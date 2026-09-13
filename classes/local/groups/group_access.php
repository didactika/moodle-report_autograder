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

namespace report_autograder\local\groups;

use report_autograder\local\query\scope;

/**
 * Which groups the viewer may see, and which students that leaves.
 *
 * Groups are not a convenience here, they are an access rule: in an activity
 * set to separate groups, a teacher is only allowed to see the students of
 * their own groups, and no report may show them more than the activity itself
 * would. So none of this is decided by this plugin — every answer comes from
 * the same core functions the gradebook and the activity pages use, activity
 * by activity:
 *
 * - `groups_get_activity_groupmode()` for the mode actually in force, which is
 *   the course's when the course forces one;
 * - `moodle/site:accessallgroups` in the activity's own context, which lifts
 *   the restriction entirely;
 * - `groups_get_activity_allowed_groups()` for what is left, already narrowed
 *   to the activity's grouping;
 * - `groups_get_activity_group()` / `groups_get_course_group()` for the group
 *   the viewer was last looking at, so the report opens on the same group
 *   Moodle would have opened on.
 *
 * The restriction is per activity, because the mode is: a course report can
 * hold one activity that separates groups and another that does not, and each
 * row has to be judged by its own.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class group_access {
    /** @var array<int, int[]> Visible group ids, by cmid, for the activities the viewer is limited in. */
    private array $restrictions;

    /** @var array<int, string> The groups the picker offers, by id. */
    private array $options;

    /** @var bool Whether "all groups" is one of the picker's choices. */
    private bool $offersall;

    /** @var int The group the report opens on; zero for all of them. */
    private int $default;

    /** @var bool Whether any activity in view puts students in groups at all. */
    private bool $hasgroups;

    /**
     * Built by {@see self::for_scope()}, which is what knows how to ask.
     *
     * @param array<int, int[]> $restrictions
     * @param array<int, string> $options
     * @param bool $offersall
     * @param int $default
     * @param bool $hasgroups
     */
    private function __construct(
        array $restrictions,
        array $options,
        bool $offersall,
        int $default,
        bool $hasgroups
    ) {
        $this->restrictions = $restrictions;
        $this->options = $options;
        $this->offersall = $offersall;
        $this->default = $default;
        $this->hasgroups = $hasgroups;
    }

    /**
     * What the current viewer may see of this report.
     *
     * Worked out once per request: it costs a handful of capability and group
     * queries per activity, and the query, the filter bar and the rows all ask
     * the same question. Kept in a request cache rather than a static so that
     * a test resetting the site clears it too.
     *
     * @param scope $scope
     * @return self
     */
    public static function for_scope(scope $scope): self {
        global $USER;

        $cache = \cache::make_from_params(\cache_store::MODE_REQUEST, 'report_autograder', 'groupaccess');
        $key = $scope->level() . '-' . implode('-', $scope->url_params()) . '-' . (int) $USER->id;
        $cached = $cache->get($key);

        if ($cached !== false) {
            return new self(...$cached);
        }

        $built = self::build($scope);
        $cache->set($key, $built);

        return new self(...$built);
    }

    /**
     * Works out the whole answer for one report.
     *
     * @param scope $scope
     * @return array{0: array<int, int[]>, 1: array<int, string>, 2: bool, 3: int, 4: bool}
     */
    private static function build(scope $scope): array {
        $restrictions = [];
        $hasgroups = false;

        foreach (self::activities_in_scope($scope) as $cm) {
            $groupmode = (int) $cm->effectivegroupmode;

            if ($groupmode === NOGROUPS) {
                continue;
            }

            $hasgroups = true;

            if ($groupmode !== SEPARATEGROUPS) {
                // Visible groups: everybody is listed, groups are only a label.
                continue;
            }

            if (has_capability('moodle/site:accessallgroups', \context_module::instance($cm->id))) {
                continue;
            }

            // An empty list is an answer, not a missing one: somebody with no
            // group of their own sees no students in an activity that
            // separates them, which is what the activity itself would show.
            $restrictions[(int) $cm->id] = array_map(
                'intval',
                array_keys(groups_get_activity_allowed_groups($cm))
            );
        }

        [$options, $offersall, $default] = self::picker($scope, $restrictions, $hasgroups);

        return [$restrictions, $options, $offersall, $default, $hasgroups];
    }

    /**
     * The activities this report covers, as the course cache knows them.
     *
     * A viewer who may see every group everywhere is spared the walk: at site
     * level that would mean reading the module cache of every course with an
     * autograded activity to reach a conclusion already known.
     *
     * @param scope $scope
     * @return \cm_info[]
     */
    private static function activities_in_scope(scope $scope): array {
        global $DB;

        if ($scope->level() === scope::LEVEL_ACTIVITY) {
            return [$scope->cm()];
        }

        if (
            $scope->level() === scope::LEVEL_SITE
            && has_capability('moodle/site:accessallgroups', \context_system::instance())
        ) {
            return [];
        }

        $params = ['enabled' => 1];
        $where = 'cfg.enabled = :enabled AND cm.deletioninprogress = 0';

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
     * What the group picker offers, and which of its choices it opens on.
     *
     * At activity level this is Moodle's own activity group menu: the same
     * allowed groups, and the same remembered choice, so that a teacher who
     * was looking at one group in the activity finds the report on that group.
     * At course level it is the course menu's. At site level there is no
     * picker at all — a group belongs to one course, so a list of them across
     * every course would be a list of names with nothing in common. The
     * restriction still applies there; only the choice is missing.
     *
     * @param scope $scope
     * @param array<int, int[]> $restrictions
     * @param bool $hasgroups
     * @return array{0: array<int, string>, 1: bool, 2: int}
     */
    private static function picker(scope $scope, array $restrictions, bool $hasgroups): array {
        switch ($scope->level()) {
            case scope::LEVEL_ACTIVITY:
                return self::activity_picker($scope->cm(), $scope->course(), $restrictions);

            case scope::LEVEL_COURSE:
                return self::course_picker($scope->course(), $restrictions, $hasgroups);

            default:
                return [[], true, 0];
        }
    }

    /**
     * The picker for one activity, straight from Moodle's own.
     *
     * @param \cm_info $cm
     * @param \stdClass $course
     * @param array<int, int[]> $restrictions
     * @return array{0: array<int, string>, 1: bool, 2: int}
     */
    private static function activity_picker(\cm_info $cm, \stdClass $course, array $restrictions): array {
        if ((int) groups_get_activity_groupmode($cm, $course) === NOGROUPS) {
            return [[], true, 0];
        }

        $allowed = groups_get_activity_allowed_groups($cm);
        $restricted = array_key_exists((int) $cm->id, $restrictions);
        $options = [];

        foreach ($allowed as $group) {
            $options[(int) $group->id] = format_string($group->name, true, ['context' => $cm->context]);
        }

        return [
            $options,
            !$restricted,
            self::opening_group((int) groups_get_activity_group($cm, true), $options, !$restricted),
        ];
    }

    /**
     * The picker for a whole course.
     *
     * It is offered whenever something in view puts students in groups, even
     * where the course itself sets no mode — an activity can separate groups
     * on its own, and the reader of a course report is looking at those
     * activities.
     *
     * @param \stdClass $course
     * @param array<int, int[]> $restrictions
     * @param bool $hasgroups
     * @return array{0: array<int, string>, 1: bool, 2: int}
     */
    private static function course_picker(\stdClass $course, array $restrictions, bool $hasgroups): array {
        if (!$hasgroups) {
            return [[], true, 0];
        }

        global $USER;

        $context = \context_course::instance($course->id);
        $seesall = has_capability('moodle/site:accessallgroups', $context);
        // The same list the course's own group menu offers: the course's
        // default grouping, and without that capability only the groups the
        // viewer is in. Each separate-groups activity narrows its own rows
        // further, by its own grouping.
        $groups = groups_get_all_groups(
            $course->id,
            $seesall ? 0 : (int) $USER->id,
            (int) $course->defaultgroupingid
        );
        $options = [];

        foreach ($groups as $group) {
            $options[(int) $group->id] = format_string($group->name, true, ['context' => $context]);
        }

        // Leaving the picker on all groups is only honest where nothing in view
        // hides anybody: with one separate-groups activity among them, it would
        // show every student of one activity and only some of another's.
        $offersall = $seesall || $restrictions === [];
        $remembered = (int) groups_get_course_group($course, true);

        return [$options, $offersall, self::opening_group($remembered, $options, $offersall)];
    }

    /**
     * Which choice the picker starts on.
     *
     * Moodle's remembered group where it is still one of the choices. Where
     * "all groups" is not on offer the report cannot open on it either, so it
     * opens on the viewer's first group — the same thing an activity page does
     * for a teacher who may only see their own.
     *
     * @param int $remembered
     * @param array<int, string> $options
     * @param bool $offersall
     * @return int Zero for all groups.
     */
    private static function opening_group(int $remembered, array $options, bool $offersall): int {
        if ($remembered > 0 && isset($options[$remembered])) {
            return $remembered;
        }

        if ($offersall || $options === []) {
            return 0;
        }

        return (int) array_key_first($options);
    }

    /**
     * The activities the viewer may only see some students of, and which
     * groups those are.
     *
     * @return array<int, int[]> Visible group ids by cmid; an empty list means
     *         no student of that activity may be shown.
     */
    public function restrictions(): array {
        return $this->restrictions;
    }

    /**
     * The groups the viewer may see in one activity.
     *
     * @param int $cmid
     * @return int[]|null Null where the viewer sees the whole activity.
     */
    public function visible_groups_in(int $cmid): ?array {
        return $this->restrictions[$cmid] ?? null;
    }

    /**
     * Whether the filter bar has a group picker at all.
     *
     * @return bool
     */
    public function shows_picker(): bool {
        return $this->options !== [];
    }

    /**
     * Whether a group column earns its place in the table.
     *
     * @return bool
     */
    public function shows_column(): bool {
        return $this->hasgroups;
    }

    /**
     * The picker's choices.
     *
     * @return array<int, array{id: int, name: string, selected: bool}>
     */
    public function picker_options(): array {
        $options = [];

        foreach ($this->options as $id => $name) {
            $options[] = ['id' => $id, 'name' => $name, 'selected' => $id === $this->default];
        }

        return $options;
    }

    /**
     * Whether the picker offers "all groups", or forces a choice between them.
     *
     * @return bool
     */
    public function offers_all_groups(): bool {
        return $this->offersall;
    }

    /**
     * The group the report opens on.
     *
     * @return int Zero for all of them.
     */
    public function opening_choice(): int {
        return $this->default;
    }

    /**
     * Whether a group the client asked to filter by is one it was offered.
     *
     * Asked of the request rather than trusted from it: the filter narrows the
     * table, so a group nobody offered would only ever narrow it to something
     * the viewer may already see — but it would also let the URL name groups
     * of other courses, and a filter should only ever mean what the page said
     * it means.
     *
     * @param int $groupid
     * @return bool
     */
    public function offers_group(int $groupid): bool {
        return $groupid > 0 && isset($this->options[$groupid]);
    }
}
