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

namespace report_autograder\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use report_autograder\local\page\grader_list;

/**
 * The courses where Autograder is switched on and, for each, whether grading there would work.
 *
 * It is what the page of the graders opens on: one page of courses, each with the people who could grade, the students it has and a
 * state that tells at a glance which courses would fail. Who would grade each student is a question for one course.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_graders_overview extends external_api {
    /**
     * Describe the parameters.
     *
     * @return external_function_parameters Description.
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'search' => new external_value(PARAM_TEXT, 'Text of the name of the course', VALUE_DEFAULT, ''),
            'page' => new external_value(PARAM_INT, 'Zero-based page of the courses', VALUE_DEFAULT, 0),
            'perpage' => new external_value(PARAM_INT, 'Courses on a page (0 = default, -1 = all)', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Read one page of the courses.
     *
     * @param string $search Text of the name of the course.
     * @param int $page Zero-based page.
     * @param int $perpage Courses on a page.
     * @return array The courses and the data of the pager.
     */
    public static function execute(string $search = '', int $page = 0, int $perpage = 0): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'search' => $search, 'page' => $page, 'perpage' => $perpage,
        ]);
        $context = \context_system::instance();
        self::validate_context($context);
        // The page of the graders is a page of the site administration, and so is this.
        require_capability('report/autograder:viewsite', $context);

        return grader_list::overview($params['search'], $params['page'], $params['perpage'] ?: grader_list::PER_PAGE);
    }

    /**
     * Describe the returned structure.
     *
     * @return external_single_structure Description.
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'courses' => new external_multiple_structure(new external_single_structure([
                'id' => new external_value(PARAM_INT, 'The course'),
                'name' => new external_value(PARAM_TEXT, 'Its short name'),
                'fullname' => new external_value(PARAM_TEXT, 'Its full name'),
                'activities' => new external_value(PARAM_INT, 'Activities where Autograder is switched on'),
                'gradercount' => new external_value(PARAM_INT, 'How many people could grade here'),
                'studentcount' => new external_value(PARAM_INT, 'How many gradable students the course has'),
                'state' => new external_value(PARAM_ALPHA, 'ready, fallback or nobody'),
                'graders' => new external_multiple_structure(new external_value(PARAM_TEXT, 'The name of a grader')),
                'moregraders' => new external_value(PARAM_INT, 'Graders that are not named'),
                'reporturl' => new external_value(PARAM_URL, 'The report of the course'),
                'studentsurl' => new external_value(PARAM_URL, 'Who would grade each student'),
            ])),
            'total' => new external_value(PARAM_INT, 'Courses that match'),
            'page' => new external_value(PARAM_INT, 'Which page this is'),
            'perpage' => new external_value(PARAM_INT, 'Courses on a page'),
            'from' => new external_value(PARAM_INT, 'The first course shown, counting from one'),
            'to' => new external_value(PARAM_INT, 'The last course shown'),
        ]);
    }
}
