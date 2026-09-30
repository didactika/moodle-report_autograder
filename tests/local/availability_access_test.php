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

use local_autograder\local\config\config_repository;
use report_autograder\local\query\filters;
use report_autograder\local\query\report_query;
use report_autograder\local\query\scope;

/**
 * Students an activity's access restrictions keep out are not listed on it.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\availability\availability_access
 */
final class availability_access_test extends \advanced_testcase {
    /**
     * An activity restricted to one group lists only that group's students,
     * in the course report as in the activity's own.
     */
    public function test_a_restricted_activity_lists_only_the_students_it_admits(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        set_config('enableavailability', 1);

        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $group = $generator->create_group(['courseid' => $course->id]);
        $inside = $generator->create_and_enrol($course, 'student', ['lastname' => 'Inside']);
        $generator->create_and_enrol($course, 'student', ['lastname' => 'Outside']);
        $generator->create_group_member(['groupid' => $group->id, 'userid' => $inside->id]);

        $restriction = json_encode([
            'op' => '&',
            'c' => [['type' => 'group', 'id' => (int) $group->id]],
            'showc' => [true],
        ]);
        $assign = $generator->create_module('assign', [
            'course' => $course->id,
            'grade' => 100,
            'availability' => $restriction,
        ]);
        config_repository::upsert_for_cm((int) $assign->cmid, (int) $course->id, true, 'point', 70.0, null, 0, 2);

        foreach ([scope::from_params(0, (int) $course->id), scope::from_params((int) $assign->cmid, 0)] as $scope) {
            $rows = report_query::rows($scope, filters::from_request([], true), report_query::SORT_NAME, 'asc', 0, 0);

            $this->assertSame(['Inside'], array_column(array_values($rows), 'lastname'));
        }
    }
}
