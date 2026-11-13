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
 * Who autograder would grade as, before it grades anything.
 *
 * Without a course it lists the courses where Autograder is switched on, each with the people who could grade there and whether grading
 * would work; with a course it shows that course, its graders and its students with the teacher each would get, which can be searched
 * and narrowed to the ones that would be graded by the fallback grader or by nobody. Who would grade a student is worked out from that
 * student's own teachers, so it is asked for one page of students at a time.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use report_autograder\local\page\grader_list;

$courseid = optional_param('courseid', 0, PARAM_INT);
$search = trim(optional_param('search', '', PARAM_TEXT));
$page = optional_param('page', 0, PARAM_INT);
$perpage = optional_param('perpage', grader_list::PER_PAGE, PARAM_INT);
$filter = optional_param('filter', grader_list::FILTER_ALL, PARAM_ALPHA);

require_login();
admin_externalpage_setup('reportautogradergraders');

$baseurl = new moodle_url('/report/autograder/graders.php', array_filter(['courseid' => $courseid]));

$PAGE->set_url($baseurl);
$PAGE->add_body_class('report-autograder-page');
$PAGE->set_title(get_string('graders:heading', 'report_autograder'));
$PAGE->set_heading(get_string('graders:heading', 'report_autograder'));

/**
 * The address of a page of the list, keeping what was searched and chosen.
 *
 * @param int $courseid The course, or 0 for the list of courses.
 * @param array $keep What the page keeps besides the page.
 * @param int $page The page.
 * @return string The address.
 */
$pageurl = static function (int $courseid, array $keep, int $page): string {
    return (new moodle_url('/report/autograder/graders.php', array_filter($keep + ['courseid' => $courseid, 'page' => $page])))
        ->out(false);
};

$pager = static function (array $data, array $keep) use ($courseid, $pageurl, $perpage): ?array {
    if ($data['total'] === 0) {
        // An empty list has no pages: its empty state says so.
        return null;
    }

    $hidden = [];

    foreach (array_filter($keep + ['courseid' => $courseid]) as $name => $value) {
        if ($name !== 'perpage') {
            $hidden[] = ['name' => $name, 'value' => $value];
        }
    }

    // The sizes smaller than the list, and All: a list of up to 12 rows offers All only, one of 13 to 24 offers 12 and All, and
    // so on up to 12, 24, 48, 96 and All. The select shows All when every row fits on the page.
    $fitting = array_values(array_filter(grader_list::PER_PAGE_OPTIONS, static fn(int $size): bool => $size < $data['total']));
    $shown = in_array($perpage, $fitting, true) ? $perpage : grader_list::ALL;
    $sizes = array_map(static fn(int $size): array => ['value' => $size, 'label' => $size, 'selected' => $size === $shown], $fitting);
    $sizes[] = ['value' => grader_list::ALL, 'label' => get_string('pagination:all', 'report_autograder'),
        'selected' => $shown === grader_list::ALL];

    return [
        'from' => $data['from'],
        'to' => $data['to'],
        'total' => $data['total'],
        'hasprev' => $data['page'] > 0,
        'hasnext' => $data['to'] < $data['total'],
        'prevurl' => $pageurl($courseid, $keep, $data['page'] - 1),
        'nexturl' => $pageurl($courseid, $keep, $data['page'] + 1),
        'hiddenfields' => $hidden,
        'peroptions' => $sizes,
    ];
};

$context = [
    'formurl' => (new moodle_url('/report/autograder/graders.php'))->out(false),
    'overviewurl' => (new moodle_url('/report/autograder/graders.php'))->out(false),
    'search' => $search,
    'courseid' => $courseid,
    'iscourse' => $courseid > 0,
];

if ($courseid > 0) {
    $course = get_course($courseid);
    require_capability('report/autograder:viewcourse', context_course::instance($courseid));

    $context += grader_list::graders_of($courseid);
    $students = grader_list::students_of($courseid, $page, $perpage, $search, $filter);
    $context['course'] = format_string($course->shortname) . ' — ' . format_string($course->fullname);
    $context['reporturl'] = (new moodle_url('/report/autograder/index.php', ['courseid' => $courseid]))->out(false);
    $context['onlyfallback'] = $context['hasgraders'] && !array_filter(
        $context['graders'],
        static fn(array $grader): bool => !$grader['isfallback']
    );
    $context['filters'] = array_map(
        static fn(string $option): array => [
            'value' => $option,
            'label' => get_string('graders:filter_' . $option, 'report_autograder'),
            'selected' => $option === $students['filter'],
            'base' => $option === grader_list::FILTER_ALL,
        ],
        [grader_list::FILTER_ALL, grader_list::FILTER_FALLBACK, grader_list::FILTER_NOBODY]
    );
    $context['students'] = $students['students'];
    $context['hasstudents'] = $students['students'] !== [];
    $narrowed = $search !== '' || $students['filter'] !== grader_list::FILTER_ALL;
    $context['emptymessage'] = get_string($narrowed ? 'graders:emptysearch' : 'graders:none', 'report_autograder');
    $context['emptyicon'] = $OUTPUT->pix_icon($narrowed ? 'a/search' : 'i/users', '');
    // The filter has no base option: once it narrows the list, its cross goes back to every student.
    $context['filterset'] = $students['filter'] !== grader_list::FILTER_ALL;
    $context['filterclearurl'] = (new moodle_url('/report/autograder/graders.php', array_filter(['courseid' => $courseid,
        'search' => $search, 'perpage' => $perpage === grader_list::PER_PAGE ? 0 : $perpage])))->out(false);
    $context['pager'] = $pager($students, array_filter(['search' => $search, 'filter' => $students['filter'] === 'all' ? '' : $students['filter'],
        'perpage' => $perpage]));
} else {
    $overview = grader_list::overview($search, $page, $perpage);
    $context['courses'] = array_map(static function (array $course): array {
        $course['statelabel'] = get_string('graders:state_' . $course['state'], 'report_autograder');
        $course['tone'] = ['ready' => 'success', 'fallback' => 'warning', 'nobody' => 'danger'][$course['state']];
        $course['graderlist'] = implode(', ', $course['graders']);
        $course['hasmore'] = $course['moregraders'] > 0;

        return $course;
    }, $overview['courses']);
    $context['hascourses'] = $overview['courses'] !== [];
    $context['emptymessage'] = get_string($search === '' ? 'graders:empty' : 'graders:emptysearch', 'report_autograder');
    $context['emptyicon'] = $OUTPUT->pix_icon($search === '' ? 'i/report' : 'a/search', '');
    $context['pager'] = $pager($overview, array_filter(['search' => $search, 'perpage' => $perpage]));
}

$PAGE->requires->js_call_amd('report_autograder/ui/submit_on_change', 'init');

echo $OUTPUT->header();
echo $OUTPUT->render_from_template('report_autograder/graders', $context);
echo $OUTPUT->footer();
