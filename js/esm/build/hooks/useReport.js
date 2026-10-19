import{useCallback as p,useEffect as g,useRef as n,useState as R}from"react";import{describeError as S,getReport as b}from"../services/api";/**
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
 */const w={rows:[],total:0,page:0,limit:0,loading:!0,needsfilter:!1,failed:""},x=e=>{const[d,o]=R({...w,limit:e.limit}),i=n(0),a=n(0),s=n(e);s.current=e;const l=p(c=>{const f=++i.current,r=s.current;o(t=>({...t,loading:!0,failed:""})),b({scope:r.scope,page:c,limit:r.limit,filters:r.filters,sort:r.sort,withtotal:c===0}).then(t=>{f===i.current&&(t.totalrecords>=0&&(a.current=t.totalrecords),o({rows:t.needsfilter?[]:t.data,total:t.needsfilter?0:a.current,page:t.page,limit:t.limit||r.limit,loading:!1,needsfilter:!!t.needsfilter,failed:""}))}).catch(t=>{f===i.current&&o(u=>({...u,rows:[],loading:!1,failed:S(t)}))})},[]),m=JSON.stringify([e.scope,e.filters,e.sort,e.limit]);return g(()=>{l(0)},[m,l]),[d,l]};export{x as useReport};
