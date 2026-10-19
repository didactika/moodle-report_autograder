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

/**
 * The report, drawn by a React component.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_autograder\output;

use core\output\react_component_renderable;
use report_autograder\local\page\page_context;
use report_autograder\local\query\filters;
use report_autograder\local\query\scope;

/**
 * The page of the report: the component report_autograder/Report gets here everything it needs to draw the first state.
 */
class report_page implements react_component_renderable, \renderable {
    /**
     * @var scope Which report is asked for: one activity, one course or the whole site.
     */
    private scope $scope;

    /**
     * @var filters What the link that was followed narrows the report to.
     */
    private filters $opening;

    /**
     * @var array|null What the forum grader needs, when the activity is a forum that the viewer may grade.
     */
    private ?array $forumgrade;

    /**
     * Keep what the page was asked for.
     *
     * @param scope $scope The report that is asked for.
     * @param filters $opening What the link narrows it to.
     * @param array|null $forumgrade The context of the forum grader, or null.
     */
    public function __construct(scope $scope, filters $opening, ?array $forumgrade) {
        $this->scope = $scope;
        $this->opening = $opening;
        $this->forumgrade = $forumgrade;
    }

    /**
     * The React component that draws the report.
     *
     * @return string Name of the component inside the plugin.
     */
    #[\Override]
    public function get_react_component_name(): string {
        return 'report_autograder/Report';
    }

    /**
     * What the component starts from.
     *
     * @param \renderer_base $renderer Renderer.
     * @return \stdClass Properties of the component.
     */
    #[\Override]
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        unset($renderer);
        $bar = page_context::filters($this->scope, $this->opening);
        $table = page_context::table($this->scope, $this->forumgrade);
        return (object) [
            'level' => $this->scope->level(),
            'scope' => (object) $this->scope->url_params(),
            'canseefailures' => $this->scope->can_see_failures(),
            'statuses' => $bar['statuses'],
            'opening' => $this->opening_filters($bar),
            'selectedcourse' => $bar['selected_course'],
            'selectedactivity' => $bar['selected_activity'],
            'showscoursefilter' => $bar['shows_course_filter'],
            'showsactivityfilter' => $bar['shows_activity_filter'],
            'showsgroupfilter' => $bar['shows_group_filter'],
            'groups' => $bar['groups'],
            'offersallgroups' => $bar['offers_all_groups'],
            'columns' => (object) [
                'activity' => $table['shows_activity_column'],
                'course' => $table['shows_course_column'],
                'group' => $table['shows_group_column'],
            ],
            'forumgrade' => $this->forumgrade,
            'pagesizes' => [12, 25, 50, 100],
            'gradersurl' => (new \moodle_url('/report/autograder/graders.php'))->out(false),
            'strings' => self::strings(),
        ];
    }

    /**
     * The filters that the report opens on: what the link carries, and the group the viewer is looking at.
     *
     * @param array $bar What the filter bar of the page says.
     * @return \stdClass The filters, written the way the component sends them back.
     */
    private function opening_filters(array $bar): \stdClass {
        $chosen = $bar['filters'];
        $groupid = $this->opening->groupid() ?: (int) $bar['opening_group'];
        return (object) [
            'searchname' => $chosen['searchname'],
            'status' => $chosen['status'] === '' ? [] : explode(',', $chosen['status']),
            'datefrom' => $this->opening->datefrom() === null ? '' : date('Y-m-d', $this->opening->datefrom()),
            'dateto' => $this->opening->dateto() === null ? '' : date('Y-m-d', $this->opening->dateto()),
            'courseid' => $this->opening->courseid(),
            'cmid' => $this->opening->cmid(),
            'groupid' => $groupid,
        ];
    }

    /**
     * What holds the place of the report until its component is there: the bar and the rows as grey blocks.
     *
     * @return string The HTML.
     */
    public static function placeholder(): string {
        $bar = '<div class="arp-sk-bar">' .
            '<span class="arp-sk arp-sk-pill" style="width:16rem"></span>' .
            str_repeat('<span class="arp-sk arp-sk-pill" style="width:7rem"></span>', 3) . '</div>';
        $rows = '';
        for ($i = 0; $i < 8; $i++) {
            $rows .= '<div class="arp-sk-row"><span class="arp-sk arp-sk-dot"></span><span class="arp-sk arp-sk-line"></span>' .
                '<span class="arp-sk arp-sk-pill" style="width:6rem"></span>' .
                '<span class="arp-sk arp-sk-line arp-sk-short"></span></div>';
        }
        return '<div class="arp" aria-hidden="true">' . $bar . '<div class="arp-sk-table">' . $rows . '</div></div>' .
            '<span class="sr-only visually-hidden" role="status">' . get_string('loading_report', 'report_autograder') . '</span>';
    }

    /**
     * Every string of the plugin, in the language of the person, with the places of the values written the way the script fills.
     *
     * A value that stands alone is written {n} and the fields of an object {name}, so the script has one way to put them in.
     *
     * @return string[] Texts by name.
     */
    public static function strings(): array {
        $strings = get_string_manager()->load_component_strings('report_autograder', current_language());
        foreach ($strings as $name => $value) {
            $strings[$name] = preg_replace(['/\{\$a->([a-z]+)\}/', '/\{\$a\}/'], ['{$1}', '{n}'], $value);
        }
        return $strings;
    }
}
