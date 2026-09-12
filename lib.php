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
 * How this report is reached.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use local_autograder\local\config_repository;

/**
 * Adds the report to an activity's own menu, where autograder is on for it.
 *
 * @param navigation_node $navigation
 * @param cm_info $cm
 */
function report_autograder_extend_navigation_module(navigation_node $navigation, cm_info $cm): void {
    $context = context_module::instance($cm->id);

    if (!has_capability('report/autograder:view', $context)) {
        return;
    }

    $config = config_repository::get_for_cm((int) $cm->id);

    if (!$config || empty($config->enabled)) {
        // Autograder is not doing anything here, so there is nothing to report.
        return;
    }

    $navigation->add(
        get_string('pluginname', 'report_autograder'),
        new moodle_url('/report/autograder/index.php', ['cmid' => $cm->id]),
        navigation_node::TYPE_SETTING,
        null,
        'reportautograder',
        new pix_icon('i/report', '')
    );
}

/**
 * Adds the report to a course's reports menu, where autograder is on for any
 * of its activities.
 *
 * @param navigation_node $navigation
 * @param stdClass $course
 * @param context_course $context
 */
function report_autograder_extend_navigation_course(
    navigation_node $navigation,
    stdClass $course,
    context_course $context
): void {
    if (!has_capability('report/autograder:viewcourse', $context)) {
        return;
    }

    if (config_repository::enabled_for_course((int) $course->id) === []) {
        return;
    }

    $navigation->add(
        get_string('pluginname', 'report_autograder'),
        new moodle_url('/report/autograder/index.php', ['courseid' => $course->id]),
        navigation_node::TYPE_SETTING,
        null,
        'reportautograder',
        new pix_icon('i/report', '')
    );
}
