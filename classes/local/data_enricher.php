<?php
    /**
     * This file is the main one that makes requests to Moodle and enriches API data.
     *
     * @package     report_autograder
     * @copyright   2026 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
    namespace report_autograder\local;

    defined('MOODLE_INTERNAL') || die();

    class data_enricher {

        public static function enrich_data(array $external_data, int $courseid, int $cmid): array {
            global $PAGE, $DB, $CFG;
            require_once($CFG->libdir . '/gradelib.php');

            if (empty($external_data)) {
                return [];
            }

            $context = \context_course::instance($courseid);
            $enrolled_users = get_enrolled_users($context, '', 0, 'u.id, u.idnumber, u.firstname, u.lastname, u.picture, u.imagealt, u.email');

            $users_by_uuid = [];
            foreach ($enrolled_users as $user_record) {
                if (!empty($user_record->idnumber)) {
                    $users_by_uuid[$user_record->idnumber] = $user_record;
                }
            }

            $moodle_grades = [];
            $cm = get_coursemodule_from_id('', $cmid, 0, false, MUST_EXIST);
            $grade_item = \grade_item::fetch([
                'itemtype' => 'mod',
                'itemmodule' => $cm->modname,
                'iteminstance' => $cm->instance,
                'courseid' => $courseid,
                'itemnumber' => 0
            ]);

            if ($grade_item) {
                $grades = $DB->get_records('grade_grades', ['itemid' => $grade_item->id], '', 'userid, finalgrade');
                foreach ($grades as $g) {
                    $moodle_grades[$g->userid] = $g->finalgrade;
                }
            }

            $instanceid = (int)$cm->instance;
            $modname = $cm->modname;

            $final_results = [];
            $date_format = \get_string('strftimedatetimeshort', 'core_langconfig');

            foreach ($external_data as $api_item) {
                $uuid = $api_item['userUuid'] ?? null;
                $moodle_user = $users_by_uuid[$uuid] ?? null;

                $user_name = \get_string('unknownuser');
                $user_profile_url = '';
                $user_picture_url = '';
                $moodle_userid = null;

                if ($moodle_user) {
                    $moodle_userid = (int)$moodle_user->id;
                    $user_name = \fullname($moodle_user);
                    $user_profile_url = (new \moodle_url('/user/view.php', ['id' => $moodle_user->id, 'course' => $courseid]))->out(false);
                    $user_picture = new \user_picture($moodle_user);
                    $user_picture->size = 100;
                    $user_picture_url = $user_picture->get_url($PAGE)->out(false);
                }

                list($submission_display, $submission_timestamp) = self::format_api_date($api_item['completedAt'] ?? null, $date_format);

                $grading_date_raw = $api_item['gradingTime'] ?? $api_item['scheduledGradingTime'] ?? null;
                list($completed_at_display, $completed_at_timestamp) = self::format_api_date($grading_date_raw, $date_format);

                $raw_status = strtoupper(trim($api_item['status'] ?? ''));
                $api_grade = null;
                if ($moodle_userid && isset($moodle_grades[$moodle_userid]) && $moodle_grades[$moodle_userid] !== null) {
                    $api_grade = round((float)$moodle_grades[$moodle_userid], 2);
                }

                if (!in_array($raw_status, ['GRADED', 'MANUAL_GRADING'])) {
                    if ($api_grade === null) {
                       $api_grade = 0;
                    } else {
                        $raw_status = 'MANUAL_GRADING';
                    }
                }

                $final_status_string = self::parse_and_translate_status($raw_status);

                $final_results[] = [
                    'id' => (int)($api_item['id'] ?? 0),
                    'user_name' => $user_name,
                    'user_profile_url' => $user_profile_url,
                    'user_picture_url' => $user_picture_url,
                    'grade' => $api_grade,
                    'submission_date' => $submission_display,
                    'submission_date_sort' => $submission_timestamp,
                    'status' => $final_status_string,
                    'completed_at' => $completed_at_display,
                    'completed_at_sort' => $completed_at_timestamp,
                    'moodle_userid' => $moodle_userid,
                    'courseid' => $courseid,
                    'instanceid' => $instanceid,
                    'modname' => $modname,
                ];
            }

            return $final_results;
        }

        private static function parse_and_translate_status(?string $raw_status): string {
            if (empty($raw_status)) {
                return \get_string('status:pending', 'report_autograder');
            }

            $status = strtoupper(trim($raw_status));

            $graded_statuses = [
                'MANUAL_GRADING',
                'READY_TO_GRADE',
                'GRADING',
                'GRADED'
            ];

            if (in_array($status, $graded_statuses)) {
                return \get_string('status:graded', 'report_autograder');
            }

            return \get_string('status:pending', 'report_autograder');
        }

        private static function format_api_date(?string $date_string, string $date_format): array {
            if (empty($date_string)) {
                return ['-', 0];
            }

            try {
                $datetime = new \DateTime($date_string);
                $timestamp = $datetime->getTimestamp();
                $display = \userdate($timestamp, $date_format);
                return [$display, $timestamp];
            } catch (\Exception $e) {
                return ['-', 0];
            }
        }
    }