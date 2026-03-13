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

        /**
         * Enriches external data with Moodle local data for all enrolled users.
         *
         * @param array $external_data
         * @param int $courseid
         * @param int $cmid
         * @return array
         */
        public static function enrich_data(array $external_data, int $courseid, int $cmid): array {
            global $PAGE;

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

            $final_results = [];
            $date_format = \get_string('strftimedatetimeshort', 'core_langconfig');

            foreach ($external_data as $api_item) {
                $uuid = $api_item['userUuid'] ?? null;
                $moodle_user = $users_by_uuid[$uuid] ?? null;

                $user_name = \get_string('unknownuser');
                $user_profile_url = '';
                $user_picture_url = '';

                if ($moodle_user) {
                    $user_name = \fullname($moodle_user);
                    $user_profile_url = (new \moodle_url('/user/view.php', ['id' => $moodle_user->id, 'course' => $courseid]))->out(false);
                    $user_picture = new \user_picture($moodle_user);
                    $user_picture->size = 100;
                    $user_picture_url = $user_picture->get_url($PAGE)->out(false);
                }

                list($submission_display, $submission_timestamp) = self::format_api_date($api_item['completedAt'] ?? null, $date_format);

                $grading_date_raw = $api_item['gradingTime'] ?? $api_item['scheduledGradingTime'] ?? null;
                list($completed_at_display, $completed_at_timestamp) = self::format_api_date($grading_date_raw, $date_format);

                $api_grade = null;
                if (isset($api_item['grade']) && $api_item['grade'] !== null && $api_item['grade'] !== '') {
                    $api_grade = round((float)$api_item['grade'], 2);
                }

                $final_status_string = self::parse_and_translate_status($api_item['status'] ?? null);

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
                ];
            }

            return $final_results;
        }

        /**
         * Parses the raw API status and groups it into either PENDING or GRADED,
         * returning the translated Moodle string.
         */
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

        /**
         * Formats the scheduled completion date.
         *
         * @param string|null $date_string
         * @param string $date_format
         * @return array
         */
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