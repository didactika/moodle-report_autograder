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
        global $DB, $USER, $CFG;
        require_once($CFG->libdir . '/gradelib.php');
        require_once($CFG->dirroot . '/report/autograder/lib.php');

        if (!defined('COMPLETION_REPORT_PAGE')) {
            define("COMPLETION_REPORT_PAGE", get_config('report_autograder', 'limitpagination') ?? 5);
        }        
    
        // Validar los parámetros
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

        $where = [];
        $where_params = [];

        if ($sifirst !== 'all') {
            $where[] = $DB->sql_like('u.firstname', ':sifirst', false, false);
            $where_params['sifirst'] = $sifirst . "%";
        }

        if ($silast !== 'all') {
            $where[] = $DB->sql_like('u.lastname', ':silast', false, false);
            $where_params['silast'] = $silast . "%";
        }
            
        $start_from = ( $actual_page) * COMPLETION_REPORT_PAGE;
        if ($mod_type == 'forum') {
            $sql_report = "SELECT laed.id,
                                   laed.courseid, 
                                   laed.relateduserid,
                                   laed.timecreated,
                                   laed.score_to_assign,
                                   laed.date_to_grade,
                                   laed.contextid,
                                   laed.instanceid,
                                   fg.id as fg_id,
                                   fg.forum, 
                                   fg.grade,
                                   fg.timecreated as activity_created_at,
                                   fg.timemodified as activity_modified_at,
                                   COUNT(laed.id) OVER() as total_records";
            $sql = " FROM {local_autograder_event_data} laed
                      JOIN {user} u ON u.id = laed.relateduserid
                      LEFT JOIN {forum_grades} fg 
                         ON (fg.forum = laed.instanceid AND fg.userid = laed.relateduserid)
                      WHERE laed.id = (SELECT max(laed.id)
                                       FROM {local_autograder_event_data} laed
                                       WHERE laed.contextinstanceid = :cmi
                                       AND laed.instanceid = :instanceid
                                       AND laed.userid = u.id ) ";
        } elseif ($mod_type == 'assign') {
            $sql_report = "SELECT laed.id,
                                   laed.courseid, 
                                   laed.relateduserid,
                                   laed.timecreated,
                                   laed.score_to_assign,
                                   laed.date_to_grade,
                                   laed.contextid,
                                   laed.instanceid, 
                                   ag.id as ag_id,
                                   ag.assignment,
                                   ag.grade,
                                   ag.timecreated as activity_created_at,
                                   ag.timemodified as activity_modified_at,
                                   COUNT(laed.id) OVER() as total_records";
            $sql = " FROM {local_autograder_event_data} laed 
                      JOIN {user} u ON u.id = laed.relateduserid              
                      LEFT JOIN {assign_grades} ag ON (ag.assignment = laed.instanceid 
                          AND ag.userid = laed.relateduserid )
                      WHERE laed.id = (SELECT max(laed.id)
                                       FROM {local_autograder_event_data} laed
                                       WHERE laed.contextinstanceid = :cmi
                                       AND laed.instanceid = :instanceid
                                       AND laed.userid = u.id )";
        } else {
            print_error('invalidaction');
        }
        
        $sql_params = ['cmi' => $cmid, 'instanceid' => $modid];
        
        if ($where) {
            $where_string = implode(' AND ', $where);
            $sql .= " AND $where_string";
            $sql_params = array_merge($sql_params, $where_params);
        }

        $sort = "ORDER BY laed.timecreated DESC";
        
        /** @var moodle_recordset $record_set */
        $record_set = $DB->get_recordset_sql($sql_report . $sql . $sort, $sql_params, $start_from, COMPLETION_REPORT_PAGE);
        $total_records = $record_set->valid() ? $record_set->current()->total_records : 0;

        $objects = [];
        //get points decimal configured
        
        foreach ($record_set as $record) {
            if (!is_enrolledstudent($record->relateduserid, $record->courseid)) {
                continue;
            }
            $student_info = \core_user::get_user($record->relateduserid);
            $student_name = fullname($student_info);
            $submission_date = $record->timecreated;
            $submission_graded = !is_null($record->activity_modified_at)
                ? $record->activity_modified_at
                : $submission_date;
            $score_created_at = userdate($submission_date, get_string('strftimedatetime', 'core_langconfig'));
            $score_modified_at = userdate($submission_graded, get_string('strftimedatetime', 'core_langconfig'));
            $grade_to_apply = $record->score_to_assign;
            $date_to_grade = userdate($record->date_to_grade, get_string('strftimedatetime', 'core_langconfig'));
            $url_to_edit = new moodle_url("/report/autograder/{$mod_type}_save.php");
            $description = get_string('gradeverb');
            $general_status = get_string('status:placeholder', 'report_autograder');
            // Chequeamos el estatus y la nota a ser enviada al template
            if (is_null($record->grade) || $record->grade == -1 || $record->grade == '-1.00000') {
                $status = get_string('status:pending', 'report_autograder');
                $grade_clean = $grade_to_apply;
                $grade_to_show = 0.00;
                $placeholder = $general_status . ": " . $grade_to_apply;
            } else {
                $status = get_string('status:graded', 'report_autograder');
                $grade_to_show = format_float(unformat_float($record->grade),$points_decimals);
                $placeholder = null;
            }

            $objects[] = [
                "userid"                   => $student_info->id,
                "grade"                    => $grade_to_show,
                "grade_placeholder"        => $placeholder,
                "grade_action_description" => $description,
                "timecreated"              => $record->timecreated,
                "timemodified"             => $record->timemodified ?? 0,
                "user_name"                => $student_name,
                "submission_date"          => $score_created_at,
                "submission_graded"        => $score_modified_at,
                "date_to_grade"            => $date_to_grade ? : get_string('status:nothing_to_show', 'report_autograder'),
                "context_id"               => $record->contextid,
                "course_id"                => $record->courseid,
                "modid"                    => $record->instanceid,
                "grade_clean"              => $grade_clean ?? null,
                "status"                   => $status,
                "mod_type"                 => $mod_type,
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
                    'grade_placeholder' => new external_value(PARAM_TEXT, 'Placeholder?'),
                    'grade_action_description' => new external_value(PARAM_TEXT, 'Placeholder?'),
                    'timecreated' => new external_value(PARAM_INT, 'Creation date'),
                    'timemodified' => new external_value(PARAM_INT, 'Modification date'),
                    'user_name' => new external_value(PARAM_TEXT, 'User name'),
                    'submission_date' => new external_value(PARAM_TEXT, 'Submission date'),
                    'submission_graded' => new external_value(PARAM_TEXT, 'Grading date'),
                    'date_to_grade' => new external_value(PARAM_TEXT, 'Date to grade'),
                    'context_id' => new external_value(PARAM_INT, 'Context ID'),
                    'course_id' => new external_value(PARAM_INT, 'Course ID'),
                    'modid' => new external_value(PARAM_INT, 'Module ID'),
                    'grade_clean' => new external_value(PARAM_TEXT, 'Clean grade'),
                    'status' => new external_value(PARAM_TEXT, 'Status'),
                    'mod_type' => new external_value(PARAM_TEXT, 'Module type')
                ])
            )
        ]);
    }
}
