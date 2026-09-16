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

namespace report_autograder\local\page;

use local_autograder\local\grading\grader_picker;
use local_autograder\local\grading\teacher_source;

/**
 * Who could grade in one course, and who would be picked for whom.
 *
 * Two questions, deliberately answered separately, because one is cheap and
 * the other is not:
 *
 * - *Who could grade here* is a property of the course. One role query answers
 *   it, whatever the course's size. This is what the page opens on.
 * - *Who would grade this student* is decided per student, from that
 *   student's own teachers. Answering it for a whole course means asking it
 *   once per student, so it is asked for one page of students at a time and
 *   only when somebody asks to see them.
 *
 * The first version of this page did the second for every student in the
 * course before drawing anything, which on a large course is a few thousand
 * round trips nobody asked for.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class grader_list {
    /** @var int Students shown per page until somebody asks for more. */
    public const PER_PAGE = 24;

    /**
     * The page sizes on offer, the same ones the report's own table offers.
     *
     * Capped rather than open-ended, and with no "all": this list is worked
     * out a student at a time, so "all" on a course of ten thousand is ten
     * thousand answers nobody asked for.
     */
    public const PER_PAGE_OPTIONS = [12, 24, 48, 96];

    /**
     * Everybody who could grade in this course at all.
     *
     * Costs the same whether the course has ten students or ten thousand: it
     * is asked of the course, not of its students.
     *
     * @param int $courseid
     * @return array The template context.
     */
    public static function graders_of(int $courseid): array {
        $possible = grader_picker::usable(teacher_source::possible_graders_in($courseid));
        $fallback = grader_picker::fallback_for();

        if ($fallback !== null && !in_array($fallback, $possible, true)) {
            $possible[] = $fallback;
        }

        $graders = [];

        foreach (self::named($possible) as $id => $name) {
            $graders[] = [
                'id' => $id,
                'name' => $name,
                'isfallback' => $id === $fallback,
            ];
        }

        return [
            'graders' => $graders,
            'hasgraders' => $graders !== [],
            'gradercount' => count($graders),
            'studentcount' => self::count_students($courseid),
            'hasfallback' => $fallback !== null,
        ];
    }

    /**
     * One page of students, each with the grader they would actually get.
     *
     * The per-student question, asked only for the students on this page.
     *
     * @param int $courseid
     * @param int $page Zero-based.
     * @param int $perpage How many to show; anything not on offer is ignored.
     * @return array The template context.
     */
    public static function students_of(int $courseid, int $page, int $perpage = self::PER_PAGE): array {
        $perpage = in_array($perpage, self::PER_PAGE_OPTIONS, true) ? $perpage : self::PER_PAGE;
        $total = self::count_students($courseid);
        $page = min(max(0, $page), max(0, (int) ceil($total / $perpage) - 1));
        $students = self::students_page($courseid, $page, $perpage);
        $fallback = grader_picker::fallback_for();
        teacher_source::prime_groups($courseid, array_merge(
            array_keys($students),
            teacher_source::possible_graders_in($courseid)
        ));
        $picked = [];
        $fellback = [];

        foreach (array_keys($students) as $studentid) {
            $graderid = grader_picker::pick_for_course($courseid, (int) $studentid);
            $fellback[(int) $studentid] = $graderid === null && $fallback !== null;
            $picked[(int) $studentid] = $graderid ?? $fallback;
        }

        // Named in one query for the whole page rather than one per row: the
        // graders of a course repeat across its students, so a page of
        // twenty-five students is usually a handful of distinct names.
        $names = self::named(array_filter($picked));
        $rows = [];

        foreach ($students as $studentid => $student) {
            $graderid = $picked[(int) $studentid];

            $rows[] = [
                'name' => fullname($student),
                'grader' => $graderid === null ? null : ($names[$graderid] ?? (string) $graderid),
                'hasgrader' => $graderid !== null,
                'viafallback' => $fellback[(int) $studentid],
            ];
        }

        $pages = max(1, (int) ceil($total / $perpage));
        $peroptions = [];

        foreach (self::PER_PAGE_OPTIONS as $option) {
            $peroptions[] = ['value' => $option, 'selected' => $option === $perpage];
        }

        return [
            'students' => $rows,
            'total' => $total,
            'page' => $page,
            'perpage' => $perpage,
            'peroptions' => $peroptions,
            // The range this page covers, counted from one, and empty when the
            // course has no students rather than reading "1 - 0 of 0".
            'from' => $total === 0 ? 0 : ($page * $perpage) + 1,
            'to' => min($total, ($page + 1) * $perpage),
            'pageshown' => $page + 1,
            'pages' => $pages,
            'hasprev' => $page > 0,
            'hasnext' => $page + 1 < $pages,
            'prevpage' => $page - 1,
            'nextpage' => $page + 1,
        ];
    }

    /**
     * How many gradable students the course has.
     *
     * @param int $courseid
     * @return int
     */
    public static function count_students(int $courseid): int {
        global $DB;

        [$sql, $params] = self::students_sql($courseid, 'COUNT(DISTINCT u.id)');

        return $sql === '' ? 0 : (int) $DB->count_records_sql($sql, $params);
    }

    /**
     * One page of the course's gradable students.
     *
     * @param int $courseid
     * @param int $page
     * @param int $perpage
     * @return \stdClass[] Keyed by user id.
     */
    private static function students_page(int $courseid, int $page, int $perpage): array {
        global $DB;

        $namefields = \core_user\fields::for_name()->get_sql('u', false, '', '', true)->selects;
        [$sql, $params] = self::students_sql($courseid, "DISTINCT u.id {$namefields}");

        if ($sql === '') {
            return [];
        }

        return $DB->get_records_sql(
            $sql . ' ORDER BY u.lastname, u.firstname, u.id',
            $params,
            $page * $perpage,
            $perpage
        );
    }

    /**
     * The gradable-student query, shaped for whichever columns are wanted.
     *
     * The same rule the report's own table uses, which is the gradebook's:
     * actively enrolled, holding one of `$CFG->gradebookroles`. The contexts
     * that can grant that role are listed rather than compared as text, so the
     * role check is an index lookup.
     *
     * @param int $courseid
     * @param string $select What to select.
     * @return array{0: string, 1: array} An empty string when the course is gone.
     */
    private static function students_sql(int $courseid, string $select): array {
        global $CFG, $DB;

        $context = \context_course::instance($courseid, IGNORE_MISSING);

        if (!$context) {
            return ['', []];
        }

        $contextids = $context->get_parent_context_ids(true);

        if ($contextids === []) {
            return ['', []];
        }

        [$rolesql, $params] = $DB->get_in_or_equal(
            array_filter(explode(',', (string) $CFG->gradebookroles)) ?: [0],
            SQL_PARAMS_NAMED,
            'gbr'
        );
        [$ctxsql, $ctxparams] = $DB->get_in_or_equal($contextids, SQL_PARAMS_NAMED, 'rctx');
        $params += $ctxparams;
        $params['courseid'] = $courseid;
        $params['enrolenabled'] = ENROL_INSTANCE_ENABLED;
        $params['ueactive'] = ENROL_USER_ACTIVE;
        $params['nowstart'] = time();
        $params['nowend'] = $params['nowstart'];

        $sql = "SELECT {$select}
                  FROM {user} u
                  JOIN {user_enrolments} ue ON ue.userid = u.id
                  JOIN {enrol} e ON e.id = ue.enrolid AND e.courseid = :courseid
                 WHERE u.deleted = 0
                   AND e.status = :enrolenabled
                   AND ue.status = :ueactive
                   AND (ue.timestart = 0 OR ue.timestart <= :nowstart)
                   AND (ue.timeend = 0 OR ue.timeend > :nowend)
                   AND EXISTS (SELECT 1
                                 FROM {role_assignments} ra
                                WHERE ra.userid = u.id
                                  AND ra.roleid {$rolesql}
                                  AND ra.contextid {$ctxsql})";

        return [$sql, $params];
    }

    /**
     * Names for some user ids, in one query.
     *
     * @param int[] $userids
     * @return array<int, string> Keyed by id.
     */
    private static function named(array $userids): array {
        global $DB;

        $userids = array_values(array_unique(array_filter(array_map('intval', $userids))));

        if ($userids === []) {
            return [];
        }

        [$insql, $params] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED);
        $namefields = \core_user\fields::for_name()->get_sql('u', false, '', '', true)->selects;
        $users = $DB->get_records_sql(
            "SELECT u.id {$namefields} FROM {user} u WHERE u.id {$insql}",
            $params
        );
        $named = [];

        foreach ($users as $user) {
            $named[(int) $user->id] = fullname($user);
        }

        \core_collator::asort($named);

        return $named;
    }
}
