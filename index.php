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
/*********************************************
 * -------- END INITIALS BAR FILTER --------
 *********************************************/

/*********************************************
 * RECORDSET
 *********************************************/

/** The default number of results to be shown per page. */
define("COMPLETION_REPORT_PAGE", get_config('report_autograder', 'limitpagination') ?? 5);

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


/*********************************************
 * -------- END PAGINATION --------
 *********************************************/


/*********************************************
 *  INITIALS BAR
 *********************************************/
//---- RENDERING
$points_decimals =  grade_get_setting($course_id, 'decimalpoints', $CFG->grade_decimalpoints);
$separator_decimals = get_string('decsep', 'langconfig');

$result = report_autograder\webservices\get_grades::get_grades($course_id, $cmid, $modid, $mod_type, $actual_page, $sifirst, $silast, $separator_decimals, $points_decimals);
    
$grades_data = $result['data'];
$total_records = $result['total_records'];
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

//Renderización de la tabla
$renderable = new index_page($grades_data, [
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