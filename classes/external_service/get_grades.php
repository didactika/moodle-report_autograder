<?php

namespace report_autograder\external_service;

defined('MOODLE_INTERNAL') || die();

use report_autograder\abstract_data;
class get_grades {

    protected $cm;
    protected $course;

    public function __construct($cmid) {
        list($this->course, $this->cm) = \get_course_and_cm_from_cmid($cmid);
        if (!$this->course || !$this->cm) {
            throw new \moodle_exception('invalidcourseorcm');
        }
    }

    public function get_grades_data($campusuuid) : object {
        global $CFG;

        $verbose_log_file = null;
        try {
            $baseurl = rtrim(\get_config('report_autograder', 'url_field'), '/');
            $url = $baseurl . '/grades/?campusUuid=' . urlencode($campusuuid) . '&externalId=' . urlencode($this->cm->id);

            $curl = new \curl();
            $verbose_log_file = tempnam(sys_get_temp_dir(), 'curl_verbose_');
            $verbose_handle = fopen($verbose_log_file, 'w+');

            $curl->setopt([
                'CURLOPT_USERAGENT' => 'Moodle Report Autograder Plugin',
                'CURLOPT_REFERER' => $CFG->wwwroot,
                'CURLOPT_SSL_VERIFYPEER' => false,
                'CURLOPT_SSL_VERIFYHOST' => false,
                'CURLOPT_VERBOSE' => true,
                'CURLOPT_STDERR' => $verbose_handle
            ]);

            $response = $curl->get($url);

            fseek($verbose_handle, 0);
            fclose($verbose_handle);
            
            if ($curl->errno) {
                return (object)['data' => [], 'total_records' => 0];
            }

            $servicedata = json_decode($response);
            if (json_last_error() !== JSON_ERROR_NONE) {
                 return (object)['data' => [], 'total_records' => 0];
            }
            if (!is_array($servicedata)) {
                return (object)['data' => [], 'total_records' => 0];
            }

            $processed_data = [];
            foreach ($servicedata as $index => $item) {
                $completedAt = null;
                if (property_exists($item, 'completedAt') && !empty($item->completedAt)) {
                    $completedAt = $item->completedAt;
                }

                if (isset($item->userUuid, $item->externalId, $item->status)) {
                    $processed_data[] = (object)[
                        'userUuid'    => $item->userUuid,
                        'externalId'  => $item->externalId,
                        'status'      => $item->status,
                        'completedAt' => $completedAt,
                    ];
                }
            }


            return (object)['data' => $processed_data, 'total_records' => count($processed_data)];

        } catch (\Exception $e) {
            throw new \moodle_exception('errorexternaldatafetch', 'report_autograder', '', null, $e->getMessage());
        } finally {
            if ($verbose_log_file && file_exists($verbose_log_file)) {
                unlink($verbose_log_file);
            }
        }
    }
}
