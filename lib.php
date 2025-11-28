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

    // First, check if the module is one of the supported types.
    $supported_modules = ['assign', 'quiz', 'forum'];
    if (!in_array($cm->modname, $supported_modules)) {
        return;
    }

    if (!\get_config('local_autograder', 'enable')) return; // get_config() is a critical global function, good to be explicit.

    $is_autograded = $DB->get_record('local_autograder', ['cmid' => $cm->id])->enable ?? false;

    if ($is_autograded && \has_capability('gradereport/grader:view', $PAGE->context)) {
        $url = new \moodle_url('/report/autograder/index.php', ['cmid' => $cm->id]);
        $navigation->add(get_string('pluginname', 'report_autograder'), $url, \navigation_node::TYPE_SETTING, null, null, new \pix_icon('i/report', ''));
    }
}

