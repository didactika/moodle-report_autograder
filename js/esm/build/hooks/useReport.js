import{useCallback as S,useEffect as g,useRef as r,useState as R}from"react";import{describeError as b,getReport as w}from"../services/api";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Reads the pages of the report from the server as the filters, the sort and the page change, and keeps only the answer to the
 * last question that was asked.
 *
 * @module     report_autograder/hooks/useReport
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const k={rows:[],total:0,page:0,limit:0,loading:!0,needsfilter:!1,counts:[],failed:""},x=e=>{const[d,i]=R({...k,limit:e.limit}),n=r(0),a=r(0),s=r([]),c=r(e);c.current=e;const l=S(u=>{const f=++n.current,o=c.current;i(t=>({...t,loading:!0,failed:""})),w({scope:o.scope,page:u,limit:o.limit,filters:o.filters,sort:o.sort,withtotal:u===0}).then(t=>{f===n.current&&(t.totalrecords>=0&&(a.current=t.totalrecords),t.statuscounts&&t.statuscounts.length>0&&(s.current=t.statuscounts),i({rows:t.needsfilter?[]:t.data,total:t.needsfilter?0:a.current,page:t.page,limit:t.limit||o.limit,loading:!1,needsfilter:!!t.needsfilter,counts:t.needsfilter?[]:s.current,failed:""}))}).catch(t=>{f===n.current&&i(p=>({...p,rows:[],loading:!1,failed:b(t)}))})},[]),m=JSON.stringify([e.scope,e.filters,e.sort,e.limit]);return g(()=>{l(0)},[m,l]),[d,l]};export{x as useReport};
