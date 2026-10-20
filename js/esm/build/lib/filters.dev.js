var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
 */
const NO_FILTERS = {
  searchname: "",
  status: [],
  datefrom: "",
  dateto: "",
  courseid: 0,
  cmid: 0,
  groupid: 0
};
const toRequest = /* @__PURE__ */ __name((filters) => {
  const entries = [
    ["searchname", filters.searchname.trim()],
    ["status", filters.status.join(",")],
    ["grading_date_from", filters.datefrom],
    ["grading_date_to", filters.dateto],
    ["courseid", filters.courseid > 0 ? String(filters.courseid) : ""],
    ["cmid", filters.cmid > 0 ? String(filters.cmid) : ""],
    ["groupid", filters.groupid > 0 ? String(filters.groupid) : ""]
  ];
  return entries.filter(([, value]) => value !== "").map(([name, value]) => ({ name, value }));
}, "toRequest");
const countFilters = /* @__PURE__ */ __name((filters) => [
  filters.status.length > 0,
  filters.datefrom !== "" || filters.dateto !== "",
  filters.courseid > 0,
  filters.cmid > 0,
  filters.groupid > 0
].filter(Boolean).length, "countFilters");
const isNarrowed = /* @__PURE__ */ __name((filters) => filters.searchname.trim() !== "" || countFilters(filters) > 0, "isNarrowed");
const nextSort = /* @__PURE__ */ __name((current, column) => {
  if (current.column === column) {
    return { column, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { column, direction: column === "completed_at_sort" ? "desc" : "asc" };
}, "nextSort");
const pageList = /* @__PURE__ */ __name((page, pages) => {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index);
  }
  const shown = /* @__PURE__ */ new Set([0, pages - 1, page - 1, page, page + 1]);
  const list = [];
  let last = -1;
  for (const number of [...shown].filter((n) => n >= 0 && n < pages).sort((a, b) => a - b)) {
    if (last >= 0 && number - last > 1) {
      list.push(-1);
    }
    list.push(number);
    last = number;
  }
  return list;
}, "pageList");
const isoDay = /* @__PURE__ */ __name((date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}, "isoDay");
const datePresets = /* @__PURE__ */ __name((today) => {
  const back = /* @__PURE__ */ __name((days) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days), "back");
  return [
    { key: "today", from: isoDay(today), to: isoDay(today) },
    { key: "week", from: isoDay(back(6)), to: isoDay(today) },
    { key: "month", from: isoDay(new Date(today.getFullYear(), today.getMonth(), 1)), to: isoDay(today) },
    { key: "last30", from: isoDay(back(29)), to: isoDay(today) }
  ];
}, "datePresets");
export {
  NO_FILTERS,
  countFilters,
  datePresets,
  isNarrowed,
  isoDay,
  nextSort,
  pageList,
  toRequest
};
//# sourceMappingURL=filters.dev.js.map
