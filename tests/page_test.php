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

use local_autograder\local\config\config_repository;
use report_autograder\local\format\status;
use report_autograder\local\query\filters;
use report_autograder\local\query\scope;
use report_autograder\output\graders_page;
use report_autograder\output\report_page;

/**
 * What the pages give their React components.
 *
 * The components draw the report, so what can break on the server is what they are given: a property that was never filled, a
 * filter that does not reach the component, a text that has no place for its value. These build the properties of each level
 * and look at them.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\output\report_page
 * @covers      \report_autograder\output\graders_page
 * @covers      \report_autograder\local\page\page_context
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
     * Each level gives its component what it needs, and PHP has nothing to say while it happens.
     *
     * @param string $level
     * @dataProvider level_provider
     */
    public function test_each_level_gives_its_properties(string $level): void {
        $props = $this->props($this->scope_for($level));

        $this->assertSame($level, $props->level);
        $this->assertNotEmpty($props->statuses);
        $this->assertSame('', $props->opening->searchname);
        $this->assertSame([], $props->opening->status);
        $this->assertNotEmpty($props->strings['pluginname']);
        $this->assertSame([12, 25, 50, 100], $props->pagesizes);
        $this->assert_no_complaints(report_page::placeholder() . graders_page::placeholder());
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
     * A row's course and activity are named only where the table holds more than one of them.
     */
    public function test_the_extra_columns_appear_only_where_they_mean_something(): void {
        $activity = $this->props($this->scope_for(scope::LEVEL_ACTIVITY))->columns;
        $course = $this->props($this->scope_for(scope::LEVEL_COURSE))->columns;
        $site = $this->props($this->scope_for(scope::LEVEL_SITE))->columns;

        $this->assertFalse($activity->activity);
        $this->assertFalse($activity->course);

        $this->assertTrue($course->activity);
        $this->assertFalse($course->course);

        $this->assertTrue($site->activity);
        $this->assertTrue($site->course);
    }

    /**
     * The pickers that are offered depend on the level: the course only on the site, the activity above an activity.
     */
    public function test_the_pickers_depend_on_the_level(): void {
        $activity = $this->props($this->scope_for(scope::LEVEL_ACTIVITY));
        $course = $this->props($this->scope_for(scope::LEVEL_COURSE));
        $site = $this->props($this->scope_for(scope::LEVEL_SITE));

        $this->assertFalse($activity->showsactivityfilter);
        $this->assertFalse($activity->showscoursefilter);
        $this->assertTrue($course->showsactivityfilter);
        $this->assertFalse($course->showscoursefilter);
        $this->assertTrue($site->showsactivityfilter);
        $this->assertTrue($site->showscoursefilter);
    }

    /**
     * The failed state is a filter only for whoever may see failures.
     */
    public function test_the_failed_filter_is_offered_only_with_the_capability(): void {
        $scope = $this->scope_for(scope::LEVEL_COURSE);

        $this->assertTrue($this->offers_failed($this->props($scope)));

        // A teacher, who does not hold report/autograder:viewfailed.
        $teacher = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->setUser($teacher);

        $this->assertFalse($this->offers_failed($this->props($scope)));
    }

    /**
     * The activity filter offers what is autograded, and stops offering what is not.
     */
    public function test_the_activity_filter_searches_what_is_autograded(): void {
        $found = \report_autograder\external\search_filter_options::execute(
            'activity',
            '',
            0,
            (int) $this->course->id
        );

        $this->assertCount(1, $found['options']);
        $this->assertEquals((int) $this->cm->id, $found['options'][0]['id']);

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

        $found = \report_autograder\external\search_filter_options::execute(
            'activity',
            '',
            0,
            (int) $this->course->id
        );

        $this->assertSame([], $found['options']);
    }

    /**
     * The activity search matches a name, and nothing else.
     */
    public function test_the_activity_search_matches_a_name(): void {
        $matching = \report_autograder\external\search_filter_options::execute(
            'activity',
            $this->cm->name,
            0,
            (int) $this->course->id
        );

        $this->assertCount(1, $matching['options']);

        $missing = \report_autograder\external\search_filter_options::execute(
            'activity',
            'nothing is called this',
            0,
            (int) $this->course->id
        );

        $this->assertSame([], $missing['options']);
    }

    /**
     * Separate groups give the report a group picker and a group column.
     */
    public function test_separate_groups_give_the_group_picker_and_column(): void {
        $before = $this->props($this->scope_for(scope::LEVEL_ACTIVITY));
        $this->assertFalse($before->showsgroupfilter);
        $this->assertFalse($before->columns->group);

        $this->getDataGenerator()->create_group(['courseid' => $this->course->id, 'name' => 'Group A']);
        $this->set_groupmode(SEPARATEGROUPS);
        rebuild_course_cache((int) $this->course->id, true);
        \cache_helper::purge_all();

        $after = $this->props(scope::from_params((int) $this->cm->id, 0));
        $this->assertTrue($after->showsgroupfilter);
        $this->assertTrue($after->columns->group);
        $this->assertContains('Group A', array_column($after->groups, 'name'));
    }

    /**
     * A link that arrives narrowed opens the report narrowed, with the dates as the date fields write them.
     */
    public function test_the_report_opens_on_what_the_link_asks_for(): void {
        $scope = scope::from_params(0, (int) $this->course->id);
        $opening = filters::from_request([
            ['name' => 'cmid', 'value' => (string) $this->cm->id],
            ['name' => 'searchname', 'value' => 'Lovelace'],
            ['name' => 'status', 'value' => 'pending,graded,nonsense'],
            ['name' => 'grading_date_from', 'value' => '2026-03-05'],
        ], true);

        $props = (new report_page($scope, $opening, null))->get_react_component_props($this->getMockBuilder(\renderer_base::class)
            ->disableOriginalConstructor()->getMock());

        $this->assertSame('Lovelace', $props->opening->searchname);
        $this->assertSame(['pending', 'graded'], $props->opening->status);
        $this->assertSame('2026-03-05', $props->opening->datefrom);
        $this->assertSame((int) $this->cm->id, $props->opening->cmid);
        $this->assertSame((int) $this->cm->id, $props->selectedactivity['id']);
    }

    /**
     * Every text that has a value puts it where the component fills it in: {n} for a single value, {name} for an object.
     */
    public function test_the_texts_mark_the_place_of_their_values(): void {
        $strings = report_page::strings();

        $this->assertStringContainsString('{n}', $strings['error:apirequest']);
        $this->assertStringContainsString('{from}', $strings['pagination:showing']);
        $this->assertStringNotContainsString('$a', implode('', $strings));
    }

    /**
     * The graders page names the course it was asked about and offers the sizes of its pages.
     */
    public function test_the_graders_page_gives_its_properties(): void {
        $props = (new graders_page((int) $this->course->id, true))
            ->get_react_component_props($this->getMockBuilder(\renderer_base::class)->disableOriginalConstructor()->getMock());

        $this->assertSame((int) $this->course->id, $props->courseid);
        $this->assertTrue($props->students);
        $this->assertContains($props->perpage, $props->pagesizes);
    }

    /**
     * The properties of the report at a level, as the page gives them.
     *
     * @param scope $scope
     * @return \stdClass
     */
    private function props(scope $scope): \stdClass {
        $renderer = $this->getMockBuilder(\renderer_base::class)->disableOriginalConstructor()->getMock();
        return (new report_page($scope, filters::from_request([], true), null))->get_react_component_props($renderer);
    }

    /**
     * Whether the failed state is among the statuses that can be filtered by.
     *
     * @param \stdClass $props
     * @return bool
     */
    private function offers_failed(\stdClass $props): bool {
        foreach ($props->statuses as $status) {
            if ($status['key'] === status::FAILED) {
                return true;
            }
        }

        return false;
    }

    /**
     * The scope of a level.
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
     * Give the activity a group mode.
     *
     * @param int $groupmode One of NOGROUPS, SEPARATEGROUPS or VISIBLEGROUPS.
     */
    private function set_groupmode(int $groupmode): void {
        $actions = \core_courseformat\formatactions::cm((int) $this->course->id);
        $actions->set_groupmode((int) $this->cm->id, $groupmode);
    }

    /**
     * Fail when PHP complained while something was drawn.
     *
     * @param string $html What was drawn.
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
