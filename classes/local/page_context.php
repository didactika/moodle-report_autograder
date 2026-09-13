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

/**
 * What the page hands its templates.
 *
 * The table is filled in by the web service once the page is up, so all this
 * has to settle is what the *shell* looks like: which filters are offered and
 * which columns the table has, both of which depend on the level and on what
 * the viewer may see.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class page_context {
    /**
     * The filter bar.
     *
     * @param scope $scope
     * @return array
     */
    public static function filters(scope $scope): array {
        $groups = group_access::for_scope($scope);
        $statuses = [];

        foreach (status::filterable($scope->can_see_failures()) as $key) {
            $statuses[] = [
                'key' => $key,
                'label' => status::label($key),
            ];
        }

        return [
            'filter_action_url' => $scope->url()->out(false),
            'statuses' => $statuses,
            'shows_activity_filter' => $scope->level() !== scope::LEVEL_ACTIVITY,
            'activities' => self::activity_options($scope),
            'shows_course_filter' => $scope->level() === scope::LEVEL_SITE,
            'courses' => self::course_options($scope),
            'shows_group_filter' => $groups->shows_picker(),
            'groups' => $groups->picker_options(),
            'offers_all_groups' => $groups->offers_all_groups(),
            'opening_group' => $groups->opening_choice(),
        ];
    }

    /**
     * The table's shell: its columns, and the forum grader's data attributes
     * where that applies.
     *
     * @param scope $scope
     * @param array|null $forumgrade From {@see grader_ui::get_forum_grade_context()}.
     * @return array
     */
    public static function table(scope $scope, ?array $forumgrade): array {
        $context = [
            'shows_activity_column' => $scope->shows_activity_column(),
            'shows_course_column' => $scope->shows_course_column(),
            'shows_group_column' => group_access::for_scope($scope)->shows_column(),
            'skeletonRows' => array_fill(0, 4, []),
        ];

        if ($forumgrade !== null) {
            $context['forum_grade'] = $forumgrade;
        }

        return $context;
    }

    /**
     * The activities the viewer could narrow to.
     *
     * Only the ones autograder is switched on for: offering an activity with
     * no rows behind it wastes the reader's time.
     *
     * @param scope $scope
     * @return array<int, array{id: int, name: string}>
     */
    private static function activity_options(scope $scope): array {
        global $DB;

        if ($scope->level() === scope::LEVEL_ACTIVITY) {
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
        $options = [];

        foreach ($rows as $row) {
            $modinfo = get_fast_modinfo((int) $row->courseid);

            if (!isset($modinfo->cms[(int) $row->cmid])) {
                continue;
            }

            $options[] = [
                'id' => (int) $row->cmid,
                'name' => format_string($modinfo->cms[(int) $row->cmid]->name),
            ];
        }

        usort($options, function (array $a, array $b): int {
            return strcasecmp(
                \core_text::strtolower($a['name']),
                \core_text::strtolower($b['name'])
            );
        });

        return $options;
    }

    /**
     * The courses the viewer could narrow to, at site level.
     *
     * @param scope $scope
     * @return array<int, array{id: int, name: string}>
     */
    private static function course_options(scope $scope): array {
        global $DB;

        if ($scope->level() !== scope::LEVEL_SITE) {
            return [];
        }

        $rows = $DB->get_records_sql(
            "SELECT DISTINCT co.id, co.shortname, co.fullname
               FROM {local_autograder_config} cfg
               JOIN {course} co ON co.id = cfg.courseid
              WHERE cfg.enabled = 1
           ORDER BY co.shortname"
        );
        $options = [];

        foreach ($rows as $row) {
            $options[] = ['id' => (int) $row->id, 'name' => format_string($row->shortname)];
        }

        return $options;
    }
}
