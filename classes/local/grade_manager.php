<?php
    /**
     * Handles internal Moodle grade updates natively.
     *
     * @package     report_autograder
     * @copyright   2026 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */

    namespace report_autograder\local;

    defined('MOODLE_INTERNAL') || die();

    global $CFG;
    require_once($CFG->libdir . '/gradelib.php');

    class grade_manager {

        /**
         * Updates the user's grade natively in Moodle.
         * Compatible with Assign, Quiz, Forum, and other standard modules.
         *
         * @param int $courseid The course ID.
         * @param \cm_info $cm The course module object.
         * @param int $userid The user ID.
         * @param float $grade The grade to assign.
         * @return bool True if successful, false otherwise.
         * @throws \moodle_exception
         */
        public static function update_grade(int $courseid, \cm_info $cm, int $userid, float $grade): bool {
            global $CFG;

            $modname = $cm->modname;

            if ($modname === 'assign') {
                require_once($CFG->dirroot . '/mod/assign/locallib.php');

                $context = \context_module::instance($cm->id);
                $course = get_course($courseid);
                $assign = new \assign($context, $cm, $course);

                $gradedata = (object)[
                    'grade' => $grade,
                    'attemptnumber' => -1,
                    'addattempt' => 0,
                    'workflowstate' => ''
                ];

                return $assign->save_grade($userid, $gradedata);
            }

            $grades = [];
            $grades[$userid] = new \stdClass();
            $grades[$userid]->userid = $userid;
            $grades[$userid]->rawgrade = $grade;

            $source = 'mod_' . $modname;

            $result = grade_update($source, $courseid, 'mod', $modname, $cm->instance, 0, $grades);

            return $result == GRADE_UPDATE_OK;
        }
    }