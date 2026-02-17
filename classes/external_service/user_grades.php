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
use moodle_url;

/**
 * Service class to fetch user grades from the external autograder service.
 */
class user_grades
{
    /**
     * Fetches user grades from the autograder service, supporting pagination.
     *
     * @param int $cmid The course module ID, sent as 'externalId'.
     * @param string $campusUuid The user's unique identifier.
     * @param string $pagination The pagination string as expected by the external API.
     * @param array $status
     * @param array $cmid_completions
     * @return array The full response from the service, including 'total' and 'data' keys.
     * @throws moodle_exception if the service is not configured, the request fails, or the response is invalid.
     */
    public static function get_user_grades(int $cmid, string $campusUuid, string $pagination, array $status, array $cmid_completions): array
    {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        $params = [
            'campusUuid' => $campusUuid,
            'externalId' => $cmid,
            'pagination' => $pagination
        ];

        if (!empty($status)) {
            $params['status'] = $status[0];
        }

        if (!empty($cmid_completions)) {
            $params['userExternalId'] = json_encode($cmid_completions);
        }

        $url = new moodle_url(rtrim($serviceUrl, '/') . '/usergrades/', $params);

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url->out(false));
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

            if ($httpcode >= 400) {
                throw new moodle_exception('error:apirequest', 'report_autograder', null, 'HTTP status code: ' . $httpcode);
            }

            $data = json_decode($responseBody, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new moodle_exception('error:jsondecode', 'report_autograder', null, json_last_error_msg());
            }

            if (!is_array($data) || !isset($data['data']) || !isset($data['total'])) {
                throw new moodle_exception('error:invalidapiresponse', 'report_autograder');
            }

            return $data;

        } catch (\Exception $e) {
            throw new moodle_exception('error:apirequest', 'report_autograder', null, json_encode($url));
        }
    }

    /**
     * Sends a POST request to update a user's grade in the external autograder service.
     *
     * @param int $completion_id The completion ID (used in URL as path parameter)
     * @param string $status The grading status to set
     * @param float $grade The grade to assign
     * @return array The API response decoded as an associative array
     * @throws moodle_exception
     */
    public static function post_user_grades(string $userUuid, int $cmid, float $grade): array
    {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        $campusUuid = get_config('local_message_broker', 'siteexternalid');
        if (empty($campusUuid)) {
            throw new moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid (local_message_broker)');
        }

        $url = rtrim($serviceUrl, '/') . '/usergrades/' . $userUuid . '/' . $cmid . '?campusUuid=' . $campusUuid;

        $payload = json_encode([
            'grade' => $grade
        ]);

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
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
                throw new moodle_exception('error:apirequest', 'report_autograder', null, 'HTTP status code: ' . $httpcode);
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