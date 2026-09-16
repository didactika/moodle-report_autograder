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

use local_autograder\local\grading\teacher_source;
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
     * A site that pins its teaching roles by hand sees only those.
     */
    public function test_the_directory_honours_roles_chosen_by_hand(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        $generator->create_and_enrol($course, 'teacher');
        set_config('teacher_source_mode', teacher_source::MODE_CHOSEN_ROLES, 'local_autograder');
        set_config('teacher_roles', 'editingteacher', 'local_autograder');
        set_config('fallback_grader', 0, 'local_autograder');
        \cache_helper::purge_all();
        $result = grader_list::graders_of((int) $course->id);
        $this->assertSame([(int) $teacher->id], array_column($result['graders'], 'id'));
    }

    /**
     * Left automatic, any role that may grade counts — including one a site
     * invented, which is what a hand-written list kept leaving out.
     */
    public function test_the_directory_finds_a_role_nobody_listed(): void {
        global $DB;

        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        // A role built on the teacher archetype, the way the roles page builds
        // one: the archetype's capabilities are copied in, and grading is
        // among them. Nothing tells autograder the role exists.
        $roleid = create_role('Corrector', 'corrector', '', 'teacher');
        reset_role_capabilities($roleid);
        $corrector = $generator->create_user();
        $generator->enrol_user($corrector->id, $course->id, $roleid);
        set_config('fallback_grader', 0, 'local_autograder');
        \cache_helper::purge_all();

        $this->assertTrue(
            $DB->record_exists('role_capabilities', [
                'roleid' => $roleid,
                'capability' => 'mod/assign:grade',
                'permission' => CAP_ALLOW,
            ]),
            'The archetype gives the new role a grading capability, which is what finds it.'
        );

        $result = grader_list::graders_of((int) $course->id);

        $this->assertSame([(int) $corrector->id], array_column($result['graders'], 'id'));
    }

    /**
     * The student list turns by page, and says which page it is showing.
     *
     * The page it reports is what the pagination control draws — "13 - 24 of
     * 31" — so it is the count, the range and the neighbours that matter here,
     * not the rows themselves.
     */
    public function test_the_student_list_reports_the_range_it_shows(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $generator->create_and_enrol($course, 'editingteacher');

        for ($i = 0; $i < 31; $i++) {
            $generator->create_and_enrol($course, 'student');
        }

        $first = grader_list::students_of((int) $course->id, 0, 12);

        $this->assertCount(12, $first['students']);
        $this->assertSame([1, 12, 31], [$first['from'], $first['to'], $first['total']]);
        $this->assertFalse($first['hasprev']);
        $this->assertTrue($first['hasnext']);

        $last = grader_list::students_of((int) $course->id, 2, 12);

        $this->assertCount(7, $last['students']);
        $this->assertSame([25, 31], [$last['from'], $last['to']]);
        $this->assertTrue($last['hasprev']);
        $this->assertFalse($last['hasnext']);

        // A page number out of range is pulled back rather than showing an
        // empty table somebody would read as "no students".
        $beyond = grader_list::students_of((int) $course->id, 99, 12);

        $this->assertSame(2, $beyond['page']);
        $this->assertNotEmpty($beyond['students']);
    }

    /**
     * Only the page sizes on offer are honoured.
     *
     * The size arrives from a URL anybody can edit, and this list costs a
     * question per student — so "all of them" is not something to be talked
     * into by a query parameter.
     */
    public function test_an_unoffered_page_size_falls_back_to_the_default(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();

        foreach ([100000, 0, -5, 13] as $asked) {
            $page = grader_list::students_of((int) $course->id, 0, $asked);

            $this->assertSame(grader_list::PER_PAGE, $page['perpage']);
        }

        $this->assertSame(48, grader_list::students_of((int) $course->id, 0, 48)['perpage']);
    }
}
