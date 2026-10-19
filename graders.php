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
 * A site-level page with a course picker, rather than a column on the report: the answer is worked out per student, so it is
 * asked one course at a time and never for the whole site at once. The page is drawn by report_autograder/Graders.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use report_autograder\output\graders_page;

$courseid = optional_param('courseid', 0, PARAM_INT);
$students = optional_param('students', 0, PARAM_BOOL);

require_login();
admin_externalpage_setup('reportautogradergraders');

if ($courseid > 0) {
    require_capability('report/autograder:viewcourse', context_course::instance($courseid));
}

$PAGE->set_url(new moodle_url('/report/autograder/graders.php', array_filter(['courseid' => $courseid])));
$PAGE->add_body_class('report-autograder-page');
$PAGE->set_title(get_string('graders:heading', 'report_autograder'));
$PAGE->set_heading(get_string('graders:heading', 'report_autograder'));

echo $OUTPUT->header();
// The element that the component fills in is empty, so the placeholder goes right before its closing tag.
echo preg_replace(
    '~</div>\s*$~',
    graders_page::placeholder() . '</div>',
    $OUTPUT->render(new graders_page($courseid, (bool) $students)),
    1
);
echo $OUTPUT->footer();
