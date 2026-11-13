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
 */

/**
 * The rows a page covers, counted from one, and none when the list is empty.
 *
 * @param page The page, counted from zero.
 * @param perpage Rows on a page.
 * @param total Rows in the list.
 * @returns The first and the last row of the page.
 */
export const pageRange = (page: number, perpage: number, total: number): {from: number; to: number} => ({
    from: total === 0 ? 0 : (page * perpage) + 1,
    to: Math.min(total, (page + 1) * perpage),
});
