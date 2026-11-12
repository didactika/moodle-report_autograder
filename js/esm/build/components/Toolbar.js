import{useEffect as p,useState as b}from"react";import g from"./DateFilter";import C from"./GroupFilter";import u from"./PickerFilter";import{IconActivity as N,IconCourse as P,IconReset as T,IconSearch as _}from"./common/Icons";import{useDebounced as F}from"../hooks/useDebounced";import{isNarrowed as O}from"../lib/filters";import{jsx as e,jsxs as s}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The bar above the table: the search box, the filters and the button that clears them all.
 *
 * @module     report_autograder/components/Toolbar
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function w({props:a,filters:r,course:m,activity:h,text:o,onFilters:i,onCourse:d,onActivity:f,onReset:v}){const[c,l]=b(r.searchname),n=F(c,300);return p(()=>{n!==r.searchname&&i({searchname:n})},[n]),p(()=>{l(r.searchname)},[r.searchname]),s("div",{className:"arp-toolbar",role:"search",children:[s("div",{className:`arp-search${c!==""?" arp-search-on":""}`,children:[e("span",{className:"arp-search-icon",children:e(_,{})}),e("input",{type:"search",className:"arp-search-field",value:c,placeholder:`${o("filter_search")}\u2026`,"aria-label":o("filter_search"),onChange:t=>l(t.target.value)})]}),s("div",{className:"arp-filters",children:[a.showscoursefilter&&e(u,{type:"course",icon:e(P,{}),label:o("filter_course"),chosen:m,scope:a.scope,courseid:0,text:o,onChange:d}),a.showsactivityfilter&&e(u,{type:"activity",icon:e(N,{}),label:o("filter_activity"),chosen:h,scope:a.scope,courseid:r.courseid,text:o,onChange:f}),a.showsgroupfilter&&e(C,{groups:a.groups,offersAll:a.offersallgroups,chosen:r.groupid,text:o,onChange:t=>i({groupid:t})}),e(g,{from:r.datefrom,to:r.dateto,text:o,onChange:(t,y)=>i({datefrom:t,dateto:y})}),O(r)&&s("button",{type:"button",className:"arp-reset",onClick:v,"aria-label":o("filters_reset"),children:[e(T,{}),e("span",{className:"arp-reset-text",children:o("filters_reset")})]})]})]})}export{w as default};
