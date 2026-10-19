import{fetchOne as s}from"@moodle/lms/core/ajax";import{toRequest as i}from"../lib/filters";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Every web service call of the report, in one place.
 *
 * @module     report_autograder/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const a=e=>s({methodname:"report_autograder_get_report",args:{cmid:e.scope.cmid??0,courseid:e.scope.courseid??0,page:e.page,limit:e.limit,filters:i(e.filters),sortcolumn:e.sort.column,sortdir:e.sort.direction,withtotal:e.withtotal}}),c=(e,t,o,r)=>s({methodname:"report_autograder_search_filter_options",args:{type:e,query:t,cmid:o.cmid??0,courseid:o.courseid??0,filtercourseid:e==="activity"?r:0}}),m=(e,t,o,r)=>s({methodname:"report_autograder_get_graders",args:{courseid:e,students:t,page:o,perpage:r}}),g=e=>e instanceof Error?e.message:e!==null&&typeof e=="object"&&"message"in e?String(e.message):String(e);export{g as describeError,m as getGraders,a as getReport,c as searchOptions};
