import u from"./common/Chip";import{IconCheck as c}from"./common/Icons";import{jsx as l,jsxs as m}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The status filter: the states that the viewer may filter by, as options that can be switched on together.
 *
 * @module     report_autograder/components/StatusFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function f({options:s,chosen:a,text:r,onChange:n}){const o=t=>s.find(e=>e.key===t)?.label??t;let i="";a.length===1?i=o(a[0]):a.length>1&&(i=r("filter_status_count",a.length));const p=t=>{n(a.includes(t)?a.filter(e=>e!==t):[...a,t])};return l(u,{icon:l("span",{className:`arp-dot arp-dot-${a.length===1?a[0]:"any"}`}),label:r("filter_status"),value:i,clearLabel:r("filter_clear"),onClear:()=>n([]),minWidth:230,children:()=>l("ul",{className:"arp-options",role:"listbox","aria-multiselectable":"true","aria-label":r("filter_status"),children:s.map(t=>{const e=a.includes(t.key);return l("li",{role:"option","aria-selected":e,children:m("button",{type:"button",className:`arp-option${e?" arp-option-on":""}`,onClick:()=>p(t.key),children:[l("span",{className:`arp-dot arp-dot-${t.key}`}),l("span",{className:"arp-option-label",children:t.label}),e&&l("span",{className:"arp-option-check",children:l(c,{})})]})},t.key)})})})}export{f as default};
