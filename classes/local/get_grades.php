<?php

namespace report_autograder\local;

defined('MOODLE_INTERNAL') || die();

class get_grades {

    /**
     * Fetches local Moodle data for a single external record.
     *
     * @param \stdClass $external_item The single object from the external service, containing userUuid and externalId.
     * @return \stdClass An object containing user_name, grade, and submission_date.
     * @throws \dml_exception
     * @throws \moodle_exception
     */
    public static function get_single_grade_data(\stdClass $external_item) {
        global $DB;

        if (!isset($external_item->externalId) || !isset($external_item->userUuid)) {
            return (object)[
                'user_name' => \get_string('unknownuser'),
                'grade' => null,
                'submission_date' => null,
            ];
        }

        // 1. Get user from userUuid (which maps to idnumber).
        $user = $DB->get_record('user', ['idnumber' => $external_item->userUuid]);
        if (!$user) {
            return (object)[
                'user_name' => \get_string('unknownuser'),
                'grade' => null,
                'submission_date' => null,
            ];
        }

        // 2. Get course module and module type from externalId (cmid).
        list($course, $cm) = \get_course_and_cm_from_cmid($external_item->externalId);
        if (!$cm || !$course) {
             throw new \moodle_exception('invalidcoursemodule');
        }
        $modulename = $cm->modname;

        // 3. Get the grade item for this module.
        $grade_item = $DB->get_record('grade_items', [
            'itemtype' => 'mod',
            'itemmodule' => $modulename,
            'iteminstance' => $cm->instance,
            'courseid' => $course->id
        ]);
        
        $finalgrade = null;
        if ($grade_item) {
            // 4. Get the final grade from grade_grades.
            $grade_grade = $DB->get_record('grade_grades', ['itemid' => $grade_item->id, 'userid' => $user->id]);
            if ($grade_grade && !is_null($grade_grade->finalgrade)) {
                $finalgrade = round($grade_grade->finalgrade, 2);
            }
        }

        // 5. Get submission date from course_module_completion.
        $completion_record = $DB->get_record('course_modules_completion', ['coursemoduleid' => $cm->id, 'userid' => $user->id]);
        $submission_date = $completion_record ? $completion_record->timemodified : null;

        return (object)[
            'user_name' => \fullname($user),
            'grade' => $finalgrade,
            'submission_date' => $submission_date ? \userdate($submission_date) : '-',
        ];
    }
}
