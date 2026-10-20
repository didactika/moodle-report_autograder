import{useEffect as y,useLayoutEffect as E,useRef as M,useState as P}from"react";import{createPortal as H}from"react-dom";import{useFollowAnchor as L}from"../../hooks/useFollowAnchor";import{jsx as x}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A panel that floats next to the element that opened it, under it or over it where there is more room, and follows it while the
 * page scrolls. It closes with Escape and when something outside it is pressed.
 *
 * @module     report_autograder/components/common/Floating
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const r=6,o=12;function R({anchor:a,onClose:d,minWidth:h=220,align:w="start",className:l,label:g,children:v}){const s=M(null),[b,m]=P({visibility:"hidden"}),u=()=>{const n=a.current;if(!n)return;const t=n.getBoundingClientRect();if(t.bottom<0||t.top>window.innerHeight){d();return}const e=Math.min(Math.max(t.width,h),window.innerWidth-2*o),i=w==="end"?t.right-e:t.left,f=Math.max(o,Math.min(i,window.innerWidth-e-o)),c=window.innerHeight-t.bottom-o,p=t.top-o;c>=240||c>=p?m({left:f,minWidth:e,top:t.bottom+r,maxHeight:Math.max(160,c-r)}):m({left:f,minWidth:e,bottom:window.innerHeight-t.top+r,maxHeight:Math.max(160,p-r)})};return E(u,[]),L(!0,u,()=>s.current),y(()=>{const n=e=>{const i=e.target;!s.current?.contains(i)&&!a.current?.contains(i)&&d()},t=e=>{e.key==="Escape"&&(e.stopPropagation(),d(),a.current?.focus())};return document.addEventListener("pointerdown",n,!0),document.addEventListener("keydown",t,!0),()=>{document.removeEventListener("pointerdown",n,!0),document.removeEventListener("keydown",t,!0)}},[]),H(x("div",{ref:s,className:`arp-floating${l?` ${l}`:""}`,style:b,role:"dialog","aria-label":g,children:v}),document.body)}export{R as default};
