<?php
    /**
     * Action script to manually update a user's grade natively and redirect back to the report.
     *
     * @package     report_autograder
     * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
     * @author      Eduardo Cubias <eduardo.cubias@ct.uneatlantico.es>
     * @author      Hector Arrechea <hector.arrechea@uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */

    require_once('../../../config.php');
    require_once($CFG->libdir . '/gradelib.php');

    $cmid   = required_param('cmid', PARAM_INT);
    $userid = required_param('userid', PARAM_INT);
    $grade  = required_param('grade', PARAM_FLOAT);

    require_login();
    require_sesskey();

    list($course, $cm) = get_course_and_cm_from_cmid($cmid);
    $context = \context_module::instance($cm->id);
    require_capability('report/autograder:view', $context);

    $source = 'report_autograder';
    $grades = [
        'userid'   => $userid,
        'rawgrade' => $grade
    ];

    $result = grade_update($source, $course->id, 'mod', $cm->modname, $cm->instance, 0, $grades);

    $returnurl = new \moodle_url('/report/autograder/index.php', ['cmid' => $cmid]);

    if ($result === GRADE_UPDATE_OK) {
        $message = \get_string('changessaved');
        redirect($returnurl, $message, null, \core\output\notification::NOTIFY_SUCCESS);
    } else {
        $message = 'El libro de calificaciones rechazó la actualización de la nota (Código de error: ' . $result . ').';
        redirect($returnurl, $message, null, \core\output\notification::NOTIFY_ERROR);
    }