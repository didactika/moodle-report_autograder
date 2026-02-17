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
            global $DB; // Necesario para consultar la base de datos de Moodle

            $params = self::validate_parameters(self::update_user_grade_parameters(), [
                'completion_id' => $completion_id,
                'status' => $status,
                'grade' => $grade
            ]);

            // 1. Busquemos el registro de 'completion' en Moodle usando el ID que envió el JS
            $completion = $DB->get_record('course_modules_completion', ['id' => $params['completion_id']], '*', MUST_EXIST);

            // 2. Con el userid del completion, buscamos al usuario para obtener su IDNUMBER (UUID)
            $user = $DB->get_record('user', ['id' => $completion->userid], 'id, idnumber', MUST_EXIST);

            if (empty($user->idnumber)) {
                throw new \moodle_exception('error:noidnumber', 'report_autograder');
            }

            try {
                // 3. Llamamos al servicio 'user_grades' usando los datos traducidos:
                // En lugar de enviar IDs internos, enviamos el UUID del usuario y el ID del módulo (cmid)
                $response = user_grades::post_user_grades(
                    $user->idnumber,            // UUID del alumno
                    $completion->coursemoduleid,// Course Module ID
                    $params['grade']            // Nota
                );
            } catch (\Exception $e) {
                throw new \moodle_exception('error:apirequest', 'report_autograder', null, $e->getMessage());
            }

            return $response;
        }

        /**
         * Returns structure of the webservice response.
         * Definimos los campos como OPCIONALES para evitar errores si la API cambia su respuesta.
         */
        public static function update_user_grade_returns() {
            return new external_single_structure([
                'id'                => new external_value(PARAM_INT, 'The ID', VALUE_OPTIONAL),
                'userUuid'          => new external_value(PARAM_TEXT, 'The user UUID', VALUE_OPTIONAL),
                'externalId'        => new external_value(PARAM_INT, 'The course module ID', VALUE_OPTIONAL),
                'status'            => new external_value(PARAM_TEXT, 'The grading status', VALUE_OPTIONAL),
                'grade'             => new external_value(PARAM_FLOAT, 'The grade', VALUE_OPTIONAL),
                'completedAt'       => new external_value(PARAM_TEXT, 'Actual completion timestamp', VALUE_OPTIONAL),
                'createdAt'         => new external_value(PARAM_TEXT, 'Record creation timestamp', VALUE_OPTIONAL),
                'updatedAt'         => new external_value(PARAM_TEXT, 'Record update timestamp', VALUE_OPTIONAL),
            ], 'Response', VALUE_OPTIONAL);
        }
    }