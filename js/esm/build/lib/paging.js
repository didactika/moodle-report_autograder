/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The arithmetic of a paged list.
 *
 * @module     report_autograder/lib/paging
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const b=(m,n,r)=>({from:r===0?0:m*n+1,to:Math.min(r,(m+1)*n)});export{b as pageRange};
