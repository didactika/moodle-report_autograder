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

/**
 * The graders of a course, as the page of the graders asks for them.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\external\get_graders
 */
final class get_graders_test extends \advanced_testcase {
    /**
     * The answer without the students holds the graders and the counts, and an empty list of students.
     */
    public function test_it_returns_the_graders_in_the_declared_shape(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $generator->create_and_enrol($course, 'editingteacher', ['firstname' => 'Ada', 'lastname' => 'Lovelace']);
        $generator->create_and_enrol($course, 'student');

        $result = get_graders::execute((int) $course->id);
        $result = \core_external\external_api::clean_returnvalue(get_graders::execute_returns(), $result);

        $this->assertSame(1, $result['studentcount']);
        $this->assertFalse($result['hasstudents']);
        $this->assertSame([], $result['studentlist']['students']);
        $this->assertStringContainsString($course->shortname, $result['course']);
    }

    /**
     * A page of the students says, for each, who would grade them, and leaves the key out where nobody would.
     */
    public function test_it_lists_a_page_of_students(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $generator->create_and_enrol($course, 'editingteacher', ['firstname' => 'Ada', 'lastname' => 'Lovelace']);
        $generator->create_and_enrol($course, 'student', ['firstname' => 'Ana', 'lastname' => 'Lopez']);

        $result = get_graders::execute((int) $course->id, true, 0, 12);
        $result = \core_external\external_api::clean_returnvalue(get_graders::execute_returns(), $result);

        $this->assertTrue($result['hasstudents']);
        $this->assertCount(1, $result['studentlist']['students']);
        $this->assertSame(1, $result['studentlist']['total']);
        $this->assertSame(12, $result['studentlist']['perpage']);
    }

    /**
     * Whoever cannot see the report of the course cannot read who would grade in it.
     */
    public function test_it_needs_the_capability_of_the_course(): void {
        $this->resetAfterTest();
        $course = $this->getDataGenerator()->create_course();
        $student = $this->getDataGenerator()->create_and_enrol($course, 'student');
        $this->setUser($student);

        $this->expectException(\required_capability_exception::class);
        get_graders::execute((int) $course->id);
    }

    /**
     * A teacher sees the report of their course, but not the page of the graders, so they cannot read it through this either.
     */
    public function test_it_needs_the_capability_of_the_site(): void {
        $this->resetAfterTest();
        $course = $this->getDataGenerator()->create_course();
        $teacher = $this->getDataGenerator()->create_and_enrol($course, 'editingteacher');
        $this->setUser($teacher);
        $this->assertTrue(has_capability('report/autograder:viewcourse', \context_course::instance($course->id)));

        $this->expectException(\required_capability_exception::class);
        get_graders::execute((int) $course->id);
    }

    /**
     * A manager of the site, who has the page of the graders, reads the graders of any course.
     */
    public function test_a_manager_of_the_site_reads_the_graders(): void {
        $this->resetAfterTest();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $manager = $generator->create_user();
        $generator->role_assign('manager', $manager->id, \context_system::instance()->id);
        $this->setUser($manager);

        $result = get_graders::execute((int) $course->id);
        $result = \core_external\external_api::clean_returnvalue(get_graders::execute_returns(), $result);

        $this->assertSame(0, $result['studentcount']);
    }
}
