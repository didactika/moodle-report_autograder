<?php
    /**
     * This file contains the core of `get grades`, which first interacts with the service and then retrieves data from Moodle based on the service's response.
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
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
    use report_autograder\local\report_builder;

    class external_get_grade_report extends external_api {

        public static function get_report_data_parameters() {
            return new external_function_parameters([
                'cmid' => new external_value(PARAM_INT, 'The course module ID', VALUE_REQUIRED),
                'page' => new external_value(PARAM_INT, 'The page number to fetch', VALUE_DEFAULT, 0),
                'limit' => new external_value(PARAM_INT, 'Records per page (0 = use server config)', VALUE_DEFAULT, 0),
                'filters' => new external_multiple_structure(
                    new external_single_structure([
                        'name' => new external_value(PARAM_TEXT, 'The name of the filter'),
                        'value' => new external_value(PARAM_TEXT, 'The value of the filter'),
                    ]),
                    'Optional filters for the report',
                    VALUE_OPTIONAL
                )
            ]);
        }

        public static function get_report_data($cmid, $page, $limit = 0, $filters = []) {
            $params = self::validate_parameters(self::get_report_data_parameters(), ['cmid' => $cmid, 'page' => $page, 'limit' => $limit, 'filters' => $filters]);
            return report_builder::get_report_data($params['cmid'], $params['page'], $params['filters'], $params['limit']);
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
                        'user_col' => new external_value(PARAM_RAW, 'HTML for user column with profile picture and name'),
                        'user_profile_url' => new external_value(PARAM_URL, 'URL to user profile', VALUE_OPTIONAL),
                        'user_picture_url' => new external_value(PARAM_URL, 'URL to user picture', VALUE_OPTIONAL),
                        'grade' => new external_value(PARAM_FLOAT, 'The final grade', VALUE_OPTIONAL),
                        'status' => new external_value(PARAM_TEXT, 'The current status of the grading process'),
                        'completed_at' => new external_value(PARAM_TEXT, 'The date the grading was completed, formatted'),
                        'completed_at_sort' => new external_value(PARAM_INT, 'The completion date, as a timestamp for sorting'),
                        'moodle_userid' => new external_value(PARAM_INT, 'Moodle internal user ID', VALUE_OPTIONAL),
                        'courseid' => new external_value(PARAM_INT, 'Moodle course ID', VALUE_OPTIONAL),
                        'instanceid' => new external_value(PARAM_INT, 'Module instance ID', VALUE_OPTIONAL),
                        'modname' => new external_value(PARAM_TEXT, 'Module name (e.g., assign, quiz)', VALUE_OPTIONAL),
                    ])
                )
            ]);
        }
    }