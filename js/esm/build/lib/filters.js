/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What the report is narrowed to, as the server asks for it, and what is counted as a filter that is on. Pure functions, so they
 * can be tested alone.
 *
 * @module     report_autograder/lib/filters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const u={searchname:"",status:[],datefrom:"",dateto:"",courseid:0,cmid:0,groupid:0},g=t=>[["searchname",t.searchname.trim()],["status",t.status.join(",")],["grading_date_from",t.datefrom],["grading_date_to",t.dateto],["courseid",t.courseid>0?String(t.courseid):""],["cmid",t.cmid>0?String(t.cmid):""],["groupid",t.groupid>0?String(t.groupid):""]].filter(([,r])=>r!=="").map(([r,s])=>({name:r,value:s})),m=t=>[t.status.length>0,t.datefrom!==""||t.dateto!=="",t.courseid>0,t.cmid>0,t.groupid>0].filter(Boolean).length,d=t=>t.searchname.trim()!==""||m(t)>0,p=(t,e)=>t.column===e?{column:e,direction:t.direction==="asc"?"desc":"asc"}:{column:e,direction:e==="completed_at_sort"?"desc":"asc"},h=(t,e)=>{if(e<=7)return Array.from({length:e},(a,n)=>n);const r=new Set([0,e-1,t-1,t,t+1]),s=[];let i=-1;for(const a of[...r].filter(n=>n>=0&&n<e).sort((n,c)=>n-c))i>=0&&a-i>1&&s.push(-1),s.push(a),i=a;return s},o=t=>{const e=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${t.getFullYear()}-${e}-${r}`},S=t=>{const e=r=>new Date(t.getFullYear(),t.getMonth(),t.getDate()-r);return[{key:"today",from:o(t),to:o(t)},{key:"week",from:o(e(6)),to:o(t)},{key:"month",from:o(new Date(t.getFullYear(),t.getMonth(),1)),to:o(t)},{key:"last30",from:o(e(29)),to:o(t)}]};export{u as NO_FILTERS,m as countFilters,S as datePresets,d as isNarrowed,o as isoDay,p as nextSort,h as pageList,g as toRequest};
