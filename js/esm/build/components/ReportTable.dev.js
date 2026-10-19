var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of the report: its sortable headers, the rows, grey blocks while it loads and a message when there is nothing to show.
 * On a narrow screen every row becomes a card that names each value.
 *
 * @module     report_autograder/components/ReportTable
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { IconArrowDown, IconArrowUp, IconSort } from "./common/Icons";
import ReportRow from "./ReportRow";
const SortHeader = /* @__PURE__ */ __name(({ column, label, help, sort, onSort }) => {
  const active = sort.column === column;
  let icon = /* @__PURE__ */ jsxDEV(IconSort, {}, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
    lineNumber: 38,
    columnNumber: 16
  });
  if (active) {
    icon = sort.direction === "asc" ? /* @__PURE__ */ jsxDEV(IconArrowUp, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 40,
      columnNumber: 43
    }) : /* @__PURE__ */ jsxDEV(IconArrowDown, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 40,
      columnNumber: 61
    });
  }
  let ariaSort = "none";
  if (active) {
    ariaSort = sort.direction === "asc" ? "ascending" : "descending";
  }
  return /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-sort": ariaSort, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: `arp-sort${active ? " arp-sort-on" : ""}`, "aria-label": help, onClick: () => onSort(column), children: [
    /* @__PURE__ */ jsxDEV("span", { children: label }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 48,
      columnNumber: 13
    }),
    icon
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
    lineNumber: 47,
    columnNumber: 9
  }) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
    lineNumber: 46,
    columnNumber: 12
  });
}, "SortHeader");
function ReportTable({ state, columns, forumgrade, sort, text, onSort, onRetry }) {
  const count = 5 + Number(columns.course) + Number(columns.activity) + Number(columns.group) + 1;
  let message = "";
  if (state.failed !== "") {
    message = text("error:apirequest", state.failed);
  } else if (state.needsfilter) {
    message = text("needsfilter");
  } else if (!state.loading && state.rows.length === 0) {
    message = text("feedback:nothing_to_show");
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "arp-table-wrap", "aria-busy": state.loading, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "arp-table-scroll", tabIndex: 0, role: "region", "aria-label": text("pluginname"), children: /* @__PURE__ */ jsxDEV("table", { className: `arp-table${state.loading ? " arp-table-loading" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("caption", { className: "sr-only visually-hidden", children: text("pluginname") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 74,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV(SortHeader, { column: "user_name", label: text("header:student"), help: text("sortby_name"), sort, onSort }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 77,
          columnNumber: 25
        }, this),
        columns.course && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:course") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 78,
          columnNumber: 44
        }, this),
        columns.activity && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:activity") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 79,
          columnNumber: 46
        }, this),
        columns.group && /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:groups") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 80,
          columnNumber: 43
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:external_status") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 81,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          SortHeader,
          {
            column: "completed_at_sort",
            label: text("header:completed_at"),
            help: text("sortby_date"),
            sort,
            onSort
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
            lineNumber: 82,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:grade") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 89,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("header:gradedby") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 90,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: /* @__PURE__ */ jsxDEV("span", { className: "sr-only visually-hidden", children: text("gradeuser") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 91,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 91,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 76,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 75,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("tbody", { children: [
        state.rows.map((row) => /* @__PURE__ */ jsxDEV(ReportRow, { row, columns, forumgrade, text }, row.rowkey, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 95,
          columnNumber: 46
        }, this)),
        state.loading && state.rows.length === 0 && Array.from({ length: 6 }, (_, index) => /* @__PURE__ */ jsxDEV("tr", { className: "arp-skeleton-row", "aria-hidden": "true", children: Array.from({ length: count }, (__, cell) => /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "arp-sk arp-sk-line" }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 97,
          columnNumber: 83
        }, this) }, cell, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 97,
          columnNumber: 68
        }, this)) }, `sk${index}`, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
          lineNumber: 96,
          columnNumber: 104
        }, this))
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 94,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 73,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 72,
      columnNumber: 9
    }, this),
    message !== "" && /* @__PURE__ */ jsxDEV("div", { className: "arp-empty", role: "status", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "arp-empty-text", children: message }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 103,
        columnNumber: 13
      }, this),
      state.failed !== "" && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "arp-action", onClick: onRetry, children: text("error:retry") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
        lineNumber: 104,
        columnNumber: 37
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
      lineNumber: 102,
      columnNumber: 28
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportTable.tsx",
    lineNumber: 71,
    columnNumber: 12
  }, this);
}
__name(ReportTable, "ReportTable");
export {
  ReportTable as default
};
//# sourceMappingURL=ReportTable.dev.js.map
