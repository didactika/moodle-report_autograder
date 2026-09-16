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
use local_autograder\local\decision\decision_repository;
use report_autograder\local\format\row_formatter;
use report_autograder\local\format\status;
use report_autograder\local\query\filters;
use report_autograder\local\query\report_query;
use report_autograder\local\query\scope;

/**
 * Who a waiting row is going to be graded as.
 *
 * A grade autograder posts is posted in a teacher's name, and until it happens
 * nothing in Moodle says whose. These tests are about the report answering that
 * before the fact — and about it saying so plainly when the answer is nobody,
 * which is a row heading for a failure that can still be fixed.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\format\row_formatter
 */
final class prospective_grader_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass An autograded assignment. */
    private \stdClass $cm;

    /** @var \stdClass The student waiting to be graded. */
    private \stdClass $student;

    /**
     * A course with an autograded assignment and a student waiting on it.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();
        $this->student = $generator->create_and_enrol($this->course, 'student');

        $assign = $generator->create_module('assign', [
            'course' => $this->course->id,
            'grade' => 100,
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
            2
        );
    }

    /**
     * A waiting row names the teacher whose grade it is going to be.
     */
    public function test_a_waiting_row_names_the_teacher_it_will_be_graded_as(): void {
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->decide_pending();

        $row = $this->formatted_row();

        $this->assertSame(fullname($teacher), $row['will_grade']);
        $this->assertArrayNotHasKey('graded_by', $row, 'Nobody has graded it yet.');
        $this->assertArrayNotHasKey('will_grade_problem', $row);
    }

    /**
     * With nobody eligible the row says so, rather than leaving the column
     * empty and the teacher none the wiser.
     */
    public function test_a_row_nobody_can_grade_says_so(): void {
        $this->decide_pending();

        $row = $this->formatted_row();

        $this->assertArrayNotHasKey('will_grade', $row);
        $this->assertSame(get_string('willgrade:nobody', 'report_autograder'), $row['will_grade_problem']);
    }

    /**
     * Once a grade is in the gradebook the column is about who put it there,
     * not about who was going to.
     */
    public function test_a_graded_row_names_who_graded_it(): void {
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->decide_pending();

        $item = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => 'assign',
            'iteminstance' => $this->cm->instance,
            'courseid' => $this->course->id,
            'itemnumber' => 0,
        ]);
        $item->update_final_grade(
            (int) $this->student->id,
            70.0,
            'test',
            null,
            FORMAT_MOODLE,
            (int) $teacher->id
        );

        $row = $this->formatted_row();

        $this->assertSame(fullname($teacher), $row['graded_by']);
        $this->assertArrayNotHasKey('will_grade', $row);
        $this->assertArrayNotHasKey('will_grade_problem', $row);
    }

    /**
     * A student nothing is waiting on is not promised a grader either: there is
     * no date, no grade and nobody to name.
     */
    public function test_a_row_with_no_decision_names_nobody(): void {
        $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');

        $row = $this->formatted_row();

        $this->assertSame(status::NOT_ENGAGED, $row['status_key']);
        $this->assertArrayNotHasKey('will_grade', $row);
        $this->assertArrayNotHasKey('will_grade_problem', $row);
    }

    /**
     * The one row the report holds, formatted.
     *
     * @return array<string, mixed>
     */
    private function formatted_row(): array {
        $scope = scope::from_params((int) $this->cm->id, 0);
        $rows = report_query::rows($scope, filters::from_request([], true), '', 'asc', 0, 0);
        $formatted = row_formatter::format_all($rows, $scope);

        $this->assertCount(1, $formatted);

        return $formatted[0];
    }

    /**
     * The report names the same validated fallback as the grading worker.
     */
    public function test_pending_row_includes_the_validated_fallback(): void {
        $fallback = $this->getDataGenerator()->create_and_enrol($this->course, 'teacher');
        set_config('teacher_roles', 'editingteacher', 'local_autograder');
        set_config('fallback_grader', $fallback->id, 'local_autograder');
        $this->decide_pending();
        $this->assertSame(fullname($fallback), $this->formatted_row()['will_grade']);
    }

    /**
     * A gradebook record without a grade is not evidence that someone graded.
     */
    public function test_empty_gradebook_record_does_not_hide_the_planned_teacher(): void {
        global $DB;
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        set_config('teacher_roles', 'editingteacher', 'local_autograder');
        $item = $DB->get_record('grade_items', ['itemmodule' => 'assign', 'iteminstance' => $this->cm->instance]);
        $DB->insert_record('grade_grades', (object) [
            'itemid' => $item->id, 'userid' => $this->student->id,
            'usermodified' => get_admin()->id, 'finalgrade' => null,
        ]);
        $this->decide_pending();
        $row = $this->formatted_row();
        $this->assertArrayNotHasKey('graded_by', $row);
        $this->assertSame(fullname($teacher), $row['will_grade']);
    }

    /**
     * Puts the student's decision in the waiting state, due tomorrow.
     */
    private function decide_pending(): void {
        global $DB;

        $when = time() + DAYSECS;
        $DB->insert_record('local_autograder_decision', (object) [
            'cmid' => (int) $this->cm->id,
            'courseid' => (int) $this->course->id,
            'userid' => (int) $this->student->id,
            'status' => decision_repository::STATUS_PENDING,
            'baselineduedate' => $when - DAYSECS,
            'duedatereason' => 'submission',
            'scheduledgradetime' => $when,
            'graderid' => null,
            'gradedvalue' => null,
            'failurereason' => null,
            'timecreated' => $when - DAYSECS,
            'timemodified' => $when,
        ]);
    }
}
