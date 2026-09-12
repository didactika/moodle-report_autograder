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
 * English language strings.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'View the autograder report for an activity';
$string['autograder:viewcourse'] = 'View the autograder report for a whole course';
$string['autograder:viewfailed'] = 'See which autograder gradings failed, and why';
$string['autograder:viewsite'] = 'View the autograder report for the whole site';
$string['datepicker_apply'] = 'Apply';
$string['datepicker_cancel'] = 'Clear';
$string['datepicker_custom'] = 'Custom';
$string['datepicker_from'] = 'From';
$string['datepicker_to'] = 'To';
$string['datepicker_week'] = 'Wk';
$string['error:apirequest'] = 'The report could not be loaded: {$a}';
$string['failure:grade_write_failed'] = 'Moodle refused the grade autograder tried to post.';
$string['failure:no_grader'] = 'No teacher of this course was eligible to be graded on behalf of.';
$string['feedback:nothing_to_show'] = 'No records found';
$string['filter_activity'] = 'Activity';
$string['filter_activity_placeholder'] = 'All activities';
$string['filter_course'] = 'Course';
$string['filter_course_placeholder'] = 'All courses';
$string['filter_grading_date'] = 'Grading date';
$string['filter_search'] = 'Search';
$string['filter_status_graded'] = 'Autograded';
$string['filter_status_manual_grading'] = 'By a teacher';
$string['filter_status_pending'] = 'Pending';
$string['filter_status_placeholder'] = 'Status...';
$string['grade_provisional_help'] = 'The indicated grade is provisional and will not be saved until the date shown in the \'Grading date\' column.';
$string['gradeuser'] = 'Grade user';
$string['header:activity'] = 'Activity';
$string['header:completed_at'] = 'Grading date';
$string['header:course'] = 'Course';
$string['header:external_status'] = 'Status';
$string['header:grade'] = 'Grade';
$string['header:gradedby'] = 'Graded as';
$string['header:student'] = 'Name';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder across the site';
$string['helper'] = 'Provisional grade';
$string['pagination:all_results'] = 'All';
$string['pagination:next'] = 'Next page';
$string['pagination:of'] = 'of';
$string['pagination:previous'] = 'Previous page';
$string['pagination:results_per_page'] = 'Results per page';
$string['pluginname'] = 'Autograder report';
$string['privacy:metadata'] = 'The autograder report shows what local_autograder recorded and what is already in the gradebook. It stores nothing of its own.';
$string['provisional:advancedstale'] = 'The rubric or marking guide changed after autograder was told what to mark, so there is no grade to promise. Open the activity\'s autograder settings and choose the levels again.';
$string['provisional:noscale'] = 'This activity no longer uses a scale.';
$string['provisional:scalemismatch'] = 'The item autograder would award does not belong to the scale this activity uses now.';
$string['provisional:unknown'] = 'Autograder cannot grade this activity as it is set up.';
$string['provisional:unset'] = 'No grade has been set for autograder to award.';
$string['reason:completion'] = 'Counted from when the student completed the activity.';
$string['reason:duedate'] = 'Counted from the activity\'s close date.';
$string['reason:groupoverride'] = 'Counted from the close date a group exception grants this student.';
$string['reason:submission'] = 'Counted from when the student submitted.';
$string['reason:useroverride'] = 'Counted from the close date an exception grants this student.';
$string['sortby_date'] = 'Sort by grading date';
$string['sortby_name'] = 'Sort by student name';
$string['status:failed'] = 'Failed';
$string['status:graded'] = 'Autograded';
$string['status:manual'] = 'By a teacher';
$string['status:notautograded'] = 'Not autograded';
$string['status:notengaged'] = 'Not submitted';
$string['status:pending'] = 'Pending';
$string['summary:heading'] = 'At a glance';
$string['summary:total'] = '{$a} student(s) across the autograded activities in view.';
