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
    public static function get_report_data(int $cmid, int $page, array $filters): array
    {
        list($course, $cm) = get_course_and_cm_from_cmid($cmid);
        if (!$course || !$cm) {
            throw new \moodle_exception('invalidcoursemodule');
        }

        $context = \context_module::instance($cm->id);
        \external_api::validate_context($context);
        require_capability('report/autograder:view', $context);

        $cmid_completions = filter_handler::get_filtered_completion_ids($cmid, $filters);
        $api_filters = filter_handler::get_api_filters($filters);

        $limit = get_config('report_autograder', 'paginationlimit');
        $limit = (empty($limit) || $limit <= 0) ? 20 : (int)$limit;

        $api_page = $page + 1;

        $campusuuid = get_config('report_autograder', 'siteexternalid');
        if (empty($campusuuid)) {
            throw new \moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
        }

        try {
            $external_response = user_grades::get_user_grades($cm->id, $campusuuid, $api_page, $limit, $api_filters, $cmid_completions);
        } catch (\Exception $e) {
            var_dump($e);
            throw $e;
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
