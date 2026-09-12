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

namespace report_autograder\local;

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
        $canseefailures = $scope->can_see_failures();
        $graders = self::grader_names($rows);
        $out = [];

        foreach ($rows as $row) {
            $out[] = self::format($row, $scope, $canseefailures, $graders);
        }

        return $out;
    }

    /**
     * One row, ready for the table.
     *
     * @param \stdClass $row
     * @param scope $scope
     * @param bool $canseefailures
     * @param array<int, string> $graders Teacher names, by user id.
     * @return array<string, mixed>
     */
    private static function format(
        \stdClass $row,
        scope $scope,
        bool $canseefailures,
        array $graders
    ): array {
        global $OUTPUT, $PAGE;

        $userid = (int) $row->userid;
        $courseid = (int) $row->courseid;
        $status = status::from_decision($row->decisionstatus, $canseefailures);
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

        self::add_grade($formatted, $row, $status);
        self::add_context_columns($formatted, $row, $scope);
        self::add_explanations($formatted, $row, $status, $canseefailures, $graders);
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
     * The tooltips: why that date, and — for somebody who may be told — why a
     * grading failed.
     *
     * @param array $formatted Added to.
     * @param \stdClass $row
     * @param string $status
     * @param bool $canseefailures
     * @param array<int, string> $graders
     */
    private static function add_explanations(
        array &$formatted,
        \stdClass $row,
        string $status,
        bool $canseefailures,
        array $graders
    ): void {
        if (!empty($row->duedatereason)) {
            $key = 'reason:' . $row->duedatereason;

            if (get_string_manager()->string_exists($key, 'report_autograder')) {
                $formatted['date_reason'] = get_string($key, 'report_autograder');
            }
        }

        $graderid = (int) ($row->graderid ?? 0);

        if ($graderid > 0 && isset($graders[$graderid])) {
            $formatted['graded_by'] = $graders[$graderid];
        }

        if ($status === status::FAILED && $canseefailures && !empty($row->failurereason)) {
            $key = 'failure:' . $row->failurereason;
            $formatted['failure_reason'] = get_string_manager()->string_exists($key, 'report_autograder')
                ? get_string($key, 'report_autograder')
                : s($row->failurereason);
        }
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
     * The teachers named as graders in this page of rows, looked up once
     * rather than per row.
     *
     * @param \stdClass[] $rows
     * @return array<int, string>
     */
    private static function grader_names(array $rows): array {
        global $DB;

        $ids = [];

        foreach ($rows as $row) {
            $graderid = (int) ($row->graderid ?? 0);

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
