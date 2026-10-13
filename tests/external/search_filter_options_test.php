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
use local_autograder\local\config\config_repository;

/**
 * What the two pickers of the report are allowed to list.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\external\search_filter_options
 */
final class search_filter_options_test extends \advanced_testcase {
    /**
     * Somebody who may read the report of one activity cannot list the other courses of the site through it, and hidden
     * courses are among them.
     */
    public function test_the_all_courses_search_is_only_for_the_site_report(): void {
        $this->resetAfterTest();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course(['shortname' => 'OPEN1', 'fullname' => 'The course of the teacher']);
        $generator->create_course(['shortname' => 'SECRET1', 'fullname' => 'A hidden course', 'visible' => 0]);
        $assign = $generator->create_module('assign', ['course' => $course->id, 'grade' => 100]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $course->id, false, MUST_EXIST);
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        config_repository::upsert_for_cm((int) $cm->id, (int) $course->id, true, 'point', 70.0, null, 0, (int) $teacher->id);

        $this->setUser($teacher);
        $result = $this->search('anycourse', ['cmid' => (int) $cm->id]);
        $this->assertSame([], $result['options'], 'A reader of one activity gets no list of courses.');

        $result = $this->search('anycourse', ['courseid' => (int) $course->id]);
        $this->assertSame([], $result['options'], 'Nor does a reader of one course.');

        $this->setAdminUser();
        $result = $this->search('anycourse', []);
        $names = array_column($result['options'], 'name');
        $this->assertNotEmpty(array_filter($names, static fn(string $name): bool => strpos($name, 'SECRET1') !== false));
        $this->assertNotEmpty(array_filter($names, static fn(string $name): bool => strpos($name, 'OPEN1') !== false));
    }

    /**
     * One call of the service, cleaned as the real request cleans it.
     *
     * @param string $type Picker.
     * @param array $scope The ids that name the scope.
     * @return array The result.
     */
    private function search(string $type, array $scope): array {
        $result = search_filter_options::execute(
            $type,
            '',
            (int) ($scope['cmid'] ?? 0),
            (int) ($scope['courseid'] ?? 0)
        );

        return external_api::clean_returnvalue(search_filter_options::execute_returns(), $result);
    }
}
