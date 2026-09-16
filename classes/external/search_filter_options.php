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

namespace report_autograder\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use report_autograder\local\query\scope;

/**
 * Searches the course and activity pickers of the filter bar.
 *
 * The pickers used to be plain `<select>` elements holding every course with
 * an autograded activity on the site, and every one of those activities.
 * On a site of a hundred thousand courses that is a page that never finishes
 * rendering — and the activity list cost a course module cache read *per
 * activity* to get at its name. So the lists are searched here instead, a
 * page at a time, and the browser only ever holds what the reader typed
 * enough of to find.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class search_filter_options extends external_api {
    /** @var string Searching the course picker. */
    public const TYPE_COURSE = 'course';

    /** @var string Searching the activity picker. */
    public const TYPE_ACTIVITY = 'activity';

    /** @var int The most matches one search will ever return. */
    private const MAX_RESULTS = 30;

    /**
     * What this service accepts.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'type' => new external_value(PARAM_ALPHA, 'course or activity'),
            'query' => new external_value(PARAM_TEXT, 'What the reader typed', VALUE_DEFAULT, ''),
            'cmid' => new external_value(PARAM_INT, 'The report\'s own activity, or 0', VALUE_DEFAULT, 0),
            'courseid' => new external_value(PARAM_INT, 'The report\'s own course, or 0', VALUE_DEFAULT, 0),
            'filtercourseid' => new external_value(
                PARAM_INT,
                'Narrow activities to this course, or 0 for any',
                VALUE_DEFAULT,
                0
            ),
        ]);
    }

    /**
     * What one search found.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'options' => new external_multiple_structure(
                new external_single_structure([
                    'id' => new external_value(PARAM_INT, 'Course id, or course module id'),
                    'name' => new external_value(PARAM_TEXT, 'What to show for it'),
                ])
            ),
            'hasmore' => new external_value(PARAM_BOOL, 'Whether the search stopped short of every match'),
        ]);
    }

    /**
     * Searches one of the two pickers.
     *
     * @param string $type
     * @param string $query
     * @param int $cmid
     * @param int $courseid
     * @param int $filtercourseid
     * @return array
     */
    public static function execute(
        string $type,
        string $query = '',
        int $cmid = 0,
        int $courseid = 0,
        int $filtercourseid = 0
    ): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'type' => $type,
            'query' => $query,
            'cmid' => $cmid,
            'courseid' => $courseid,
            'filtercourseid' => $filtercourseid,
        ]);

        // The same scope the report itself is being read at, checked the same
        // way: a picker must never offer a course its reader could not open
        // the report for.
        $scope = scope::from_params($params['cmid'], $params['courseid']);
        self::validate_context($scope->context());
        $scope->require_capability();

        $found = $params['type'] === self::TYPE_ACTIVITY
            ? self::activities($scope, $params['query'], $params['filtercourseid'])
            : self::courses($scope, $params['query']);

        // One more than asked for is how the search knows there were more.
        $hasmore = count($found) > self::MAX_RESULTS;

        return [
            'options' => array_slice($found, 0, self::MAX_RESULTS),
            'hasmore' => $hasmore,
        ];
    }

    /**
     * The courses with an autograded activity whose name matches.
     *
     * @param scope $scope
     * @param string $query
     * @return array<int, array{id: int, name: string}>
     */
    private static function courses(scope $scope, string $query): array {
        global $DB;

        if ($scope->level() !== scope::LEVEL_SITE) {
            // Below site level the course is already decided; there is nothing
            // to pick between.
            return [];
        }

        [$where, $params] = self::name_match(['co.shortname', 'co.fullname'], $query);

        $rows = $DB->get_records_sql(
            "SELECT DISTINCT co.id, co.shortname, co.fullname
               FROM {local_autograder_config} cfg
               JOIN {course} co ON co.id = cfg.courseid
              WHERE cfg.enabled = 1 {$where}
           ORDER BY co.shortname",
            $params,
            0,
            self::MAX_RESULTS + 1
        );
        $options = [];

        foreach ($rows as $row) {
            $options[] = ['id' => (int) $row->id, 'name' => format_string($row->shortname)];
        }

        return $options;
    }

    /**
     * The autograded activities whose name matches.
     *
     * Matched on the module's own `name` column rather than through the course
     * module cache: the cache holds the formatted name but reading it means
     * loading one course's worth of cache per candidate, which is exactly the
     * cost this service exists to avoid. The name is then formatted for the
     * handful that are actually returned.
     *
     * @param scope $scope
     * @param string $query
     * @param int $filtercourseid
     * @return array<int, array{id: int, name: string}>
     */
    private static function activities(scope $scope, string $query, int $filtercourseid): array {
        global $DB;

        if ($scope->level() === scope::LEVEL_ACTIVITY) {
            return [];
        }

        $params = ['enabled' => 1];
        $where = 'cfg.enabled = :enabled AND cm.deletioninprogress = 0';

        if ($scope->level() === scope::LEVEL_COURSE) {
            $where .= ' AND cfg.courseid = :scopecourseid';
            $params['scopecourseid'] = (int) $scope->course()->id;
        } else if ($filtercourseid > 0) {
            // Site level, with the course picker already narrowed: the
            // activity list follows it, the same way the table does.
            $where .= ' AND cfg.courseid = :filtercourseid';
            $params['filtercourseid'] = $filtercourseid;
        }

        [$namewhere, $nameparams] = self::name_match(['md.name'], $query);
        $params += $nameparams;

        // The activity's name lives in its own module table, which differs per
        // module type, so the union of the enabled types is built rather than
        // joined: `{assign} a ON ...` cannot be written once for all of them.
        // Joined to the course as well, so that a configuration left behind by
        // a deleted course cannot put a name in the picker that leads nowhere.
        $rows = $DB->get_records_sql(
            "SELECT cfg.cmid, cfg.courseid, md.name
               FROM {local_autograder_config} cfg
               JOIN {course_modules} cm ON cm.id = cfg.cmid
               JOIN {course} co ON co.id = cfg.courseid
               JOIN {modules} m ON m.id = cm.module
               JOIN " . self::module_names_union($params) . " md
                    ON md.modname = m.name AND md.instanceid = cm.instance
              WHERE {$where} {$namewhere}
           ORDER BY md.name",
            $params,
            0,
            self::MAX_RESULTS + 1
        );
        $options = [];

        foreach ($rows as $row) {
            $context = \context_module::instance((int) $row->cmid, IGNORE_MISSING);
            $options[] = [
                'id' => (int) $row->cmid,
                'name' => $context
                    ? format_string($row->name, true, ['context' => $context])
                    : format_string($row->name),
            ];
        }

        return $options;
    }

    /**
     * A derived table of every autogradable activity's id and name, across the
     * module types the site has autograder switched on for.
     *
     * @param array $params Added to.
     * @return string
     */
    private static function module_names_union(array &$params): string {
        $selects = [];
        $index = 0;

        foreach (\local_autograder\local\config\eligibility::enabled_module_types() as $modname) {
            $key = 'unionmod' . $index++;
            $params[$key] = $modname;
            // The table name is a plugin's own component name, never anything
            // a request said, so it cannot carry anything but a module type.
            $selects[] = "SELECT id AS instanceid, name, :{$key} AS modname FROM {" . $modname . '}';
        }

        if ($selects === []) {
            // Nothing is autogradable, so nothing can match.
            return '(SELECT 0 AS instanceid, \'\' AS name, \'\' AS modname WHERE 1 = 0)';
        }

        return '(' . implode(' UNION ALL ', $selects) . ')';
    }

    /**
     * Matches what the reader typed against one or more name columns.
     *
     * @param string[] $columns
     * @param string $query
     * @return array{0: string, 1: array} A leading "AND ..." fragment, empty when nothing was typed.
     */
    private static function name_match(array $columns, string $query): array {
        global $DB;

        $query = trim($query);

        if ($query === '') {
            return ['', []];
        }

        $params = [];
        $branches = [];
        $index = 0;

        foreach ($columns as $column) {
            $key = 'namematch' . $index++;
            $params[$key] = '%' . $DB->sql_like_escape(\core_text::strtolower($query)) . '%';
            $branches[] = $DB->sql_like("LOWER({$column})", ":{$key}", false);
        }

        return [' AND (' . implode(' OR ', $branches) . ')', $params];
    }
}
