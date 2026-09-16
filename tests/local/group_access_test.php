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
use report_autograder\local\format\row_formatter;
use report_autograder\local\groups\group_access;
use report_autograder\local\groups\group_names;
use report_autograder\local\query\filters;
use report_autograder\local\query\report_query;
use report_autograder\local\query\scope;

/**
 * What the report shows of an activity that separates its students by group.
 *
 * The rule being tested is not this plugin's: an activity set to separate
 * groups only lets a teacher see their own groups, and the report may not show
 * more than the activity does. So these tests set the same things a course
 * actually sets — a group mode, a grouping, the accessallgroups capability —
 * and check the report against what Moodle would have shown.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\groups\group_access
 * @covers      \report_autograder\local\groups\group_names
 */
final class group_access_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass An autograded activity that separates its groups. */
    private \stdClass $cm;

    /** @var \stdClass Group A, the one the teacher is in. */
    private \stdClass $groupa;

    /** @var \stdClass Group B, the one they are not. */
    private \stdClass $groupb;

    /** @var \stdClass A teacher of group A. */
    private \stdClass $teacher;

    /** @var \stdClass[] Students, by label. */
    private array $students = [];

    /**
     * A course with two groups, a student in each and one in neither, and an
     * autograded activity set to separate groups.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();

        $this->groupa = $generator->create_group(['courseid' => $this->course->id, 'name' => 'Group A']);
        $this->groupb = $generator->create_group(['courseid' => $this->course->id, 'name' => 'Group B']);

        $this->teacher = $generator->create_and_enrol($this->course, 'editingteacher');
        $this->students['ana'] = $generator->create_and_enrol(
            $this->course,
            'student',
            ['firstname' => 'Ana', 'lastname' => 'Lopez']
        );
        $this->students['bruno'] = $generator->create_and_enrol(
            $this->course,
            'student',
            ['firstname' => 'Bruno', 'lastname' => 'Marti']
        );
        $this->students['carla'] = $generator->create_and_enrol(
            $this->course,
            'student',
            ['firstname' => 'Carla', 'lastname' => 'Nunez']
        );

        $this->add_to_group($this->groupa, $this->teacher);
        $this->add_to_group($this->groupa, $this->students['ana']);
        $this->add_to_group($this->groupb, $this->students['bruno']);

        $this->cm = $this->autograded_activity('Essay', SEPARATEGROUPS);
    }

    /**
     * An activity that does not use groups says nothing about them: no picker
     * in the bar, no column in the table, nobody hidden.
     */
    public function test_an_activity_without_groups_says_nothing_about_them(): void {
        $cm = $this->autograded_activity('No groups here', NOGROUPS);
        $access = group_access::for_scope(scope::from_params((int) $cm->id, 0));

        $this->assertFalse($access->shows_picker());
        $this->assertFalse($access->shows_column());
        $this->assertSame([], $access->restrictions());
    }

    /**
     * Switching separate groups on is what the filter waits for: the bar gets
     * a group picker and the table a group column.
     */
    public function test_separate_groups_puts_the_filter_in_the_bar(): void {
        $access = group_access::for_scope(scope::from_params((int) $this->cm->id, 0));

        $this->assertTrue($access->shows_picker(), 'An activity that separates groups must offer the filter.');
        $this->assertTrue($access->shows_column());
        $this->assertSame(
            ['Group A', 'Group B'],
            array_column($access->picker_options(), 'name')
        );
    }

    /**
     * Somebody who may see every group is offered every group, and the choice
     * of not choosing.
     */
    public function test_seeing_every_group_is_offered_all_of_them(): void {
        $access = group_access::for_scope(scope::from_params((int) $this->cm->id, 0));

        $this->assertTrue($access->offers_all_groups());
        $this->assertSame(0, $access->opening_choice(), 'Nothing has been chosen yet, so: all of them.');
        $this->assertSame([], $access->restrictions(), 'Nobody is hidden from them.');
    }

    /**
     * A teacher who may not see every group is offered only their own, and the
     * report opens on it — there is no "all groups" for them to open on.
     */
    public function test_a_teacher_of_one_group_is_offered_only_that_group(): void {
        $this->become_a_teacher_of_one_group();

        $access = group_access::for_scope(scope::from_params((int) $this->cm->id, 0));

        $this->assertSame(['Group A'], array_column($access->picker_options(), 'name'));
        $this->assertFalse($access->offers_all_groups());
        $this->assertSame((int) $this->groupa->id, $access->opening_choice());
        $this->assertSame(
            [(int) $this->cm->id => [(int) $this->groupa->id]],
            $access->restrictions()
        );
    }

    /**
     * And the table holds their students only. This is the whole point of the
     * exercise: the other group's students are not theirs to see.
     */
    public function test_the_table_holds_only_the_students_of_the_visible_groups(): void {
        $this->become_a_teacher_of_one_group();

        $scope = scope::from_params((int) $this->cm->id, 0);
        $rows = report_query::rows($scope, $this->no_filters(), report_query::SORT_NAME, 'asc', 0, 0);

        $this->assertSame(1, report_query::count($scope, $this->no_filters()));
        $this->assertSame(['Lopez'], array_column(array_values($rows), 'lastname'));
    }

    /**
     * A teacher in none of the groups of a separate-groups activity sees no
     * students in it, which is what the activity itself shows them.
     */
    public function test_a_teacher_in_no_group_sees_no_students(): void {
        $outsider = $this->getDataGenerator()->create_and_enrol($this->course, 'editingteacher');
        $this->prevent_access_all_groups();
        $this->setUser($outsider);

        $scope = scope::from_params((int) $this->cm->id, 0);
        $access = group_access::for_scope($scope);

        $this->assertSame([(int) $this->cm->id => []], $access->restrictions());
        $this->assertSame(0, report_query::count($scope, $this->no_filters()));
    }

    /**
     * Visible groups hide nobody: the groups are shown as a label, and every
     * student is still listed.
     */
    public function test_visible_groups_label_the_rows_without_hiding_any(): void {
        $cm = $this->autograded_activity('Everyone visible', VISIBLEGROUPS);
        $this->become_a_teacher_of_one_group();

        $scope = scope::from_params((int) $cm->id, 0);
        $access = group_access::for_scope($scope);

        $this->assertSame([], $access->restrictions());
        $this->assertTrue($access->shows_column());
        $this->assertTrue($access->offers_all_groups());
        $this->assertSame(3, report_query::count($scope, $this->no_filters()));
    }

    /**
     * Choosing a group narrows the table to it.
     */
    public function test_choosing_a_group_narrows_the_table(): void {
        $scope = scope::from_params((int) $this->cm->id, 0);
        $rows = report_query::rows($scope, $this->group_filter($this->groupb), '', 'asc', 0, 0);

        $this->assertSame(['Marti'], array_column(array_values($rows), 'lastname'));
    }

    /**
     * A group the page never offered does nothing, whatever the request says.
     */
    public function test_a_group_of_another_course_is_ignored(): void {
        $elsewhere = $this->getDataGenerator()->create_group([
            'courseid' => $this->getDataGenerator()->create_course()->id,
        ]);
        $scope = scope::from_params((int) $this->cm->id, 0);

        $this->assertSame(3, report_query::count($scope, $this->group_filter($elsewhere)));
    }

    /**
     * An activity limited to a grouping only knows about the groups in it.
     */
    public function test_a_grouping_leaves_out_the_groups_it_does_not_hold(): void {
        $grouping = $this->getDataGenerator()->create_grouping(['courseid' => $this->course->id]);
        groups_assign_grouping((int) $grouping->id, (int) $this->groupa->id);
        $this->limit_to_grouping($this->cm, $grouping);

        $access = group_access::for_scope(scope::from_params((int) $this->cm->id, 0));

        $this->assertSame(['Group A'], array_column($access->picker_options(), 'name'));
    }

    /**
     * Each activity is judged by its own group mode. A course report holding
     * one activity that separates groups and one that does not must hide the
     * other group's students in the first and list them in the second.
     */
    public function test_a_course_report_judges_each_activity_by_its_own_mode(): void {
        $this->autograded_activity('Open to all', NOGROUPS);
        $this->become_a_teacher_of_one_group();

        $scope = scope::from_params(0, (int) $this->course->id);

        // One student of group A in the activity that separates them, and all
        // three in the one that does not.
        $this->assertSame(4, report_query::count($scope, $this->no_filters()));
    }

    /**
     * The site report offers no group picker — a group belongs to one course,
     * so a list of them across every course would be a list of names with
     * nothing in common — but it still hides what it must.
     */
    public function test_the_site_report_has_no_picker_and_still_hides(): void {
        $this->become_a_teacher_of_one_group();

        $scope = scope::from_params(0, 0);
        $access = group_access::for_scope($scope);

        $this->assertFalse($access->shows_picker());
        $this->assertSame([(int) $this->cm->id => [(int) $this->groupa->id]], $access->restrictions());
        $this->assertSame(1, report_query::count($scope, $this->no_filters()));
    }

    /**
     * The column names the groups the student is in — and only the ones the
     * viewer may know about.
     */
    public function test_the_column_names_the_students_groups(): void {
        $this->add_to_group($this->groupb, $this->students['ana']);

        $scope = scope::from_params((int) $this->cm->id, 0);
        $rows = report_query::rows($scope, $this->no_filters(), report_query::SORT_NAME, 'asc', 0, 0);
        $formatted = row_formatter::format_all($rows, $scope);

        $this->assertSame('Group A, Group B', $formatted[0]['groups'], 'Ana is in both.');
        $this->assertSame('Group B', $formatted[1]['groups']);
        $this->assertArrayNotHasKey('groups', $formatted[2], 'Carla is in no group.');
        $this->assertTrue($formatted[2]['shows_groups'], 'The cell is still drawn, so the row lines up.');
    }

    /**
     * A teacher of one group is not told which other groups their students are
     * also in: that is exactly what separate groups means.
     */
    public function test_the_column_does_not_name_groups_the_viewer_cannot_see(): void {
        $this->add_to_group($this->groupb, $this->students['ana']);
        $this->become_a_teacher_of_one_group();

        $scope = scope::from_params((int) $this->cm->id, 0);
        $rows = report_query::rows($scope, $this->no_filters(), report_query::SORT_NAME, 'asc', 0, 0);
        $formatted = row_formatter::format_all($rows, $scope);

        $this->assertCount(1, $formatted);
        $this->assertSame('Group A', $formatted[0]['groups']);
    }

    /**
     * An activity with no group mode gets no group column, so its rows carry
     * no groups even for a student who is in one.
     */
    public function test_an_activity_without_groups_names_none(): void {
        $cm = $this->autograded_activity('No groups here', NOGROUPS);
        $scope = scope::from_params((int) $cm->id, 0);
        $rows = report_query::rows($scope, $this->no_filters(), report_query::SORT_NAME, 'asc', 0, 0);
        $formatted = row_formatter::format_all($rows, $scope);

        $this->assertFalse($formatted[0]['shows_groups']);
        $this->assertArrayNotHasKey('groups', $formatted[0]);
    }

    /**
     * A system grant does not override a prohibition on one activity.
     */
    public function test_site_report_honours_module_group_prohibition(): void {
        global $DB;
        $roleid = (int) $DB->get_field('role', 'id', ['shortname' => 'editingteacher'], MUST_EXIST);
        role_assign($roleid, $this->teacher->id, \context_system::instance()->id);
        assign_capability(
            'moodle/site:accessallgroups',
            CAP_PROHIBIT,
            $roleid,
            \context_module::instance($this->cm->id)->id
        );
        accesslib_clear_all_caches_for_unit_testing();
        $this->setUser($this->teacher);
        $this->assertTrue(has_capability('moodle/site:accessallgroups', \context_system::instance()));
        $access = group_access::for_scope(scope::from_params(0, 0));
        $this->assertNotEmpty($access->restrictions());
    }

    /**
     * An activity filter must not silently discard the course's group filter.
     */
    public function test_course_group_filter_survives_activity_narrowing(): void {
        $grouping = $this->getDataGenerator()->create_grouping(['courseid' => $this->course->id]);
        groups_assign_grouping($grouping->id, $this->groupa->id);
        $this->limit_to_grouping($this->cm, $grouping);
        $filters = filters::from_request([
            ['name' => 'cmid', 'value' => (string) $this->cm->id],
            ['name' => 'groupid', 'value' => (string) $this->groupb->id],
        ], true);
        $scope = scope::from_params(0, (int) $this->course->id);
        $rows = report_query::rows($scope, $filters, '', 'asc', 0, 25);
        $this->assertSame(1, report_query::count($scope, $filters));
        $this->assertSame([(int) $this->students['bruno']->id], array_map(
            'intval',
            array_column($rows, 'userid')
        ));
    }

    /**
     * Becomes a teacher who may only see their own groups — the configuration
     * a course that means to separate its groups actually has.
     */
    private function become_a_teacher_of_one_group(): void {
        $this->prevent_access_all_groups();
        $this->setUser($this->teacher);
    }

    /**
     * Takes `moodle/site:accessallgroups` away from teachers of this course.
     */
    private function prevent_access_all_groups(): void {
        global $DB;

        $roleid = (int) $DB->get_field('role', 'id', ['shortname' => 'editingteacher'], MUST_EXIST);
        assign_capability(
            'moodle/site:accessallgroups',
            CAP_PREVENT,
            $roleid,
            \context_course::instance($this->course->id)->id,
            true
        );
        accesslib_clear_all_caches_for_unit_testing();
    }

    /**
     * Puts a user in a group.
     *
     * @param \stdClass $group
     * @param \stdClass $user
     */
    private function add_to_group(\stdClass $group, \stdClass $user): void {
        $this->getDataGenerator()->create_group_member([
            'groupid' => $group->id,
            'userid' => $user->id,
        ]);
    }

    /**
     * Limits an activity to one grouping, the way its settings form would.
     *
     * @param \stdClass $cm
     * @param \stdClass $grouping
     */
    private function limit_to_grouping(\stdClass $cm, \stdClass $grouping): void {
        global $DB;

        $DB->set_field('course_modules', 'groupingid', (int) $grouping->id, ['id' => (int) $cm->id]);
        rebuild_course_cache((int) $this->course->id, true);
    }

    /**
     * An autograded assignment with a group mode of its own.
     *
     * @param string $name
     * @param int $groupmode One of NOGROUPS, SEPARATEGROUPS, VISIBLEGROUPS.
     * @return \stdClass The course module.
     */
    private function autograded_activity(string $name, int $groupmode): \stdClass {
        $assign = $this->getDataGenerator()->create_module('assign', [
            'course' => $this->course->id,
            'name' => $name,
            'grade' => 100,
            'groupmode' => $groupmode,
        ]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $cm->id,
            (int) $this->course->id,
            true,
            'point',
            70.0,
            null,
            DAYSECS,
            (int) $this->teacher->id
        );

        return $cm;
    }

    /**
     * No filter at all.
     *
     * @return filters
     */
    private function no_filters(): filters {
        return filters::from_request([], true);
    }

    /**
     * A request asking for one group.
     *
     * @param \stdClass $group
     * @return filters
     */
    private function group_filter(\stdClass $group): filters {
        return filters::from_request(
            [['name' => 'groupid', 'value' => (string) $group->id]],
            true
        );
    }
}
