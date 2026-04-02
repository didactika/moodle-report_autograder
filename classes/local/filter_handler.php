<?php
    /**
     * This file defines the logic for each filter
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
namespace report_autograder\local;

defined('MOODLE_INTERNAL') || die();

class filter_handler {

    /**
     * Normalizes a search string: strips diacritics and lowercases.
     * "Héctor" → "hector", "García" → "garcia"
     */
    private static function normalizeSearch(string $input): string {
        if (class_exists('Normalizer')) {
            $decomposed = \Normalizer::normalize($input, \Normalizer::FORM_D);
            if ($decomposed !== false) {
                // Strip combining diacritical marks (unicode category Mn)
                $input = preg_replace('/\p{Mn}/u', '', $decomposed);
            }
        }
        return mb_strtolower($input, 'UTF-8');
    }

    public static function get_filtered_completion_ids(int $cmid, array $filters): ?array {
        global $DB;

        $filter_moodle = self::get_moodle_filters($filters);

        if (empty($filter_moodle)) {
            return [];
        }

        try {
            $params = ['cmid' => $cmid];
            $whereClauses = ["c.coursemoduleid = :cmid"];
            $joins = '';
            $joinCounter = 0;

            foreach ($filter_moodle as $filter_name => $filter_value) {
                switch ($filter_name) {
                    case 'nameUser':
                        $normalized = self::normalizeSearch($filter_value);
                        $like = "%{$normalized}%";
                        $whereClauses[] = "(LOWER(u.firstname) LIKE :firstname"
                            . " OR LOWER(u.lastname) LIKE :lastname"
                            . " OR LOWER(" . $DB->sql_concat('u.firstname', "' '", 'u.lastname') . ") LIKE :fullname)";
                        $params['firstname'] = $like;
                        $params['lastname']  = $like;
                        $params['fullname']  = $like;
                        break;

                    case 'grade':
                        $mingrade = floatval($filter_value);
                        $joinCounter++;
                        $joins .= " JOIN {grade_grades} g$joinCounter ON g$joinCounter.userid = c.userid";
                        $joins .= " JOIN {grade_items} i$joinCounter ON i$joinCounter.id = g$joinCounter.itemid";
                        $whereClauses[] = "g$joinCounter.finalgrade >= :mingrade$joinCounter";
                        $params["mingrade$joinCounter"] = $mingrade;
                        break;
                }
            }

            $sql = "SELECT u.idnumber
                      FROM {course_modules_completion} c
                      JOIN {user} u ON u.id = c.userid
                      $joins
                     WHERE " . implode(' AND ', $whereClauses) . " AND u.idnumber != ''";

            $cmid_completions = $DB->get_fieldset_sql($sql, $params);
            // Return null (not [0]) to signal "filter active, no results" so callers
            // can short-circuit without sending invalid data to the external API.
            return empty($cmid_completions) ? null : array_unique($cmid_completions);

        } catch (\dml_exception $e) {
            error_log('[AUTOGRADER][FILTER_COMBINED][DML_EXCEPTION] ' . $e->getMessage());
            return null;
        }
    }

    public static function get_moodle_filters(array $filters): array {
        $filter_moodle = [];
        $filter_type_moodle = ['nameUser', 'grade'];

        if (empty($filters)) {
            return [];
        }

        foreach ($filters as $filter) {
            $name = clean_param($filter['name'], PARAM_ALPHANUM);
            $value = clean_param($filter['value'], PARAM_RAW);

            if (!$name || !$value) {
                continue;
            }

            if (in_array($name, $filter_type_moodle)) {
                $filter_moodle[$name] = $value;
            }
        }
        return $filter_moodle;
    }

    public static function get_api_filters(array $filters): array {
        $filter_api = [];
        $filter_type_api = ['status', 'scheduledOrGradingTimeFrom', 'scheduledOrGradingTimeTo'];

        if (empty($filters)) {
            return [];
        }

        foreach ($filters as $filter) {
            $name = clean_param($filter['name'], PARAM_ALPHANUM);
            $value = clean_param($filter['value'], PARAM_RAW);

            if (!$name || !$value) {
                continue;
            }

            if (in_array($name, $filter_type_api)) {
                if ($name === 'status') {
                    if (!isset($filter_api['status']) || !is_array($filter_api['status'])) {
                        $filter_api['status'] = [];
                    }

                    foreach (explode(',', $value) as $status) {
                        $cleanstatus = trim($status);
                        if ($cleanstatus !== '') {
                            $filter_api['status'][] = $cleanstatus;
                        }
                    }
                } else {
                    $filter_api[$name] = $value;
                }
            }
        }

        $processed_filters = [];
        if (!empty($filter_api['status'])) {
            $statuses = array_unique(array_map('strtoupper', $filter_api['status']));

            // "PENDING" in the UI represents PENDING, READY_TO_GRADE, FAILED and SKIPPED
            // at the API level. Expand when present.
            $pending_api_values = ['PENDING', 'READY_TO_GRADE', 'FAILED', 'SKIPPED'];
            if (in_array('PENDING', $statuses, true)) {
                $statuses = array_values(array_unique(
                    array_merge(
                        array_diff($statuses, ['PENDING']),
                        $pending_api_values
                    )
                ));
            }

            $processed_filters['status'] = array_values($statuses);
        }

        if (!empty($filter_api['scheduledOrGradingTimeFrom'])) {
            $processed_filters['scheduledOrGradingTimeFrom'] = $filter_api['scheduledOrGradingTimeFrom'];
        }

        if (!empty($filter_api['scheduledOrGradingTimeTo'])) {
            $processed_filters['scheduledOrGradingTimeTo'] = $filter_api['scheduledOrGradingTimeTo'];
        }

        return $processed_filters;
    }
}
