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

namespace report_autograder\local\page;

use local_autograder\local\grading\grader_picker;

/**
 * Who would actually be grading, in one course, before anything is graded.
 *
 * The choice is made per student, from the student's own teachers, so the
 * only way to know what a course is going to do is to ask it of every student
 * in that course. Which is what this does — and why it is one course at a
 * time and never the whole site: the answer costs a handful of queries per
 * student, and a campus-wide version of this question would be a campus-wide
 * walk.
 *
 * Read-only, and it grades nothing. It is here so that a course can be
 * checked *before* its deadlines pass, rather than after — a student with no
 * teacher and no fallback is a decision that will fail, and this says so
 * while there is still time to fix it.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class grader_list {
    /** @var int The most students one course is walked for. */
    private const MAX_STUDENTS = 2000;

    /**
     * Every grader a course would use, and who they would be grading.
     *
     * @param int $courseid
     * @return array The template context: `graders`, `nobody`, `total`, `truncated`.
     */
    public static function for_course(int $courseid): array {
        $students = self::gradable_students($courseid);
        $truncated = count($students) > self::MAX_STUDENTS;
        $students = array_slice($students, 0, self::MAX_STUDENTS, true);

        $bygrader = [];
        $nobody = [];

        foreach ($students as $studentid => $student) {
            $candidates = grader_picker::candidates_for_course($courseid, (int) $studentid);
            $chosen = grader_picker::pick_for_course($courseid, (int) $studentid);
            $viafallback = false;

            if ($candidates === []) {
                $fallback = grader_picker::fallback_for(0);

                if ($fallback === null) {
                    $nobody[] = fullname($student);

                    continue;
                }

                $candidates = [$fallback];
                $chosen = $fallback;
                $viafallback = true;
            }

            // Every candidate is listed, not only the one who would be picked
            // today: a teacher can join or leave the course before the grade
            // is due, and the reader is asking who might end up grading.
            foreach ($candidates as $graderid) {
                if (!isset($bygrader[$graderid])) {
                    $bygrader[$graderid] = [
                        'students' => [],
                        'viafallback' => $viafallback,
                        'chosen' => 0,
                    ];
                }

                $bygrader[$graderid]['students'][] = fullname($student);

                if ($graderid === $chosen) {
                    $bygrader[$graderid]['chosen']++;
                }
            }
        }

        return [
            'graders' => self::named($bygrader),
            'nobody' => $nobody,
            'hasnobody' => $nobody !== [],
            'nobodycount' => count($nobody),
            'total' => count($students),
            'truncated' => $truncated,
            'max' => self::MAX_STUDENTS,
        ];
    }

    /**
     * The students a course would grade: the same rule the report's own table
     * uses, which is the gradebook's rule — actively enrolled, holding one of
     * `$CFG->gradebookroles`.
     *
     * @param int $courseid
     * @return \stdClass[] Keyed by user id.
     */
    private static function gradable_students(int $courseid): array {
        global $CFG, $DB;

        $context = \context_course::instance($courseid, IGNORE_MISSING);

        if (!$context) {
            return [];
        }

        [$rolesql, $params] = $DB->get_in_or_equal(
            array_filter(explode(',', (string) $CFG->gradebookroles)),
            SQL_PARAMS_NAMED,
            'gbr'
        );
        $params['courseid'] = $courseid;
        $params['ctxpath'] = $context->path;
        $params['ctxpath2'] = $context->path;
        $params['enrolenabled'] = ENROL_INSTANCE_ENABLED;
        $params['ueactive'] = ENROL_USER_ACTIVE;

        // With the leading comma, so the list stays valid however many name
        // fields the site is configured to show.
        $namefields = \core_user\fields::for_name()->get_sql('u', false, '', '', true)->selects;

        // One row per student however many enrolments or role assignments they
        // have: the same DISTINCT the report's own query needs, for the same
        // reason.
        return $DB->get_records_sql(
            "SELECT DISTINCT u.id {$namefields}
               FROM {user} u
               JOIN {user_enrolments} ue ON ue.userid = u.id
               JOIN {enrol} e ON e.id = ue.enrolid AND e.courseid = :courseid
              WHERE u.deleted = 0
                AND e.status = :enrolenabled
                AND ue.status = :ueactive
                AND EXISTS (SELECT 1
                              FROM {role_assignments} ra
                              JOIN {context} rctx ON rctx.id = ra.contextid
                             WHERE ra.userid = u.id
                               AND ra.roleid {$rolesql}
                               AND (:ctxpath = rctx.path OR :ctxpath2 LIKE " .
                                    $DB->sql_concat('rctx.path', "'/%'") . "))
           ORDER BY u.lastname, u.firstname, u.id",
            $params
        );
    }

    /**
     * Puts a name and a count on each grader, in the order a person would read
     * them: the busiest first.
     *
     * @param array $bygrader
     * @return array
     */
    private static function named(array $bygrader): array {
        global $DB;

        if ($bygrader === []) {
            return [];
        }

        [$insql, $params] = $DB->get_in_or_equal(array_keys($bygrader), SQL_PARAMS_NAMED);
        $namefields = \core_user\fields::for_name()->get_sql('u', false, '', '', true)->selects;
        $users = $DB->get_records_sql(
            "SELECT u.id {$namefields} FROM {user} u WHERE u.id {$insql}",
            $params
        );

        $graders = [];

        foreach ($bygrader as $graderid => $entry) {
            $graders[] = [
                'id' => (int) $graderid,
                'name' => isset($users[$graderid]) ? fullname($users[$graderid]) : (string) $graderid,
                'count' => count($entry['students']),
                'chosen' => (int) $entry['chosen'],
                'ischosen' => (int) $entry['chosen'] > 0,
                'students' => $entry['students'],
                'viafallback' => $entry['viafallback'],
            ];
        }

        // Whoever would actually be picked for the most students first, then
        // by how many they could grade at all.
        usort(
            $graders,
            static fn(array $a, array $b): int => [$b['chosen'], $b['count']] <=> [$a['chosen'], $a['count']]
        );

        return $graders;
    }
}
