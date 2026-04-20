<?php

/**
 * Shared forum grader context and assign grader capability (used by index and data enricher).
 *
 * @package     report_autograder
 * @copyright   2026 ADSDR <eduardo.cubias@ct.uneatlantico.es>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace report_autograder\local;

defined('MOODLE_INTERNAL') || die();

use cm_info;
use mod_forum\grades\forum_gradeitem;
use mod_forum\local\container as forum_container;
use stdClass;

/**
 * Shared UI context for forum JS grader and assign redirect URLs (keep in sync with index.php usage).
 */
class grader_ui
{
    /**
     * Context for mod_forum/grades templates and #autograder-report-container data-* attrs, or null if N/A.
     *
     * @param stdClass $course
     * @param cm_info $cm
     * @param stdClass $user
     * @return array<string, mixed>|null
     */
    public static function get_forum_grade_context(stdClass $course, cm_info $cm, stdClass $user): ?array {
        if ($cm->modname !== 'forum') {
            return null;
        }
        $vaultfactory = forum_container::get_vault_factory();
        $forumvault = $vaultfactory->get_forum_vault();
        $forum = $forumvault->get_from_course_module_id((int) $cm->id);
        if ($forum === null) {
            return null;
        }
        $forumgradeitem = forum_gradeitem::load_from_forum_entity($forum);
        $managerfactory = forum_container::get_manager_factory();
        $capabilitymanager = $managerfactory->get_capability_manager($forum);
        if (!$forumgradeitem->is_grading_enabled() || !$capabilitymanager->can_grade($user)) {
            return null;
        }
        $groupid = groups_get_activity_group($cm, true) ?: null;
        return [
            'contextid' => $forum->get_context()->id,
            'cmid' => $cm->id,
            'name' => format_string($forum->get_name()),
            'courseid' => $course->id,
            'coursename' => format_string($course->shortname),
            'experimentaldisplaymode' => 0,
            'groupid' => $groupid,
            'gradingcomponent' => $forumgradeitem->get_grading_component_name(),
            'gradingcomponentsubtype' => $forumgradeitem->get_grading_component_subtype(),
            'gradeonlyactiveusers' => $forumgradeitem->should_grade_only_active_users() ? 1 : 0,
            'sendstudentnotifications' => $forum->should_notify_students_default_when_grade_for_forum(),
        ];
    }

    /**
     * Whether the current user can open the assign activity grader for a student (redirect URL).
     */
    public static function can_use_assign_grader(cm_info $cm): bool {
        if ($cm->modname !== 'assign') {
            return false;
        }
        $ctx = \context_module::instance($cm->id);
        return has_capability('mod/assign:grade', $ctx);
    }
}
