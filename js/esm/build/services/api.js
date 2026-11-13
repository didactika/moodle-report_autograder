import{fetchOne as o}from"@moodle/lms/core/ajax";import{toRequest as p}from"../lib/filters";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Every web service call of the report, in one place.
 *
 * @module     report_autograder/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const c=e=>o({methodname:"report_autograder_get_report",args:{cmid:e.scope.cmid??0,courseid:e.scope.courseid??0,page:e.page,limit:e.limit,filters:p(e.filters),sortcolumn:e.sort.column,sortdir:e.sort.direction,withtotal:e.withtotal}}),d=(e,t,r,s)=>o({methodname:"report_autograder_search_filter_options",args:{type:e,query:t,cmid:r.cmid??0,courseid:r.courseid??0,filtercourseid:e==="activity"?s:0}}),g=(e,t,r,s,i,n)=>o({methodname:"report_autograder_get_graders",args:{courseid:e,students:t,page:r,perpage:s,search:i,filter:n}}),u=(e,t,r)=>o({methodname:"report_autograder_get_graders_overview",args:{search:e,page:t,perpage:r}}),l=e=>e instanceof Error?e.message:e!==null&&typeof e=="object"&&"message"in e?String(e.message):String(e);export{l as describeError,g as getGraders,u as getGradersOverview,c as getReport,d as searchOptions};
