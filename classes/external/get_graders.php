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
 * External function: who Autograder would grade as in one course, and for which students.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_autograder\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use report_autograder\local\page\grader_list;

/**
 * The page of the graders asks for the people who could grade a course, and for one page of its students on request: who
 * would grade a student is worked out from that student's own teachers, so it is a question with a cost for each row.
 */
class get_graders extends external_api {
    /**
     * Describe the parameters.
     *
     * @return external_function_parameters Description.
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'The course'),
            'students' => new external_value(PARAM_BOOL, 'Whether to list one page of the students', VALUE_DEFAULT, false),
            'page' => new external_value(PARAM_INT, 'Zero-based page of the students', VALUE_DEFAULT, 0),
            'perpage' => new external_value(PARAM_INT, 'Students on a page', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Read the graders of a course and, when asked, a page of its students.
     *
     * @param int $courseid The course.
     * @param bool $students Whether to list one page of the students.
     * @param int $page Zero-based page of the students.
     * @param int $perpage Students on a page.
     * @return array The graders, the counts and the students.
     */
    public static function execute(int $courseid, bool $students = false, int $page = 0, int $perpage = 0): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid, 'students' => $students, 'page' => $page, 'perpage' => $perpage,
        ]);
        $course = get_course($params['courseid']);
        $context = \context_course::instance($course->id);
        self::validate_context($context);
        // The same two capabilities as the page of the graders, which is a page of the site administration.
        require_capability('report/autograder:viewsite', \context_system::instance());
        require_capability('report/autograder:viewcourse', $context);

        $result = grader_list::graders_of($course->id) + [
            'course' => format_string($course->shortname) . ' — ' . format_string($course->fullname),
            'reporturl' => (new \moodle_url('/report/autograder/index.php', ['courseid' => $course->id]))->out(false),
            'hasstudents' => false,
            'studentlist' => self::no_students(),
        ];
        if ($params['students']) {
            $list = grader_list::students_of($course->id, $params['page'], $params['perpage'] ?: grader_list::PER_PAGE);
            $result['hasstudents'] = true;
            $result['studentlist'] = array_intersect_key($list, self::no_students());
            // A student that nobody would grade has no grader key, so the declared structure holds.
            $result['studentlist']['students'] = array_map(
                static fn(array $row): array => array_filter($row, static fn($value): bool => $value !== null),
                $result['studentlist']['students']
            );
        }
        return $result;
    }

    /**
     * What the list of students is when it was not asked for.
     *
     * @return array The empty list.
     */
    private static function no_students(): array {
        return [
            'students' => [], 'total' => 0, 'page' => 0, 'perpage' => grader_list::PER_PAGE, 'from' => 0, 'to' => 0, 'pages' => 1,
        ];
    }

    /**
     * Describe the returned structure.
     *
     * @return external_single_structure Description.
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'course' => new external_value(PARAM_TEXT, 'The course, as the picker names it'),
            'reporturl' => new external_value(PARAM_URL, 'The report of that course'),
            'graders' => new external_multiple_structure(new external_single_structure([
                'id' => new external_value(PARAM_INT, 'The teacher'),
                'name' => new external_value(PARAM_TEXT, 'Their name'),
                'isfallback' => new external_value(PARAM_BOOL, 'Whether they are only the fallback grader of the site'),
            ])),
            'hasgraders' => new external_value(PARAM_BOOL, 'Whether anybody could grade here'),
            'gradercount' => new external_value(PARAM_INT, 'How many people could grade here'),
            'studentcount' => new external_value(PARAM_INT, 'How many gradable students the course has'),
            'hasfallback' => new external_value(PARAM_BOOL, 'Whether the site has a fallback grader'),
            'hasstudents' => new external_value(PARAM_BOOL, 'Whether the list of students was asked for'),
            'studentlist' => new external_single_structure([
                'students' => new external_multiple_structure(new external_single_structure([
                    'name' => new external_value(PARAM_TEXT, 'The student'),
                    'grader' => new external_value(PARAM_TEXT, 'Who would grade them', VALUE_OPTIONAL),
                    'hasgrader' => new external_value(PARAM_BOOL, 'Whether anybody would'),
                    'viafallback' => new external_value(PARAM_BOOL, 'Whether it is the fallback grader'),
                ])),
                'total' => new external_value(PARAM_INT, 'Students in the course'),
                'page' => new external_value(PARAM_INT, 'Which page this is'),
                'perpage' => new external_value(PARAM_INT, 'Students on a page'),
                'from' => new external_value(PARAM_INT, 'The first student shown, counting from one'),
                'to' => new external_value(PARAM_INT, 'The last student shown'),
                'pages' => new external_value(PARAM_INT, 'How many pages there are'),
            ]),
        ]);
    }
}
