import{jsx as n}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The small icons of the report: the icons of Moodle, which Font Awesome draws, so they take the colour of the text around them and
 * a site can restyle them. None is drawn by hand.
 *
 * @module     report_autograder/components/common/Icons
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const o=({name:r,className:e})=>n("i",{className:`arp-glyph fa-solid fa-${r}${e?` ${e}`:""}`,"aria-hidden":"true"}),c=()=>n(o,{name:"arrow-down"}),t=()=>n(o,{name:"arrow-up"}),a=()=>n(o,{name:"calendar-days"}),s=()=>n(o,{name:"check"}),p=()=>n(o,{name:"chevron-down"}),i=()=>n(o,{name:"chevron-left"}),m=()=>n(o,{name:"chevron-right"}),l=()=>n(o,{name:"xmark"}),x=()=>n(o,{name:"graduation-cap"}),I=()=>n(o,{name:"circle-exclamation",className:"arp-icon-danger"}),h=()=>n(o,{name:"filter"}),g=()=>n(o,{name:"users"}),d=()=>n(o,{name:"circle-info"}),f=()=>n(o,{name:"puzzle-piece"}),w=()=>n(o,{name:"rotate-right"}),v=()=>n(o,{name:"magnifying-glass"}),y=()=>n(o,{name:"sort"}),C=()=>n(o,{name:"triangle-exclamation",className:"arp-icon-warning"});export{f as IconActivity,c as IconArrowDown,t as IconArrowUp,a as IconCalendar,s as IconCheck,p as IconChevron,i as IconChevronLeft,m as IconChevronRight,l as IconClose,x as IconCourse,I as IconFailed,h as IconFilter,g as IconGroup,d as IconInfo,w as IconReset,v as IconSearch,y as IconSort,C as IconWarning};
