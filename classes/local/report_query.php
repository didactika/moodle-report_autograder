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

use core_user\fields;
use local_autograder\local\eligibility;

/**
 * The one query behind all three reports.
 *
 * It is built around the *students*, not around autograder's decisions: a
 * teacher opening this wants to know who is going to be graded and who has not
 * done anything yet, and a table that only listed students autograder already
 * has an opinion about would answer half of that. So the rows are the gradable
 * users of each autograded activity, and the decision joins in where there is
 * one.
 *
 * "Gradable user" is not this plugin's invention: it is the same rule the
 * gradebook uses — actively enrolled, holding one of `$CFG->gradebookroles` in
 * the course context or above (see `grade_report::get_numusers()`). Asking the
 * same question the gradebook asks means the two never disagree about who is
 * in the class.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class report_query {
    /** @var string Order by the student's name. */
    public const SORT_NAME = 'user_name';

    /** @var string Order by the date the row is about. */
    public const SORT_DATE = 'completed_at_sort';

    /**
     * How many rows the report has, before paging.
     *
     * @param scope $scope
     * @param filters $filters
     * @return int
     */
    public static function count(scope $scope, filters $filters): int {
        global $DB;

        [$from, $where, $params] = self::build($scope, $filters);

        return (int) $DB->count_records_sql("SELECT COUNT(1) {$from} WHERE {$where}", $params);
    }

    /**
     * How many rows there are in each state.
     *
     * One grouped pass rather than one count per state: the summary strip asks
     * about five or six of them at once, and a site can have a lot of rows.
     *
     * @param scope $scope
     * @param filters $filters
     * @return array<string, int> Keyed by `local_autograder_decision.status`,
     *         plus an empty key for the students with no decision at all.
     */
    public static function count_by_decision_status(scope $scope, filters $filters): array {
        global $DB;

        [$from, $where, $params] = self::build($scope, $filters);
        $bucket = "CASE WHEN d.id IS NULL THEN '' ELSE d.status END";

        $rows = $DB->get_records_sql(
            "SELECT {$bucket} AS bucket, COUNT(1) AS total {$from} WHERE {$where} GROUP BY {$bucket}",
            $params
        );
        $counts = [];

        foreach ($rows as $row) {
            $counts[(string) $row->bucket] = (int) $row->total;
        }

        return $counts;
    }

    /**
     * One page of rows.
     *
     * @param scope $scope
     * @param filters $filters
     * @param string $sortcolumn One of the SORT_* constants, or empty.
     * @param string $sortdir "asc" or "desc".
     * @param int $page Zero-based.
     * @param int $limit Rows per page; zero for all of them.
     * @return \stdClass[]
     */
    public static function rows(
        scope $scope,
        filters $filters,
        string $sortcolumn,
        string $sortdir,
        int $page,
        int $limit
    ): array {
        global $DB;

        [$from, $where, $params] = self::build($scope, $filters);
        $select = self::select_list();
        $order = self::order_by($sortcolumn, $sortdir);

        return $DB->get_records_sql(
            "SELECT {$select} {$from} WHERE {$where} ORDER BY {$order}",
            $params,
            $limit > 0 ? $page * $limit : 0,
            $limit > 0 ? $limit : 0
        );
    }

    /**
     * The columns every row carries.
     *
     * @return string
     */
    private static function select_list(): string {
        global $DB;

        // With the leading comma, so the list stays valid however many name
        // fields the site is configured to show.
        $namefields = fields::for_name()->get_sql('u', false, '', '', true)->selects;
        $rowkey = $DB->sql_concat('cfg.cmid', "'-'", 'u.id');

        return "{$rowkey} AS rowkey,
                u.id AS userid,
                u.picture, u.imagealt, u.email
                {$namefields},
                cfg.cmid, cfg.courseid, cfg.enabled, cfg.grademethod, cfg.gradevalue, cfg.advancedgrading,
                cm.instance, m.name AS modname,
                co.shortname AS courseshortname, co.fullname AS coursefullname,
                d.id AS decisionid, d.status AS decisionstatus, d.scheduledgradetime,
                d.baselineduedate, d.duedatereason, d.graderid, d.gradedvalue, d.failurereason,
                d.timemodified AS decisiontimemodified,
                " . self::effective_date_sql() . " AS effectivedate,
                g.finalgrade, g.usermodified AS gradedbyid";
    }

    /**
     * The date a row is about: when it *will* be graded while it is waiting,
     * and when it was settled once it is.
     *
     * One column so that sorting and the date filter mean the same thing for
     * every row, whatever state it is in.
     *
     * @return string
     */
    private static function effective_date_sql(): string {
        return "CASE
                    WHEN d.id IS NULL THEN NULL
                    WHEN d.status = 'pending' THEN d.scheduledgradetime
                    ELSE d.timemodified
                END";
    }

    /**
     * The FROM and WHERE of the query, and their parameters.
     *
     * @param scope $scope
     * @param filters $filters
     * @return array{0: string, 1: string, 2: array}
     */
    private static function build(scope $scope, filters $filters): array {
        global $CFG, $DB;

        $params = [];
        $conditions = ['cfg.enabled = 1', 'cm.deletioninprogress = 0', 'u.deleted = 0'];

        [$rolesql, $roleparams] = $DB->get_in_or_equal(
            array_filter(explode(',', (string) $CFG->gradebookroles)),
            SQL_PARAMS_NAMED,
            'gbr'
        );
        $params += $roleparams;

        // The role may be assigned on the course itself or on anything above
        // it, which is what `ra.contextid IN (parent context ids)` means in
        // the gradebook's own query. Expressed as a path comparison because
        // this one query spans courses, each with its own ancestry.
        //
        // The LIKE is written out rather than built with sql_like(), which
        // only accepts a bound parameter on the right and so cannot compare
        // one column against another. Nothing needs escaping here: a context
        // path is digits and slashes, never a wildcard.
        $ancestry = 'ctx.path = rctx.path OR ctx.path LIKE ' . $DB->sql_concat('rctx.path', "'/%'");

        // One row per student and course, whatever else is true of them.
        //
        // A student can be enrolled in the same course twice — manually and by
        // self enrolment, say — and can hold a gradeable role in more than one
        // context above that course. Joined directly, either of those
        // multiplies the student's row for every activity, and the report
        // would list them twice and count them twice. So the enrolment is
        // reduced to distinct (course, user) pairs before it is joined, and
        // the role is asked as a question rather than joined at all.
        $enrolled = "SELECT DISTINCT e.courseid, ue.userid
                       FROM {enrol} e
                       JOIN {user_enrolments} ue ON ue.enrolid = e.id
                      WHERE e.status = :enrolenabled
                        AND ue.status = :ueactive
                        AND (ue.timestart = 0 OR ue.timestart <= :uenow1)
                        AND (ue.timeend = 0 OR ue.timeend > :uenow2)";

        $from = "FROM {local_autograder_config} cfg
                 JOIN {course_modules} cm ON cm.id = cfg.cmid
                 JOIN {modules} m ON m.id = cm.module
                 JOIN {course} co ON co.id = cfg.courseid
                 JOIN {context} ctx ON ctx.instanceid = co.id AND ctx.contextlevel = :ctxcourse
                 JOIN ({$enrolled}) en ON en.courseid = co.id
                 JOIN {user} u ON u.id = en.userid
            LEFT JOIN {local_autograder_decision} d ON d.cmid = cfg.cmid AND d.userid = u.id
            LEFT JOIN {grade_items} gi ON gi.itemtype = 'mod'
                                     AND gi.itemmodule = m.name
                                     AND gi.iteminstance = cm.instance
                                     AND gi.courseid = co.id
                                     AND gi.itemnumber = " . self::item_number_sql($params) . "
            LEFT JOIN {grade_grades} g ON g.itemid = gi.id AND g.userid = u.id";

        $params['ctxcourse'] = CONTEXT_COURSE;
        $params['enrolenabled'] = ENROL_INSTANCE_ENABLED;
        $params['ueactive'] = ENROL_USER_ACTIVE;

        // An enrolment that has not started, or has ended, is not one. The
        // window is applied inside the enrolment subquery above; these are its
        // parameters.
        $now = time();
        $params['uenow1'] = $now;
        $params['uenow2'] = $now;

        // Holding a gradeable role in the course, or anywhere above it — the
        // gradebook's own rule for who is in the class. Asked as a question
        // rather than joined, so that a student holding the role in two
        // contexts is still one student.
        $conditions[] = "EXISTS (SELECT 1
                                   FROM {role_assignments} ra
                                   JOIN {context} rctx ON rctx.id = ra.contextid
                                  WHERE ra.userid = u.id
                                    AND ra.roleid {$rolesql}
                                    AND ({$ancestry}))";

        self::apply_scope($scope, $conditions, $params);
        self::apply_group_access($scope, $filters, $conditions, $params);
        self::apply_filters($filters, $conditions, $params);

        return [$from, implode(' AND ', $conditions), $params];
    }

    /**
     * Which grade item carries the activity's own grade, per module type.
     *
     * A forum's activity grade is item 1 and item 0 is its post ratings, so a
     * flat `itemnumber = 0` would read the wrong number. The fact lives in
     * local_autograder; this only spreads it across the module types the site
     * has switched on.
     *
     * @param array $params Added to.
     * @return string
     */
    private static function item_number_sql(array &$params): string {
        $cases = [];
        $index = 0;

        foreach (eligibility::enabled_module_types() as $modname) {
            $key = 'itemnummod' . $index++;
            $params[$key] = $modname;
            $cases[] = "WHEN m.name = :{$key} THEN " . eligibility::grade_itemnumber($modname);
        }

        if ($cases === []) {
            return '0';
        }

        return 'CASE ' . implode(' ', $cases) . ' ELSE 0 END';
    }

    /**
     * Narrows the query to what this report is about.
     *
     * @param scope $scope
     * @param array $conditions Added to.
     * @param array $params Added to.
     */
    private static function apply_scope(scope $scope, array &$conditions, array &$params): void {
        switch ($scope->level()) {
            case scope::LEVEL_ACTIVITY:
                $conditions[] = 'cfg.cmid = :scopecmid';
                $params['scopecmid'] = (int) $scope->cm()->id;
                break;

            case scope::LEVEL_COURSE:
                $conditions[] = 'cfg.courseid = :scopecourseid';
                $params['scopecourseid'] = (int) $scope->course()->id;
                break;
        }
    }

    /**
     * Keeps each row inside the groups its own activity lets the viewer see,
     * and narrows to one group where they asked for one.
     *
     * The restriction is per activity because the group mode is: one condition
     * per set of visible groups, which collapses to a single condition on the
     * usual site where every activity shares a grouping. An activity the
     * viewer may see nothing of is excluded outright rather than joined
     * against an empty list.
     *
     * @param scope $scope
     * @param filters $filters
     * @param array $conditions Added to.
     * @param array $params Added to.
     */
    private static function apply_group_access(
        scope $scope,
        filters $filters,
        array &$conditions,
        array &$params
    ): void {
        global $DB;

        $access = group_access::for_scope($scope);

        if ($access->offers_group($filters->groupid())) {
            $conditions[] = 'u.id IN (SELECT gmf.userid FROM {groups_members} gmf WHERE gmf.groupid = :filtergroupid)';
            $params['filtergroupid'] = $filters->groupid();
        }

        $buckets = [];

        foreach ($access->restrictions() as $cmid => $groupids) {
            sort($groupids);
            $buckets[implode(',', $groupids)][] = (int) $cmid;
        }

        $index = 0;

        foreach ($buckets as $signature => $cmids) {
            [$notcm, $cmparams] = $DB->get_in_or_equal($cmids, SQL_PARAMS_NAMED, "gacm{$index}", false);
            $params += $cmparams;
            $groupids = $signature === '' ? [] : array_map('intval', explode(',', $signature));

            if ($groupids === []) {
                // Separate groups, and the viewer is in none of them: the
                // activity itself would show them nobody.
                $conditions[] = "cfg.cmid {$notcm}";
                $index++;

                continue;
            }

            [$ingroups, $groupparams] = $DB->get_in_or_equal($groupids, SQL_PARAMS_NAMED, "gagr{$index}");
            $params += $groupparams;
            $conditions[] = "(cfg.cmid {$notcm}
                              OR u.id IN (SELECT gma{$index}.userid
                                            FROM {groups_members} gma{$index}
                                           WHERE gma{$index}.groupid {$ingroups}))";
            $index++;
        }
    }

    /**
     * Narrows the query to what the viewer asked for.
     *
     * @param filters $filters
     * @param array $conditions Added to.
     * @param array $params Added to.
     */
    private static function apply_filters(filters $filters, array &$conditions, array &$params): void {
        global $DB;

        if ($filters->courseid() > 0) {
            $conditions[] = 'cfg.courseid = :filtercourseid';
            $params['filtercourseid'] = $filters->courseid();
        }

        if ($filters->cmid() > 0) {
            $conditions[] = 'cfg.cmid = :filtercmid';
            $params['filtercmid'] = $filters->cmid();
        }

        if ($filters->search() !== '') {
            $conditions[] = self::name_search_sql($filters->search(), $params);
        }

        $date = self::effective_date_sql();

        if ($filters->datefrom() !== null) {
            $conditions[] = "({$date}) >= :datefrom";
            $params['datefrom'] = $filters->datefrom();
        }

        if ($filters->dateto() !== null) {
            $conditions[] = "({$date}) <= :dateto";
            $params['dateto'] = $filters->dateto();
        }

        if ($filters->statuses() !== []) {
            $conditions[] = self::status_sql($filters->statuses(), $params);
        }

        unset($DB);
    }

    /**
     * Matches part of a name against the first name, the last name, or the two
     * together, so that "ana lópez" finds what neither half finds alone.
     *
     * @param string $search
     * @param array $params Added to.
     * @return string
     */
    private static function name_search_sql(string $search, array &$params): string {
        global $DB;

        $params['search1'] = '%' . $DB->sql_like_escape(\core_text::strtolower($search)) . '%';
        $params['search2'] = $params['search1'];
        $params['search3'] = $params['search1'];

        $fullname = $DB->sql_concat('u.firstname', "' '", 'u.lastname');

        return '(' . $DB->sql_like($DB->sql_compare_text('LOWER(u.firstname)'), ':search1', false) .
            ' OR ' . $DB->sql_like($DB->sql_compare_text('LOWER(u.lastname)'), ':search2', false) .
            ' OR ' . $DB->sql_like("LOWER({$fullname})", ':search3', false) . ')';
    }

    /**
     * Turns the statuses the viewer picked into a condition on the decision.
     *
     * "Not engaged" is the absence of a decision rather than a value, so it
     * cannot be part of the `IN` list and gets its own branch.
     *
     * @param string[] $statuses
     * @param array $params Added to.
     * @return string
     */
    private static function status_sql(array $statuses, array &$params): string {
        global $DB;

        $branches = [];
        $decisionstatuses = [];

        foreach ($statuses as $reportstatus) {
            if ($reportstatus === status::NOT_ENGAGED) {
                $branches[] = 'd.id IS NULL';

                continue;
            }

            $decisionstatuses = array_merge($decisionstatuses, status::decision_statuses($reportstatus));
        }

        $decisionstatuses = array_values(array_unique($decisionstatuses));

        if ($decisionstatuses !== []) {
            [$insql, $inparams] = $DB->get_in_or_equal($decisionstatuses, SQL_PARAMS_NAMED, 'dst');
            $params += $inparams;
            $branches[] = "d.status {$insql}";
        }

        if ($branches === []) {
            // Asked for nothing that can match anything.
            return '1 = 0';
        }

        return '(' . implode(' OR ', $branches) . ')';
    }

    /**
     * The ordering, always ending on something unique so that paging cannot
     * show the same student twice or skip one.
     *
     * @param string $sortcolumn
     * @param string $sortdir
     * @return string
     */
    private static function order_by(string $sortcolumn, string $sortdir): string {
        $dir = strtolower($sortdir) === 'desc' ? 'DESC' : 'ASC';

        switch ($sortcolumn) {
            case self::SORT_DATE:
                // A row with no date has nothing to be ordered by; it goes
                // last either way rather than leading a descending list.
                return "CASE WHEN d.id IS NULL THEN 1 ELSE 0 END ASC,
                        " . self::effective_date_sql() . " {$dir},
                        u.lastname ASC, u.firstname ASC, cfg.cmid ASC, u.id ASC";

            case self::SORT_NAME:
                return "u.lastname {$dir}, u.firstname {$dir}, cfg.cmid ASC, u.id ASC";

            default:
                return 'u.lastname ASC, u.firstname ASC, cfg.cmid ASC, u.id ASC';
        }
    }
}
