<?php
    /**
     * Index.php.
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
    require_once('../../config.php');

// We need to output the header first, so we can see error messages.
    try {
        defined('MOODLE_INTERNAL') || die();
        global $PAGE, $OUTPUT;

        $cmid = required_param('cmid', PARAM_INT);

        list($course, $cm) = get_course_and_cm_from_cmid($cmid);
        if (!$course || !$cm) {
            throw new \moodle_exception('invalidcourseorcm');
        }

        require_login($course, true, $cm);
        $context = \context_module::instance($cm->id);
        require_capability('report/autograder:view', $context);

        $PAGE->set_url('/report/autograder/index.php', ['cmid' => $cmid]);
        $PAGE->set_pagelayout('report');
        $PAGE->set_title(get_string('pluginname', 'report_autograder'));
        $PAGE->set_heading(get_string('pluginname', 'report_autograder'));
        $PAGE->set_context($context);

        $PAGE->requires->js_call_amd('report_autograder/main', 'init', [$cmid]);

        echo $OUTPUT->header();
        echo $OUTPUT->render_from_template('report_autograder/partials/filters', []);
        echo $OUTPUT->render_from_template('report_autograder/report_table', ['skeletonRows' => array_fill(0, 4, [])]);
        echo $OUTPUT->footer();

    } catch (\Exception $e) {
        // If an exception was thrown, we display it here.
        // This is to help debug issues like missing cmid, permissions, etc.
        echo $OUTPUT->header();
        echo $OUTPUT->notification('A critical error occurred: ' . $e->getMessage() . '<br><pre>' . $e->getTraceAsString() . '</pre>', 'error');
        echo $OUTPUT->footer();
        die();
    }
