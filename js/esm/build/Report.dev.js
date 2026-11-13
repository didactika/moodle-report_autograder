var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The autograder report: a search and one menu for each filter, one table and its pages, for an activity, a course or the whole site.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes. Filtering, sorting and paging are done by the
 * server, because the report of a site can have more rows than a browser should ever be sent.
 *
 * @module     report_autograder/Report
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useMemo, useState } from "react";
import { DateMenu, PickerMenu, StatusMenu } from "./components/Filters";
import ReportTable from "./components/ReportTable";
import { Icon, Pager, SearchBox, SelectMenu } from "./components/ui";
import { useDebounced } from "./hooks/useDebounced";
import { createText } from "./engine/text";
import { useReport } from "./hooks/useReport";
import { NO_FILTERS, countApplied, nextSort } from "./lib/filters";
import { DEFAULT_PAGE_SIZE } from "./lib/paging";
const forumAttributes = /* @__PURE__ */ __name((props) => {
  const forum = props.forumgrade;
  if (!forum) {
    return {};
  }
  return {
    "data-contextid": forum.contextid,
    "data-cmid": forum.cmid,
    "data-name": forum.name,
    "data-course-id": forum.courseid,
    "data-course-name": forum.coursename,
    "data-experimental-display-mode": forum.experimentaldisplaymode,
    "data-group": forum.groupid ?? "",
    "data-grading-component": forum.gradingcomponent,
    "data-grading-component-subtype": forum.gradingcomponentsubtype,
    "data-gradable-itemtype": "forum",
    "data-grade-only-active-users": forum.gradeonlyactiveusers,
    ...forum.sendstudentnotifications ? { "data-send-student-notifications": 1 } : {}
  };
}, "forumAttributes");
function Report(props) {
  const text = useMemo(() => createText(props.strings), [props.strings]);
  const [filters, setFilters] = useState(props.opening);
  const [course, setCourse] = useState(props.selectedcourse);
  const [activity, setActivity] = useState(props.selectedactivity);
  const [sort, setSort] = useState({ column: "", direction: "asc" });
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [state, goto] = useReport({ scope: props.scope, filters, sort, limit });
  const [searchText, setSearchText] = useState(props.opening.searchname);
  const settled = useDebounced(searchText, 300);
  useEffect(() => {
    if (settled !== filters.searchname) {
      setFilters((before) => ({ ...before, searchname: settled }));
      setSort({ column: "", direction: "asc" });
    }
  }, [settled]);
  useEffect(() => {
    setSearchText(filters.searchname);
  }, [filters.searchname]);
  const remember = /* @__PURE__ */ __name((event) => {
    const button = event.target.closest('[data-grade-action="launch"][data-initialuserid]');
    if (button && props.forumgrade) {
      event.currentTarget.dataset.initialuserid = button.dataset.initialuserid;
    }
  }, "remember");
  const change = /* @__PURE__ */ __name((changes) => {
    setFilters((before) => ({ ...before, ...changes }));
    setSort({ column: "", direction: "asc" });
  }, "change");
  const applied = countApplied(filters, { course: props.showscoursefilter, activity: props.showsactivityfilter, group: props.showsgroupfilter });
  const narrowed = applied > 0 || filters.searchname.trim() !== "";
  const reset = /* @__PURE__ */ __name(() => {
    setCourse(null);
    setActivity(null);
    setFilters({ ...NO_FILTERS, groupid: props.offersallgroups ? 0 : filters.groupid });
    setSort({ column: "", direction: "asc" });
  }, "reset");
  const groups = [
    ...props.offersallgroups ? [{ value: "0", label: text("filter_group_placeholder") }] : [],
    ...props.groups.map((group) => ({ value: String(group.id), label: group.name }))
  ];
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      id: "autograder-report-container",
      className: "arp",
      onClickCapture: remember,
      ...forumAttributes(props),
      children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-muted mb-0", children: text(`lead_${props.level}`) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Report.tsx",
          lineNumber: 114,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar", "data-region": "filters", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar-start", children: [
              /* @__PURE__ */ jsxDEV(SearchBox, { value: searchText, onChange: setSearchText, label: text("filter_search"), text }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Report.tsx",
                lineNumber: 118,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                StatusMenu,
                {
                  statuses: props.statuses,
                  counts: state.counts,
                  chosen: filters.status,
                  text,
                  onChange: (status) => change({ status })
                },
                void 0,
                false,
                {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 119,
                  columnNumber: 21
                },
                this
              ),
              props.showscoursefilter && /* @__PURE__ */ jsxDEV(
                PickerMenu,
                {
                  type: "course",
                  label: text("filter_course"),
                  chosen: course,
                  scope: props.scope,
                  courseid: 0,
                  text,
                  onPick: (option) => {
                    setCourse(option);
                    setActivity(null);
                    change({ courseid: option?.id ?? 0, cmid: 0 });
                  }
                },
                void 0,
                false,
                {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 126,
                  columnNumber: 49
                },
                this
              ),
              props.showsactivityfilter && /* @__PURE__ */ jsxDEV(
                PickerMenu,
                {
                  type: "activity",
                  label: text("filter_activity"),
                  chosen: activity,
                  scope: props.scope,
                  courseid: filters.courseid,
                  text,
                  onPick: (option) => {
                    setActivity(option);
                    change({ cmid: option?.id ?? 0 });
                  }
                },
                void 0,
                false,
                {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 140,
                  columnNumber: 51
                },
                this
              ),
              props.showsgroupfilter && /* @__PURE__ */ jsxDEV(
                SelectMenu,
                {
                  label: text("filter_group"),
                  options: groups,
                  value: String(filters.groupid),
                  base: props.offersallgroups ? "0" : void 0,
                  text,
                  onChange: (groupid) => change({ groupid: Number(groupid) })
                },
                void 0,
                false,
                {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 152,
                  columnNumber: 48
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                DateMenu,
                {
                  from: filters.datefrom,
                  to: filters.dateto,
                  text,
                  onChange: (datefrom, dateto) => change({ datefrom, dateto })
                },
                void 0,
                false,
                {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 160,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Report.tsx",
              lineNumber: 117,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar-end", children: /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                id: "autograder-filter-clear",
                className: "btn btn-link btn-icon",
                disabled: !narrowed,
                title: text("filters_reset"),
                "aria-label": text("filters_reset"),
                onClick: reset,
                children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/reload", text }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Report.tsx",
                  lineNumber: 177,
                  columnNumber: 25
                }, this)
              },
              void 0,
              false,
              {
                fileName: "public/report/autograder/js/esm/src/Report.tsx",
                lineNumber: 168,
                columnNumber: 21
              },
              this
            ) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Report.tsx",
              lineNumber: 167,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Report.tsx",
            lineNumber: 116,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            ReportTable,
            {
              state,
              columns: props.columns,
              forumgrade: props.forumgrade,
              sort,
              narrowed,
              text,
              onSort: (column) => setSort(nextSort(sort, column)),
              onRetry: () => goto(state.page),
              onClear: reset
            },
            void 0,
            false,
            {
              fileName: "public/report/autograder/js/esm/src/Report.tsx",
              lineNumber: 181,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Pager,
            {
              page: state.page,
              perpage: limit,
              total: state.total,
              disabled: state.loading,
              text,
              onChange: ({ page, perpage }) => {
                if (perpage !== void 0) {
                  setLimit(perpage);
                } else if (page !== void 0) {
                  goto(page);
                }
              }
            },
            void 0,
            false,
            {
              fileName: "public/report/autograder/js/esm/src/Report.tsx",
              lineNumber: 192,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Report.tsx",
          lineNumber: 115,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "public/report/autograder/js/esm/src/Report.tsx",
      lineNumber: 108,
      columnNumber: 12
    },
    this
  );
}
__name(Report, "Report");
export {
  Report as default
};
//# sourceMappingURL=Report.dev.js.map
