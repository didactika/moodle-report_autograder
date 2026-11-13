var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of the report, with the header of its sortable columns, its rows and what it says when it has none.
 *
 * @module     report_autograder/components/ReportTable
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import ReportRow from "./ReportRow";
import { Empty, SortHeader } from "./ui";
function ReportTable({ state, columns, forumgrade, sort, narrowed, text, onSort, onRetry, onClear }) {
  const sorted = /* @__PURE__ */ __name((column) => ({ active: sort.column === column, direction: sort.direction, onSort: /* @__PURE__ */ __name(() => onSort(column), "onSort") }), "sorted");
  const count = 5 + Number(columns.course) + Number(columns.activity) + Number(columns.group) + 1;
  const failed = state.failed !== "";
  const empty = !failed && !state.needsfilter && !state.loading && state.rows.length === 0;
  return /* @__PURE__ */ jsxDEV("div", { className: "table-responsive", "aria-busy": state.loading, children: [
    /* @__PURE__ */ jsxDEV("table", { className: "table", children: [
      /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden sr-only", children: text("pluginname") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 43,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV(SortHeader, { label: text("header:student"), help: text("sortby_name"), ...sorted("user_name") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 46,
          columnNumber: 21
        }, this),
        columns.course && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:course") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 47,
          columnNumber: 40
        }, this),
        columns.activity && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:activity") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 48,
          columnNumber: 42
        }, this),
        columns.group && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:groups") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 49,
          columnNumber: 39
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:external_status") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 50,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SortHeader, { label: text("header:completed_at"), help: text("sortby_date"), ...sorted("completed_at_sort") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 51,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:grade") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 52,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:gradedby") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 53,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden sr-only", children: text("gradeuser") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 54,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 54,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 45,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 44,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("tbody", { children: [
        state.rows.map((row) => /* @__PURE__ */ jsxDEV(ReportRow, { row, columns, forumgrade, text }, row.rowkey, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 58,
          columnNumber: 42
        }, this)),
        state.loading && state.rows.length === 0 && Array.from({ length: 6 }, (_, index) => /* @__PURE__ */ jsxDEV("tr", { "aria-hidden": "true", children: Array.from({ length: count }, (__, cell) => /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "placeholder-glow", children: /* @__PURE__ */ jsxDEV("span", { className: "placeholder col-8" }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 60,
          columnNumber: 114
        }, this) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 60,
          columnNumber: 79
        }, this) }, cell, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 60,
          columnNumber: 64
        }, this)) }, `sk${index}`, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 59,
          columnNumber: 100
        }, this))
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 57,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 42,
      columnNumber: 9
    }, this),
    failed && /* @__PURE__ */ jsxDEV(Empty, { message: text("error:apirequest", state.failed), action: text("error:retry"), onAction: onRetry }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 64,
      columnNumber: 20
    }, this),
    state.needsfilter && /* @__PURE__ */ jsxDEV(Empty, { message: text("needsfilter") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 65,
      columnNumber: 31
    }, this),
    empty && /* @__PURE__ */ jsxDEV(
      Empty,
      {
        message: narrowed ? text("table:empty") : text("feedback:nothing_to_show"),
        action: narrowed ? text("filters_reset") : void 0,
        onAction: narrowed ? onClear : void 0
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 66,
        columnNumber: 19
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
    lineNumber: 41,
    columnNumber: 12
  }, this);
}
__name(ReportTable, "ReportTable");
export {
  ReportTable as default
};
//# sourceMappingURL=ReportTable.dev.js.map
