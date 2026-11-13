var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
const PAGE_SIZES = [12, 24, 48, 96, 0];
const DEFAULT_PAGE_SIZE = 12;
const ALL_ROWS = -1;
const pageRange = /* @__PURE__ */ __name((page, perpage, total) => {
  const size = perpage > 0 ? perpage : Math.max(total, 1);
  return {
    from: total === 0 ? 0 : page * size + 1,
    to: Math.min(total, (page + 1) * size)
  };
}, "pageRange");
const fitPageSizes = /* @__PURE__ */ __name((perpage, total) => ({
  sizes: PAGE_SIZES.filter((size) => size === 0 || size < total),
  shown: perpage > 0 && perpage < total ? perpage : 0
}), "fitPageSizes");
export {
  ALL_ROWS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  fitPageSizes,
  pageRange
};
//# sourceMappingURL=paging.dev.js.map
