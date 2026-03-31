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

use core_http\client as http_client;
use moodle_exception;

/**
 * Service class to fetch and update user grades from the external autograder service.
 */
class user_grades
{
    /**
     * Fetches user grades from the autograder service, supporting pagination.
     *
     * @param int $cmid The course module ID, sent as 'externalId'.
     * @param string $campusUuid The campus unique identifier.
     * @param int $page The pagination int as expected by the external API.
     * @param int $limit The pagination int as expected by the external API.
     * @param array $api_filters
     * @param array $cmid_completions Array of user UUIDs
     * @return array The full response from the service, including 'total' and 'data' keys.
     * @throws moodle_exception if the service is not configured, the request fails, or the response is invalid.
     */
    public static function get_user_grades(int $cmid, string $campusUuid, int $page, int $limit, array $api_filters, array $cmid_completions): array
    {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        // Build query string manually to preserve bracket notation (campus[uuid],
        // status[N], etc.) and commas in userUuid without moodle_url percent-encoding them.
        $queryParts = [];
        $queryParts[] = 'campus[uuid]=' . rawurlencode($campusUuid);
        $queryParts[] = 'courseModuleExternalId=' . rawurlencode((string)$cmid);
        $queryParts[] = 'page=' . (int)$page;
        $queryParts[] = 'limit=' . (int)$limit;

        if (!empty($api_filters['status'])) {
            $statuses = is_array($api_filters['status']) ? $api_filters['status'] : [$api_filters['status']];
            foreach ($statuses as $i => $status) {
                if (!empty($status)) {
                    $queryParts[] = 'status[' . (int)$i . ']=' . rawurlencode($status);
                }
            }
        }

        if (!empty($api_filters['completedAtFrom'])) {
            $queryParts[] = 'completedAt[GREATER_EQUAL]=' . rawurlencode($api_filters['completedAtFrom']);
        }

        if (!empty($api_filters['completedAtTo'])) {
            $queryParts[] = 'completedAt[LESS_EQUAL]=' . rawurlencode($api_filters['completedAtTo']);
        }

        if (!empty($api_filters['scheduledOrGradingTimeFrom'])) {
            $queryParts[] = 'scheduledOrGradingTime[GREATER_EQUAL]=' . rawurlencode($api_filters['scheduledOrGradingTimeFrom']);
        }

        if (!empty($api_filters['scheduledOrGradingTimeTo'])) {
            $queryParts[] = 'scheduledOrGradingTime[LESS_EQUAL]=' . rawurlencode($api_filters['scheduledOrGradingTimeTo']);
        }

        $urlstring = rtrim($serviceUrl, '/') . '/moduleGrades/?' . implode('&', $queryParts);

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
                        'page' => $page,
                        'limit' => $limit
                    ]
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
