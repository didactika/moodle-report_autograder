import{jsx as u,jsxs as e}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The statuses of the report as chips with the number of students in each: one press narrows the report to a status, another
 * lifts it. The numbers are counted inside every other filter, so they say what the report would show.
 *
 * @module     report_autograder/components/StatusTabs
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function b({options:l,counts:n,chosen:a,total:o,text:r,onChange:p}){if(n.length===0)return null;const c=n.reduce((t,s)=>t+s.count,0),i=(n.length>0?n:l.map(t=>({...t,count:0}))).filter(t=>t.count>0||a.includes(t.key));return e("div",{className:"arp-statuses",role:"group","aria-label":r("filter_status"),children:[e("button",{type:"button",className:`arp-status${a.length===0?" arp-status-on":""}`,"aria-pressed":a.length===0,onClick:()=>p([]),children:[r("status_all")," ",u("span",{className:"arp-status-count",children:a.length===0&&o>0?o:c})]}),i.map(t=>{const s=a.includes(t.key);return e("button",{type:"button",className:`arp-status${s?" arp-status-on":""}`,"aria-pressed":s,onClick:()=>p(s?[]:[t.key]),children:[u("span",{className:`arp-dot arp-dot-${t.key}`}),t.label," ",u("span",{className:"arp-status-count",children:t.count})]},t.key)})]})}export{b as default};
