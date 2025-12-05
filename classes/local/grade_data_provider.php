<?php

namespace report_autograder\local;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/gradelib.php');

use moodle_exception;
use stdClass;
use core_completion\api as completion_api;

/**
 * Provides Moodle context for external grade data.
 */
class grade_data_provider
{
    /**
     * Fetches local Moodle data (user, grade, completion) for a single external grade record.
     * This method enriches the external data with context from the Moodle database using Moodle APIs.
     *
     * @param stdClass $external_item The single object from the external service.
     * @param stdClass $course The course object.
     * @param stdClass $cm The course module object.
     * @param ?stdClass $user The pre-fetched user object, or null if not found.
     * @param ?stdClass $grade The pre-fetched grade object, or null if not found.
     * @param ?stdClass $completion The pre-fetched completion object, or null if not found.
     * @return stdClass An object containing user_name, grade, and submission_date_timestamp.
     * @throws moodle_exception
     */
    public static function get_moodle_context(stdClass $external_item, stdClass $course, ?stdClass $user, ?stdClass $grade, ?stdClass $completion): stdClass
    {
        global $DB;
        $result = new stdClass();
        $result->user_name = \get_string('unknownuser');
        $result->grade = null;
        $result->submission_date_timestamp = null;

        if (!$user) {
            return $result;
        }
        $result->user_name = \fullname($user);

        $finalgrade = null;
        if ($grade && isset($grade->grade)) {
            $finalgrade = round($grade->grade, 2);
        }

        $result->grade = $finalgrade;
        
        if ($completion && !empty($completion->timemodified)) {
            $result->submission_date_timestamp = $completion->timemodified;
        }

        return $result;
    }
}