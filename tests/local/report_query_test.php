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
 * The one query behind the three reports.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\report_query
 */
final class report_query_test extends \advanced_testcase {
    /** @var \stdClass First course. */
    private \stdClass $course;

    /** @var \stdClass A second course, so scoping is actually tested. */
    private \stdClass $othercourse;

    /** @var \stdClass An autograded assignment in the first course. */
    private \stdClass $cm;

    /** @var \stdClass A second autograded activity in the first course. */
    private \stdClass $othercm;

    /** @var \stdClass An autograded activity in the second course. */
    private \stdClass $faraway;

    /** @var \stdClass The teacher. */
    private \stdClass $teacher;

    /** @var \stdClass[] Students of the first course, by label. */
    private array $students = [];

    /**
     * Two courses, three autograded activities, three students in the first
     * course and one in the second.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();

        $this->course = $generator->create_course(['fullname' => 'First course']);
        $this->othercourse = $generator->create_course(['fullname' => 'Second course']);

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

        $generator->create_and_enrol($this->othercourse, 'student');

        $this->cm = $this->autograded_activity($this->course, 'Essay');
        $this->othercm = $this->autograded_activity($this->course, 'Report');
        $this->faraway = $this->autograded_activity($this->othercourse, 'Elsewhere');
    }

    /**
     * The activity report is about one activity and every student in it,
     * including the ones who have not done anything yet.
     */
    public function test_the_activity_report_lists_every_gradable_student(): void {
        $scope = scope::from_params((int) $this->cm->id, 0);

        $this->assertSame(3, report_query::count($scope, $this->no_filters()));

        $rows = report_query::rows($scope, $this->no_filters(), report_query::SORT_NAME, 'asc', 0, 0);
        $names = array_map(function ($row) {
            return $row->lastname;
        }, array_values($rows));

        $this->assertSame(['Lopez', 'Marti', 'Nunez'], $names);
    }

    /**
     * The teacher is not one of the people being graded.
     */
    public function test_the_teacher_is_not_a_row(): void {
        $rows = report_query::rows(
            scope::from_params((int) $this->cm->id, 0),
            $this->no_filters(),
            '',
            'asc',
            0,
            0
        );

        foreach ($rows as $row) {
            $this->assertNotEquals($this->teacher->id, (int) $row->userid);
        }
    }

    /**
     * The course report reaches every autograded activity of that course, and
     * stops there.
     */
    public function test_the_course_report_covers_the_courses_activities(): void {
        $scope = scope::from_params(0, (int) $this->course->id);

        // Three students on two activities.
        $this->assertSame(6, report_query::count($scope, $this->no_filters()));

        $rows = report_query::rows($scope, $this->no_filters(), '', 'asc', 0, 0);
        $cmids = array_unique(array_map(function ($row) {
            return (int) $row->cmid;
        }, array_values($rows)));
        sort($cmids);

        $expected = [(int) $this->cm->id, (int) $this->othercm->id];
        sort($expected);
        $this->assertSame($expected, $cmids);
    }

    /**
     * The site report reaches across courses.
     */
    public function test_the_site_report_covers_every_course(): void {
        $scope = scope::from_params(0, 0);

        // Six from the first course, one from the second.
        $this->assertSame(7, report_query::count($scope, $this->no_filters()));
    }

    /**
     * An activity with autograder switched off is not in any of them: the
     * report is about what autograder is doing, and there it is doing nothing.
     */
    public function test_a_disabled_activity_is_left_out(): void {
        config_repository::upsert_for_cm(
            (int) $this->othercm->id,
            (int) $this->course->id,
            false,
            'point',
            70.0,
            null,
            0,
            (int) $this->teacher->id
        );

        $this->assertSame(
            3,
            report_query::count(scope::from_params(0, (int) $this->course->id), $this->no_filters())
        );
    }

    /**
     * A student whose enrolment has not started yet, or has ended, is not
     * somebody autograder will act on — so the report does not promise it
     * will.
     */
    public function test_an_inactive_enrolment_is_left_out(): void {
        global $DB;

        $scope = scope::from_params((int) $this->cm->id, 0);

        $this->set_enrolment_window($this->students['ana'], time() + WEEKSECS, 0);
        $this->assertSame(2, report_query::count($scope, $this->no_filters()));

        $this->set_enrolment_window($this->students['bruno'], 0, time() - DAYSECS);
        $this->assertSame(1, report_query::count($scope, $this->no_filters()));

        $DB->set_field('user_enrolments', 'status', ENROL_USER_SUSPENDED, ['userid' => $this->students['carla']->id]);
        $this->assertSame(0, report_query::count($scope, $this->no_filters()));
    }

    /**
     * A student enrolled twice in the same course is still one student.
     *
     * Manual plus self enrolment is an ordinary thing for a course to have,
     * and joined directly it would list and count that student once per
     * enrolment, on every activity.
     */
    public function test_a_student_enrolled_twice_appears_once(): void {
        global $DB;

        $scope = scope::from_params((int) $this->cm->id, 0);
        $before = report_query::count($scope, $this->no_filters());

        $self = $this->getDataGenerator()->create_and_enrol($this->course, 'student');
        $instance = $DB->get_record(
            'enrol',
            ['courseid' => $this->course->id, 'enrol' => 'self'],
            '*',
            IGNORE_MISSING
        );

        if (!$instance) {
            $plugin = enrol_get_plugin('self');
            $instanceid = $plugin->add_instance($this->course, $plugin->get_instance_defaults());
            $instance = $DB->get_record('enrol', ['id' => $instanceid], '*', MUST_EXIST);
        }

        // Self enrolment is created disabled, and a disabled instance is not
        // an enrolment as far as this report is concerned — so leaving it that
        // way would make this test pass without ever putting the student in
        // twice, which is the whole thing it is here to check.
        $DB->set_field('enrol', 'status', ENROL_INSTANCE_ENABLED, ['id' => $instance->id]);
        $instance->status = ENROL_INSTANCE_ENABLED;

        enrol_get_plugin('self')->enrol_user($instance, (int) $self->id, 5);

        $this->assertSame(
            2,
            $DB->count_records('user_enrolments', ['userid' => $self->id]),
            'The test needs the student genuinely enrolled twice.'
        );
        $this->assertSame(
            2,
            $DB->count_records_sql(
                "SELECT COUNT(1)
                   FROM {user_enrolments} ue
                   JOIN {enrol} e ON e.id = ue.enrolid
                  WHERE ue.userid = :userid AND e.status = :status",
                ['userid' => $self->id, 'status' => ENROL_INSTANCE_ENABLED]
            ),
            'And both of those enrolments have to count, or nothing is being tested.'
        );
        $this->assertSame($before + 1, report_query::count($scope, $this->no_filters()));
    }

    /**
     * A student holding a gradeable role both in the course and above it is
     * still one student.
     */
    public function test_a_student_with_the_role_twice_appears_once(): void {
        $scope = scope::from_params((int) $this->cm->id, 0);
        $before = report_query::count($scope, $this->no_filters());

        // The same role again, at the category the course sits in.
        role_assign(
            5,
            (int) $this->students['ana']->id,
            \context_coursecat::instance((int) $this->course->category)->id
        );

        $this->assertSame($before, report_query::count($scope, $this->no_filters()));

        $rows = report_query::rows($scope, $this->no_filters(), '', 'asc', 0, 0);
        $userids = array_map(function ($row) {
            return (int) $row->userid;
        }, array_values($rows));

        $this->assertSame(count($userids), count(array_unique($userids)));
    }

    /**
     * Each student's decision comes with them, and the ones with none say so.
     */
    public function test_decisions_land_on_the_right_rows(): void {
        $pending = $this->decide($this->cm, $this->students['ana'], decision_repository::STATUS_PENDING);
        $this->decide($this->cm, $this->students['bruno'], decision_repository::STATUS_GRADED);

        $rows = report_query::rows(
            scope::from_params((int) $this->cm->id, 0),
            $this->no_filters(),
            report_query::SORT_NAME,
            'asc',
            0,
            0
        );
        $byuser = [];

        foreach ($rows as $row) {
            $byuser[(int) $row->userid] = $row;
        }

        $this->assertSame(
            decision_repository::STATUS_PENDING,
            $byuser[(int) $this->students['ana']->id]->decisionstatus
        );
        $this->assertEquals(
            $pending->scheduledgradetime,
            $byuser[(int) $this->students['ana']->id]->effectivedate,
            'A row still waiting is dated by when it will be graded.'
        );
        $this->assertSame(
            decision_repository::STATUS_GRADED,
            $byuser[(int) $this->students['bruno']->id]->decisionstatus
        );
        $this->assertNull($byuser[(int) $this->students['carla']->id]->decisionstatus);
        $this->assertNull($byuser[(int) $this->students['carla']->id]->effectivedate);
    }

    /**
     * The status filter asks about the report's own vocabulary, not the
     * decision table's.
     */
    public function test_the_status_filter_narrows_by_what_the_viewer_sees(): void {
        $this->decide($this->cm, $this->students['ana'], decision_repository::STATUS_PENDING);
        $this->decide($this->cm, $this->students['bruno'], decision_repository::STATUS_MANUAL);
        $this->decide($this->cm, $this->students['carla'], decision_repository::STATUS_FAILED);

        $scope = scope::from_params((int) $this->cm->id, 0);

        $this->assertSame(1, report_query::count($scope, $this->filter('status', status::PENDING)));
        $this->assertSame(1, report_query::count($scope, $this->filter('status', status::MANUAL)));
        $this->assertSame(1, report_query::count($scope, $this->filter('status', status::FAILED)));
        $this->assertSame(0, report_query::count($scope, $this->filter('status', status::NOT_ENGAGED)));
        $this->assertSame(
            2,
            report_query::count(
                $scope,
                $this->filter('status', status::PENDING . ',' . status::MANUAL)
            )
        );
    }

    /**
     * Somebody who cannot see failures cannot filter by them either, and a
     * failed row falls under "not autograded" for them.
     */
    public function test_failures_are_only_filterable_by_those_who_may_see_them(): void {
        $this->decide($this->cm, $this->students['ana'], decision_repository::STATUS_FAILED);

        $scope = scope::from_params((int) $this->cm->id, 0);

        $hidden = filters::from_request([['name' => 'status', 'value' => status::FAILED]], false);
        $this->assertSame([], $hidden->statuses(), 'The status is dropped rather than honoured.');

        $this->assertSame(
            1,
            report_query::count($scope, $this->filter('status', status::NOT_AUTOGRADED)),
            'It still shows, as a row that autograder did not grade.'
        );
    }

    /**
     * Searching by name finds each half and the whole.
     *
     * @param string $needle
     * @dataProvider name_search_provider
     */
    public function test_searching_by_name(string $needle): void {
        $this->assertSame(
            1,
            report_query::count(
                scope::from_params((int) $this->cm->id, 0),
                $this->filter('searchname', $needle)
            )
        );
    }

    /**
     * The ways one student can be searched for.
     *
     * @return array<string, array{string}>
     */
    public static function name_search_provider(): array {
        return [
            'first name' => ['Ana'],
            'last name' => ['Lopez'],
            'both' => ['ana lopez'],
            'a fragment' => ['ope'],
            'wrong case' => ['ANA'],
        ];
    }

    /**
     * The date filter works on the date the row actually shows, whichever
     * state it is in.
     */
    public function test_the_date_filter_uses_the_date_the_row_shows(): void {
        $this->decide(
            $this->cm,
            $this->students['ana'],
            decision_repository::STATUS_PENDING,
            strtotime('2030-03-05 10:00')
        );

        $scope = scope::from_params((int) $this->cm->id, 0);

        $this->assertSame(1, report_query::count($scope, $this->filter('grading_date_from', '2030-03-05')));
        $this->assertSame(
            1,
            report_query::count($scope, $this->filter('grading_date_to', '2030-03-05')),
            'A day filter has to include that whole day, not just its first second.'
        );
        $this->assertSame(0, report_query::count($scope, $this->filter('grading_date_from', '2030-03-06')));
        $this->assertSame(0, report_query::count($scope, $this->filter('grading_date_to', '2030-03-04')));
    }

    /**
     * Paging returns each row once and never twice, whatever the sort.
     *
     * @param string $column
     * @dataProvider sort_provider
     */
    public function test_paging_is_stable(string $column): void {
        $scope = scope::from_params(0, (int) $this->course->id);
        $seen = [];

        for ($page = 0; $page < 3; $page++) {
            foreach (report_query::rows($scope, $this->no_filters(), $column, 'asc', $page, 2) as $row) {
                $seen[] = $row->rowkey;
            }
        }

        $this->assertCount(6, $seen);
        $this->assertSame($seen, array_unique($seen), 'A row must not turn up on two pages.');
    }

    /**
     * The orders the table can be put in.
     *
     * @return array<string, array{string}>
     */
    public static function sort_provider(): array {
        return [
            'by name' => [report_query::SORT_NAME],
            'by date' => [report_query::SORT_DATE],
            'unsorted' => [''],
        ];
    }

    /**
     * Rows with no date sort last, so a descending list is not led by the
     * students nothing is known about.
     */
    public function test_rows_without_a_date_sort_last(): void {
        $this->decide($this->cm, $this->students['carla'], decision_repository::STATUS_PENDING);

        foreach (['asc', 'desc'] as $direction) {
            $rows = array_values(report_query::rows(
                scope::from_params((int) $this->cm->id, 0),
                $this->no_filters(),
                report_query::SORT_DATE,
                $direction,
                0,
                0
            ));

            $this->assertEquals(
                $this->students['carla']->id,
                (int) $rows[0]->userid,
                "The only dated row leads, sorting {$direction}."
            );
        }
    }

    /**
     * The gradebook grade travels with the row.
     */
    public function test_the_gradebook_grade_comes_along(): void {
        $item = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => 'assign',
            'iteminstance' => $this->cm->instance,
            'courseid' => $this->course->id,
            'itemnumber' => 0,
        ]);
        $item->update_final_grade((int) $this->students['ana']->id, 61.0, 'test');

        $rows = report_query::rows(
            scope::from_params((int) $this->cm->id, 0),
            $this->filter('searchname', 'Ana'),
            '',
            'asc',
            0,
            0
        );
        $row = reset($rows);

        $this->assertEquals(61.0, (float) $row->finalgrade);
    }

    /**
     * An assignment with autograder switched on.
     *
     * @param \stdClass $course
     * @param string $name
     * @return \stdClass The course module.
     */
    private function autograded_activity(\stdClass $course, string $name): \stdClass {
        $assign = $this->getDataGenerator()->create_module('assign', [
            'course' => $course->id,
            'name' => $name,
            'grade' => 100,
        ]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $cm->id,
            (int) $course->id,
            true,
            'point',
            70.0,
            null,
            DAYSECS,
            2
        );

        return $cm;
    }

    /**
     * Puts a decision in a given state, without going through the machinery
     * that would decide it for itself.
     *
     * @param \stdClass $cm
     * @param \stdClass $user
     * @param string $status
     * @param int|null $when The moment the row is about.
     * @return \stdClass
     */
    private function decide(\stdClass $cm, \stdClass $user, string $status, ?int $when = null): \stdClass {
        global $DB;

        $when = $when ?? (time() + DAYSECS);
        $decision = (object) [
            'cmid' => (int) $cm->id,
            'courseid' => (int) $cm->course,
            'userid' => (int) $user->id,
            'status' => $status,
            'baselineduedate' => $when - DAYSECS,
            'duedatereason' => 'submission',
            'scheduledgradetime' => $when,
            'graderid' => $status === decision_repository::STATUS_GRADED ? (int) $this->teacher->id : null,
            'gradedvalue' => $status === decision_repository::STATUS_GRADED ? 70.0 : null,
            'failurereason' => $status === decision_repository::STATUS_FAILED ? 'no_grader' : null,
            'timecreated' => $when - DAYSECS,
            'timemodified' => $when,
        ];
        $decision->id = $DB->insert_record('local_autograder_decision', $decision);

        return $decision;
    }

    /**
     * Moves a student's enrolment window.
     *
     * @param \stdClass $user
     * @param int $start
     * @param int $end
     */
    private function set_enrolment_window(\stdClass $user, int $start, int $end): void {
        global $DB;

        $DB->set_field('user_enrolments', 'timestart', $start, ['userid' => $user->id]);
        $DB->set_field('user_enrolments', 'timeend', $end, ['userid' => $user->id]);
    }

    /**
     * Nothing narrowed.
     *
     * @return filters Nothing narrowed.
     */
    private function no_filters(): filters {
        return filters::from_request([], true);
    }

    /**
     * One filter, shaped the way the client sends it.
     *
     * @param string $name
     * @param string $value
     * @return filters One filter, as the client sends it.
     */
    private function filter(string $name, string $value): filters {
        return filters::from_request([['name' => $name, 'value' => $value]], true);
    }
}
