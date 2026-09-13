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
use report_autograder\local\filters;
use report_autograder\local\report_query;
use report_autograder\local\row_formatter;
use report_autograder\local\scope;

/**
 * One page of the report, for whichever of the three levels was asked for.
 *
 * Paging is done here rather than in the browser. The previous version sent
 * every row and sliced it client-side, which is fine for one activity and
 * impossible for a site.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_report extends external_api {
    /** @var int Rows per page when the client does not say. */
    private const DEFAULT_LIMIT = 12;

    /** @var int The most rows one call will ever return. */
    private const MAX_LIMIT = 200;

    /**
     * What this service accepts.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'One activity, or 0', VALUE_DEFAULT, 0),
            'courseid' => new external_value(PARAM_INT, 'One course, or 0', VALUE_DEFAULT, 0),
            'page' => new external_value(PARAM_INT, 'Zero-based page number', VALUE_DEFAULT, 0),
            'limit' => new external_value(PARAM_INT, 'Rows per page (0 = default)', VALUE_DEFAULT, 0),
            'filters' => new external_multiple_structure(
                new external_single_structure([
                    'name' => new external_value(PARAM_ALPHANUMEXT, 'Which filter'),
                    'value' => new external_value(PARAM_TEXT, 'What to narrow it to'),
                ]),
                'What to narrow the table to',
                VALUE_DEFAULT,
                []
            ),
            'sortcolumn' => new external_value(PARAM_ALPHANUMEXT, 'user_name, completed_at_sort, or empty', VALUE_DEFAULT, ''),
            'sortdir' => new external_value(PARAM_ALPHA, 'asc or desc', VALUE_DEFAULT, 'asc'),
        ]);
    }

    /**
     * One page of the report.
     *
     * @param int $cmid
     * @param int $courseid
     * @param int $page
     * @param int $limit
     * @param array $filters
     * @param string $sortcolumn
     * @param string $sortdir
     * @return array
     */
    public static function execute(
        int $cmid = 0,
        int $courseid = 0,
        int $page = 0,
        int $limit = 0,
        array $filters = [],
        string $sortcolumn = '',
        string $sortdir = 'asc'
    ): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid' => $cmid,
            'courseid' => $courseid,
            'page' => $page,
            'limit' => $limit,
            'filters' => $filters,
            'sortcolumn' => $sortcolumn,
            'sortdir' => $sortdir,
        ]);

        $scope = scope::from_params($params['cmid'], $params['courseid']);
        self::validate_context($scope->context());
        $scope->require_capability();

        $limit = self::normalise_limit($params['limit']);
        $filters = filters::from_request($params['filters'], $scope->can_see_failures());
        $sortcolumn = self::normalise_sort_column($params['sortcolumn']);

        $total = report_query::count($scope, $filters);
        $rows = report_query::rows(
            $scope,
            $filters,
            $sortcolumn,
            $params['sortdir'],
            max(0, $params['page']),
            $limit
        );

        return [
            'totalrecords' => $total,
            'limit' => $limit,
            'page' => max(0, $params['page']),
            'data' => row_formatter::format_all($rows, $scope),
        ];
    }

    /**
     * A page size this service is willing to serve.
     *
     * @param int $limit
     * @return int
     */
    private static function normalise_limit(int $limit): int {
        if ($limit <= 0) {
            return self::DEFAULT_LIMIT;
        }

        return min($limit, self::MAX_LIMIT);
    }

    /**
     * A column this report actually sorts by.
     *
     * @param string $column
     * @return string Empty for anything this report does not sort by.
     */
    private static function normalise_sort_column(string $column): string {
        $column = trim($column);

        return in_array($column, [report_query::SORT_NAME, report_query::SORT_DATE], true) ? $column : '';
    }

    /**
     * What this service returns.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'totalrecords' => new external_value(PARAM_INT, 'Rows the report has, before paging'),
            'limit' => new external_value(PARAM_INT, 'Rows on this page'),
            'page' => new external_value(PARAM_INT, 'Which page this is'),
            'data' => new external_multiple_structure(
                new external_single_structure([
                    'rowkey' => new external_value(PARAM_RAW, 'Unique per activity and student'),
                    'user_col' => new external_value(PARAM_RAW, 'The student column, picture and name'),
                    'user_name' => new external_value(PARAM_TEXT, 'The student, as text'),
                    'user_profile_url' => new external_value(PARAM_URL, 'Their profile'),
                    'user_picture_url' => new external_value(PARAM_URL, 'Their picture'),
                    'moodle_userid' => new external_value(PARAM_INT, 'The student'),
                    'courseid' => new external_value(PARAM_INT, 'The course'),
                    'instanceid' => new external_value(PARAM_INT, 'The activity instance'),
                    'modname' => new external_value(PARAM_PLUGIN, 'The activity type'),
                    'status' => new external_value(PARAM_TEXT, 'What the badge says'),
                    'status_key' => new external_value(PARAM_ALPHANUMEXT, 'What the badge means'),
                    'status_class' => new external_value(PARAM_NOTAGS, 'How the badge looks'),
                    'completed_at' => new external_value(PARAM_TEXT, 'The date, formatted'),
                    'completed_at_sort' => new external_value(PARAM_INT, 'The date, for sorting'),
                    'date_reason' => new external_value(PARAM_TEXT, 'Why that date', VALUE_OPTIONAL),
                    'grade' => new external_value(PARAM_TEXT, 'The grade the student has', VALUE_OPTIONAL),
                    'provisional_grade' => new external_value(PARAM_TEXT, 'The grade they are going to get', VALUE_OPTIONAL),
                    'grade_problem' => new external_value(PARAM_TEXT, 'Why no grade can be promised', VALUE_OPTIONAL),
                    'graded_by' => new external_value(PARAM_TEXT, 'The teacher it was graded as', VALUE_OPTIONAL),
                    'will_grade' => new external_value(PARAM_TEXT, 'The teacher it is going to be graded as', VALUE_OPTIONAL),
                    'will_grade_problem' => new external_value(PARAM_TEXT, 'Why nobody can be named yet', VALUE_OPTIONAL),
                    'shows_groups' => new external_value(PARAM_BOOL, 'Whether the table has a group column', VALUE_OPTIONAL),
                    'groups' => new external_value(PARAM_TEXT, 'The student\'s groups in this activity', VALUE_OPTIONAL),
                    'failure_reason' => new external_value(PARAM_TEXT, 'Why it failed', VALUE_OPTIONAL),
                    'activity_name' => new external_value(PARAM_TEXT, 'The activity', VALUE_OPTIONAL),
                    'activity_url' => new external_value(PARAM_URL, 'That activity\'s own report', VALUE_OPTIONAL),
                    'course_name' => new external_value(PARAM_TEXT, 'The course', VALUE_OPTIONAL),
                    'course_url' => new external_value(PARAM_URL, 'That course\'s own report', VALUE_OPTIONAL),
                    'grade_user_url' => new external_value(PARAM_URL, 'The activity grading screen', VALUE_OPTIONAL),
                    'show_forum_grader' => new external_value(PARAM_BOOL, 'Launch the forum grader', VALUE_OPTIONAL),
                ])
            ),
        ]);
    }
}
