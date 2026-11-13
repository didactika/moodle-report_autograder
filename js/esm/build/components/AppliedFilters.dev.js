var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The filters that are applied, each as a badge with a button that removes it, and the number of results at the end of the row.
 *
 * @module     report_autograder/components/AppliedFilters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Icon } from "./ui";
function AppliedFilters({ props, filters, course, activity, total, loading, text, onFilters, onCourse, onActivity }) {
  const applied = [];
  for (const key of filters.status) {
    const status = props.statuses.find((item) => item.key === key);
    applied.push({
      key: `status-${key}`,
      label: `${text("filter_status")}: ${status?.label ?? key}`,
      remove: /* @__PURE__ */ __name(() => onFilters({ status: filters.status.filter((item) => item !== key) }), "remove")
    });
  }
  if (course && props.showscoursefilter) {
    applied.push({ key: "course", label: `${text("filter_course")}: ${course.name}`, remove: /* @__PURE__ */ __name(() => onCourse(null), "remove") });
  }
  if (activity && props.showsactivityfilter) {
    applied.push({ key: "activity", label: `${text("filter_activity")}: ${activity.name}`, remove: /* @__PURE__ */ __name(() => onActivity(null), "remove") });
  }
  if (filters.groupid > 0) {
    const group = props.groups.find((item) => item.id === filters.groupid);
    applied.push({ key: "group", label: `${text("filter_group")}: ${group?.name ?? filters.groupid}`, remove: /* @__PURE__ */ __name(() => onFilters({ groupid: 0 }), "remove") });
  }
  if (filters.datefrom !== "" || filters.dateto !== "") {
    let range = text("filter_date_range", { from: filters.datefrom, to: filters.dateto });
    if (filters.dateto === "") {
      range = text("filter_date_since", filters.datefrom);
    } else if (filters.datefrom === "") {
      range = text("filter_date_until", filters.dateto);
    }
    applied.push({ key: "date", label: `${text("filter_grading_date")}: ${range}`, remove: /* @__PURE__ */ __name(() => onFilters({ datefrom: "", dateto: "" }), "remove") });
  }
  if (applied.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2 border-bottom", children: [
    /* @__PURE__ */ jsxDEV("ul", { className: "list-unstyled d-flex flex-wrap align-items-center gap-2 mb-0", children: applied.map((item) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge badge-secondary bg-secondary rounded-pill d-inline-flex align-items-center gap-1", children: [
      item.label,
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "btn btn-link btn-sm p-0",
          "aria-label": text("filter_remove", item.label),
          title: text("filter_remove", item.label),
          onClick: item.remove,
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "e/cancel", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
            lineNumber: 81,
            columnNumber: 25
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
          lineNumber: 74,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
      lineNumber: 72,
      columnNumber: 17
    }, this) }, item.key, false, {
      fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
      lineNumber: 71,
      columnNumber: 36
    }, this)) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("span", { className: "text-muted small", role: "status", "aria-busy": loading, children: text("results_count", total) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/AppliedFilters.tsx",
    lineNumber: 69,
    columnNumber: 12
  }, this);
}
__name(AppliedFilters, "AppliedFilters");
export {
  AppliedFilters as default
};
//# sourceMappingURL=AppliedFilters.dev.js.map
