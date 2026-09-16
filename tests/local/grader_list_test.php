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

namespace report_autograder\local;

use report_autograder\local\page\grader_list;

/**
 * Course association and enrolment boundaries in the grader directory.
 *
 * @package report_autograder
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \report_autograder\local\page\grader_list
 */
final class grader_list_test extends \advanced_testcase {
    /**
     * Expired and future enrolments must match the main report's exclusions.
     */
    public function test_only_current_enrolments_are_counted(): void {
        global $DB;
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $generator->create_and_enrol($course, 'student');
        $expired = $generator->create_and_enrol($course, 'student');
        $future = $generator->create_and_enrol($course, 'student');
        $DB->set_field('user_enrolments', 'timeend', time() - 60, ['userid' => $expired->id]);
        $DB->set_field('user_enrolments', 'timestart', time() + DAYSECS, ['userid' => $future->id]);
        $this->assertSame(1, grader_list::count_students((int) $course->id));
    }

    /**
     * Empty role configuration returns an empty list, not malformed SQL.
     */
    public function test_empty_gradebook_roles_and_page_are_valid(): void {
        global $CFG;
        $this->resetAfterTest();
        $this->setAdminUser();
        $course = $this->getDataGenerator()->create_course();
        $CFG->gradebookroles = '';
        $page = grader_list::students_of((int) $course->id, 99);
        $this->assertSame(0, $page['total']);
        $this->assertSame(0, $page['page']);
        $this->assertSame(1, $page['pages']);
        $this->assertFalse($page['hasprev']);
        $this->assertFalse($page['hasnext']);
    }

    /**
     * A gradebook capability alone never makes somebody an associated teacher.
     */
    public function test_directory_uses_only_the_resume_role_family(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        $generator->create_and_enrol($course, 'teacher');
        set_config('teacher_roles', 'editingteacher', 'local_autograder');
        set_config('fallback_grader', 0, 'local_autograder');
        $result = grader_list::graders_of((int) $course->id);
        $this->assertSame([(int) $teacher->id], array_column($result['graders'], 'id'));
    }
}
