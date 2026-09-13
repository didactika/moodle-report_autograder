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
use local_autograder\local\config_repository;
use report_autograder\local\scope;

/**
 * The service the table is actually filled from.
 *
 * Everything the browser shows arrives through here, and a field the returns
 * structure does not declare is not a missing column — it is a fatal error in
 * the middle of the page. So each call is put through
 * `external_api::clean_returnvalue()`, which is what the real request does and
 * what nothing else in these tests does.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\external\get_report
 */
final class get_report_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass An autograded assignment that separates its groups. */
    private \stdClass $cm;

    /** @var \stdClass The teacher. */
    private \stdClass $teacher;

    /**
     * A course with a group, three students, and an autograded assignment set
     * to separate groups — so that every optional field the service can return
     * has a chance to appear.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();
        $group = $generator->create_group(['courseid' => $this->course->id, 'name' => 'Group A']);
        $this->teacher = $generator->create_and_enrol($this->course, 'editingteacher');

        foreach (['Ana', 'Bruno', 'Carla'] as $name) {
            $student = $generator->create_and_enrol($this->course, 'student', ['firstname' => $name]);
            $generator->create_group_member(['groupid' => $group->id, 'userid' => $student->id]);
        }

        $assign = $generator->create_module('assign', [
            'course' => $this->course->id,
            'grade' => 100,
            'groupmode' => SEPARATEGROUPS,
        ]);
        $this->cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $this->cm->id,
            (int) $this->course->id,
            true,
            'point',
            70.0,
            null,
            DAYSECS,
            (int) $this->teacher->id
        );
    }

    /**
     * One page of the activity report, in the shape the service promises.
     */
    public function test_it_returns_a_page_in_the_declared_shape(): void {
        $result = $this->call(['cmid' => (int) $this->cm->id]);

        $this->assertSame(3, $result['totalrecords']);
        $this->assertCount(3, $result['data']);

        $row = $result['data'][0];
        $this->assertSame('Group A', $row['groups'], 'The group column travels with the row.');
        $this->assertTrue((bool) $row['shows_groups']);
    }

    /**
     * Paging is the server's job, so it has to be the server that limits.
     */
    public function test_it_pages_on_the_server(): void {
        $first = $this->call(['cmid' => (int) $this->cm->id, 'limit' => 2]);
        $second = $this->call(['cmid' => (int) $this->cm->id, 'limit' => 2, 'page' => 1]);

        $this->assertSame(3, $first['totalrecords']);
        $this->assertCount(2, $first['data']);
        $this->assertCount(1, $second['data']);
        $this->assertNotSame($first['data'][0]['rowkey'], $second['data'][0]['rowkey']);
    }

    /**
     * The filters the bar sends arrive as filters.
     */
    public function test_it_honours_the_filters_it_is_sent(): void {
        $result = $this->call([
            'cmid' => (int) $this->cm->id,
            'filters' => [['name' => 'searchname', 'value' => 'Bruno']],
        ]);

        $this->assertSame(1, $result['totalrecords']);
        $this->assertStringContainsString('Bruno', $result['data'][0]['user_name']);
    }

    /**
     * A student asking for the report of their own activity is refused: the
     * service checks the same capability the page does.
     */
    public function test_it_refuses_somebody_who_may_not_see_the_report(): void {
        $student = $this->getDataGenerator()->create_and_enrol($this->course, 'student');
        $this->setUser($student);

        $this->expectException(\required_capability_exception::class);
        $this->call(['cmid' => (int) $this->cm->id]);
    }

    /**
     * The course and site reports answer through the same service.
     */
    public function test_the_wider_reports_answer_too(): void {
        $course = $this->call(['courseid' => (int) $this->course->id]);
        $site = $this->call([]);

        $this->assertSame(3, $course['totalrecords']);
        $this->assertSame(3, $site['totalrecords']);
        $this->assertSame(
            scope::LEVEL_SITE,
            scope::from_params(0, 0)->level(),
            'The site report is the one asked for with neither parameter.'
        );
    }

    /**
     * Calls the service the way a real request does, return validation and all.
     *
     * @param array $args Overrides for the service's parameters.
     * @return array The cleaned return value.
     */
    private function call(array $args): array {
        $defaults = [
            'cmid' => 0,
            'courseid' => 0,
            'page' => 0,
            'limit' => 0,
            'filters' => [],
            'sortcolumn' => 'user_name',
            'sortdir' => 'asc',
        ];
        $args = array_merge($defaults, $args);

        $result = get_report::execute(
            $args['cmid'],
            $args['courseid'],
            $args['page'],
            $args['limit'],
            $args['filters'],
            $args['sortcolumn'],
            $args['sortdir']
        );

        return external_api::clean_returnvalue(get_report::execute_returns(), $result);
    }
}
