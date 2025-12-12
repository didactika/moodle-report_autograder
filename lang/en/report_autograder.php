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
 * Lang strings
 *
 * @package    report
 * @subpackage autograder
 * @copyright  2022
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'Autograder Report';
$string['header:student'] = 'Name';
$string['header:delivery_date'] = 'Delivered Date';
$string['header:modification_date'] = 'Last modification (grading)';
$string['header:grade_date'] = 'Date to be graded';
$string['header:grade'] = 'Grade';
$string['header:status'] = 'Status';
$string['header:external_status'] = 'Status';
$string['header:completed_at'] = 'Graded Date';
$string['status:pending'] = 'Pending';
$string['status:waiting_for_due_date'] = 'Waiting for due date';
$string['status:waiting_for_grading'] = 'Waiting for grading';
$string['status:ready_to_grade'] = 'Ready to grade';
$string['status:grading'] = 'Grading';
$string['status:graded'] = 'Graded';
$string['status:failed'] = 'Failed';
$string['status:skipped'] = 'Skipped';
    $string['status:manual_grading'] = 'Manual grading';
$string['feedback:nothing_to_show'] = 'No records found';
$string['placeholder:automatic_grade'] = 'Automatic grade';
$string['navigation:go_back'] = 'Go back';
$string['navigation:location'] = 'Automatic Grades Report';
$string['error:grade_required'] = 'Grade is required';
$string['action:grade'] = 'Grade';
$string['setting:url_field_name'] = 'External service URL';
$string['setting:url_field_desc'] = 'URL of the external service to send grade data to';
$string['error:missing_config'] = 'The configuration for {$a} is missing. Please contact the administrator.';
$string['error:building_report_data'] = 'Error building report data. Please contact the administrator.';
$string['feedback:no_status'] = 'No Status';
$string['setting:pagination_limit_name'] = 'Pagination Limit';
$string['setting:pagination_limit_desc'] = 'The number of items to display per page in the Autograder report.';
$string['report/autograder:view'] = 'View autograder report';
$string['filter_all'] = 'All';
$string['manual_grading'] = 'Manual Grading';
$string['manual_grading_send'] = 'Send Grade';
$string['success:gradeupdated'] = 'Grade updated successfully!';
$string['error:updatefailed'] = 'Failed to update grade:';
$string['error:invalidgrade'] = 'Please enter a valid numeric grade.';
$string['error:gradetoolarge'] = 'The grade cannot be higher than {$a->maxgrade}.';
$string['error:negativegrade'] = 'The grade cannot be a negative value.';

$string['filter_button'] = 'Filter';
$string['filter_searchname'] = 'Search by name';
$string['filter_search_placeholder'] = 'Enter name to search';
$string['filter_datefrom'] = 'Date from';
$string['filter_dateto'] = 'Date to';
$string['filter_grade'] = 'Grade';
$string['filter_grade_placeholder'] = 'Enter grade';
$string['filter_status'] = 'Status';
$string['filter_clear'] = 'Clear filters';
$string['filter_search'] = 'Search';
$string['filter_active'] = 'Active filters:';
$string['filter_active_searchname'] = 'Name: {$a}';
$string['filter_active_datefrom'] = 'From: {$a}';
$string['filter_active_dateto'] = 'To: {$a}';
$string['filter_active_grade'] = 'Grade: {$a}';
$string['filter_active_status'] = 'Status: {$a}';

