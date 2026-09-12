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
use local_autograder\local\eligibility;

/**
 * The grade a student is going to get, before they have it.
 *
 * This is the column the previous report got wrong: with the answer living in
 * another service it showed the activity's *maximum* and called it
 * provisional. The grade autograder will actually post has been sitting in
 * `local_autograder_config` all along, and for a rubric or marking guide it
 * can be worked out from the levels the teacher chose.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class provisional_grade {
    /**
     * What autograder will post for this activity, ready to show.
     *
     * @param \stdClass $row A row from {@see report_query}.
     * @return array{value: float|null, display: string|null, problem: string|null}
     *         `display` is what the column shows; `problem` is set instead
     *         when there is a reason no grade can be promised.
     */
    public static function for_row(\stdClass $row): array {
        switch ($row->grademethod) {
            case 'point':
                return self::point($row);

            case 'scale':
                return self::scale($row);

            case 'rubric':
            case 'guide':
                return self::advanced($row);

            default:
                return self::problem(get_string('provisional:unknown', 'report_autograder'));
        }
    }

    /**
     * A plain number, shown the way the gradebook shows numbers.
     *
     * @param \stdClass $row
     * @return array{value: float|null, display: string|null, problem: string|null}
     */
    private static function point(\stdClass $row): array {
        if ($row->gradevalue === null) {
            return self::problem(get_string('provisional:unset', 'report_autograder'));
        }

        $value = (float) $row->gradevalue;

        return ['value' => $value, 'display' => format_float($value, -1), 'problem' => null];
    }

    /**
     * A scale item, shown by its name rather than by its number — "Separate
     * and connected" tells a teacher something; "2" does not.
     *
     * @param \stdClass $row
     * @return array{value: float|null, display: string|null, problem: string|null}
     */
    private static function scale(\stdClass $row): array {
        global $DB, $CFG;

        require_once($CFG->libdir . '/gradelib.php');

        if ($row->gradevalue === null) {
            return self::problem(get_string('provisional:unset', 'report_autograder'));
        }

        $index = (int) $row->gradevalue;
        $item = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => $row->modname,
            'iteminstance' => $row->instance,
            'courseid' => $row->courseid,
        ]);

        if (!$item || empty($item->scaleid)) {
            return self::problem(get_string('provisional:noscale', 'report_autograder'));
        }

        $scale = $DB->get_record('scale', ['id' => $item->scaleid]);

        if (!$scale) {
            return self::problem(get_string('provisional:noscale', 'report_autograder'));
        }

        $items = array_map('trim', explode(',', $scale->scale));

        if (!isset($items[$index - 1])) {
            // The activity's scale changed after autograder was told which
            // item to award.
            return self::problem(get_string('provisional:scalemismatch', 'report_autograder'));
        }

        return [
            'value' => (float) $index,
            'display' => format_string($items[$index - 1]),
            'problem' => null,
        ];
    }

    /**
     * What the chosen rubric levels or marking-guide scores add up to.
     *
     * The arithmetic mirrors `gradingform_rubric_instance::get_grade()` and
     * its marking-guide twin, because the alternative — persisting a grading
     * instance per row just to ask it — would write to the database every time
     * somebody opened a report. It is pinned by a test that grades a real
     * student through the real rubric and checks the gradebook agrees, so a
     * change to the formula in core shows up as a failure here rather than as
     * a wrong number on the page.
     *
     * @param \stdClass $row
     * @return array{value: float|null, display: string|null, problem: string|null}
     */
    private static function advanced(\stdClass $row): array {
        $cm = get_coursemodule_from_id('', (int) $row->cmid, 0, false, IGNORE_MISSING);

        if (!$cm) {
            return self::problem(get_string('provisional:unset', 'report_autograder'));
        }

        if (!advanced_grading::filling_is_current($cm, $row->advancedgrading)) {
            return self::problem(get_string('provisional:advancedstale', 'report_autograder'));
        }

        $controller = advanced_grading::controller($cm);

        if ($controller === null || !self::set_grade_range($controller, $row)) {
            return self::problem(get_string('provisional:unset', 'report_autograder'));
        }

        $scores = $controller->get_min_max_score();
        $graderange = array_keys($controller->get_grade_range());

        if (!$scores || $scores['maxscore'] <= $scores['minscore'] || empty($graderange)) {
            return self::problem(get_string('provisional:unset', 'report_autograder'));
        }

        sort($graderange);
        $mingrade = (float) $graderange[0];
        $maxgrade = (float) $graderange[count($graderange) - 1];
        $curscore = self::chosen_score($row, advanced_grading::criteria($cm));

        if ($curscore === null) {
            return self::problem(get_string('provisional:advancedstale', 'report_autograder'));
        }

        $options = $controller->get_options();
        $decimals = $controller->get_allow_grade_decimals();

        if ($row->grademethod === 'rubric' && !empty($options['lockzeropoints'])) {
            $grade = max($mingrade, $curscore / $scores['maxscore'] * $maxgrade);
            $grade = $decimals ? $grade : round($grade, 0);
        } else {
            $offset = ($curscore - $scores['minscore'])
                / ($scores['maxscore'] - $scores['minscore'])
                * ($maxgrade - $mingrade);
            $grade = ($decimals ? $offset : round($offset, 0)) + $mingrade;
        }

        return ['value' => (float) $grade, 'display' => format_float((float) $grade, -1), 'problem' => null];
    }

    /**
     * Tells the grading form what it is grading out of.
     *
     * A controller fetched on its own does not know: the module sets the range
     * when it prepares to grade somebody (see `assign::get_grading_instance()`,
     * which is the line this mirrors). Without it `get_grade_range()` is empty
     * and every rubric would report having no grade to give.
     *
     * @param \gradingform_controller $controller
     * @param \stdClass $row
     * @return bool False when the activity has no grade item to read it from.
     */
    private static function set_grade_range(\gradingform_controller $controller, \stdClass $row): bool {
        global $CFG;

        require_once($CFG->libdir . '/gradelib.php');

        $gradeitem = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => $row->modname,
            'iteminstance' => $row->instance,
            'courseid' => $row->courseid,
            'itemnumber' => eligibility::grade_itemnumber($row->modname),
        ]);

        if (!$gradeitem) {
            return false;
        }

        // The module's own "grade" setting: the maximum for points, minus the
        // scale id for a scale — what make_grades_menu() expects.
        $gradetype = (int) $gradeitem->gradetype === GRADE_TYPE_SCALE
            ? -(int) $gradeitem->scaleid
            : (int) $gradeitem->grademax;

        $controller->set_grade_range(make_grades_menu($gradetype), $gradetype > 0);

        return true;
    }

    /**
     * What the teacher's choices add up to, in the grading form's own points.
     *
     * @param \stdClass $row
     * @param array $criteria From {@see advanced_grading::criteria()}.
     * @return float|null Null when a choice no longer matches the definition.
     */
    private static function chosen_score(\stdClass $row, array $criteria): ?float {
        $filling = advanced_grading::decode($row->advancedgrading);
        $score = 0.0;

        foreach ($criteria as $criterionid => $criterion) {
            $answer = $filling[$criterionid] ?? null;

            if ($answer === null) {
                return null;
            }

            if (!empty($criterion['levels'])) {
                $levelid = (int) ($answer['levelid'] ?? 0);

                if (!isset($criterion['levels'][$levelid])) {
                    return null;
                }

                $score += (float) $criterion['levels'][$levelid]['score'];

                continue;
            }

            $score += (float) ($answer['score'] ?? 0);
        }

        return $score;
    }

    /**
     * A result that carries a reason instead of a grade.
     *
     * @param string $message
     * @return array{value: null, display: null, problem: string}
     */
    private static function problem(string $message): array {
        return ['value' => null, 'display' => null, 'problem' => $message];
    }
}
