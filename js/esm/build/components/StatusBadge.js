import p from"./common/Hint";import{IconFailed as r}from"./common/Icons";import{jsx as t,jsxs as e}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The badge of a status, and the reason of a failure next to it.
 *
 * @module     report_autograder/components/StatusBadge
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function o({row:a,text:s}){return e("span",{className:"arp-status",children:[e("span",{className:`arp-badge arp-badge-${a.status_key}`,children:[t("span",{className:"arp-dot"}),a.status]}),a.failure_reason&&t(p,{text:a.failure_reason,label:s("info:failure"),icon:t(r,{})})]})}export{o as default};
