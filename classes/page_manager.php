<?php

namespace report_autograder;

use report_autograder\output\index_page;
use report_autograder\local\get_grades as local_data_fetcher;
use report_autograder\external_service\get_grades as external_data_source;

class page_manager {

    protected $course;
    protected $cm;
    protected $context;
    protected $params;
    protected $external_data_source;

    public function __construct($cmid) {
        global $DB, $PAGE;

        $this->params = new \stdClass();
        $this->params->cmid = $cmid;

        list($this->course, $this->cm) = \get_course_and_cm_from_cmid($this->params->cmid);
        if (!$this->course || !$this->cm) {
            throw new \moodle_exception('invalidcourseorcm');
        }

        $this->context = \context_course::instance($this->course->id);
        $PAGE->set_context($this->context);
        
        $this->external_data_source = new external_data_source($this->cm->id);
    }

    public function display() {
        global $OUTPUT, $CFG;

        $this->setup_page();
        $this->require_capabilities();

        echo $OUTPUT->header();

        $data = $this->build_report_data();
        
        $additional_data = [
            'points_decimals' => \grade_get_setting($this->course->id, 'decimalpoints', $CFG->grade_decimalpoints),
            'separator_decimals' => \get_string('decsep', 'langconfig'),
        ];
        
        $output_page = new index_page($data, $additional_data);
        echo $OUTPUT->render($output_page);

        echo $OUTPUT->footer();
    }
    

    
    protected function setup_page() {
        global $PAGE;

        $page_url = new \moodle_url('/report/autograder/index.php', [
            'cmid'    => $this->cm->id,
        ]);
        
        $PAGE->set_url($page_url);
        $PAGE->set_pagelayout('report');
        $PAGE->set_title(\get_string('pluginname', 'report_autograder'));
        $PAGE->set_heading(\get_string('pluginname', 'report_autograder'));
        
        $PAGE->navigation->add($this->course->shortname, new \moodle_url('/course/view.php', ['id' => $this->course->id]));
        $PAGE->navigation->add($this->cm->name, new \moodle_url('/mod/' . $this->cm->modname . '/view.php', ['id' => $this->cm->id]));

        \require_login($this->course);
    }

    protected function get_required_capabilities(): array {
        switch ($this->cm->modname) {
            case 'assign':
                return ['mod/assign:grade', 'mod/assign:reviewgrades', 'mod/assign:managegrades', 'mod/assign:releasegrades'];
            case 'quiz':
                return ['mod/quiz:viewreports', 'mod/quiz:grade'];
            case 'forum':
                return ['mod/forum:viewhiddentimestamp', 'mod/forum:viewanyrating'];
            default:
                return [];
        }
    }

    protected function require_capabilities() {
        $capabilities = $this->get_required_capabilities();
        \require_all_capabilities($capabilities, $this->context);
    }
    
    protected function build_report_data() {
        global $CFG;

        try {
            $campusuuid = \get_config('local_message_broker', 'siteexternalid');
            if (empty($campusuuid)) {
                throw new \moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
            }
            $external_result = $this->external_data_source->get_grades_data($campusuuid);
            $final_results = [];
            if (!empty($external_result->data)) {
                foreach ($external_result->data as $index => $external_item) {
                    $local_data = local_data_fetcher::get_single_grade_data($external_item);
                    $status_string = get_string('feedback:no_status', 'report_autograder');
                    if (!empty($external_item->status)) {
                        $status_key = 'status:' . strtolower($external_item->status);
                        if (get_string_manager()->string_exists($status_key, 'report_autograder')) {
                            $status_string = get_string($status_key, 'report_autograder');
                        } else {
                            $status_string = $external_item->status;
                        }
                    }
                    $completed_at = '-';
                    if (!empty($external_item->completedAt)) {
                        $timestamp = strtotime($external_item->completedAt);
                        if ($timestamp !== false) {
                            $completed_at = userdate($timestamp);
                        }
                    }

                    $combined_item = [
                        'user_name' => !empty($local_data->user_name) ? $local_data->user_name : get_string('unknownuser'),
                        'grade' => $local_data->grade ?? null,
                        'submission_date' => !empty($local_data->submission_date) ? $local_data->submission_date : '-',
                        'status' => $status_string,
                        'completed_at' => $completed_at,
                    ];

                    $final_results[] = $combined_item;
                }
            }
            $report_data = (object)['data' => $final_results, 'total_records' => count($final_results)];
            return $report_data;

        } catch (\moodle_exception $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new \moodle_exception('error:building_report_data', 'report_autograder', '', null, $e->getMessage());
        }
    }
}