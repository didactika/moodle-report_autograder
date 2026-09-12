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

namespace report_autograder;

use local_autograder\local\config_repository;
use report_autograder\local\page_context;
use report_autograder\local\scope;

/**
 * The three pages, drawn for real.
 *
 * Rendering is where a report plugin actually breaks — an undefined function,
 * a template variable that was never passed, an admin page that collides with
 * the one core makes for you. None of that shows up in a query test, so these
 * build each page's templates and look at what comes out.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\page_context
 */
final class page_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass An autograded assignment. */
    private \stdClass $cm;

    /**
     * A course with one autograded activity and one student.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();
        $teacher = $generator->create_and_enrol($this->course, 'editingteacher');
        $generator->create_and_enrol($this->course, 'student');

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
    }

    /**
     * Each level draws its filter bar and its table, and PHP has nothing to
     * say while it happens.
     *
     * @param string $level
     * @dataProvider level_provider
     */
    public function test_each_level_renders(string $level): void {
        global $OUTPUT, $PAGE;

        $scope = $this->scope_for($level);
        $PAGE->set_url('/report/autograder/index.php');
        $PAGE->set_context($scope->context());

        $filters = $OUTPUT->render_from_template(
            'report_autograder/partials/filters',
            page_context::filters($scope)
        );
        $table = $OUTPUT->render_from_template(
            'report_autograder/report_table',
            page_context::table($scope, null)
        );

        $this->assertStringContainsString('autograder-filter-form', $filters);
        $this->assertStringContainsString('autograder-report-container', $table);
        $this->assert_no_complaints($filters . $table);
    }

    /**
     * The three levels a report can be drawn at.
     *
     * @return array<string, array{string}>
     */
    public static function level_provider(): array {
        return [
            'activity' => [scope::LEVEL_ACTIVITY],
            'course' => [scope::LEVEL_COURSE],
            'site' => [scope::LEVEL_SITE],
        ];
    }

    /**
     * A row's course and activity are named only where the table holds more
     * than one of them.
     */
    public function test_the_extra_columns_appear_only_where_they_mean_something(): void {
        $activity = page_context::table($this->scope_for(scope::LEVEL_ACTIVITY), null);
        $course = page_context::table($this->scope_for(scope::LEVEL_COURSE), null);
        $site = page_context::table($this->scope_for(scope::LEVEL_SITE), null);

        $this->assertFalse($activity['shows_activity_column']);
        $this->assertFalse($activity['shows_course_column']);

        $this->assertTrue($course['shows_activity_column']);
        $this->assertFalse($course['shows_course_column']);

        $this->assertTrue($site['shows_activity_column']);
        $this->assertTrue($site['shows_course_column']);
    }

    /**
     * The status filter offers "Failed" only to somebody who could tell a
     * failure apart if they picked it.
     */
    public function test_the_failed_filter_is_offered_only_with_the_capability(): void {
        $scope = $this->scope_for(scope::LEVEL_COURSE);

        $this->assertTrue($this->offers_failed(page_context::filters($scope)));

        // A teacher, who does not hold report/autograder:viewfailed.
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->setUser($teacher);

        $this->assertFalse($this->offers_failed(page_context::filters($scope)));
    }

    /**
     * The activity filter lists the autograded activities, and drops one whose
     * autograder has been switched off.
     */
    public function test_the_activity_filter_lists_what_is_autograded(): void {
        $scope = $this->scope_for(scope::LEVEL_COURSE);
        $context = page_context::filters($scope);

        $this->assertCount(1, $context['activities']);
        $this->assertEquals((int) $this->cm->id, $context['activities'][0]['id']);

        config_repository::upsert_for_cm(
            (int) $this->cm->id,
            (int) $this->course->id,
            false,
            'point',
            70.0,
            null,
            0,
            2
        );

        $this->assertSame([], page_context::filters($scope)['activities']);
    }

    /**
     * Whether the filter bar offers the "failed" status.
     *
     * @param array $context From page_context::filters().
     * @return bool
     */
    private function offers_failed(array $context): bool {
        foreach ($context['statuses'] as $status) {
            if ($status['key'] === local\status::FAILED) {
                return true;
            }
        }

        return false;
    }

    /**
     * The scope object for one level.
     *
     * @param string $level
     * @return scope
     */
    private function scope_for(string $level): scope {
        switch ($level) {
            case scope::LEVEL_ACTIVITY:
                return scope::from_params((int) $this->cm->id, 0);

            case scope::LEVEL_COURSE:
                return scope::from_params(0, (int) $this->course->id);

            default:
                return scope::from_params(0, 0);
        }
    }

    /**
     * Fails if PHP complained anywhere in the rendered output.
     *
     * @param string $html
     */
    private function assert_no_complaints(string $html): void {
        $matches = [];
        preg_match_all(
            '/.{0,80}(Warning|Notice|Undefined|Deprecated|Fatal).{0,80}/',
            strip_tags($html),
            $matches
        );

        $this->assertEmpty(
            $matches[0] ?? [],
            'PHP complained while the page was drawn: ' . implode(' | ', array_unique($matches[0] ?? []))
        );
    }
}
