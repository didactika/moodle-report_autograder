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

use local_autograder\local\advanced_grading;
use local_autograder\local\config_repository;
use local_autograder\local\module\module_adapter;

/**
 * The grade a student is going to get, before they have it.
 *
 * The rubric and marking guide cases matter most: the arithmetic is a copy of
 * core's, so the test that earns it is the one that grades a real student
 * through the real grading form and checks the gradebook lands on the same
 * number this predicted.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \report_autograder\local\provisional_grade
 */
final class provisional_grade_test extends \advanced_testcase {
    /** @var \stdClass The course. */
    private \stdClass $course;

    /** @var \stdClass The teacher autograder grades as. */
    private \stdClass $teacher;

    /** @var \stdClass The student. */
    private \stdClass $student;

    /**
     * A course with a teacher and a student.
     */
    protected function setUp(): void {
        parent::setUp();

        $this->resetAfterTest();
        $this->setAdminUser();

        $generator = $this->getDataGenerator();
        $this->course = $generator->create_course();
        $this->teacher = $generator->create_and_enrol($this->course, 'editingteacher');
        $this->student = $generator->create_and_enrol($this->course, 'student');
    }

    /**
     * A point-graded activity promises the number the teacher set.
     */
    public function test_a_point_grade_is_the_number_that_was_configured(): void {
        $cm = $this->point_activity(65.0);
        $result = provisional_grade::for_row($this->row($cm));

        $this->assertNull($result['problem']);
        $this->assertEquals(65.0, $result['value']);
        $this->assertSame('65', $result['display']);
    }

    /**
     * A scale-graded activity names the item rather than numbering it: "Good"
     * tells a teacher something, "2" does not.
     */
    public function test_a_scale_grade_is_shown_by_its_name(): void {
        $cm = $this->scale_activity(['Poor', 'Fair', 'Good'], 3);
        $result = provisional_grade::for_row($this->row($cm));

        $this->assertNull($result['problem']);
        $this->assertSame('Good', $result['display']);
    }

    /**
     * An item beyond the scale the activity now uses cannot be promised.
     */
    public function test_a_scale_item_that_no_longer_exists_is_a_problem(): void {
        $cm = $this->scale_activity(['Poor', 'Fair', 'Good'], 9);
        $result = provisional_grade::for_row($this->row($cm));

        $this->assertNotNull($result['problem']);
        $this->assertNull($result['value']);
    }

    /**
     * With no grade configured there is nothing to promise, and the column
     * says so instead of inventing one.
     */
    public function test_an_unset_grade_is_a_problem_not_a_blank(): void {
        $cm = $this->point_activity(null);
        $result = provisional_grade::for_row($this->row($cm));

        $this->assertNotNull($result['problem']);
        $this->assertNull($result['value']);
    }

    /**
     * The predicted rubric grade is the grade Moodle actually awards.
     *
     * This is what makes copying core's formula safe: if core changes how a
     * rubric turns into a number, these two stop agreeing.
     *
     * @param string $level Which level of each criterion to mark.
     * @dataProvider rubric_level_provider
     */
    public function test_the_predicted_rubric_grade_is_the_one_moodle_awards(string $level): void {
        $cm = $this->rubric_activity();
        $this->choose_levels($cm, $level);

        $predicted = provisional_grade::for_row($this->row($cm));
        $this->assertNull($predicted['problem']);

        // Now let autograder actually grade this student through the real
        // grading form, and read what the gradebook ended up with.
        $config = config_repository::get_for_cm((int) $cm->id);
        $adapter = module_adapter::for_cm($cm, $config);
        $posted = $adapter->write_grade((int) $this->student->id, (int) $this->teacher->id);

        $this->assertEqualsWithDelta(
            $posted,
            $predicted['value'],
            0.001,
            'What the report promised is not what Moodle awarded.'
        );
    }

    /**
     * Which level of each criterion to mark.
     *
     * @return array<string, array{string}>
     */
    public static function rubric_level_provider(): array {
        return [
            'the bottom level' => ['first'],
            'the top level' => ['last'],
        ];
    }

    /**
     * A rubric edited after autograder was configured has no grade to
     * promise, and the column says what to do about it.
     */
    public function test_a_stale_rubric_filling_is_a_problem(): void {
        global $DB;

        $cm = $this->rubric_activity();
        $this->choose_levels($cm, 'first');

        // Point the stored choice at a level that does not exist.
        $config = config_repository::get_for_cm((int) $cm->id);
        $filling = advanced_grading::decode($config->advancedgrading);
        $filling[array_key_first($filling)]['levelid'] = 999999;
        $DB->set_field(
            'local_autograder_config',
            'advancedgrading',
            advanced_grading::encode($filling),
            ['cmid' => $cm->id]
        );

        $result = provisional_grade::for_row($this->row($cm));

        $this->assertNotNull($result['problem']);
        $this->assertNull($result['value']);
    }

    /**
     * An assignment graded out of 100 by points.
     *
     * @param float|null $grade
     * @return \stdClass The course module.
     */
    private function point_activity(?float $grade): \stdClass {
        $assign = $this->getDataGenerator()->create_module('assign', [
            'course' => $this->course->id,
            'grade' => 100,
        ]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $cm->id,
            (int) $this->course->id,
            true,
            'point',
            $grade,
            null,
            0,
            (int) $this->teacher->id
        );

        return $cm;
    }

    /**
     * An assignment graded by a scale.
     *
     * @param string[] $items
     * @param int $chosen The one-based index autograder would award.
     * @return \stdClass The course module.
     */
    private function scale_activity(array $items, int $chosen): \stdClass {
        $scale = $this->getDataGenerator()->create_scale(['scale' => implode(',', $items)]);
        $assign = $this->getDataGenerator()->create_module('assign', [
            'course' => $this->course->id,
            'grade' => -$scale->id,
        ]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);

        config_repository::upsert_for_cm(
            (int) $cm->id,
            (int) $this->course->id,
            true,
            'scale',
            (float) $chosen,
            null,
            0,
            (int) $this->teacher->id
        );

        return $cm;
    }

    /**
     * An assignment graded by a two-criterion rubric.
     *
     * @return \stdClass The course module.
     */
    private function rubric_activity(): \stdClass {
        $generator = $this->getDataGenerator();
        $assign = $generator->create_module('assign', ['course' => $this->course->id, 'grade' => 100]);
        $cm = get_coursemodule_from_instance('assign', $assign->id, $this->course->id, false, MUST_EXIST);
        $context = \context_module::instance((int) $cm->id);

        $generator->get_plugin_generator('core_grading')
            ->create_instance($context, 'mod_assign', 'submissions', 'rubric');
        $generator->get_plugin_generator('gradingform_rubric')
            ->create_instance($context, 'mod_assign', 'submissions', 'Test rubric', 'For autograder', [
                'Argument' => ['Absent' => 0, 'Partial' => 3, 'Present' => 5],
                'Evidence' => ['Absent' => 0, 'Partial' => 2, 'Present' => 4],
            ]);

        return $cm;
    }

    /**
     * Tells autograder which level of each criterion to mark.
     *
     * @param \stdClass $cm
     * @param string $which "first" or "last".
     */
    private function choose_levels(\stdClass $cm, string $which): void {
        $filling = [];

        foreach (advanced_grading::criteria($cm) as $criterionid => $criterion) {
            $levelids = array_keys($criterion['levels']);
            $filling[$criterionid] = [
                'levelid' => (int) ($which === 'first' ? reset($levelids) : end($levelids)),
                'remark' => '',
            ];
        }

        config_repository::upsert_for_cm(
            (int) $cm->id,
            (int) $this->course->id,
            true,
            'rubric',
            null,
            advanced_grading::encode($filling),
            0,
            (int) $this->teacher->id
        );
    }

    /**
     * The row shape {@see report_query} produces, for one activity.
     *
     * @param \stdClass $cm
     * @return \stdClass
     */
    private function row(\stdClass $cm): \stdClass {
        $config = config_repository::get_for_cm((int) $cm->id);

        return (object) [
            'cmid' => (int) $cm->id,
            'courseid' => (int) $this->course->id,
            'instance' => (int) $cm->instance,
            'modname' => $cm->modname,
            'grademethod' => $config->grademethod,
            'gradevalue' => $config->gradevalue,
            'advancedgrading' => $config->advancedgrading,
        ];
    }
}
