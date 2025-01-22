<?php
namespace report_autograder\webservices;

use external_api;
use external_function_parameters;
use external_single_structure;
use external_multiple_structure;
use external_value;
use moodle_url;

defined('MOODLE_INTERNAL') || die();

class get_grades extends external_api {
    /**
     * Define the input parameters for the web service.
     *
     * @return external_function_parameters
     */
    public static function get_grades_parameters() {
        return new external_function_parameters([
            'course_id' => new external_value(PARAM_INT, 'Course ID'),
            'cmid' => new external_value(PARAM_INT, 'Course module ID'),
            'modid' => new external_value(PARAM_INT, 'Module ID'),
            'mod_type' => new external_value(PARAM_ALPHA, 'Module type'),
            'actual_page' => new external_value(PARAM_INT, 'Current page', VALUE_DEFAULT, 0),
            'sifirst' => new external_value(PARAM_TEXT, 'Filter by first name', VALUE_DEFAULT, 'all'),
            'silast' => new external_value(PARAM_TEXT, 'Filter by last name', VALUE_DEFAULT, 'all'),
            'separator_decimals' => new external_value(PARAM_TEXT, 'Decimal separator', VALUE_DEFAULT, '.'),
            'points_decimals' => new external_value(PARAM_INT, 'Number of decimal places for points', VALUE_DEFAULT, '2')
        ]);
    }

    /**
     * Web service logic to retrieve complete grades.
     *
     * @param int $course_id
     * @param int $cmid
     * @param int $modid
     * @param string $mod_type
     * @param int $actual_page
     * @param string $sifirst
     * @param string $silast
     * @return array
     */
    public static function get_grades($course_id, $cmid, $modid, $mod_type, $actual_page, $sifirst, $silast, $separator_decimals, $points_decimals) {
        global $DB, $CFG;
        require_once($CFG->libdir . '/gradelib.php');
        require_once($CFG->dirroot . '/report/autograder/lib.php');

        if (!defined('COMPLETION_REPORT_PAGE')) {
            define("COMPLETION_REPORT_PAGE", get_config('report_autograder', 'limitpagination') ?? 5);
        }        

        // Validate parameters
        $params = self::validate_parameters(
            self::get_grades_parameters(),
            array(
                'course_id' => $course_id,
                'cmid' => $cmid,
                'modid' => $modid,
                'mod_type' => $mod_type,
                'actual_page' => $actual_page,
                'sifirst' => $sifirst,
                'silast' => $silast,
            )
        );

        $start_from = $actual_page * COMPLETION_REPORT_PAGE;

$sql_report = "SELECT 
                   laed.id, laed.courseid, laed.relateduserid, laed.timecreated,
                   laed.score_to_assign, laed.date_to_grade, laed.contextid,
                   laed.instanceid,
                   COUNT(*) OVER() AS total_records
               FROM mdl_local_autograder_event_data laed
               JOIN mdl_user u ON u.id = laed.relateduserid
               WHERE laed.contextinstanceid = :cmi
                 AND laed.instanceid = :instanceid
               ORDER BY laed.timecreated DESC";


        $sql_params = [
            'cmi' => $cmid,
            'instanceid' => $modid
        ];

        if ($sifirst !== 'all') {
            $sql_report .= " AND " . $DB->sql_like('u.firstname', ':sifirst');
            $sql_params['sifirst'] = $sifirst . "%";
        }

        if ($silast !== 'all') {
            $sql_report .= " AND " . $DB->sql_like('u.lastname', ':silast');
            $sql_params['silast'] = $silast . "%";
        }

        $sql_report .= " ORDER BY laed.timecreated DESC";

        $record_set = $DB->get_recordset_sql($sql_report, $sql_params, $start_from, COMPLETION_REPORT_PAGE);

        $objects = [];
        $total_records = 0;

        foreach ($record_set as $record) {
            $total_records = $record->total_records;

            $student_info = \core_user::get_user($record->relateduserid);
            $student_name = fullname($student_info);

            $submission_date = userdate($record->timecreated, get_string('strftimedatetime', 'core_langconfig'));
            $graded_date = !is_null($record->activity_modified_at) 
                ? userdate($record->activity_modified_at, get_string('strftimedatetime', 'core_langconfig'))
                : $submission_date;

            $grade_to_show = is_null($record->grade) || $record->grade == -1
                ? 0.00
                : format_float($record->grade, $points_decimals);

            $status = is_null($record->grade) || $record->grade == -1
                ? get_string('status:pending', 'report_autograder')
                : get_string('status:graded', 'report_autograder');

            $objects[] = [
                "userid" => $student_info->id,
                "grade" => $grade_to_show,
                "timecreated" => $record->timecreated,
                "timemodified" => $record->activity_modified_at ?? 0,
                "user_name" => $student_name,
                "submission_date" => $submission_date,
                "submission_graded" => $graded_date,
                "context_id" => $record->contextid,
                "course_id" => $record->courseid,
                "modid" => $record->instanceid,
                "status" => $status,
            ];
        }
        $record_set->close();

        return [
            'data' => $objects,
            'total_records' => $total_records,
        ];
    }

    /**
     * Define the output structure for the web service.
     *
     * @return external_single_structure
     */
    public static function get_grades_returns() {
        return new external_single_structure([
            'data' => new external_multiple_structure(
                new external_single_structure([
                    'userid' => new external_value(PARAM_INT, 'User ID'),
                    'grade' => new external_value(PARAM_TEXT, 'Grade'),
                    'timecreated' => new external_value(PARAM_INT, 'Creation date'),
                    'timemodified' => new external_value(PARAM_INT, 'Modification date'),
                    'user_name' => new external_value(PARAM_TEXT, 'User name'),
                    'submission_date' => new external_value(PARAM_TEXT, 'Submission date'),
                    'submission_graded' => new external_value(PARAM_TEXT, 'Grading date'),
                    'context_id' => new external_value(PARAM_INT, 'Context ID'),
                    'course_id' => new external_value(PARAM_INT, 'Course ID'),
                    'modid' => new external_value(PARAM_INT, 'Module ID'),
                    'status' => new external_value(PARAM_TEXT, 'Status'),
                ])
            ),
            'total_records' => new external_value(PARAM_INT, 'Total records'),
        ]);
    }
}
