<?php
namespace report_autograder\webservice;
defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->libdir . '/gradelib.php');

use external_api;
use external_function_parameters;
use external_multiple_structure;
use external_single_structure;
use external_value;
use report_autograder\external_service\user_grades;
use report_autograder\local\grade_data_provider;
    class external_get_grade_report extends external_api {

    public static function get_report_data_parameters() {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'The course module ID', VALUE_REQUIRED),
            'page' => new external_value(PARAM_INT, 'The page number to fetch', VALUE_DEFAULT, 0)
        ]);
    }

    public static function get_report_data($cmid, $page) {
        global $CFG, $DB;

        self::validate_parameters(self::get_report_data_parameters(), ['cmid' => $cmid, 'page' => $page]);

        list($course, $cm) = get_course_and_cm_from_cmid($cmid);
        if (!$course || !$cm) {
            throw new \moodle_exception('invalidcoursemodule');
        }

        $context = \context_module::instance($cm->id);
        self::validate_context($context);
        require_capability('report/autograder:view', $context);

        // Fetch the grade item for this activity to get the max grade.
        $grade_item = \grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => $cm->modname, 'iteminstance' => $cm->instance, 'courseid' => $course->id]);
        $maxgrade = $grade_item ? $grade_item->grademax : null;

        $limit = get_config('report_autograder', 'paginationlimit');
        if (empty($limit) || $limit <= 0) {
            $limit = 20;
        }

        $start = $page * $limit;
        $end = $start + $limit;
        $paginationstring = "{$start},{$end}";

        $campusuuid = get_config('local_message_broker', 'siteexternalid');
        if (empty($campusuuid)) {
            throw new \moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
        }
        try {
            $external_response = user_grades::get_user_grades($cm->id, $campusuuid, $paginationstring);
        } catch (\Exception $e) {
            throw $e;
        }

        $final_results = [];
        if (!empty($external_response['data'])) {

            $useruuids = array_map(function($item) { return $item['userUuid']; }, $external_response['data']);

            $users_by_id = $DB->get_records_list('user', 'idnumber', $useruuids, '', 'id, idnumber, firstname, lastname');
            $users_by_uuid = [];
            foreach ($users_by_id as $user_record) {
                if (!empty($user_record->idnumber)) {
                    $users_by_uuid[$user_record->idnumber] = $user_record;
                }
            }

            $userids = array_keys($users_by_id);
            $gradesinfo = \grade_get_grades($course->id, 'mod', $cm->modname, $cm->instance, $userids);
            $gradesbyuserid = !empty($gradesinfo->items[0]->grades) ? $gradesinfo->items[0]->grades : [];

            $completionsbyuserid = [];
            if (!empty($userids)) {
                list($usql, $params) = $DB->get_in_or_equal($userids);
                array_unshift($params, $cm->id);
                $sql = "SELECT userid, timemodified
                          FROM {course_modules_completion}
                         WHERE coursemoduleid = ? AND userid $usql";
                $completions = $DB->get_records_sql($sql, $params);
                foreach ($completions as $completion) {
                    if (!empty($completion->timemodified)) {
                        $completionsbyuserid[$completion->userid] = $completion;
                    }
                }
            }
            // --- Batch fetching ends ---

            foreach ($external_response['data'] as $external_item) {
                $external_item_obj = (object)$external_item;

                $user = $users_by_uuid[$external_item_obj->userUuid] ?? null;

                $grade = $user && isset($gradesbyuserid[$user->id]) ? $gradesbyuserid[$user->id] : null;
                $completion = $user && isset($completionsbyuserid[$user->id]) ? $completionsbyuserid[$user->id] : null;

                $local_data = grade_data_provider::get_moodle_context($external_item_obj, $course, $user, $grade, $completion);

                $status_string = \get_string('feedback:no_status', 'report_autograder');
                if (!empty($external_item['status'])) {
                    $status_key = 'status:' . strtolower($external_item['status']);
                    if (\get_string_manager()->string_exists($status_key, 'report_autograder')) {
                        $status_string = \get_string($status_key, 'report_autograder');
                    } else {
                        $status_string = $external_item['status'];
                    }
                }
                $submission_date_display = !empty($local_data->submission_date_timestamp) ? \userdate($local_data->submission_date_timestamp) : '-';

                $completed_at_display = '-';
                $completed_at_timestamp = 0;
                if (!empty($external_item['completedAt'])) {
                    try {
                        $datetime = new \DateTime($external_item['completedAt']);
                        $completed_at_timestamp = $datetime->getTimestamp();
                        $completed_at_display = \userdate($completed_at_timestamp);
                    } catch (\Exception $e) {
                    }
                }

                $final_results[] = [
                    'id' => $external_item['id'],
                    'user_name' => $local_data->user_name ?? \get_string('unknownuser'),
                    'grade' => $local_data->grade,
                    'submission_date' => $submission_date_display,
                    'submission_date_sort' => (int)($local_data->submission_date_timestamp ?? 0),
                    'status' => $status_string,
                    'completed_at' => $completed_at_display,
                    'completed_at_sort' => $completed_at_timestamp,
                ];
            }
        }

        $final_return = [
            'totalrecords' => $external_response['total'],
            'limit' => $limit,
            'maxgrade' => $maxgrade,
            'data' => $final_results
        ];
        return $final_return;
    }

    public static function get_report_data_returns() {
        return new external_single_structure([
            'totalrecords' => new external_value(PARAM_INT, 'Total number of records available'),
            'limit' => new external_value(PARAM_INT, 'The number of records per page'),
            'maxgrade' => new external_value(PARAM_FLOAT, 'Maximum possible grade for the activity', VALUE_OPTIONAL),
            'data' => new external_multiple_structure(
                new external_single_structure([
                    'id' => new external_value(PARAM_INT, 'The external completion ID'),
                    'user_name' => new external_value(PARAM_TEXT, 'Student full name'),
                    'grade' => new external_value(PARAM_FLOAT, 'The final grade', VALUE_OPTIONAL),
                    'submission_date' => new external_value(PARAM_TEXT, 'The submission date, formatted'),
                    'submission_date_sort' => new external_value(PARAM_INT, 'The submission date, as a timestamp for sorting'),
                    'status' => new external_value(PARAM_TEXT, 'The current status of the grading process'),
                    'completed_at' => new external_value(PARAM_TEXT, 'The date the grading was completed, formatted'),
                    'completed_at_sort' => new external_value(PARAM_INT, 'The completion date, as a timestamp for sorting'),
                ])
            )
        ]);
    }
}
