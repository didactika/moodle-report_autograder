<?php
    /**
     * Core of webservice to update user grades natively in Moodle
     *
     * @package     report_autograder
     * @copyright   2026 ADSDR <eduardo.cubias@ct.uneatlantico.es>
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
    use report_autograder\local\grade_manager;

    class external_update_user_grade extends external_api {

        public static function update_user_grade_parameters() {
            return new external_function_parameters([
                'completion_id' => new external_value(PARAM_INT, 'The completion ID of the user', VALUE_REQUIRED),
                'status'        => new external_value(PARAM_TEXT, 'The grading status to set', VALUE_REQUIRED),
                'grade'         => new external_value(PARAM_FLOAT, 'The grade to assign', VALUE_REQUIRED),
            ]);
        }

        public static function update_user_grade($completion_id, $status, $grade) {
            global $DB;

            $params = self::validate_parameters(self::update_user_grade_parameters(), [
                'completion_id' => $completion_id,
                'status' => $status,
                'grade' => $grade
            ]);

            $completion = $DB->get_record('course_modules_completion', ['id' => $params['completion_id']], '*', MUST_EXIST);

            list($course, $cm) = get_course_and_cm_from_cmid($completion->coursemoduleid);
            if (!$course || !$cm) {
                throw new \moodle_exception('invalidcoursemodule');
            }

            try {
                $success = grade_manager::update_grade($course->id, $cm, $completion->userid, $params['grade']);

                if (!$success) {
                    throw new \Exception('Gradebook rejected the grade update.');
                }
            } catch (\Exception $e) {
                throw new \moodle_exception('error:gradeupdate', 'report_autograder', null, $e->getMessage());
            }

            return [
                'id' => $params['completion_id'],
                'status' => 'GRADED',
                'grade' => $params['grade'],
                'completedAt' => (new \DateTime())->format('c')
            ];
        }

        public static function update_user_grade_returns() {
            return new external_single_structure([
                'id'                => new external_value(PARAM_INT, 'The ID', VALUE_OPTIONAL),
                'status'            => new external_value(PARAM_TEXT, 'The grading status', VALUE_OPTIONAL),
                'grade'             => new external_value(PARAM_FLOAT, 'The grade', VALUE_OPTIONAL),
                'completedAt'       => new external_value(PARAM_TEXT, 'Actual completion timestamp', VALUE_OPTIONAL),
            ], 'Response', VALUE_OPTIONAL);
        }
    }