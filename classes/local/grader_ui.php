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

use cm_info;
use mod_forum\grades\forum_gradeitem;
use mod_forum\local\container as forum_container;
use stdClass;

/**
 * How a row hands the viewer over to the activity's own grading screen.
 *
 * This report never grades anything itself. Where a teacher wants to grade a
 * student they are looking at, they are sent to the screen the activity already
 * has for it — the assignment grader by URL, the forum grader by the same
 * JavaScript the forum itself launches — so that everything the activity does
 * around a grade still happens.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class grader_ui {
    /**
     * What `mod_forum`'s grader needs to be launched from this page.
     *
     * The values land on the table's root element as `data-*` attributes, which
     * is where `mod_forum/grades/grader` reads them from; the shape is the
     * forum's, not this plugin's.
     *
     * @param stdClass $course
     * @param cm_info $cm
     * @param stdClass $user The viewer, whose right to grade is checked.
     * @return array<string, mixed>|null Null where this activity has no forum
     *         grader to launch, or this viewer may not use it.
     */
    public static function get_forum_grade_context(stdClass $course, cm_info $cm, stdClass $user): ?array {
        if ($cm->modname !== 'forum') {
            return null;
        }

        $forumvault = forum_container::get_vault_factory()->get_forum_vault();
        $forum = $forumvault->get_from_course_module_id((int) $cm->id);

        if ($forum === null) {
            return null;
        }

        $forumgradeitem = forum_gradeitem::load_from_forum_entity($forum);
        $capabilitymanager = forum_container::get_manager_factory()->get_capability_manager($forum);

        if (!$forumgradeitem->is_grading_enabled() || !$capabilitymanager->can_grade($user)) {
            return null;
        }

        return [
            'contextid' => $forum->get_context()->id,
            'cmid' => $cm->id,
            'name' => format_string($forum->get_name()),
            'courseid' => $course->id,
            'coursename' => format_string($course->shortname),
            'experimentaldisplaymode' => 0,
            // The group the viewer is looking at, so the grader opens on the
            // same students the report is showing.
            'groupid' => groups_get_activity_group($cm, true) ?: null,
            'gradingcomponent' => $forumgradeitem->get_grading_component_name(),
            'gradingcomponentsubtype' => $forumgradeitem->get_grading_component_subtype(),
            'gradeonlyactiveusers' => $forumgradeitem->should_grade_only_active_users() ? 1 : 0,
            'sendstudentnotifications' => $forum->should_notify_students_default_when_grade_for_forum(),
        ];
    }

    /**
     * Whether a row may offer a link into the assignment grader.
     *
     * @param cm_info $cm
     * @return bool
     */
    public static function can_use_assign_grader(cm_info $cm): bool {
        if ($cm->modname !== 'assign') {
            return false;
        }

        return has_capability('mod/assign:grade', \context_module::instance($cm->id));
    }
}
