import{useMemo as x,useState as r}from"react";import S from"./components/Pagination";import T from"./components/ReportTable";import C from"./components/Toolbar";import{createText as F}from"./engine/text";import{useReport as P}from"./hooks/useReport";import{NO_FILTERS as E,nextSort as L}from"./lib/filters";import{jsx as u,jsxs as O}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The autograder report: a bar of filters, one table and its pages, for an activity, a course or the whole site.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes. Filtering, sorting and paging are done by the
 * server, because the report of a site can have more rows than a browser should ever be sent.
 *
 * @module     report_autograder/Report
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const M=t=>{const e=t.forumgrade;return e?{"data-contextid":e.contextid,"data-cmid":e.cmid,"data-name":e.name,"data-course-id":e.courseid,"data-course-name":e.coursename,"data-experimental-display-mode":e.experimentaldisplaymode,"data-group":e.groupid??"","data-grading-component":e.gradingcomponent,"data-grading-component-subtype":e.gradingcomponentsubtype,"data-gradable-itemtype":"forum","data-grade-only-active-users":e.gradeonlyactiveusers,...e.sendstudentnotifications?{"data-send-student-notifications":1}:{}}:{}};function z(t){const e=x(()=>F(t.strings),[t.strings]),[n,l]=r(t.opening),[y,g]=r(t.selectedcourse),[v,s]=r(t.selectedactivity),[d,c]=r({column:"",direction:"asc"}),[f,R]=r(t.pagesizes[0]??12),[i,p]=P({scope:t.scope,filters:n,sort:d,limit:f}),b=o=>{const a=o.target.closest('[data-grade-action="launch"][data-initialuserid]');a&&t.forumgrade&&(o.currentTarget.dataset.initialuserid=a.dataset.initialuserid)},m=o=>{l(a=>({...a,...o})),c({column:"",direction:"asc"})};return O("div",{id:"autograder-report-container",className:"arp",onClickCapture:b,...M(t),children:[u(C,{props:t,filters:n,course:y,activity:v,text:e,onFilters:m,onCourse:o=>{g(o),s(null),m({courseid:o?.id??0,cmid:0})},onActivity:o=>{s(o),m({cmid:o?.id??0})},onReset:()=>{g(null),s(null),l({...E,groupid:t.offersallgroups?0:n.groupid}),c({column:"",direction:"asc"})}}),u(T,{state:i,columns:t.columns,forumgrade:t.forumgrade,sort:d,text:e,onSort:o=>c(L(d,o)),onRetry:()=>p(i.page)}),u(S,{page:i.page,limit:i.limit||f,total:i.total,sizes:t.pagesizes,showing:"",disabled:i.loading,text:e,onPage:p,onSize:R})]})}export{z as default};
