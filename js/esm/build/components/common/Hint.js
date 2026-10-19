import{useRef as s,useState as p}from"react";import c from"./Floating";import{Fragment as f,jsx as e,jsxs as m}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A small icon that opens a short explanation when it is pressed, for the dates, the grades and the graders that need one.
 *
 * @module     report_autograder/components/common/Hint
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function u({text:l,label:n,icon:r,className:a}){const o=s(null),[t,i]=p(!1);return m(f,{children:[e("button",{ref:o,type:"button",className:`arp-hint${a?` ${a}`:""}`,"aria-label":n,"aria-expanded":t,onClick:()=>i(!t),children:r}),t&&e(c,{anchor:o,onClose:()=>i(!1),minWidth:200,className:"arp-hint-panel",label:n,children:e("p",{className:"arp-hint-text",children:l})})]})}export{u as default};
