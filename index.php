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
 * @package     report_autograder
 * @category    report
 * @copyright   2022 Antonio Carmona <antonio.carmona@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once( '../../config.php' );
require_once($CFG->dirroot . '/report/autograder/lib.php');

use report_autograder\output\index_page;
/*********************************************
 * DECLARE CONST
 *********************************************/
const CAPABILITIES_REQUIRED = ['mod/assign:grade','mod/assign:reviewgrades','mod/assign:managegrades','mod/assign:releasegrades','mod/assign:managegrades'];
/*********************************************
 * QUERY PARAMS
 *********************************************/
$course_id = required_param('id', PARAM_INT);
$cmid = required_param('cmid', PARAM_INT);
$modid = required_param('modid', PARAM_INT);
$mod_type = required_param('modname', PARAM_ALPHA);
$actual_page = optional_param('page', 0, PARAM_INT);
$sifirst = optional_param('sifirst', 'all', PARAM_NOTAGS);
$silast = optional_param('silast', 'all', PARAM_NOTAGS);
/*********************************************
 * -------- END QUERY PARAMS --------
 *********************************************/

/*********************************************
 * PAGE CONFIGURATION
 *********************************************/
global $DB, $PAGE, $CFG, $OUTPUT;
[$course, $cm] = get_course_and_cm_from_cmid($cmid, $mod_type);
$page_url = new moodle_url('/report/autograder/index.php', [
    'id'      => $course->id,
    'cmid'    => $cm->id,
    'modname' => $cm->modname,
    'modid'   => $cm->instance,
]);

if ($actual_page !== 0) {
    $page_url->param('page', $actual_page);
}
if ($sifirst !== 'all') {
    $page_url->param('sifirst', $sifirst);
}
if ($silast !== 'all') {
    $page_url->param('silast', $silast);
}
$PAGE->set_url($page_url);
$PAGE->set_pagelayout('report');
require_login($course);

//Set global page configuration
$PAGE->set_context(context_system::instance());
echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('pluginname', 'report_autograder'));
/*********************************************
 * -------- END PAGE CONFIGURATION --------
 *********************************************/

/*********************************************
 * -------- VALIDATION CAPABILITIES --------
 *********************************************/

$contextCourse = context_course::instance($course->id);
require_all_capabilities(CAPABILITIES_REQUIRED, $contextCourse);

/*********************************************
 * -------- END VALIDATION CAPABILITIES --------
 *********************************************/

/*********************************************
 * BREADCRUMB NAVIGATION
 *********************************************/
$course_url = new moodle_url('/course/view.php', ['id' => $course->id]);
$activity_url = new moodle_url('/mod/' . $mod_type . '/view.php', ['id' => $cm->id]);
$nav_string_here = get_string('navigation:location', 'report_autograder');
$html_nav = '<nav aria-label="breadcrumb">';
$html_nav .= '<ol class="breadcrumb">';
$html_nav .= '<li class="breadcrumb-item"><a href=';
$html_nav .= "'$course_url'>$course->shortname</a></li>";
$html_nav .= '<li class="breadcrumb-item"><a href=';
$html_nav .= "'$activity_url'>$cm->name</a></li>";
$html_nav .= '<li class="breadcrumb-item active" aria-current="page">';
$html_nav .= "$nav_string_here</li>";
$html_nav .= '</ol></nav>';
echo $html_nav;
/*********************************************
 * -------- END BREADCRUMB NAVIGATION --------
 *********************************************/

/*********************************************
 *  INITIALS BAR FILTER
 *********************************************/
// ----- FILTERING
if ($sifirst !== 'all')
    set_user_preference('ifirst', $sifirst);

if ($silast !== 'all')
    set_user_preference('ilast', $silast);

$sifirst = ( !empty($USER->preference['ifirst']) ) ? $USER->preference['ifirst'] : 'all';

$silast = ( !empty($USER->preference['ilast']) ) ? $USER->preference['ilast'] : 'all';

// Generate where clause
$where = [];
$where_params = [];

if ($sifirst !== 'all') {
    $where[] = $DB->sql_like('u.firstname', ':sifirst', false, false);
    $where_params['sifirst'] = $sifirst . "%";
}

if ($silast !== 'all') {
    $where[] = $DB->sql_like('u.lastname', ':silast', false, false);
    $where_params['silast'] = $silast . "%";
}
/*********************************************
 * -------- END INITIALS BAR FILTER --------
 *********************************************/

/*********************************************
 * RECORDSET
 *********************************************/

/** The default number of results to be shown per page. */
define("COMPLETION_REPORT_PAGE", get_config('report_autograder', 'limitpagination') ?? 5);

$start_from = ( $actual_page) * COMPLETION_REPORT_PAGE;
if ($mod_type == 'forum') {
    $sql_report = "SELECT  laed.id,
                           laed.courseid, 
                           laed.relateduserid,
                           laed.timecreated,
                           laed.score_to_assign,
                           laed.date_to_grade,
                           laed.contextid,
                           laed.instanceid,
                           fg.id as fg_id,
                           fg.forum, 
                           fg.grade,
                           fg.timecreated as activity_created_at,
                           fg.timemodified as activity_modified_at";
    $sql = "  FROM {local_autograder_event_data} laed
              JOIN {user} u ON u.id = laed.relateduserid
              LEFT JOIN {forum_grades} fg 
                 ON (fg.forum = laed.instanceid AND fg.userid = laed.relateduserid)
              WHERE laed.id = (SELECT max(laed.id)
                               FROM {local_autograder_event_data} laed
                               WHERE laed.contextinstanceid = :cmi
                               AND laed.instanceid = :instanceid
                               AND laed.userid = u.id )";
} elseif ($mod_type == 'assign') {
    $sql_report = "SELECT  laed.id,
                           laed.courseid, 
                           laed.relateduserid,
                           laed.timecreated,
                           laed.score_to_assign,
                           laed.date_to_grade,
                           laed.contextid,
                           laed.instanceid, 
                           ag.id as ag_id,
                           ag.assignment,
                           ag.grade,
                           ag.timecreated as activity_created_at,
                           ag.timemodified as activity_modified_at";
    $sql = " FROM {local_autograder_event_data} laed 
              JOIN {user} u ON u.id = laed.relateduserid              
         LEFT JOIN {assign_grades} ag ON (ag.assignment = laed.instanceid 
             AND ag.userid = laed.relateduserid )
             WHERE laed.id = (SELECT max(laed.id)
                               FROM {local_autograder_event_data} laed
                               WHERE laed.contextinstanceid = :cmi
                               AND laed.instanceid = :instanceid
                               AND laed.userid = u.id )";
} else print_error('invalidaction');

$sql_count = "SELECT COUNT(laed.id)";
$sql_params = ['cmi' => $cmid, 'instanceid'=>$modid];
$sort = "laed.timecreated DESC";

if ($where) {
    $where_string = implode(' AND ', $where);
    $sql .= " AND $where_string";
    $sql_params = array_merge($sql_params, $where_params);
}

if ($sort) {
    $sql .= " ORDER BY " . $sort;
}


/** @var moodle_recordset $record_set */
$record_set = $DB->get_recordset_sql($sql_report. $sql, $sql_params, $start_from, COMPLETION_REPORT_PAGE);
$total_records = $DB->count_records_sql($sql_count . $sql, $sql_params);
//if (!$record_set->valid()){
//    $renderable = new index_page([]);
//    echo $OUTPUT->render($renderable);
//    echo $OUTPUT->footer();
//    exit;
//}
/*********************************************
 * -------- END RECORDSET --------
 *********************************************/

/*********************************************
 * Pagination
 * Definición de las variables necesarias para la paginación
 *********************************************/

$pages = ceil($total_records / COMPLETION_REPORT_PAGE);
$next_page = $actual_page >= $pages ? $pages : $actual_page + 1;
$last_page_active = isset($page_data->pages);
$last_url = isset($page_data->pages) ? count($page_data->pages) : 1;
/*********************************************
 * -------- END PAGINATION --------
 *********************************************/


/*********************************************
 *  INITIALS BAR
 *********************************************/
//---- RENDERING
$pagingbar = '';

// Initials bar.
$prefixfirst = 'sifirst';
$prefixlast = 'silast';

// The URL used in the initials bar should reset the 'start' parameter.
$initialsbarurl = fullclone($page_url);
$initialsbarurl->remove_params('page');

$pagingbar .= $OUTPUT->initials_bar($sifirst, 'firstinitial mt-2', get_string('firstname'), $prefixfirst, $initialsbarurl);
$pagingbar .= $OUTPUT->initials_bar($silast, 'lastinitial', get_string('lastname'), $prefixlast, $initialsbarurl);
$pagingbar .= $OUTPUT->paging_bar($total_records, $actual_page, COMPLETION_REPORT_PAGE, $page_url);
print $pagingbar;

/*********************************************
 * -------- END INITIALS BAR --------
 *********************************************/

/*********************************************
 * RENDER TABLE
 * Construcción del array de datos para la tabla
 * //$date_to_grade = date('d/m/Y', $DB->get_field('local_autograder', 'datetograde', ['cmid' => $cmid]));
 * //$grade_to_apply = $DB->get_field('local_autograder', 'autogradergrade', ['cmid' => $cmid]);
 *********************************************/
$objects = [];
//get points decimal configured
$points_decimals =  grade_get_setting($course_id, 'decimalpoints', $CFG->grade_decimalpoints);
$separator_decimals = get_string('decsep', 'langconfig');

foreach ($record_set as $record) {
    if (!is_enrolledstudent($record->relateduserid, $record->courseid)) {
        continue;
    }
    $student_info = \core_user::get_user($record->relateduserid);
    $student_name = fullname($student_info);
    $submission_date = $record->timecreated;
    $submission_graded = !is_null($record->activity_modified_at)
        ? $record->activity_modified_at
        : $submission_date;
    $score_created_at = userdate($submission_date, get_string('strftimedatetime', 'core_langconfig'));
    $score_modified_at = userdate($submission_graded, get_string('strftimedatetime', 'core_langconfig'));
    $grade_to_apply = $record->score_to_assign;
    $date_to_grade = userdate($record->date_to_grade, get_string('strftimedatetime', 'core_langconfig'));
    $url_to_edit = new moodle_url("/report/autograder/{$mod_type}_save.php");
    $description = get_string('gradeverb');
    $general_status = get_string('status:placeholder', 'report_autograder');
    // Chequeamos el estatus y la nota a ser enviada al template
    if (is_null($record->grade) || $record->grade == -1 || $record->grade == '-1.00000') {
        $status = get_string('status:pending', 'report_autograder');
        $grade_clean = $grade_to_apply;
        $grade_to_show = 0.00;
        $placeholder = $general_status . ": " . $grade_to_apply;
    } else {
        $status = get_string('status:graded', 'report_autograder');
        $grade_clean = $record->grade;
        $grade_to_show = format_float(unformat_float($record->grade),$points_decimals);
        $placeholder = null;
    }

    $objects[] = [
        "userid"                   => $student_info->id,
        "grade"                    => $grade_to_show,
        "grade_placeholder"        => $placeholder,
        "grade_action_description" => $description,
        "timecreated"              => $record->timecreated,
        "timemodified"             => $record->timemodified ?? 0,
        "user_name"                => $student_name,
        "submission_date"          => $score_created_at,
        "submission_graded"        => $score_modified_at,
        "date_to_grade"            => $date_to_grade ? : get_string('status:nothing_to_show', 'report_autograder'),
        "context_id"               => $record->contextid,
        "course_id"                => $record->courseid,
        "modid"                    => $record->instanceid,
        "grade_clean"              => $grade_clean,
        "status"                   => $status,
        "mod_type"                 => $mod_type,
    ];
}
$record_set->close();

//Renderización de la tabla
$renderable = new index_page($objects, [
    'points_decimals' => $points_decimals,
    'separator_decimals' =>$separator_decimals
]);
echo $OUTPUT->render($renderable);

/*********************************************
 * -------- END RENDER TABLE --------
 *********************************************/

//renderización de la paginación

$pagingbarfooter = new paging_bar($total_records, $actual_page, COMPLETION_REPORT_PAGE, $page_url);

echo $OUTPUT->render($pagingbarfooter);

echo $OUTPUT->footer();
exit;