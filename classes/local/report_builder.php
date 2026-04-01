<?php

namespace report_autograder\local;

/**
 * This file communicates requests to the appropriate flow between the API and Moodle, in addition to parsing pagination details and checking if there are filters to be processed.
 *
 * @package     report_autograder
 * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->libdir . '/gradelib.php');

use report_autograder\external_service\user_grades;

class report_builder
{
    public static function get_report_data(int $cmid, int $page, array $filters, int $limit_override = 0): array
    {
        list($course, $cm) = get_course_and_cm_from_cmid($cmid);
        if (!$course || !$cm) {
            throw new \moodle_exception('invalidcoursemodule');
        }

        $context = \context_module::instance($cm->id);
        \external_api::validate_context($context);
        require_capability('report/autograder:view', $context);

        error_log('[autograder] get_report_data called: cmid=' . $cmid . ' page=' . $page . ' limit_override=' . $limit_override);
        $cmid_completions = filter_handler::get_filtered_completion_ids($cmid, $filters);
        $api_filters = filter_handler::get_api_filters($filters);

        // If Moodle-side filters were active but matched no users, return empty
        // results immediately — no point calling the external API.
        if ($cmid_completions === null) {
            $grade_item = \grade_item::fetch([
                'itemtype' => 'mod',
                'itemmodule' => $cm->modname,
                'iteminstance' => $cm->instance,
                'courseid' => $course->id,
                'itemnumber' => 0
            ]);
            return [
                'totalrecords' => 0,
                'limit' => ($limit_override > 0) ? $limit_override : 12,
                'maxgrade' => $grade_item ? $grade_item->grademax : null,
                'data' => []
            ];
        }

        $limit = ($limit_override > 0) ? $limit_override : 12;

        $api_page = $page + 1;

        $campusuuid = get_config('report_autograder', 'siteexternalid');
        if (empty($campusuuid)) {
            throw new \moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
        }

        try {
            $external_response = user_grades::get_user_grades($cm->id, $campusuuid, $api_page, $limit, $api_filters, []);
        } catch (\Exception $e) {
            throw $e;
        }

        // Filter API results on the Moodle side:
        // - If a name filter is active, keep only matching UUIDs.
        // - data_enricher will further restrict to enrolled users only.
        if (!empty($cmid_completions) && !empty($external_response['data'])) {
            $uuid_set = array_flip($cmid_completions);
            $external_response['data'] = array_values(
                array_filter($external_response['data'], function ($item) use ($uuid_set) {
                    return isset($uuid_set[$item['userUuid'] ?? '']);
                })
            );
        }

        $final_results = [];
        if (!empty($external_response['data'])) {
            $final_results = data_enricher::enrich_data($external_response['data'], $course->id, $cm->id);
        }

        $grade_item = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => $cm->modname,
            'iteminstance' => $cm->instance,
            'courseid' => $course->id,
            'itemnumber' => 0
        ]);
        $maxgrade = $grade_item ? $grade_item->grademax : null;
        $totalrecords = isset($external_response['pagination']['total']) ? (int)$external_response['pagination']['total'] : 0;

        return [
            'totalrecords' => $totalrecords,
            'limit' => $limit,
            'maxgrade' => $maxgrade,
            'data' => $final_results
        ];
    }
}
