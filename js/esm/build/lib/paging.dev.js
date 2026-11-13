var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
const pageRange = /* @__PURE__ */ __name((page, perpage, total) => ({
  from: total === 0 ? 0 : page * perpage + 1,
  to: Math.min(total, (page + 1) * perpage)
}), "pageRange");
export {
  pageRange
};
//# sourceMappingURL=paging.dev.js.map
