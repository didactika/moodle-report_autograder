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

use local_autograder\local\config_repository;
use local_autograder\local\decision_repository;

/**
 * The strip of counts above the course and site reports.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\summary
 */
final class summary_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass An autograded assignment. */
    private \stdClass $cm;

    /** @var \stdClass[] The students, by label. */
    private array $students = [];

    /**
     * A course with one autograded activity and four students, one in each of
     * the states the summary counts.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();
        $teacher = $generator->create_and_enrol($this->course, 'editingteacher');

        foreach (['pending', 'graded', 'manual', 'failed', 'idle'] as $label) {
            $this->students[$label] = $generator->create_and_enrol($this->course, 'student');
        }

        $assign = $generator->create_module('assign', ['course' => $this->course->id, 'grade' => 100]);
        $this->cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $this->cm->id,
            (int) $this->course->id,
            true,
            'point',
            70.0,
            null,
            DAYSECS,
            (int) $teacher->id
        );

        $this->decide('pending', decision_repository::STATUS_PENDING);
        $this->decide('graded', decision_repository::STATUS_GRADED);
        $this->decide('manual', decision_repository::STATUS_MANUAL);
        $this->decide('failed', decision_repository::STATUS_FAILED);
        // The fifth student is left without a decision on purpose.
    }

    /**
     * Every student lands in exactly one tile, so the tiles add up to the
     * table they link into.
     */
    public function test_the_tiles_add_up_to_the_table(): void {
        $scope = scope::from_params(0, (int) $this->course->id);
        $summary = summary::for_scope($scope);

        $this->assertTrue($summary['show']);
        $this->assertSame(
            report_query::count($scope, filters::from_request([], true)),
            $summary['total']
        );
        $this->assertSame(5, $summary['total']);
    }

    /**
     * Each state is counted where it belongs.
     */
    public function test_each_state_is_counted_where_it_belongs(): void {
        $counts = $this->counts(scope::from_params(0, (int) $this->course->id));

        $this->assertSame(1, $counts[status::PENDING]);
        $this->assertSame(1, $counts[status::GRADED]);
        $this->assertSame(1, $counts[status::MANUAL]);
        $this->assertSame(1, $counts[status::FAILED]);
        $this->assertSame(1, $counts[status::NOT_ENGAGED]);
        $this->assertSame(0, $counts[status::NOT_AUTOGRADED]);
    }

    /**
     * Without the capability there is no "failed" tile, and the row it would
     * have counted is still counted — under what such a viewer is told
     * everywhere else.
     */
    public function test_failures_fold_away_for_a_viewer_who_may_not_see_them(): void {
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->setUser($teacher);

        $scope = scope::from_params(0, (int) $this->course->id);
        $summary = summary::for_scope($scope);
        $counts = $this->counts($scope);

        $this->assertArrayNotHasKey(status::FAILED, $counts);
        $this->assertSame(1, $counts[status::NOT_AUTOGRADED]);
        $this->assertSame(
            5,
            $summary['total'],
            'The same students are counted; only how they are grouped changes.'
        );
    }

    /**
     * One activity's table is short enough to be its own summary, so it does
     * not get one.
     */
    public function test_an_activity_report_has_no_summary(): void {
        $summary = summary::for_scope(scope::from_params((int) $this->cm->id, 0));

        $this->assertFalse($summary['show']);
        $this->assertSame([], $summary['tiles']);
    }

    /**
     * A tile that would show nothing says so rather than disappearing: "no
     * failures" is worth reading.
     */
    public function test_an_empty_tile_is_shown_as_empty(): void {
        $counts = $this->counts(scope::from_params(0, (int) $this->course->id));
        $this->assertSame(0, $counts[status::NOT_AUTOGRADED]);

        $summary = summary::for_scope(scope::from_params(0, (int) $this->course->id));

        foreach ($summary['tiles'] as $tile) {
            if ($tile['key'] === status::NOT_AUTOGRADED) {
                $this->assertTrue($tile['empty']);

                return;
            }
        }

        $this->fail('The tile was dropped instead of being shown as empty.');
    }

    /**
     * Each tile links into the table already filtered by its own state.
     */
    public function test_each_tile_links_into_its_own_rows(): void {
        $summary = summary::for_scope(scope::from_params(0, (int) $this->course->id));

        foreach ($summary['tiles'] as $tile) {
            $this->assertStringContainsString('status=' . $tile['key'], $tile['url']);
            $this->assertStringContainsString('courseid=' . $this->course->id, $tile['url']);
        }
    }

    /**
     * The tile counts, keyed by state.
     *
     * @param scope $scope
     * @return array<string, int>
     */
    private function counts(scope $scope): array {
        $counts = [];

        foreach (summary::for_scope($scope)['tiles'] as $tile) {
            $counts[$tile['key']] = $tile['count'];
        }

        return $counts;
    }

    /**
     * Puts one student's decision in a given state.
     *
     * @param string $label Which of the students.
     * @param string $status
     */
    private function decide(string $label, string $status): void {
        global $DB;

        $now = time();
        $DB->insert_record('local_autograder_decision', (object) [
            'cmid' => (int) $this->cm->id,
            'courseid' => (int) $this->course->id,
            'userid' => (int) $this->students[$label]->id,
            'status' => $status,
            'baselineduedate' => $now,
            'duedatereason' => 'submission',
            'scheduledgradetime' => $now + DAYSECS,
            'timecreated' => $now,
            'timemodified' => $now,
        ]);
    }
}
