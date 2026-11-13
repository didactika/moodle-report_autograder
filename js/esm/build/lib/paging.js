/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The sizes a page of a list may have, and which rows a page shows.
 *
 * @module     report_autograder/lib/paging
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const m=[12,24,48,96,0],s=12,t=-1,u=(n,e,r)=>{const o=e>0?e:Math.max(r,1);return{from:r===0?0:n*o+1,to:Math.min(r,(n+1)*o)}},b=(n,e)=>({sizes:m.filter(r=>r===0||r<e),shown:n>0&&n<e?n:0});export{t as ALL_ROWS,s as DEFAULT_PAGE_SIZE,m as PAGE_SIZES,b as fitPageSizes,u as pageRange};
