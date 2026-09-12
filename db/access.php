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
 * Capabilities this report defines.
 *
 * One per level, because they are genuinely different audiences: a teacher
 * looks at their own activity, a course leader at a whole course, an
 * administrator at the site. They are declared here rather than borrowed from
 * local_autograder because a capability belongs to the plugin that checks it.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$capabilities = [
    // One activity's report, reached from the activity itself.
    'report/autograder:view' => [
        'riskbitmask' => RISK_PERSONAL,
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes' => [
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ],
    ],

    // Every autograded activity in one course, from the course reports menu.
    'report/autograder:viewcourse' => [
        'riskbitmask' => RISK_PERSONAL,
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW,
        ],
    ],

    // The whole site, from the administration reports menu.
    'report/autograder:viewsite' => [
        'riskbitmask' => RISK_PERSONAL,
        'captype' => 'read',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => [
            'manager' => CAP_ALLOW,
        ],
    ],

    // Seeing that autograder *tried and could not*, and why.
    //
    // A failure is a fact about the installation — no eligible teacher, a
    // rubric that no longer matches, a grade the activity refused — not about
    // the student, and acting on one is an administrator's job. Without this
    // capability those rows still appear, because hiding a student entirely
    // would read as "this person is not here"; they just say the activity was
    // not autograded, with no technical detail.
    'report/autograder:viewfailed' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            'manager' => CAP_ALLOW,
        ],
    ],
];
