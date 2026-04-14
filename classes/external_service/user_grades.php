<?php

/**
 * This file defines the API calls for the service
 *
 * @package     report_autograder
 * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_autograder\external_service;

defined('MOODLE_INTERNAL') || die();

use moodle_exception;

/**
 * Service class to fetch and update user grades from the external autograder service.
 */
class user_grades
{
    /** Page size for each HTTP request when walking every API page. */
    private const FETCH_PAGE_SIZE = 100;

    /**
     * Fetches every page of moduleGrades for the course module and merges row data into one list.
     *
     * Flow: apply {@see $api_filters} on the query; read the first response; derive total pages from
     * `pagination` (or `total` / `limit`); request the remaining pages; concatenate `data` / `items` /
     * `results` from each response. Callers filter that merged list in PHP (e.g. Moodle idnumber allowlist).
     *
     * @param int $cmid Course module ID (external id for the API).
     * @param string $campusUuid Campus unique identifier.
     * @param array $api_filters Status and scheduled/grading date filters sent on every request.
     * @return array Merged shape: `data` => all rows, `pagination` => summary from the first page (totals, hasNext false).
     * @throws moodle_exception if the service is not configured, the request fails, or the response is invalid.
     */
    public static function get_user_grades(int $cmid, string $campusUuid, array $api_filters): array {
        $perpage = self::FETCH_PAGE_SIZE;
        $startpage = 1;

        [$urlprefix, $staticquery] = self::module_grades_paged_query_parts($cmid, $campusUuid, $perpage, $api_filters);
        $firsturl = $urlprefix . 'page=' . $startpage . '&' . $staticquery;
        $first = self::module_grades_http_get($firsturl, $startpage, $perpage);

        $rowsfrom = function (array $r): array {
            if (isset($r['data']) && is_array($r['data'])) {
                return $r['data'];
            }
            if (isset($r['items']) && is_array($r['items'])) {
                return $r['items'];
            }
            if (isset($r['results']) && is_array($r['results'])) {
                return $r['results'];
            }
            return [];
        };

        $firstrows = $rowsfrom($first);
        $pagination = isset($first['pagination']) && is_array($first['pagination']) ? $first['pagination'] : [];
        $totalpages = self::total_pages_from_pagination($pagination, $perpage);

        if ($totalpages <= $startpage) {
            $pag = $first['pagination'] ?? [];
            if (is_array($pag)) {
                $pag['page'] = $startpage;
                $pag['hasNext'] = false;
                $pag['hasPrev'] = $startpage > 1;
            }

            return [
                'data' => $firstrows,
                'pagination' => $pag,
            ];
        }

        $merged = $firstrows;
        for ($p = $startpage + 1; $p <= $totalpages; $p++) {
            $nexturl = $urlprefix . 'page=' . $p . '&' . $staticquery;
            $resp = self::module_grades_http_get($nexturl, $p, $perpage);
            $merged = array_merge($merged, $rowsfrom($resp));
        }

        $firstpag = isset($first['pagination']) && is_array($first['pagination']) ? $first['pagination'] : [];

        return [
            'data' => $merged,
            'pagination' => [
                'page' => $startpage,
                'limit' => $firstpag['limit'] ?? $perpage,
                'total' => $firstpag['total'] ?? count($merged),
                'totalPages' => $firstpag['totalPages'] ?? $totalpages,
                'hasNext' => false,
                'hasPrev' => $startpage > 1,
            ],
        ];
    }

    /**
     * Prefer `pagination.totalPages`; else `ceil(total / limit)`.
     *
     * @param array $pagination
     * @param int $perpage
     * @return int At least 1
     */
    private static function total_pages_from_pagination(array $pagination, int $perpage): int {
        if (isset($pagination['totalPages'])) {
            $tp = (int) $pagination['totalPages'];
            if ($tp > 0) {
                return $tp;
            }
        }
        $total = (int) ($pagination['total'] ?? 0);
        $limit = (int) ($pagination['limit'] ?? $perpage);
        if ($limit <= 0) {
            $limit = $perpage;
        }
        if ($total <= 0) {
            return 1;
        }
        $tp = (int) ceil($total / $limit);
        return max(1, $tp);
    }

    /**
     * Builds the fixed URL prefix and query string for moduleGrades; only `page` changes between requests.
     *
     * @param int $cmid
     * @param string $campusUuid
     * @param int $perpage
     * @param array $api_filters
     * @return array{0: string, 1: string} [0] = URL ending with `?`, [1] = query params without `page` (for `page=N&...`).
     */
    private static function module_grades_paged_query_parts(
        int $cmid,
        string $campusUuid,
        int $perpage,
        array $api_filters
    ): array {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        $queryParts = [];
        $queryParts[] = 'campusModule[campus][uuid]=' . rawurlencode($campusUuid);
        $queryParts[] = 'campusModule[courseModuleExternalId]=' . rawurlencode((string) $cmid);
        $queryParts[] = 'limit=' . (int) $perpage;

        if (!empty($api_filters['status'])) {
            $statuses = is_array($api_filters['status']) ? $api_filters['status'] : [$api_filters['status']];
            foreach ($statuses as $i => $status) {
                if (!empty($status)) {
                    $queryParts[] = 'status[' . (int) $i . ']=' . rawurlencode($status);
                }
            }
        }

        if (!empty($api_filters['scheduledOrGradingTimeFrom'])) {
            $queryParts[] = 'scheduledOrGradingTime[GREATER_EQUAL]=' .
                rawurlencode($api_filters['scheduledOrGradingTimeFrom']);
        }

        if (!empty($api_filters['scheduledOrGradingTimeTo'])) {
            $queryParts[] = 'scheduledOrGradingTime[LESS_EQUAL]=' .
                rawurlencode($api_filters['scheduledOrGradingTimeTo']);
        }

        $urlprefix = rtrim($serviceUrl, '/') . '/moduleGrades/?';
        $staticquery = implode('&', $queryParts);

        return [$urlprefix, $staticquery];
    }

    /**
     * GETs a moduleGrades URL and returns decoded JSON (or empty 404-style payload).
     *
     * @param string $urlstring
     * @param int $fallbackpage Page to report when the response is empty / 404 (matches request).
     * @param int $fallbacklimit Limit to report when the response is empty / 404 (matches request).
     * @return array
     */
    private static function module_grades_http_get(string $urlstring, int $fallbackpage, int $fallbacklimit): array {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $urlstring);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);

            $responseBody = curl_exec($ch);

            if ($responseBody === false) {
                $error = curl_error($ch);
                curl_close($ch);
                throw new moodle_exception('error:apirequest', 'report_autograder', null, $error);
            }

            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpcode == 404 || empty(trim($responseBody))) {
                return [
                    'data' => [],
                    'pagination' => [
                        'total' => 0,
                        'page' => $fallbackpage,
                        'limit' => $fallbacklimit,
                    ],
                ];
            }

            if ($httpcode >= 400) {
                throw new moodle_exception('error:apirequest', 'report_autograder', null, 'HTTP status code: ' . $httpcode);
            }

            $data = json_decode($responseBody, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new moodle_exception('error:jsondecode', 'report_autograder', null, json_last_error_msg());
            }

            if (!is_array($data)) {
                throw new moodle_exception('error:invalidapiresponse', 'report_autograder');
            }

            return $data;
        } catch (\Exception $e) {
            throw new moodle_exception('error:apirequest', 'report_autograder', null, $e->getMessage());
        }
    }

    /**
     * Sends a PUT request to update a user's grade in the external autograder service.
     *
     * @param string $userUuid The user's UUID
     * @param int $cmid The course module ID
     * @param float $grade The grade to assign
     * @return array The API response decoded as an associative array
     * @throws moodle_exception
     */
    public static function update_user_grade(string $userUuid, int $cmid, float $grade): array
    {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        $campusUuid = get_config('report_autograder', 'siteexternalid');
        if (empty($campusUuid)) {
            throw new moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
        }

        $url = rtrim($serviceUrl, '/') . '/moduleGrades?campusUuid=' . urlencode($campusUuid);

        $payload = json_encode([
            'userUuid' => $userUuid,
            'courseModuleExternalId' => $cmid,
            'grade' => $grade
        ]);

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);

            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload)
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

            $responseBody = curl_exec($ch);
            if ($responseBody === false) {
                $error = curl_error($ch);
                curl_close($ch);
                throw new moodle_exception('error:apirequest', 'report_autograder', null, $error);
            }

            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpcode >= 400) {
                throw new moodle_exception('error:apirequest', 'report_autograder', null, 'HTTP status code: ' . $httpcode . ' Response: ' . $responseBody);
            }

            $data = json_decode($responseBody, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new moodle_exception('error:jsondecode', 'report_autograder', null, json_last_error_msg());
            }

            return $data;
        } catch (\Exception $e) {
            throw new moodle_exception('error:apirequest', 'report_autograder', null, $e->getMessage());
        }
    }
}
