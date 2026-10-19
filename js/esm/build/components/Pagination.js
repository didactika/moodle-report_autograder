import{IconChevronLeft as h,IconChevronRight as f}from"./common/Icons";import{pageList as v}from"../lib/filters";import{jsx as n,jsxs as u}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What is under a table: which rows are shown, the pages, and how many rows a page has.
 *
 * @module     report_autograder/components/Pagination
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function N({page:e,limit:o,total:t,sizes:r,showing:c,disabled:p,text:i,onPage:s,onSize:b}){if(t<=0)return null;const l=Math.max(1,Math.ceil(t/o)),m=e*o+1,d=Math.min(t,(e+1)*o);return u("nav",{className:"arp-pagination","aria-label":i("pagination:label"),children:[n("p",{className:"arp-pagination-showing",children:c||i("pagination:showing",{from:m,to:d,total:t})}),u("label",{className:"arp-pagination-size",children:[n("span",{children:i("pagination:results_per_page")}),n("select",{value:o,disabled:p,onChange:a=>b(Number(a.target.value)),children:(r.includes(o)?r:[...r,o].sort((a,g)=>a-g)).map(a=>n("option",{value:a,children:a},a))})]}),l>1&&u("ul",{className:"arp-pages",children:[n("li",{children:n("button",{type:"button",className:"arp-page","aria-label":i("pagination:previous"),disabled:p||e===0,onClick:()=>s(e-1),children:n(h,{})})}),v(e,l).map((a,g)=>n("li",{children:a<0?n("span",{className:"arp-page-gap","aria-hidden":"true",children:"\u2026"}):n("button",{type:"button",className:`arp-page${a===e?" arp-page-on":""}`,"aria-current":a===e?"page":void 0,"aria-label":i("pagination:page",{page:a+1,pages:l}),disabled:p,onClick:()=>s(a),children:a+1})},`${a}-${g}`)),n("li",{children:n("button",{type:"button",className:"arp-page","aria-label":i("pagination:next"),disabled:p||e+1>=l,onClick:()=>s(e+1),children:n(f,{})})})]})]})}export{N as default};
