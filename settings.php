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
 * The site-wide report, in the administration reports menu.
 *
 * There are no settings: with autograder running inside Moodle there is no
 * service to point this report at any more, and everything it needs is
 * already configured on the activities themselves.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('reports', new admin_externalpage(
    'reportautograder',
    get_string('pluginname', 'report_autograder'),
    new moodle_url('/report/autograder/index.php'),
    'report/autograder:viewsite'
));

// Core hands every report plugin a settings page of its own before it includes
// this file, under the same name. Dropping it is what makes the link above the
// thing the menu points at, rather than an empty settings screen beside it.
$settings = null;
