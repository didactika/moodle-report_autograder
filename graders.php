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

$context = [
    'formurl' => (new moodle_url('/report/autograder/graders.php'))->out(false),
    'courseid' => $courseid,
];

if ($courseid > 0) {
    $course = get_course($courseid);
    require_capability('report/autograder:viewcourse', context_course::instance($courseid));

    $showstudents = optional_param('students', 0, PARAM_BOOL);
    $page = optional_param('page', 0, PARAM_INT);
    $perpage = optional_param('perpage', grader_list::PER_PAGE, PARAM_INT);

    $context += grader_list::graders_of($courseid);
    $context['showstudents'] = $showstudents;
    $context['studentsurl'] = (new moodle_url(
        '/report/autograder/graders.php',
        ['courseid' => $courseid, 'students' => 1]
    ))->out(false);

    if ($showstudents) {
        // Only now is anything asked per student, and only for one page of
        // them: who would grade a student is worked out from that student's
        // own teachers, so it is a question with a cost per row.
        $students = grader_list::students_of($courseid, $page, $perpage);

        $pageurl = static function (int $page) use ($courseid, $students): string {
            return (new moodle_url('/report/autograder/graders.php', [
                'courseid' => $courseid,
                'students' => 1,
                'page' => $page,
                'perpage' => $students['perpage'],
            ]))->out(false);
        };

        $students['formurl'] = (new moodle_url('/report/autograder/graders.php'))->out(false);
        // Carried by the page-size form so that changing the size keeps the
        // course and the student list, rather than dropping back to the picker.
        $students['hiddenfields'] = [
            ['name' => 'courseid', 'value' => $courseid],
            ['name' => 'students', 'value' => 1],
        ];
        $students['prevurl'] = $pageurl($students['prevpage']);
        $students['nexturl'] = $pageurl($students['nextpage']);
        $context['studentlist'] = $students;
    }
    // The same label the picker's own search returns, so the option it is
    // left showing reads the way the ones it offers do.
    $context['course'] = format_string($course->shortname) . ' — ' . format_string($course->fullname);
    $context['haschosen'] = true;
    $context['reporturl'] = (new moodle_url(
        '/report/autograder/index.php',
        ['courseid' => $courseid]
    ))->out(false);
}

$PAGE->requires->js_call_amd('report_autograder/ui/graders', 'init', [
    get_string('search:nomatches', 'report_autograder'),
    get_string('search:loading', 'report_autograder'),
    get_string('datepicker_cancel', 'report_autograder'),
]);

echo $OUTPUT->header();
echo $OUTPUT->render_from_template('report_autograder/graders', $context);
echo $OUTPUT->footer();
