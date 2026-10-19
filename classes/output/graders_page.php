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
 * The page of the graders, drawn by a React component.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_autograder\output;

use core\output\react_component_renderable;
use report_autograder\local\page\grader_list;

/**
 * Who Autograder would grade as in one course: the component report_autograder/Graders asks for the data it shows.
 */
class graders_page implements react_component_renderable, \renderable {
    /**
     * @var int The course that was asked for, or 0.
     */
    private int $courseid;

    /**
     * @var bool Whether the list of students was asked for.
     */
    private bool $students;

    /**
     * Keep what the page was asked for.
     *
     * @param int $courseid The course, or 0 while none is chosen.
     * @param bool $students Whether the list of students is open.
     */
    public function __construct(int $courseid, bool $students) {
        $this->courseid = $courseid;
        $this->students = $students;
    }

    /**
     * The React component that draws the page.
     *
     * @return string Name of the component inside the plugin.
     */
    #[\Override]
    public function get_react_component_name(): string {
        return 'report_autograder/Graders';
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
        return (object) [
            'courseid' => $this->courseid,
            'students' => $this->students,
            'pagesizes' => grader_list::PER_PAGE_OPTIONS,
            'perpage' => grader_list::PER_PAGE,
            'strings' => report_page::strings(),
        ];
    }

    /**
     * What holds the place of the page until its component is there.
     *
     * @return string The HTML.
     */
    public static function placeholder(): string {
        return '<div class="arp" aria-hidden="true"><div class="arp-sk-bar"><span class="arp-sk arp-sk-pill" style="width:18rem">' .
            '</span></div><div class="arp-sk-table">' .
            str_repeat('<div class="arp-sk-row"><span class="arp-sk arp-sk-line"></span></div>', 4) . '</div></div>' .
            '<span class="sr-only visually-hidden" role="status">' . get_string('loading_report', 'report_autograder') . '</span>';
    }
}
