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
 * Who autograder would grade as, in one course, before it grades anything.
 *
 * A site-level page with a course picker, rather than a column on the report:
 * the answer is worked out per student, so it is asked one course at a time
 * and never for the whole site at once.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use report_autograder\local\page\grader_list;

$courseid = optional_param('courseid', 0, PARAM_INT);

require_login();
admin_externalpage_setup('reportautogradergraders');

$url = new moodle_url('/report/autograder/graders.php', array_filter(['courseid' => $courseid]));

$PAGE->set_url($url);
$PAGE->add_body_class('report-autograder-page');
$PAGE->set_title(get_string('graders:heading', 'report_autograder'));
$PAGE->set_heading(get_string('graders:heading', 'report_autograder'));

$context = ['formurl' => (new moodle_url('/report/autograder/graders.php'))->out(false)];

if ($courseid > 0) {
    $course = get_course($courseid);
    require_capability('report/autograder:viewcourse', context_course::instance($courseid));

    $context += grader_list::for_course($courseid);
    $context['course'] = format_string($course->shortname);
    $context['haschosen'] = true;
    $context['reporturl'] = (new moodle_url(
        '/report/autograder/index.php',
        ['courseid' => $courseid]
    ))->out(false);
}

echo $OUTPUT->header();
echo $OUTPUT->render_from_template('report_autograder/graders', $context);
echo $OUTPUT->footer();
