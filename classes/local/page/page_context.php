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

use report_autograder\local\format\status;
use report_autograder\local\groups\group_access;
use report_autograder\local\query\filters;
use report_autograder\local\query\scope;

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
     * The filter bar, showing whatever the report is already narrowed to.
     *
     * A report opened from a bookmark, or from a link somebody was sent, is
     * narrowed before anybody touches a control — so the controls have to say
     * so. They used to open blank whatever the URL said: the table came back
     * filtered while the bar claimed it was not, which reads as a broken
     * report rather than a narrowed one.
     *
     * @param scope $scope
     * @param filters|null $filters What the request asked for.
     * @return array
     */
    public static function filters(scope $scope, ?filters $filters = null): array {
        $groups = $scope->level() === scope::LEVEL_SITE ? null : group_access::for_scope($scope);
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
            'filters' => self::chosen_values($filters),
            'selected_course' => self::chosen_course($filters),
            'selected_activity' => self::chosen_activity($filters),
            'shows_activity_filter' => $scope->level() !== scope::LEVEL_ACTIVITY,
            'shows_course_filter' => $scope->level() === scope::LEVEL_SITE,
            // What the two pickers need to search themselves: which report
            // they belong to. Their options are not listed here — they are
            // fetched as the reader types, by
            // {@see \report_autograder\external\search_filter_options}.
            'scope_cmid' => $scope->level() === scope::LEVEL_ACTIVITY ? (int) $scope->cm()->id : 0,
            'scope_courseid' => $scope->level() === scope::LEVEL_COURSE ? (int) $scope->course()->id : 0,
            'moment_url' => self::library_url('moment/moment-with-locales.min.js'),
            'picker_url' => self::library_url('daterangepicker/daterangepicker.js'),
            'shows_group_filter' => $groups ? $groups->shows_picker() : false,
            'groups' => $groups ? $groups->picker_options() : [],
            'offers_all_groups' => $groups ? $groups->offers_all_groups() : true,
            'opening_group' => $groups ? $groups->opening_choice() : 0,
        ];
    }

    /**
     * The plain values the filter bar's own inputs carry.
     *
     * @param filters|null $filters
     * @return array
     */
    private static function chosen_values(?filters $filters): array {
        if ($filters === null) {
            return ['searchname' => '', 'status' => '', 'grading_date_from' => '', 'grading_date_to' => ''];
        }

        return [
            'searchname' => $filters->search(),
            'status' => implode(',', $filters->statuses()),
            // The date chip reads these back and paints itself from them, so
            // they have to be written the way it writes them, not as a
            // timestamp it would show verbatim.
            'grading_date_from' => self::as_date($filters->datefrom()),
            'grading_date_to' => self::as_date($filters->dateto()),
        ];
    }

    /**
     * The course the report is already narrowed to, ready for its picker.
     *
     * Labelled exactly as the picker's own search labels it, so the option it
     * opens showing reads like the ones it offers.
     *
     * @param filters|null $filters
     * @return array|null
     */
    private static function chosen_course(?filters $filters): ?array {
        global $DB;

        if ($filters === null || $filters->courseid() <= 0) {
            return null;
        }

        $course = $DB->get_record('course', ['id' => $filters->courseid()], 'id, shortname', IGNORE_MISSING);

        return $course ? ['id' => (int) $course->id, 'name' => format_string($course->shortname)] : null;
    }

    /**
     * The activity the report is already narrowed to, ready for its picker.
     *
     * @param filters|null $filters
     * @return array|null
     */
    private static function chosen_activity(?filters $filters): ?array {
        if ($filters === null || $filters->cmid() <= 0) {
            return null;
        }

        $cm = get_coursemodule_from_id(null, $filters->cmid(), 0, false, IGNORE_MISSING);

        if (!$cm) {
            return null;
        }

        return [
            'id' => (int) $cm->id,
            'name' => format_string($cm->name, true, ['context' => \context_module::instance((int) $cm->id)]),
        ];
    }

    /**
     * One end of the date range, written the way the date chip writes it.
     *
     * @param int|null $timestamp
     * @return string Empty when that end is open.
     */
    private static function as_date(?int $timestamp): string {
        return $timestamp === null ? '' : userdate($timestamp, '%d/%m/%Y');
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
            'shows_group_column' => $scope->level() !== scope::LEVEL_SITE
                && group_access::for_scope($scope)->shows_column(),
            'skeletonRows' => array_fill(0, 4, []),
        ];

        if ($forumgrade !== null) {
            $context['forum_grade'] = $forumgrade;
        }

        return $context;
    }

    /**
     * Where one of this plugin's bundled libraries is served from.
     *
     * The date picker and the date library it needs ship with the plugin and
     * are declared in `thirdpartylibs.xml`. They used to be fetched from a
     * public CDN, which a Moodle site cannot allow: it hands a third party a
     * record of who reads this report from where, and it puts the report at
     * the mercy of a host nobody here controls — including sites that are
     * behind a firewall and would simply be left with no calendar.
     *
     * @param string $path Relative to the plugin's lib directory.
     * @return string
     */
    private static function library_url(string $path): string {
        return (new \moodle_url('/report/autograder/lib/' . $path))->out(false);
    }
}
