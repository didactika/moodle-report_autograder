<?php
namespace report_autograder\webservices;

use external_api;
use external_function_parameters;
use external_single_structure;
use external_multiple_structure;
use external_value;
use moodle_url;
use context_course;

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
            'points_decimals' => new external_value(PARAM_INT, 'Number of decimal places for points', VALUE_DEFAULT, 2)
        ]);
    }

    /**
     * Web service logic to retrieve complete grades.
     */
    public static function get_grades($course_id, $cmid, $modid, $mod_type, $actual_page, $sifirst, $silast, $separator_decimals, $points_decimals) {
        global $DB, $CFG;
        require_once($CFG->libdir . '/gradelib.php');

        // Define paginación
        $limit_per_page = get_config('report_autograder', 'limitpagination') ?? 20;
        $start_from = $actual_page * $limit_per_page;

        // Validar parámetros
        $params = self::validate_parameters(
            self::get_grades_parameters(),
            [
                'course_id' => $course_id,
                'cmid' => $cmid,
                'modid' => $modid,
                'mod_type' => $mod_type,
                'actual_page' => $actual_page,
                'sifirst' => $sifirst,
                'silast' => $silast,
            ]
        );

        // Filtro WHERE
        $where = [];
        $where_params = ['cmi' => $cmid, 'instanceid' => $modid];

        if ($sifirst !== 'all') {
            $where[] = $DB->sql_like('u.firstname', ':sifirst', false, false);
            $where_params['sifirst'] = $sifirst . "%";
        }
        if ($silast !== 'all') {
            $where[] = $DB->sql_like('u.lastname', ':silast', false, false);
            $where_params['silast'] = $silast . "%";
        }

        // Query SQL según el tipo de módulo
        $sql_report = "SELECT laed.id,
                               laed.courseid, 
                               laed.relateduserid,
                               laed.timecreated,
                               laed.score_to_assign,
                               laed.date_to_grade,
                               laed.contextid,
                               laed.instanceid,
                               CASE 
                                   WHEN fg.id IS NOT NULL THEN fg.grade
                                   WHEN ag.id IS NOT NULL THEN ag.grade
                                   ELSE NULL
                               END AS grade,
                               CASE 
                                   WHEN fg.timecreated IS NOT NULL THEN fg.timecreated
                                   WHEN ag.timecreated IS NOT NULL THEN ag.timecreated
                                   ELSE NULL
                               END AS activity_created_at,
                               CASE 
                                   WHEN fg.timemodified IS NOT NULL THEN fg.timemodified
                                   WHEN ag.timemodified IS NOT NULL THEN ag.timemodified
                                   ELSE NULL
                               END AS activity_modified_at,
                               COUNT(*) OVER() AS total_records";

        $sql_from = " FROM {local_autograder_event_data} laed
                      JOIN {user} u ON u.id = laed.relateduserid";

        if ($mod_type === 'forum') {
            $sql_from .= " LEFT JOIN {forum_grades} fg 
                           ON fg.forum = laed.instanceid AND fg.userid = laed.relateduserid";
        } elseif ($mod_type === 'assign') {
            $sql_from .= " LEFT JOIN {assign_grades} ag 
                           ON ag.assignment = laed.instanceid AND ag.userid = laed.relateduserid";
        } else {
            throw new \moodle_exception('invalidaction');
        }

        $sql_where = " WHERE laed.contextinstanceid = :cmi
                         AND laed.instanceid = :instanceid";

        if ($where) {
            $sql_where .= " AND " . implode(' AND ', $where);
        }

        $sql_order = " ORDER BY laed.timecreated DESC";

        // Concatenar la consulta
        $final_sql = $sql_report . $sql_from . $sql_where . $sql_order;

        // Obtener los datos paginados
        $record_set = $DB->get_recordset_sql($final_sql, $where_params, $start_from, $limit_per_page);

        $objects = [];
        $total_records = 0;

        // Cachear los usuarios inscritos
        $enrolled_users = get_enrolled_users(context_course::instance($course_id));
        $enrolled_ids = array_column($enrolled_users, 'id');

        foreach ($record_set as $record) {
            // Verificar si el usuario está inscrito
            if (!in_array($record->relateduserid, $enrolled_ids)) {
                continue;
            }

            $student_info = \core_user::get_user($record->relateduserid);
            $student_name = fullname($student_info);

            $submission_date = userdate($record->timecreated, get_string('strftimedatetime', 'core_langconfig'));
            $submission_graded = userdate($record->activity_modified_at, get_string('strftimedatetime', 'core_langconfig'));
            $date_to_grade = userdate($record->date_to_grade, get_string('strftimedatetime', 'core_langconfig'));

            $grade = is_null($record->grade) ? 0.00 : format_float($record->grade, $points_decimals);
            $grade_clean = $record->score_to_assign;

            $status = is_null($record->grade) ? get_string('status:pending', 'report_autograder') : get_string('status:graded', 'report_autograder');
            $grade_placeholder = $grade_clean ?? null;
            $description = get_string('gradeverb', 'report_autograder');

            $objects[] = [
                "userid" => $student_info->id,
                "grade" => $grade,
                "grade_clean" => $grade_clean,
                "grade_placeholder" => $grade_placeholder,
                "grade_action_description" => $description,
                "timecreated" => $record->timecreated,
                "timemodified" => $record->activity_modified_at ?? 0,
                "user_name" => $student_name,
                "submission_date" => $submission_date,
                "submission_graded" => $submission_graded,
                "date_to_grade" => $date_to_grade ?? get_string('status:nothing_to_show', 'report_autograder'),
                "context_id" => $record->contextid,
                "course_id" => $record->courseid,
                "modid" => $record->instanceid,
                "status" => $status,
                "mod_type" => $mod_type,
            ];

            $total_records = $record->total_records; // Obtener el total desde la primera fila
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
                    'grade' => new external_value(PARAM_FLOAT, 'Grade'),
                    'grade_clean' => new external_value(PARAM_TEXT, 'Clean grade'),
                    'grade_placeholder' => new external_value(PARAM_TEXT, 'Grade placeholder'),
                    'grade_action_description' => new external_value(PARAM_TEXT, 'Grade action description'),
                    'timecreated' => new external_value(PARAM_INT, 'Creation date'),
                    'timemodified' => new external_value(PARAM_INT, 'Modification date'),
                    'user_name' => new external_value(PARAM_TEXT, 'User name'),
                    'submission_date' => new external_value(PARAM_TEXT, 'Submission date'),
                    'submission_graded' => new external_value(PARAM_TEXT, 'Grading date'),
                    'date_to_grade' => new external_value(PARAM_TEXT, 'Date to grade'),
                    'context_id' => new external_value(PARAM_INT, 'Context ID'),
                    'course_id' => new external_value(PARAM_INT, 'Course ID'),
                    'modid' => new external_value(PARAM_INT, 'Module ID'),
                    'status' => new external_value(PARAM_TEXT, 'Status'),
                    'mod_type' => new external_value(PARAM_TEXT, 'Module type'),
                ])
            ),
            'total_records' => new external_value(PARAM_INT, 'Total records'),
        ]);
    }
}
