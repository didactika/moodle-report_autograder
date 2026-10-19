import u from"./common/Chip";import{IconCheck as d,IconGroup as b}from"./common/Icons";import{jsx as o,jsxs as h}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The group filter, for the reports where groups are in play: the groups that the viewer may see, and all of them when the viewer
 * may.
 *
 * @module     report_autograder/components/GroupFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function f({groups:n,offersAll:r,chosen:p,text:e,onChange:c}){const t=n.find(a=>a.id===p),s=t&&(r||n.length>1)?t.name:"",m=r?[{id:0,name:e("filter_group_placeholder")},...n]:n;return o(u,{icon:o(b,{}),label:r?e("filter_group"):t?.name??e("filter_group"),value:s,clearLabel:e("filter_clear"),onClear:()=>c(0),minWidth:220,children:a=>o("ul",{className:"arp-options",role:"listbox","aria-label":e("filter_group"),children:m.map(i=>{const l=i.id===p;return o("li",{role:"option","aria-selected":l,children:h("button",{type:"button",className:`arp-option${l?" arp-option-on":""}`,onClick:()=>{c(i.id),a()},children:[o("span",{className:"arp-option-label",children:i.name}),l&&o("span",{className:"arp-option-check",children:o(d,{})})]})},i.id)})})})}export{f as default};
