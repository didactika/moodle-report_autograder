import{useMemo as p}from"react";import u from"./common/Chip";import{IconCalendar as o}from"./common/Icons";import{datePresets as c}from"../lib/filters";import{jsx as r,jsxs as n}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The grading date filter: ranges that can be chosen with one press, and two date fields for any other range. The fields are the
 * date inputs of the browser, so the calendar is the one of the person's own system and no library ships with the plugin.
 *
 * @module     report_autograder/components/DateFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const f=(e,a,t)=>e!==""&&a!==""?e===a?e:t("filter_date_range",{from:e,to:a}):e!==""?t("filter_date_since",e):a===""?"":t("filter_date_until",a);function m({from:e,to:a,text:t,onChange:l}){const s=p(()=>c(new Date),[]);return r(u,{icon:r(o,{}),label:t("filter_grading_date"),value:f(e,a,t),clearLabel:t("filter_clear"),onClear:()=>l("",""),minWidth:280,children:d=>n("div",{className:"arp-dates",children:[r("ul",{className:"arp-presets",children:s.map(i=>r("li",{children:r("button",{type:"button",className:`arp-preset${i.from===e&&i.to===a?" arp-preset-on":""}`,onClick:()=>{l(i.from,i.to),d()},children:t(`filter_date_${i.key}`)})},i.key))}),n("div",{className:"arp-date-fields",children:[n("label",{className:"arp-date-field",children:[r("span",{children:t("datepicker_from")}),r("input",{type:"date",value:e,max:a||void 0,onChange:i=>l(i.target.value,a)})]}),n("label",{className:"arp-date-field",children:[r("span",{children:t("datepicker_to")}),r("input",{type:"date",value:a,min:e||void 0,onChange:i=>l(e,i.target.value)})]})]})]})})}export{m as default};
