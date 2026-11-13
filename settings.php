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
 * One setting: whether the guided tour of the report can be skipped.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// Its own heading in the reports menu, with a link per report under it, the
// way core's own multi-report plugins present themselves. Two flat entries
// side by side in the reports list would not say that they belong together.
$ADMIN->add('reports', new admin_category(
    'reportautogradercategory',
    get_string('pluginname', 'report_autograder')
));

$ADMIN->add('reportautogradercategory', new admin_externalpage(
    'reportautograder',
    get_string('menu:report', 'report_autograder'),
    new moodle_url('/report/autograder/index.php'),
    'report/autograder:viewsite'
));

// Who autograder would grade as, one course at a time. Its own page rather
// than a column on the report: the answer is worked out per student, so it is
// never asked for the whole site at once.
$ADMIN->add('reportautogradercategory', new admin_externalpage(
    'reportautogradergraders',
    get_string('menu:graders', 'report_autograder'),
    new moodle_url('/report/autograder/graders.php'),
    'report/autograder:viewsite'
));

// Whether the guided tour of the report can be skipped. Moodle always lets a tour be closed with the Escape key and finished on
// its last step; required only takes away the button that skips it on the other steps.
$tourpage = new admin_settingpage('reportautogradersettings', get_string('settings', 'report_autograder'), 'moodle/site:config');

if ($ADMIN->fulltree) {
    $tourpage->add(new admin_setting_configcheckbox(
        'report_autograder/tourrequired',
        get_string('setting:tourrequired', 'report_autograder'),
        get_string('setting:tourrequired_desc', 'report_autograder'),
        0
    ));
}

$ADMIN->add('reportautogradercategory', $tourpage);

// Core hands every report plugin a settings page of its own before it includes
// this file, under the same name. Dropping it is what makes the link above the
// thing the menu points at, rather than an empty settings screen beside it.
$settings = null;
