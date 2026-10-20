var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Every web service call of the report, in one place.
 *
 * @module     report_autograder/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { fetchOne } from "@moodle/lms/core/ajax";
import { toRequest } from "../lib/filters";
const getReport = /* @__PURE__ */ __name((request) => fetchOne({
  methodname: "report_autograder_get_report",
  args: {
    cmid: request.scope.cmid ?? 0,
    courseid: request.scope.courseid ?? 0,
    page: request.page,
    limit: request.limit,
    filters: toRequest(request.filters),
    sortcolumn: request.sort.column,
    sortdir: request.sort.direction,
    withtotal: request.withtotal
  }
}), "getReport");
const searchOptions = /* @__PURE__ */ __name((type, query, scope, filtercourseid) => fetchOne({
  methodname: "report_autograder_search_filter_options",
  args: {
    type,
    query,
    cmid: scope.cmid ?? 0,
    courseid: scope.courseid ?? 0,
    filtercourseid: type === "activity" ? filtercourseid : 0
  }
}), "searchOptions");
const getGraders = /* @__PURE__ */ __name((courseid, students, page, perpage) => fetchOne({
  methodname: "report_autograder_get_graders",
  args: { courseid, students, page, perpage }
}), "getGraders");
const describeError = /* @__PURE__ */ __name((error) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error !== null && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
}, "describeError");
export {
  describeError,
  getGraders,
  getReport,
  searchOptions
};
//# sourceMappingURL=api.dev.js.map
