<?php
    /**
     * Core of webservice update grade user with external service
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
    namespace report_autograder\webservice;
    defined('MOODLE_INTERNAL') || die();

    global $CFG;
    require_once($CFG->libdir . '/externallib.php');

    use external_api;
    use external_function_parameters;
    use external_single_structure;
    use external_value;
    use report_autograder\external_service\user_grades;

    /**
     * Webservice to update a user's grade via POST.
     */
    class external_update_user_grade extends external_api {

        /**
         * Parameters for the webservice.
         */
        public static function update_user_grade_parameters() {
            return new external_function_parameters([
                'completion_id' => new external_value(PARAM_INT, 'The completion ID of the user', VALUE_REQUIRED),
                'status'        => new external_value(PARAM_TEXT, 'The grading status to set', VALUE_REQUIRED),
                'grade'         => new external_value(PARAM_FLOAT, 'The grade to assign', VALUE_REQUIRED),
            ]);
        }

        /**
         * Webservice implementation: updates a user's grade.
         *
         * @param int $completion_id
         * @param string $status
         * @param float $grade
         * @return array The API response decoded as associative array
         * @throws \moodle_exception
         */
        public static function update_user_grade($completion_id, $status, $grade) {
            global $USER;

            $params = self::validate_parameters(self::update_user_grade_parameters(), [
                'completion_id' => $completion_id,
                'status' => $status,
                'grade' => $grade
            ]);

            try {
                $response = user_grades::post_user_grades($params['completion_id'], $params['status'], $params['grade']);
            } catch (\Exception $e) {
                throw new \moodle_exception('error:apirequest', 'report_autograder', null, $e->getMessage());
            }

            return $response;
        }

        /**
         * Returns structure of the webservice response.
         */
        public static function update_user_grade_returns() {
            return new external_single_structure([
                'id'                => new external_value(PARAM_INT, 'The completion ID'),
                'userUuid'          => new external_value(PARAM_TEXT, 'The user UUID'),
                'externalId'        => new external_value(PARAM_INT, 'The course module ID'),
                'moduleConfigId'    => new external_value(PARAM_INT, 'Module config ID'),
                'status'            => new external_value(PARAM_TEXT, 'The grading status'),
                'completed'         => new external_value(PARAM_BOOL, 'Whether the completion is marked completed'),
                'scheduledGradingTime' => new external_value(PARAM_TEXT, 'Scheduled grading time'),
                'overrideDueDate'   => new external_value(PARAM_TEXT, 'Override due date', VALUE_OPTIONAL),
                'overrideGroupDueDate' => new external_value(PARAM_TEXT, 'Override group due date', VALUE_OPTIONAL),
                'completedAt'       => new external_value(PARAM_TEXT, 'Actual completion timestamp', VALUE_OPTIONAL),
                'createdAt'         => new external_value(PARAM_TEXT, 'Record creation timestamp'),
                'updatedAt'         => new external_value(PARAM_TEXT, 'Record update timestamp'),
            ]);
        }
    }
