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
$string['filter_group'] = 'Group';
$string['filter_group_placeholder'] = 'All groups';
$string['filter_search'] = 'Search';
$string['filter_status_placeholder'] = 'Status...';
$string['grade_provisional_help'] = 'The indicated grade is provisional and will not be saved until the date shown in the \'Grading date\' column.';
$string['gradedby_prospective'] = 'Will be graded as';
$string['gradedby_prospective_help'] = 'Autograder will post this grade in this teacher\'s name. The teacher is chosen at the moment of grading, so this can still change — if they leave the course or the group, somebody else will be chosen.';
$string['graders:associationnote'] = 'Course association. The activity report checks grading permissions and groups for that specific activity before showing the effective grader.';
$string['graders:courseidplaceholder'] = 'Search for a course…';
$string['graders:grader'] = 'Would grade as';
$string['graders:gradercount'] = '{$a} possible grader(s)';
$string['graders:heading'] = 'Graders by course';
$string['graders:intro'] = 'Choose a course to see who autograder would post its grades as, before any of them are due.';
$string['graders:nobodyfor'] = 'Nobody — this would fail';
$string['graders:nograders'] = 'Nobody in this course may grade. Every autograded activity here will fail unless a fallback grader is configured.';
$string['graders:none'] = 'No gradable students in this course.';
$string['graders:openreport'] = 'Open this course\'s report';
$string['graders:pickcourse'] = 'Course';
$string['graders:possible'] = 'Who could grade here';
$string['graders:seestudents'] = 'See which grader each student would get';
$string['graders:show'] = 'Show';
$string['graders:student'] = 'Student';
$string['graders:studentcount'] = '{$a} gradable student(s)';
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
$string['menu:graders'] = 'Graders by course';
$string['menu:report'] = 'Grading report';
$string['needsfilter'] = 'Choose a course, an activity or another filter to run this report. The site-wide report is not run unfiltered: it would ask the database about every enrolment on the campus at once.';
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
$string['search:loading'] = 'Searching…';
$string['search:nomatches'] = 'No matches';
$string['sortby_date'] = 'Sort by grading date';
$string['sortby_name'] = 'Sort by student name';
$string['status:failed'] = 'Failed';
$string['status:graded'] = 'Autograded';
$string['status:manual'] = 'Graded by a teacher';
$string['status:notautograded'] = 'Not autograded';
$string['status:notengaged'] = 'Not submitted';
$string['status:pending'] = 'Pending';
$string['willgrade:nobody'] = 'This student has no teacher in this course, and no fallback grader is configured, so this grade cannot be posted. Check the roles configured as teachers, and whether a teacher shares one of the student\'s groups in the course\'s default grouping.';
