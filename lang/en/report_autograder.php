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
 * @copyright  2025
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
$string['header:completed_at'] = 'Grading date';
$string['grade_provisional_help'] = 'The indicated grade is provisional and will not be saved until the date shown in the \'Grading date\' column.';
$string['status:pending'] = 'Pending';
$string['status:awaiting_confirmation_of_rating'] = 'Waiting for your grade to be processed';
$string['status:ready_to_grade'] = 'Ready to grade';
$string['status:retry'] = 'Retrying';
$string['status:graded'] = 'Graded';
$string['status:failed'] = 'Failed';
$string['status:failed_notified'] = 'Failure notified to admin';
$string['status:skipped'] = 'Skipped';
$string['status:manual_grading'] = 'Manual grading';
$string['feedback:nothing_to_show'] = 'No records found';
$string['placeholder:automatic_grade'] = 'Automatic grade';
$string['navigation:go_back'] = 'Go back';
$string['navigation:location'] = 'Automatic Grades Report';
$string['error:grade_required'] = 'Grade is required';
$string['action:grade'] = 'Grade';
$string['setting:site_external_id'] = 'Site External ID';
$string['setting:site_externalid_desc'] = 'The external identifier for this Moodle site used by the autograder service';
$string['setting:url_field_name'] = 'External service URL';
$string['setting:url_field_desc'] = 'URL of the external service from which grade data will be requested';
$string['error:apirequest'] = 'Error communicating with the external service: {$a}';
$string['error:missing_config'] = 'The configuration for {$a} is missing. Please contact the administrator.';
$string['error:building_report_data'] = 'Error building report data. Please contact the administrator.';
$string['feedback:no_status'] = 'No Status';
$string['setting:pagination_limit_name'] = 'Pagination Limit';
$string['setting:pagination_limit_desc'] = 'The number of items to display per page in the Autograder report.';
$string['autograder:view'] = 'View autograder report';
$string['filter_all'] = 'All';
$string['manual_grading'] = 'Manual Grading';
$string['manual_grading_send'] = 'Send Grade';
$string['success:gradeupdated'] = 'Grade updated successfully!';
$string['error:updatefailed'] = 'Failed to update grade:';
$string['error:invalidgrade'] = 'Please enter a valid numeric grade.';
$string['error:gradetoolarge'] = 'The grade cannot be higher than {$a->maxgrade}.';
$string['error:negativegrade'] = 'The grade cannot be a negative value.';

$string['filter_button'] = 'Filter';
$string['filter_submission_date'] = 'Submission date';
$string['filter_grading_date'] = 'Grading date';
$string['filter_datefrom'] = 'Delivery date from';
$string['filter_dateto'] = 'Graded date from';
$string['filter_grade'] = 'Grade from';
$string['filter_grade_placeholder'] = 'Enter grade';
$string['filter_status'] = 'Status';
$string['filter_status_placeholder'] = 'Status...';
$string['filter_status_pending'] = 'Pending';
$string['filter_status_manual_grading'] = 'Manual grading';
$string['filter_status_graded'] = 'Graded';
$string['pagination:results_per_page'] = 'Results per page';
$string['pagination:all_results'] = 'All';
$string['pagination:of'] = 'of';
$string['pagination:previous'] = 'Previous page';
$string['pagination:next'] = 'Next page';
$string['filter_clear'] = 'Clear filters';
$string['filter_search'] = 'Search';
$string['datepicker_apply'] = 'Apply';
$string['datepicker_cancel'] = 'Clear';
$string['datepicker_from'] = 'From';
$string['datepicker_to'] = 'To';
$string['datepicker_custom'] = 'Custom';
$string['datepicker_week'] = 'Wk';
$string['filter_active'] = 'Active filters:';
$string['filter_active_searchname'] = 'Name: {$a}';
$string['filter_active_datefrom'] = 'From: {$a}';
$string['filter_active_dateto'] = 'From: {$a}';
$string['filter_active_grade'] = 'Grade: {$a}';
$string['filter_active_status'] = 'Status: {$a}';
$string['gradeuser'] = 'Grade user';
$string['sortby_name'] = 'Sort by student name';
$string['sortby_date'] = 'Sort by grading date';
$string['helper'] = 'Provisional grade';
