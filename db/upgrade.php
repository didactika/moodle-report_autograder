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
 * Upgrades of the report.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Upgrades the report.
 *
 * @param int $oldversion The version the site had.
 * @return bool Always true.
 */
function xmldb_report_autograder_upgrade($oldversion) {
    global $CFG;

    if ($oldversion < 2026101403) {
        // The guided tour of the report, for the sites that installed it before it existed.
        require_once($CFG->dirroot . '/report/autograder/lib.php');
        report_autograder_import_tours();

        upgrade_plugin_savepoint(true, 2026101403, 'report', 'autograder');
    }

    return true;
}
