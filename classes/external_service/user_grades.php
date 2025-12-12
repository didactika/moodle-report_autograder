<?php

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

        debugging('Calling external API with URL: ' . $url->out(false), DEBUG_ALL);

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url->out(false));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FAILONERROR, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);

            $responseBody = curl_exec($ch);

            if ($responseBody === false) {
                $error = curl_error($ch);
                $error_no = curl_errno($ch);
                curl_close($ch);
                debugging("cURL request for \"" . $url->out(false) . "\" failed with: $error ($error_no)", DEBUG_ALL);
                throw new moodle_exception('error:apirequest', 'report_autograder', null, $error);
            }

            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpcode >= 400) {
                $error = 'HTTP status code: ' . $httpcode;
                debugging("cURL request for \"" . $url->out(false) . "\" returned non-2xx status: $httpcode", DEBUG_ALL);
                throw new moodle_exception('error:apirequest', 'report_autograder', null, $error);
            }

            $data = json_decode($responseBody, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                debugging('Failed to decode JSON response: ' . json_last_error_msg(), DEBUG_ALL);
                throw new moodle_exception('error:jsondecode', 'report_autograder', null, json_last_error_msg());
            }

            if (!is_array($data) || !isset($data['data']) || !isset($data['total'])) {
                debugging('API response is not in the expected format or is missing keys. Response: ' . $responseBody, DEBUG_ALL);
                throw new moodle_exception('error:invalidapiresponse', 'report_autograder');
            }

            return $data;

        } catch (\Exception $e) {
            debugging('Generic exception caught during API call: ' . $e->getMessage(), DEBUG_ALL);
            throw new moodle_exception('error:apirequest', 'report_autograder', null, $e->getMessage());
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
    public static function post_user_grades(int $completion_id, string $status, float $grade): array {
        $serviceUrl = get_config('report_autograder', 'serviceurl');
        if (empty($serviceUrl)) {
            throw new moodle_exception('error:serviceurlconfig', 'report_autograder');
        }

        $url = rtrim($serviceUrl, '/') . '/usergrades/' . $completion_id;

        $payload = json_encode([
            'status' => $status,
            'grade' => $grade
        ]);

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FAILONERROR, true);
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
