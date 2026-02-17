<?php
    /**
     * This file is the main one that makes requests to Moodle.
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
namespace report_autograder\local;

defined('MOODLE_INTERNAL') || die();

class data_enricher {

    public static function enrich_data(array $external_data, int $courseid, int $cmid): array {
        global $DB;

        if (empty($external_data)) {
            return [];
        }

        $useruuids = array_map(fn($item) => $item['userUuid'], $external_data);
        $users_by_id = $DB->get_records_list('user', 'idnumber', $useruuids, '', 'id, idnumber, firstname, lastname');

        $users_by_uuid = [];
        $user_ids_list = [];

        foreach ($users_by_id as $user_record) {
            if (!empty($user_record->idnumber)) {
                $users_by_uuid[$user_record->idnumber] = $user_record;
                $user_ids_list[] = $user_record->id;
            }
        }

        $userids_keys = array_keys($users_by_id);
        $cm = get_coursemodule_from_id(null, $cmid, 0, false, MUST_EXIST);
        $gradesinfo = \grade_get_grades($courseid, 'mod', $cm->modname, $cm->instance, $userids_keys);
        $gradesbyuserid = !empty($gradesinfo->items[0]->grades) ? $gradesinfo->items[0]->grades : [];

        $completionRecords = self::get_completion_records_by_users($cmid, $user_ids_list);

        $final_results = [];
        foreach ($external_data as $external_item) {
            $external_item_obj = (object)$external_item;

            $user = $users_by_uuid[$external_item_obj->userUuid] ?? null;
            $grade = $user && isset($gradesbyuserid[$user->id]) ? $gradesbyuserid[$user->id] : null;

            $completion = ($user && isset($completionRecords[$user->id]))
                ? $completionRecords[$user->id]
                : null;

            $local_data = self::extract_moodle_details($user, $grade, $completion);

            $status_string = self::get_status_string($external_item);
            list($completed_at_display, $completed_at_timestamp) = self::format_completion_date($external_item);

            $submission_date_display = !empty($local_data->submission_date_timestamp)
                ? \userdate($local_data->submission_date_timestamp)
                : '-';

            // CORRECCIÓN CLAVE: Usamos el ID de completion de Moodle si existe, no el externo.
            $moodle_completion_id = $completion ? (int)$completion->id : 0;

            $final_results[] = [
                'id' => $moodle_completion_id,
                'user_name' => $local_data->user_name ?? \get_string('unknownuser'),
                'grade' => $local_data->grade,
                'submission_date' => $submission_date_display,
                'submission_date_sort' => (int)($local_data->submission_date_timestamp ?? 0),
                'status' => $status_string,
                'completed_at' => $completed_at_display,
                'completed_at_sort' => $completed_at_timestamp,
            ];
        }

        return $final_results;
    }

    private static function get_completion_records_by_users(int $cmid, array $userids): array {
        global $DB;
        if (empty($userids)) {
            return [];
        }

        list($insql, $params) = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED);
        $params['cmid'] = $cmid;

        $sql = "SELECT userid, id, timemodified, completionstate
                  FROM {course_modules_completion}
                 WHERE coursemoduleid = :cmid
                   AND userid $insql";

        return $DB->get_records_sql($sql, $params);
    }

    private static function extract_moodle_details(?\stdClass $user, ?\stdClass $grade, ?\stdClass $completion): \stdClass {
        $result = new \stdClass();
        $result->user_name = \get_string('unknownuser');
        $result->grade = null;
        $result->submission_date_timestamp = null;

        if ($user) {
            $result->user_name = \fullname($user);
        }

        if ($grade && isset($grade->grade)) {
            $result->grade = round($grade->grade, 2);
        }

        if ($completion && !empty($completion->timemodified)) {
            $result->submission_date_timestamp = $completion->timemodified;
        }

        return $result;
    }

    private static function get_status_string(array $external_item): string {
        if (empty($external_item['status'])) {
            return \get_string('feedback:no_status', 'report_autograder');
        }

        $status_key = 'status:' . strtolower($external_item['status']);
        if (\get_string_manager()->string_exists($status_key, 'report_autograder')) {
            return \get_string($status_key, 'report_autograder');
        }

        return $external_item['status'];
    }

    private static function format_completion_date(array $external_item): array {
        $completed_at_display = '-';
        $completed_at_timestamp = 0;
        if (!empty($external_item['scheduledGradingTime'])) {
            try {
                $datetime = new \DateTime($external_item['scheduledGradingTime']);
                $completed_at_timestamp = $datetime->getTimestamp();
                $completed_at_display = \userdate($completed_at_timestamp);
            } catch (\Exception $e) {}
        }
        return [$completed_at_display, $completed_at_timestamp];
    }
}
