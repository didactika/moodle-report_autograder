<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace report_autograder\local\format;

use local_autograder\local\grading\grader_picker;
use local_autograder\local\grading\teacher_source;
use report_autograder\local\groups\group_access;
use report_autograder\local\groups\group_names;
use report_autograder\local\page\grader_ui;
use report_autograder\local\query\report_query;
use report_autograder\local\query\scope;

/**
 * A database row, turned into the row the table draws.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class row_formatter {
    /**
     * Formats a whole page of rows.
     *
     * @param \stdClass[] $rows From {@see report_query::rows()}.
     * @param scope $scope
     * @return array<int, array<string, mixed>>
     */
    public static function format_all(array $rows, scope $scope): array {
        $access = $scope->level() === scope::LEVEL_SITE ? null : group_access::for_scope($scope);
        $prospective = self::prospective_graders($rows, $scope);
        $page = [
            'canseefailures' => $scope->can_see_failures(),
            'prospective' => $prospective,
            'graders' => self::grader_names($rows, $prospective),
            'showsgroups' => $access ? $access->shows_column() : false,
            'groups' => $access ? group_names::for_rows($rows, $access) : [],
        ];
        $out = [];

        foreach ($rows as $row) {
            $out[] = self::format($row, $scope, $page);
        }

        return $out;
    }

    /**
     * One row, ready for the table.
     *
     * @param \stdClass $row
     * @param scope $scope
     * @param array $page What was looked up once for the whole page: the
     *        viewer's right to see failures, the prospective grader of each
     *        waiting row, every grader's name, and each row's groups.
     * @return array<string, mixed>
     */
    private static function format(\stdClass $row, scope $scope, array $page): array {
        global $OUTPUT, $PAGE;

        $userid = (int) $row->userid;
        $courseid = (int) $row->courseid;
        $status = status::from_decision($row->decisionstatus, $page['canseefailures']);
        $user = self::user_stub($row);

        $formatted = [
            'rowkey' => $row->rowkey,
            'user_col' => $OUTPUT->render(\core_user::get_profile_picture(
                $user,
                null,
                ['courseid' => $courseid, 'includefullname' => true]
            )),
            'user_name' => fullname($user),
            'user_profile_url' => (new \moodle_url('/user/view.php', [
                'id' => $userid,
                'course' => $courseid,
            ]))->out(false),
            'moodle_userid' => $userid,
            'courseid' => $courseid,
            'instanceid' => (int) $row->instance,
            'modname' => $row->modname,
            'status' => status::label($status),
            'status_key' => $status,
            'status_class' => status::badge_class($status),
            'completed_at' => self::format_date($row),
            'completed_at_sort' => (int) ($row->effectivedate ?? 0),
        ];

        $picture = new \user_picture($user);
        $picture->size = 100;
        $formatted['user_picture_url'] = $picture->get_url($PAGE)->out(false);

        // The cell is drawn whenever the table has the column, empty or not: a
        // student in no group of the activity still needs their row to line up
        // with everybody else's.
        $formatted['shows_groups'] = $page['showsgroups'];

        if (isset($page['groups'][$row->rowkey])) {
            $formatted['groups'] = implode(', ', $page['groups'][$row->rowkey]);
        }

        self::add_grade($formatted, $row, $status);
        self::add_context_columns($formatted, $row, $scope);
        self::add_explanations($formatted, $row, $status, $page);
        self::add_grading_action($formatted, $row, $scope);

        return $formatted;
    }

    /**
     * The grade column: what the student has, or what they are going to get.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param string $status
     */
    private static function add_grade(array &$formatted, \stdClass $row, string $status): void {
        if ($row->finalgrade !== null) {
            $formatted['grade'] = format_float(round((float) $row->finalgrade, 2), -1);

            return;
        }

        if (!status::is_awaiting($status)) {
            // Nothing is going to be posted, so promising a number would be a
            // lie; the column stays empty rather than hopeful.
            return;
        }

        $provisional = provisional_grade::for_row($row);

        if ($provisional['problem'] !== null) {
            $formatted['grade_problem'] = $provisional['problem'];

            return;
        }

        $formatted['provisional_grade'] = $provisional['display'];
    }

    /**
     * Which activity, and which course, the row is about — only where the
     * table holds more than one.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param scope $scope
     */
    private static function add_context_columns(array &$formatted, \stdClass $row, scope $scope): void {
        if ($scope->shows_activity_column()) {
            $formatted['activity_name'] = self::activity_name($row);
            $formatted['activity_url'] = (new \moodle_url('/report/autograder/index.php', [
                'cmid' => (int) $row->cmid,
            ]))->out(false);
        }

        if ($scope->shows_course_column()) {
            $formatted['course_name'] = format_string($row->courseshortname);
            $formatted['course_url'] = (new \moodle_url('/report/autograder/index.php', [
                'courseid' => (int) $row->courseid,
            ]))->out(false);
        }
    }

    /**
     * The tooltips and the names: why that date, who graded it or who is going
     * to, and — for somebody who may be told — why a grading failed.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param string $status
     * @param array $page The once-per-page lookups; see {@see self::format()}.
     */
    private static function add_explanations(
        array &$formatted,
        \stdClass $row,
        string $status,
        array $page
    ): void {
        if (!empty($row->duedatereason)) {
            $key = 'reason:' . $row->duedatereason;

            if (get_string_manager()->string_exists($key, 'report_autograder')) {
                $formatted['date_reason'] = get_string($key, 'report_autograder');
            }
        }

        $graderid = self::grader_of($row);

        if ($graderid > 0 && isset($page['graders'][$graderid])) {
            $formatted['graded_by'] = $page['graders'][$graderid];
        } else if (status::is_awaiting($status)) {
            self::add_prospective_grader($formatted, $row, $page);
        }

        if ($status === status::FAILED && $page['canseefailures'] && !empty($row->failurereason)) {
            $key = 'failure:' . $row->failurereason;
            $formatted['failure_reason'] = get_string_manager()->string_exists($key, 'report_autograder')
                ? get_string($key, 'report_autograder')
                : s($row->failurereason);
        }
    }

    /**
     * Who a waiting row is going to be graded as.
     *
     * The same column as the grader of a row already graded, because it is the
     * same fact at a different moment — and it is the one thing a teacher
     * cannot find out anywhere else before it happens. Where nobody qualifies,
     * saying so is the more useful answer: that row is heading for a failure,
     * and it can be fixed before the date arrives.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param array $page The once-per-page lookups; see {@see self::format()}.
     */
    private static function add_prospective_grader(array &$formatted, \stdClass $row, array $page): void {
        $graderid = $page['prospective'][$row->rowkey] ?? 0;

        if ($graderid > 0 && isset($page['graders'][$graderid])) {
            $formatted['will_grade'] = $page['graders'][$graderid];

            return;
        }

        $formatted['will_grade_problem'] = get_string('willgrade:nobody', 'report_autograder');
    }

    /**
     * The button that opens the activity's own grading screen, where the
     * viewer may use it.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param scope $scope
     */
    private static function add_grading_action(array &$formatted, \stdClass $row, scope $scope): void {
        $cm = $scope->cm();

        if ($cm === null || (int) $cm->id !== (int) $row->cmid) {
            // The grading screens are launched from the activity's own report,
            // where the page has been set up for them.
            return;
        }

        if (grader_ui::can_use_assign_grader($cm)) {
            $formatted['grade_user_url'] = (new \moodle_url('/mod/assign/view.php', [
                'id' => (int) $cm->id,
                'action' => 'grader',
                'userid' => (int) $row->userid,
            ]))->out(false);

            return;
        }

        if ($row->modname === 'forum') {
            $formatted['show_forum_grader'] = true;
        }
    }

    /**
     * The activity's name, from the course cache so that a renamed activity
     * does not need this report to be told.
     *
     * @param \stdClass $row
     * @return string
     */
    private static function activity_name(\stdClass $row): string {
        $modinfo = get_fast_modinfo((int) $row->courseid);
        $cm = $modinfo->get_cm((int) $row->cmid);

        return format_string($cm->name);
    }

    /**
     * The date, said as what it is: a promise while the row is waiting, a
     * record once it is settled.
     *
     * @param \stdClass $row
     * @return string
     */
    private static function format_date(\stdClass $row): string {
        if (empty($row->effectivedate)) {
            return '-';
        }

        return userdate(
            (int) $row->effectivedate,
            get_string('strftimedatetimeshort', 'core_langconfig')
        );
    }

    /**
     * Whose name the grade stands in.
     *
     * The gradebook is asked first and the decision second. A row graded by a
     * teacher has no grader on its decision — autograder never posted it — but
     * the gradebook knows perfectly well who did, and that is exactly the name
     * the column is there to show. Autograder's own rows agree either way,
     * since it posts as the teacher it chose.
     *
     * @param \stdClass $row
     * @return int Zero when nobody has graded it.
     */
    private static function grader_of(\stdClass $row): int {
        $fromgradebook = (int) ($row->gradedbyid ?? 0);

        if ($fromgradebook > 0 && $row->finalgrade !== null) {
            return $fromgradebook;
        }

        return (int) ($row->graderid ?? 0);
    }

    /**
     * Who autograder would grade each waiting row as, asked of the plugin that
     * will actually do it.
     *
     * Worked out now rather than stored, for the same reason local_autograder
     * only decides at the moment of grading: a teacher can join or leave the
     * course, a group or the capability while a decision waits. Which makes
     * this an answer about today, and the column says as much.
     *
     * @param \stdClass[] $rows
     * @param scope $scope
     * @return array<string, int> The chosen teacher, by the row's own key.
     */
    private static function prospective_graders(array $rows, scope $scope): array {
        $canseefailures = $scope->can_see_failures();
        $graders = [];
        $students = [];
        foreach ($rows as $row) {
            if (
                status::is_awaiting(status::from_decision($row->decisionstatus, $canseefailures))
                    && self::grader_of($row) === 0
            ) {
                $students[(int) $row->courseid][] = (int) $row->userid;
            }
        }
        foreach ($students as $courseid => $userids) {
            teacher_source::prime_groups($courseid, array_merge($userids, teacher_source::possible_graders_in($courseid)));
        }

        foreach ($rows as $row) {
            $status = status::from_decision($row->decisionstatus, $canseefailures);

            if (!status::is_awaiting($status) || self::grader_of($row) > 0) {
                continue;
            }

            $graders[$row->rowkey] = (int) grader_picker::resolve_for(
                (int) $row->cmid,
                (int) $row->userid
            );
        }

        return $graders;
    }

    /**
     * The teachers named in this page of rows, looked up once rather than per
     * row.
     *
     * @param \stdClass[] $rows
     * @param array $prospective User ids, from {@see self::prospective_graders()}.
     * @return array Their names, by user id.
     */
    private static function grader_names(array $rows, array $prospective): array {
        global $DB;

        $ids = [];

        foreach ($rows as $row) {
            $graderid = self::grader_of($row);

            if ($graderid > 0) {
                $ids[$graderid] = true;
            }
        }

        foreach ($prospective as $graderid) {
            if ($graderid > 0) {
                $ids[$graderid] = true;
            }
        }

        if ($ids === []) {
            return [];
        }

        [$insql, $params] = $DB->get_in_or_equal(array_keys($ids), SQL_PARAMS_NAMED);
        // With the leading comma: without it the field list reads
        // "id firstname, lastname", which is not a missing comma to SQL — it
        // is `id AS firstname`, and the row comes back with no id at all.
        $fields = \core_user\fields::for_name()->get_sql('', false, '', '', true)->selects;
        $users = $DB->get_records_select('user', "id {$insql}", $params, '', "id {$fields}");
        $names = [];

        foreach ($users as $user) {
            $names[(int) $user->id] = fullname($user);
        }

        return $names;
    }

    /**
     * The user object `fullname()` and the picture renderers expect, built
     * from what the query already selected.
     *
     * @param \stdClass $row
     * @return \stdClass
     */
    private static function user_stub(\stdClass $row): \stdClass {
        $user = (object) ['id' => (int) $row->userid];

        foreach (\core_user\fields::get_name_fields() as $field) {
            $user->$field = $row->$field ?? '';
        }

        foreach (['picture', 'imagealt', 'email'] as $field) {
            $user->$field = $row->$field ?? null;
        }

        return $user;
    }
}
