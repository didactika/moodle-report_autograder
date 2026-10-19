import{useRef as d,useState as u}from"react";import{IconChevron as b,IconClose as f}from"./Icons";import C from"./Floating";import{jsx as a,jsxs as r}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The button of a filter in the bar: a pill with the name of the filter or what it is set to, an arrow, and a button that clears
 * it once it is on. Its panel hangs from it.
 *
 * @module     report_autograder/components/common/Chip
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function N({icon:s,label:p,value:t,onClear:c,clearLabel:l,minWidth:h=240,children:m}){const i=d(null),[e,n]=u(!1),o=t!=="";return r("div",{ref:i,className:`arp-chip${o?" arp-chip-on":""}${e?" arp-chip-open":""}`,children:[r("button",{type:"button",className:"arp-chip-button","aria-haspopup":"dialog","aria-expanded":e,onClick:()=>n(!e),children:[a("span",{className:"arp-chip-icon",children:s}),a("span",{className:"arp-chip-text",children:o?t:p}),!o&&a("span",{className:"arp-chip-arrow",children:a(b,{})})]}),o&&a("button",{type:"button",className:"arp-chip-clear","aria-label":l,onClick:c,children:a(f,{})}),e&&a(C,{anchor:i,onClose:()=>n(!1),minWidth:h,label:p,children:m(()=>n(!1))})]})}export{N as default};
