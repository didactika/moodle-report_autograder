<?php
// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Plugin version and other meta-data are defined here.
 *
 * @package     report_autograder
 * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;


$settings->add(new admin_setting_configtext(
    'report_autograder/siteexternalid',
    get_string('setting:site_external_id', 'report_autograder'),
    get_string('setting:site_externalid_desc', 'report_autograder'),
    '',
    PARAM_TEXT
));

$settings->add(new admin_setting_configtext(
    'report_autograder/serviceurl',
    get_string('setting:url_field_name', 'report_autograder'),
    get_string('setting:url_field_desc', 'report_autograder'),
    'http://autograder-service-app-1:8085',
    PARAM_URL
));

$settings->add(new admin_setting_configtext(
    'report_autograder/paginationlimit',
    get_string('setting:pagination_limit_name', 'report_autograder'),
    get_string('setting:pagination_limit_desc', 'report_autograder'),
    20,
    PARAM_INT
));
