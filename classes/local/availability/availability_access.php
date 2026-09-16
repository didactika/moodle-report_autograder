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

namespace report_autograder\local\availability;

use report_autograder\local\query\scope;

/**
 * Which students an activity's own access restrictions actually let in.
 *
 * Distinct from {@see \report_autograder\local\groups\group_access}, which is
 * about the *viewer*: that one decides how much of an activity a teacher is
 * allowed to be shown. This one is about the *student*. An activity restricted
 * to one group is not on the course page for anybody else — they cannot open
 * it, cannot submit to it, and will never be graded on it, so listing them as
 * not having submitted says something untrue about them and puts a number in
 * the summary that no teacher can ever bring down to zero.
 *
 * The answer comes from core, not from reading the restriction ourselves:
 * `\core_availability\info_module::get_user_list_sql()` is the same call
 * `mod_assign` uses to decide who its participant list holds. Like that call,
 * this only covers the conditions core marks as applying to user lists —
 * group and grouping among them, a date restriction not, since a date applies
 * to the whole class at once and hides nobody in particular.
 *
 * Only activities that actually carry a restriction are looked at. On the
 * usual site that is a small fraction of them, which is what keeps a
 * site-wide report from reading the module cache of every course that has an
 * autograded activity.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class availability_access {
    /** @var array<int, array{0: string, 1: array}> The user-list SQL and its parameters, by cmid. */
    private array $restrictions;

    /**
     * Built by {@see self::for_scope()}, which is what knows how to ask.
     *
     * @param array<int, array{0: string, 1: array}> $restrictions
     */
    private function __construct(array $restrictions) {
        $this->restrictions = $restrictions;
    }

    /**
     * The restrictions in force across one report.
     *
     * Worked out once per request and kept in a request cache: the count, the
     * status summary and the rows are three queries asking the same question,
     * and the walk behind it reads a course module cache per course involved.
     *
     * @param scope $scope
     * @return self
     */
    public static function for_scope(scope $scope): self {
        $cache = \cache::make_from_params(\cache_store::MODE_REQUEST, 'report_autograder', 'availabilityaccess');
        $key = $scope->level() . '-' . implode('-', $scope->url_params());
        $cached = $cache->get($key);

        if ($cached !== false) {
            return new self($cached);
        }

        $built = self::build($scope);
        $cache->set($key, $built);

        return new self($built);
    }

    /**
     * Asks core, activity by activity, who its restrictions admit.
     *
     * @param scope $scope
     * @return array<int, array{0: string, 1: array}>
     */
    private static function build(scope $scope): array {
        global $CFG;

        if (empty($CFG->enableavailability)) {
            return [];
        }

        $restrictions = [];

        foreach (self::restricted_activities($scope) as $cm) {
            // True: only active enrolments count, the same rule the rest of
            // this report's own enrolment filter applies.
            [$sql, $params] = (new \core_availability\info_module($cm))->get_user_list_sql(true);

            if ($sql === '') {
                // Carries a restriction, but not one that singles anybody out
                // — a date, typically, which closes the activity for the whole
                // class at once.
                continue;
            }

            $restrictions[(int) $cm->id] = [$sql, $params];
        }

        return $restrictions;
    }

    /**
     * The activities in scope that carry an access restriction at all.
     *
     * The `availability` column is read first so that the module cache is only
     * loaded for courses that can actually change the answer: an unrestricted
     * activity admits everybody, and there is nothing to ask core about.
     *
     * @param scope $scope
     * @return \cm_info[]
     */
    private static function restricted_activities(scope $scope): array {
        global $DB;

        if ($scope->level() === scope::LEVEL_ACTIVITY) {
            $cm = $scope->cm();

            return self::carries_restriction($cm->availability ?? null) ? [$cm] : [];
        }

        $params = ['enabled' => 1];
        $where = 'cfg.enabled = :enabled
                  AND cm.deletioninprogress = 0
                  AND cm.availability IS NOT NULL
                  AND ' . $DB->sql_compare_text('cm.availability') . " <> :empty
                  AND " . $DB->sql_compare_text('cm.availability') . ' <> :null';
        $params['empty'] = '';
        $params['null'] = 'null';

        if ($scope->level() === scope::LEVEL_COURSE) {
            $where .= ' AND cfg.courseid = :courseid';
            $params['courseid'] = (int) $scope->course()->id;
        }

        $rows = $DB->get_records_sql(
            "SELECT cfg.cmid, cfg.courseid
               FROM {local_autograder_config} cfg
               JOIN {course_modules} cm ON cm.id = cfg.cmid
              WHERE {$where}",
            $params
        );
        $activities = [];

        foreach ($rows as $row) {
            $modinfo = get_fast_modinfo((int) $row->courseid);

            if (!isset($modinfo->cms[(int) $row->cmid])) {
                continue;
            }

            $activities[] = $modinfo->cms[(int) $row->cmid];
        }

        return $activities;
    }

    /**
     * Whether an `availability` value is a restriction rather than the absence
     * of one — which Moodle spells three different ways depending on how the
     * activity was last saved.
     *
     * @param string|null $availability
     * @return bool
     */
    private static function carries_restriction(?string $availability): bool {
        return $availability !== null && $availability !== '' && $availability !== 'null';
    }

    /**
     * The activities whose restrictions leave somebody out, and the SQL that
     * names who is left in.
     *
     * @return array<int, array{0: string, 1: array}> Keyed by cmid.
     */
    public function restrictions(): array {
        return $this->restrictions;
    }
}
