<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * @param $navigation
 * @param $cm
 *
 * @return void
 * @throws coding_exception
 * @throws dml_exception
 * @throws moodle_exception
 */
function report_autograder_extend_navigation_module($navigation, $cm)
{
    global $PAGE, $DB;

    $is_autograded = $DB->get_record('local_autograder', ['cmid' => $cm->id])->isautograded ?? false; // Check if the instance exist and the activity is autograded

    if ($is_autograded && has_capability('gradereport/grader:view', $PAGE->context)) {
        $course = $DB->get_record('course', ['id' => $cm->course], '*', MUST_EXIST);
        $cm = get_coursemodule_from_id($cm->modname, $cm->id, $course->id, false, MUST_EXIST);
        $url = new moodle_url('/report/autograder/index.php', ['id' => $cm->course, 'cmid' => $cm->id, 'modname' => $cm->modname, 'modid' => $cm->instance]);
        $navigation->add(get_string('pluginname', 'report_autograder'), $url, navigation_node::TYPE_SETTING, null, null, new pix_icon('i/report', ''));
    }
}

function is_enrolledstudent($userid, $courseid)
{
    global $DB;
    $role = $DB->get_record('role', ['shortname' => 'student']);
    $context = context_course::instance($courseid);
    $enrolled = is_enrolled($context, $userid, '', true);
    return !empty($role) && user_has_role_assignment($userid, $role->id) && $enrolled;
}
