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

    /** @var string Every student. */
    public const FILTER_ALL = 'all';

    /** @var string The students that would be graded by the fallback grader of the site. */
    public const FILTER_FALLBACK = 'fallback';

    /** @var string The students that nobody would grade. */
    public const FILTER_NOBODY = 'nobody';

    /** @var int The most students a filter by who would grade them looks at: it is answered one student at a time. */
    private const FILTERED_CEILING = 2000;

    /** @var int The size of page that asks for every row at once (All), up to the ceiling. */
    public const ALL = -1;

    /** @var string A course where a teacher could grade. */
    public const STATE_READY = 'ready';

    /** @var string A course where only the fallback grader could grade. */
    public const STATE_FALLBACK = 'fallback';

    /** @var string A course where nobody could grade, so every grade would fail. */
    public const STATE_NOBODY = 'nobody';

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
     * @param string $search Text of the name of the student.
     * @param string $filter Which students: all of them, the ones the fallback grader would grade, or the ones nobody would.
     * @return array The template context.
     */
    public static function students_of(
        int $courseid,
        int $page,
        int $perpage = self::PER_PAGE,
        string $search = '',
        string $filter = self::FILTER_ALL
    ): array {
        $perpage = self::page_size($perpage);
        $search = trim($search);
        $filter = in_array($filter, [self::FILTER_FALLBACK, self::FILTER_NOBODY], true) ? $filter : self::FILTER_ALL;

        if ($filter === self::FILTER_ALL) {
            $total = self::count_students($courseid, $search);
            $page = min(max(0, $page), max(0, (int) ceil($total / $perpage) - 1));
            $rows = self::rows_for($courseid, self::students_page($courseid, $page * $perpage, $perpage, $search));
        } else {
            // Who would grade a student is only known by asking, so these filters ask for every student that matches,
            // up to a ceiling, and keep the ones that answer the filter.
            $rows = array_values(array_filter(
                self::rows_for($courseid, self::students_page($courseid, 0, self::FILTERED_CEILING, $search)),
                static fn(array $row): bool => $filter === self::FILTER_NOBODY ? !$row['hasgrader'] : $row['viafallback']
            ));
            $total = count($rows);
            $page = min(max(0, $page), max(0, (int) ceil($total / $perpage) - 1));
            $rows = array_slice($rows, $page * $perpage, $perpage);
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
            // The range this page covers, counted from one, and empty when the course has no students rather than reading
            // "1 - 0 of 0".
            'from' => $total === 0 ? 0 : ($page * $perpage) + 1,
            'to' => min($total, ($page + 1) * $perpage),
            'pageshown' => $page + 1,
            'pages' => $pages,
            'hasprev' => $page > 0,
            'hasnext' => $page + 1 < $pages,
            'prevpage' => $page - 1,
            'nextpage' => $page + 1,
            'peroptions' => $peroptions,
            'search' => $search,
            'filter' => $filter,
        ];
    }

    /**
     * Who would grade each of some students.
     *
     * @param int $courseid
     * @param \stdClass[] $students Keyed by user id.
     * @return array[] One row for each student.
     */
    private static function rows_for(int $courseid, array $students): array {
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

        // Named in one query for the whole page rather than one per row: the graders of a course repeat across its students, so
        // a page of twenty-five students is usually a handful of distinct names.
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

        return $rows;
    }

    /**
     * The size of a page that is on offer: All asks for every row up to the ceiling, and anything else not on offer gives the
     * default.
     *
     * @param int $perpage The size asked for.
     * @return int The size used.
     */
    public static function page_size(int $perpage): int {
        if ($perpage === self::ALL) {
            return self::FILTERED_CEILING;
        }

        return in_array($perpage, self::PER_PAGE_OPTIONS, true) ? $perpage : self::PER_PAGE;
    }

    /**
     * One page of the courses where Autograder is switched on, and what grading would be like in each.
     *
     * The answer for a course is the cheap one, who could grade there, so the overview can show it for a whole page of courses at
     * once; who would grade each student stays in the page of one course.
     *
     * @param string $search Text of the short name or the full name of the course.
     * @param int $page Zero-based.
     * @param int $perpage How many to show; anything not on offer is ignored.
     * @return array The courses and the data of the pager.
     */
    public static function overview(string $search, int $page, int $perpage = self::PER_PAGE): array {
        global $DB;

        $perpage = self::page_size($perpage);
        $search = trim($search);
        $params = [];
        $where = 'cfg.enabled = 1';

        if ($search !== '') {
            $like = '%' . $DB->sql_like_escape($search) . '%';
            $where .= ' AND (' . $DB->sql_like('c.shortname', ':short', false, false)
                . ' OR ' . $DB->sql_like('c.fullname', ':full', false, false) . ')';
            $params['short'] = $like;
            $params['full'] = $like;
        }

        $from = "FROM {local_autograder_config} cfg JOIN {course} c ON c.id = cfg.courseid WHERE {$where}";
        $total = (int) $DB->count_records_sql("SELECT COUNT(DISTINCT c.id) {$from}", $params);
        $page = min(max(0, $page), max(0, (int) ceil($total / $perpage) - 1));
        $records = $DB->get_records_sql(
            "SELECT c.id, c.shortname, c.fullname, COUNT(cfg.id) AS activities {$from}
           GROUP BY c.id, c.shortname, c.fullname
           ORDER BY c.shortname, c.id",
            $params,
            $page * $perpage,
            $perpage
        );
        $courses = [];

        foreach ($records as $record) {
            $graders = self::graders_of((int) $record->id);
            $teachers = array_values(array_filter($graders['graders'], static fn(array $grader): bool => !$grader['isfallback']));

            if ($graders['hasgraders']) {
                $state = $teachers === [] ? self::STATE_FALLBACK : self::STATE_READY;
            } else {
                $state = self::STATE_NOBODY;
            }

            $courses[] = [
                'id' => (int) $record->id,
                'name' => format_string($record->shortname),
                'fullname' => format_string($record->fullname),
                'activities' => (int) $record->activities,
                'gradercount' => $graders['gradercount'],
                'studentcount' => $graders['studentcount'],
                'state' => $state,
                'graders' => array_map(static fn(array $grader): string => $grader['name'], array_slice($graders['graders'], 0, 3)),
                'moregraders' => max(0, $graders['gradercount'] - 3),
                'reporturl' => (new \moodle_url('/report/autograder/index.php', ['courseid' => (int) $record->id]))->out(false),
                'studentsurl' => (new \moodle_url('/report/autograder/graders.php', [
                    'courseid' => (int) $record->id,
                    'students' => 1,
                ]))->out(false),
            ];
        }

        return [
            'courses' => $courses,
            'total' => $total,
            'page' => $page,
            'perpage' => $perpage,
            'from' => $total === 0 ? 0 : ($page * $perpage) + 1,
            'to' => min($total, ($page + 1) * $perpage),
        ];
    }

    /**
     * How many gradable students the course has.
     *
     * @param int $courseid
     * @param string $search Text of the name of the student.
     * @return int
     */
    public static function count_students(int $courseid, string $search = ''): int {
        global $DB;

        [$sql, $params] = self::students_sql($courseid, 'COUNT(DISTINCT u.id)', $search);

        return $sql === '' ? 0 : (int) $DB->count_records_sql($sql, $params);
    }

    /**
     * One page of the course's gradable students.
     *
     * @param int $courseid
     * @param int $offset Rows to skip.
     * @param int $limit Rows to read.
     * @param string $search Text of the name of the student.
     * @return \stdClass[] Keyed by user id.
     */
    private static function students_page(int $courseid, int $offset, int $limit, string $search = ''): array {
        global $DB;

        $namefields = \core_user\fields::for_name()->get_sql('u', false, '', '', true)->selects;
        [$sql, $params] = self::students_sql($courseid, "DISTINCT u.id {$namefields}", $search);

        if ($sql === '') {
            return [];
        }

        return $DB->get_records_sql(
            $sql . ' ORDER BY u.lastname, u.firstname, u.id',
            $params,
            $offset,
            $limit
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
     * @param string $search Text of the name of the student; every student when it is empty.
     * @return array{0: string, 1: array} An empty string when the course is gone.
     */
    private static function students_sql(int $courseid, string $select, string $search = ''): array {
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

        if (trim($search) !== '') {
            $sql .= ' AND ' . $DB->sql_like($DB->sql_fullname('u.firstname', 'u.lastname'), ':search', false, false);
            $params['search'] = '%' . $DB->sql_like_escape(trim($search)) . '%';
        }

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
