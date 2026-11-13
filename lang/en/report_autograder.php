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
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'View the autograder report for an activity';
$string['autograder:viewcourse'] = 'View the autograder report for a whole course';
$string['autograder:viewfailed'] = 'See which autograder gradings failed, and why';
$string['autograder:viewsite'] = 'View the autograder report for the whole site';
$string['datepicker_from'] = 'From';
$string['datepicker_to'] = 'To';
$string['details:close'] = 'Close';
$string['details:grade_expected'] = 'Not in the gradebook yet: Autograder will record it on {$a}.';
$string['error:apirequest'] = 'The report could not be loaded: {$a}';
$string['failure:grade_write_failed'] = 'Moodle refused the grade autograder tried to post.';
$string['failure:no_grader'] = 'No teacher of this course was eligible to be graded on behalf of.';
$string['feedback:nothing_to_show'] = 'No records found';
$string['filter_activity'] = 'Activity';
$string['filter_clear'] = 'Clear';
$string['filter_course'] = 'Course';
$string['filter_date_last30'] = 'Last 30 days';
$string['filter_date_month'] = 'This month';
$string['filter_date_range'] = '{$a->from} to {$a->to}';
$string['filter_date_since'] = 'From {$a}';
$string['filter_date_today'] = 'Today';
$string['filter_date_until'] = 'Until {$a}';
$string['filter_date_week'] = 'Last 7 days';
$string['filter_grading_date'] = 'Grading date';
$string['filter_group'] = 'Group';
$string['filter_group_placeholder'] = 'All groups';
$string['filter_remove'] = 'Remove the filter {$a}';
$string['filter_search'] = 'Search';
$string['filter_status'] = 'Status';
$string['filters'] = 'Filters';
$string['filters_reset'] = 'Clear every filter';
$string['grade_expected'] = 'Expected';
$string['grade_provisional_help'] = 'The indicated grade is provisional and will not be saved until the date shown in the \'Grading date\' column.';
$string['gradedby_prospective'] = 'Will be graded as';
$string['gradedby_prospective_help'] = 'Autograder will post this grade in this teacher\'s name. The teacher is chosen at the moment of grading, so this can still change — if they leave the course or the group, somebody else will be chosen.';
$string['graders:activities'] = 'Activities';
$string['graders:associationnote'] = 'Course association. The activity report checks grading permissions and groups for that specific activity before showing the effective grader.';
$string['graders:back'] = 'All courses';
$string['graders:course'] = 'Course';
$string['graders:empty'] = 'No course has Autograder switched on.';
$string['graders:emptysearch'] = 'Nothing matches the search and the filter.';
$string['graders:filter_all'] = 'All the students';
$string['graders:filter_fallback'] = 'Graded by the fallback grader';
$string['graders:filter_nobody'] = 'Nobody would grade them';
$string['graders:grader'] = 'Would grade as';
$string['graders:gradercount'] = 'possible graders';
$string['graders:graders'] = 'Graders';
$string['graders:heading'] = 'Graders by course';
$string['graders:more'] = '+{$a} more';
$string['graders:nobodyfor'] = 'Nobody — this would fail';
$string['graders:nograders'] = 'Nobody in this course may grade. Every autograded activity here will fail unless a fallback grader is configured.';
$string['graders:none'] = 'No gradable students in this course.';
$string['graders:note'] = 'Note';
$string['graders:onlyfallback'] = 'No teacher of this course could grade, so every grade here would be recorded as the fallback grader of the site.';
$string['graders:openreport'] = 'Open this course\'s report';
$string['graders:possible'] = 'Who could grade here';
$string['graders:search'] = 'Search courses';
$string['graders:search_students'] = 'Search students';
$string['graders:seestudents'] = 'Who grades each student';
$string['graders:show'] = 'Show';
$string['graders:state'] = 'Grading';
$string['graders:state_fallback'] = 'Fallback grader only';
$string['graders:state_nobody'] = 'Nobody can grade';
$string['graders:state_ready'] = 'Ready';
$string['graders:student'] = 'Student';
$string['graders:studentcount'] = 'gradable students';
$string['graders:students'] = 'Students';
$string['graders:viafallback'] = 'Fallback';
$string['gradeuser'] = 'Grade user';
$string['header:activity'] = 'Activity';
$string['header:completed_at'] = 'Grading date';
$string['header:course'] = 'Course';
$string['header:external_status'] = 'Status';
$string['header:grade'] = 'Grade';
$string['header:gradedby'] = 'Graded as';
$string['header:groups'] = 'Groups';
$string['header:student'] = 'Name';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder across the site';
$string['helper'] = 'Provisional grade';
$string['info:date'] = 'Why this date';
$string['info:failure'] = 'Why it failed';
$string['info:grade'] = 'About this grade';
$string['info:grader'] = 'About this grader';
$string['info:problem'] = 'Why there is no grade';
$string['info:row'] = 'About this row';
$string['lead_activity'] = 'What Autograder decided for each student of this activity';
$string['lead_course'] = 'What Autograder decided for the students of this course, activity by activity';
$string['lead_graders'] = 'Who Autograder would grade as in each course, before any grade is due';
$string['lead_site'] = 'What Autograder decided across the site, narrowed by course, activity, status or date';
$string['menu:graders'] = 'Graders by course';
$string['menu:report'] = 'Grading report';
$string['needsfilter'] = 'Choose a course, an activity or another filter to run this report. The site-wide report is not run unfiltered: it would ask the database about every enrolment on the site at once.';
$string['pagination:all'] = 'All';
$string['pagination:all_results'] = 'All';
$string['pagination:label'] = 'Pagination';
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
$string['results_count'] = '{$a} results';
$string['search:loading'] = 'Searching…';
$string['search:nomatches'] = 'No matches';
$string['search:typetosearch'] = 'Type to search';
$string['setting:tourrequired'] = 'Require the guided tour';
$string['setting:tourrequired_desc'] = 'When enabled, the guided tour of the report of an activity and of a course cannot be skipped: each person goes through its steps the first time they open the report. When disabled, the tour can be skipped at any step.';
$string['settings'] = 'Settings of the report';
$string['sortby_date'] = 'Sort by grading date';
$string['sortby_name'] = 'Sort by student name';
$string['status:failed'] = 'Failed';
$string['status:graded'] = 'Autograded';
$string['status:manual'] = 'Graded by a teacher';
$string['status:notautograded'] = 'Not autograded';
$string['status:notengaged'] = 'Not submitted';
$string['status:pending'] = 'Pending';
$string['table:empty'] = 'No students match these filters.';
$string['tour_report_description'] = 'Introduces teachers to the report of an activity and of a course: the search, the filters, the columns and the pages of the list.';
$string['tour_report_name'] = 'Autograder report';
$string['tour_report_step1_content'] = '<p>This report shows, for each student, the decision of Autograder: whether the student is pending, has been graded automatically, has been graded by a teacher or could not be graded.</p><p>The following steps explain how to find a student and how to read each column.</p>';
$string['tour_report_step1_title'] = 'The Autograder report';
$string['tour_report_step2_content'] = '<p>Type part of the name of a student to narrow the list. The list changes as you type.</p>';
$string['tour_report_step2_title'] = 'Search';
$string['tour_report_step3_content'] = '<p>Choose one or more statuses to see only the students in them. The number beside each status is the number of students in it within the other filters.</p>';
$string['tour_report_step3_title'] = 'Status';
$string['tour_report_step4_content'] = '<p>Limit the list to a period: today, the last seven days, the current month, the last thirty days or two dates of your choice.</p>';
$string['tour_report_step4_title'] = 'Grading date';
$string['tour_report_step5_content'] = '<p>Select this button to remove every filter and the search at once.</p>';
$string['tour_report_step5_title'] = 'Clear the filters';
$string['tour_report_step6_content'] = '<p>Each row shows the status, the grading date, the grade and the teacher in whose name the grade is recorded.</p><p>A grade marked <strong>Expected</strong> is not in the gradebook yet: it is the grade the student will receive on the date shown, and the teacher beside it appears in grey. The button at the end of a row opens its details: what its date is based on, what is still to happen and, when something went wrong, why. Its colour is blue when it only informs, amber when there is a problem and red when the grading failed.</p>';
$string['tour_report_step6_title'] = 'The columns';
$string['tour_report_step7_content'] = '<p>Choose how many rows each page shows and move between the pages with the arrows.</p>';
$string['tour_report_step7_title'] = 'Pages';
$string['willgrade:nobody'] = 'This student has no teacher in this course, and no fallback grader is configured, so this grade cannot be posted. Check the roles configured as teachers, and whether a teacher shares one of the student\'s groups in the course\'s default grouping.';
