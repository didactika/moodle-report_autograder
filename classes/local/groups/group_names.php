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

namespace report_autograder\local\groups;

use report_autograder\local\query\report_query;

/**
 * Which groups each student of a page belongs to, in the activity's own terms.
 *
 * A student can be in several groups, and which of them count depends on the
 * activity: one restricted to a grouping only knows about the groups in it, and
 * a viewer limited to their own groups is not told about the others. So the
 * answer is per row, not per student.
 *
 * Read for the whole page in two queries rather than per row: a page of two
 * hundred students in the same course asks the same two questions two hundred
 * times otherwise.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class group_names {
    /**
     * The groups to name in each row of one page.
     *
     * @param \stdClass[] $rows From {@see report_query::rows()}.
     * @param group_access $access What the viewer may see.
     * @return array<string, string[]> Group names, by the row's own key.
     */
    public static function for_rows(array $rows, group_access $access): array {
        if ($rows === [] || !$access->shows_column()) {
            return [];
        }

        $courseids = [];
        $userids = [];

        foreach ($rows as $row) {
            $courseids[(int) $row->courseid] = true;
            $userids[(int) $row->userid] = true;
        }

        $membership = self::membership(array_keys($courseids), array_keys($userids));

        if ($membership === []) {
            return [];
        }

        $groupings = self::groupings(array_keys($membership));
        $names = [];

        foreach ($rows as $row) {
            $found = self::groups_of_row($row, $access, $membership, $groupings);

            if ($found !== []) {
                asort($found, SORT_NATURAL | SORT_FLAG_CASE);
                $names[$row->rowkey] = array_values($found);
            }
        }

        return $names;
    }

    /**
     * The groups to name in one row.
     *
     * @param \stdClass $row
     * @param group_access $access
     * @param array $membership Each group's name, course and members, by group id.
     * @param array $groupings Grouping ids, by group id.
     * @return array Group names, by group id.
     */
    private static function groups_of_row(
        \stdClass $row,
        group_access $access,
        array $membership,
        array $groupings
    ): array {
        $cmid = (int) $row->cmid;
        $modinfo = get_fast_modinfo((int) $row->courseid);

        if (!isset($modinfo->cms[$cmid])) {
            return [];
        }

        $cm = $modinfo->cms[$cmid];

        if ((int) $cm->effectivegroupmode === NOGROUPS) {
            // The activity does not sort its students into groups, so naming
            // the groups they happen to be in would say nothing about it.
            return [];
        }

        $grouping = (int) $cm->groupingid;
        $visible = $access->visible_groups_in($cmid);
        $userid = (int) $row->userid;
        $found = [];

        foreach ($membership as $groupid => $group) {
            if ($group['courseid'] !== (int) $row->courseid || !isset($group['members'][$userid])) {
                continue;
            }

            if ($grouping > 0 && !in_array($grouping, $groupings[$groupid] ?? [], true)) {
                // The activity is limited to one grouping; a group outside it
                // plays no part in this activity.
                continue;
            }

            if ($visible !== null && !in_array($groupid, $visible, true)) {
                continue;
            }

            $found[$groupid] = $group['name'];
        }

        return $found;
    }

    /**
     * Who is in which group, across the courses and students of one page.
     *
     * @param int[] $courseids
     * @param int[] $userids
     * @return array<int, array{name: string, courseid: int, members: array<int, bool>}> By group id.
     */
    private static function membership(array $courseids, array $userids): array {
        global $DB;

        [$coursesql, $courseparams] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED, 'gnco');
        [$usersql, $userparams] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED, 'gnus');

        $rows = $DB->get_records_sql(
            "SELECT gm.id, gm.userid, g.id AS groupid, g.name, g.courseid
               FROM {groups_members} gm
               JOIN {groups} g ON g.id = gm.groupid
              WHERE g.courseid {$coursesql} AND gm.userid {$usersql}",
            $courseparams + $userparams
        );
        $membership = [];

        foreach ($rows as $row) {
            $groupid = (int) $row->groupid;

            if (!isset($membership[$groupid])) {
                $membership[$groupid] = [
                    'name' => format_string(
                        $row->name,
                        true,
                        ['context' => \context_course::instance((int) $row->courseid)]
                    ),
                    'courseid' => (int) $row->courseid,
                    'members' => [],
                ];
            }

            $membership[$groupid]['members'][(int) $row->userid] = true;
        }

        return $membership;
    }

    /**
     * Which groupings each of those groups belongs to.
     *
     * @param int[] $groupids
     * @return array<int, int[]> Grouping ids, by group id.
     */
    private static function groupings(array $groupids): array {
        global $DB;

        [$insql, $params] = $DB->get_in_or_equal($groupids, SQL_PARAMS_NAMED, 'gngr');
        $rows = $DB->get_records_sql(
            "SELECT gg.id, gg.groupid, gg.groupingid
               FROM {groupings_groups} gg
              WHERE gg.groupid {$insql}",
            $params
        );
        $groupings = [];

        foreach ($rows as $row) {
            $groupings[(int) $row->groupid][] = (int) $row->groupingid;
        }

        return $groupings;
    }
}
