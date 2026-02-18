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
    public static function get_filtered_completion_ids(int $cmid, array $filters): array {
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
                        $like = "%{$filter_value}%";
                        $joins .= " JOIN {user} u ON u.id = c.userid";
                        $whereClauses[] = "(u.firstname LIKE :firstname OR u.lastname LIKE :lastname)";
                        $params['firstname'] = $like;
                        $params['lastname'] = $like;
                        break;

                    case 'dateDelivered':
                        $timestamp = strtotime($filter_value);
                        $whereClauses[] = "c.timemodified >= :startdate";
                        $params['startdate'] = $timestamp;
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

            $sql = "SELECT c.id
                      FROM {course_modules_completion} c
                      $joins
                     WHERE " . implode(' AND ', $whereClauses);

            $cmid_completions = $DB->get_fieldset_sql($sql, $params);
            return empty($cmid_completions) ? [0] : array_unique($cmid_completions);

        } catch (\dml_exception $e) {
            error_log('[AUTOGRADER][FILTER_COMBINED][DML_EXCEPTION] ' . $e->getMessage());
            return [];
        }
    }

    public static function get_moodle_filters(array $filters): array {
        $filter_moodle = [];
        $filter_type_moodle = ['nameUser', 'dateDelivered', 'grade'];

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
        $filter_type_api = ['status', 'dateGraded'];

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
                $filter_api[$name] = $value;
            }
        }

        $processed_filters = [];
        if (!empty($filter_api['status'])) {
            $processed_filters['status'] = strtoupper($filter_api['status']);
        }

        if (!empty($filter_api['dateGraded'])) {
            $processed_filters['dateGraded'] = $filter_api['dateGraded'];
        }

        return $processed_filters;
    }
}
