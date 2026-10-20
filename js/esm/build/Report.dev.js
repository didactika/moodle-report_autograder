var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The autograder report: a bar of filters, one table and its pages, for an activity, a course or the whole site.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes. Filtering, sorting and paging are done by the
 * server, because the report of a site can have more rows than a browser should ever be sent.
 *
 * @module     report_autograder/Report
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useMemo, useState } from "react";
import Pagination from "./components/Pagination";
import ReportTable from "./components/ReportTable";
import Toolbar from "./components/Toolbar";
import { createText } from "./engine/text";
import { useReport } from "./hooks/useReport";
import { NO_FILTERS, nextSort } from "./lib/filters";
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
  const [limit, setLimit] = useState(props.pagesizes[0] ?? 12);
  const [state, goto] = useReport({ scope: props.scope, filters, sort, limit });
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
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      id: "autograder-report-container",
      className: "arp",
      onClickCapture: remember,
      ...forumAttributes(props),
      children: [
        /* @__PURE__ */ jsxDEV(
          Toolbar,
          {
            props,
            filters,
            course,
            activity,
            text,
            onFilters: change,
            onCourse: (option) => {
              setCourse(option);
              setActivity(null);
              change({ courseid: option?.id ?? 0, cmid: 0 });
            },
            onActivity: (option) => {
              setActivity(option);
              change({ cmid: option?.id ?? 0 });
            },
            onReset: () => {
              setCourse(null);
              setActivity(null);
              setFilters({ ...NO_FILTERS, groupid: props.offersallgroups ? 0 : filters.groupid });
              setSort({ column: "", direction: "asc" });
            }
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/Report.tsx",
            lineNumber: 85,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ReportTable,
          {
            state,
            columns: props.columns,
            forumgrade: props.forumgrade,
            sort,
            text,
            onSort: (column) => setSort(nextSort(sort, column)),
            onRetry: () => goto(state.page)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/Report.tsx",
            lineNumber: 109,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          Pagination,
          {
            page: state.page,
            limit: state.limit || limit,
            total: state.total,
            sizes: props.pagesizes,
            showing: "",
            disabled: state.loading,
            text,
            onPage: goto,
            onSize: setLimit
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/Report.tsx",
            lineNumber: 118,
            columnNumber: 9
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "public/report/autograder/js/esm/src/Report.tsx",
      lineNumber: 79,
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
