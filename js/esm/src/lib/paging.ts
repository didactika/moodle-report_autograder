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
 */

/** The sizes a page of a list may have, 0 being every row at once. */
export const PAGE_SIZES = [12, 24, 48, 96, 0];

/** The size a list starts with. */
export const DEFAULT_PAGE_SIZE = 12;

/** What the services are sent to ask for every row at once. */
export const ALL_ROWS = -1;

/**
 * The rows a page covers, counted from one, and none when the list is empty.
 *
 * @param page The page, counted from zero.
 * @param perpage Rows on a page, 0 for all of them.
 * @param total Rows in the list.
 * @returns The first and the last row of the page.
 */
export const pageRange = (page: number, perpage: number, total: number): {from: number; to: number} => {
    const size = perpage > 0 ? perpage : Math.max(total, 1);
    return {
        from: total === 0 ? 0 : (page * size) + 1,
        to: Math.min(total, (page + 1) * size),
    };
};

/**
 * The sizes a pager offers for a list, the ones smaller than it and all of it, and the one it shows: All when every row fits on
 * the page. A list of up to 12 rows offers All only; one of 13 to 24 offers 12 and All; and so on up to 12, 24, 48, 96 and All.
 *
 * @param perpage Rows per page, 0 for all of them.
 * @param total How many rows there are.
 * @returns The sizes and the one shown.
 */
export const fitPageSizes = (perpage: number, total: number): {sizes: number[]; shown: number} => ({
    sizes: PAGE_SIZES.filter((size) => size === 0 || size < total),
    shown: perpage > 0 && perpage < total ? perpage : 0,
});
