var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The bar above the table: the search box, the filters and the button that clears them all.
 *
 * @module     report_autograder/components/Toolbar
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useState } from "react";
import DateFilter from "./DateFilter";
import GroupFilter from "./GroupFilter";
import PickerFilter from "./PickerFilter";
import StatusFilter from "./StatusFilter";
import { IconActivity, IconCourse, IconReset, IconSearch } from "./common/Icons";
import { useDebounced } from "../hooks/useDebounced";
import { isNarrowed } from "../lib/filters";
function Toolbar({ props, filters, course, activity, text, onFilters, onCourse, onActivity, onReset }) {
  const [typed, setTyped] = useState(filters.searchname);
  const settled = useDebounced(typed, 300);
  useEffect(() => {
    if (settled !== filters.searchname) {
      onFilters({ searchname: settled });
    }
  }, [settled]);
  useEffect(() => {
    setTyped(filters.searchname);
  }, [filters.searchname]);
  return /* @__PURE__ */ jsxDEV("div", { className: "arp-toolbar", role: "search", children: [
    /* @__PURE__ */ jsxDEV("div", { className: `arp-search${typed !== "" ? " arp-search-on" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("span", { className: "arp-search-icon", children: /* @__PURE__ */ jsxDEV(IconSearch, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
        lineNumber: 57,
        columnNumber: 47
      }, this) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
        lineNumber: 57,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "search",
          className: "arp-search-field",
          value: typed,
          placeholder: `${text("filter_search")}\u2026`,
          "aria-label": text("filter_search"),
          onChange: (event) => setTyped(event.target.value)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 58,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
      lineNumber: 56,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "arp-filters", children: [
      props.showscoursefilter && /* @__PURE__ */ jsxDEV(
        PickerFilter,
        {
          type: "course",
          icon: /* @__PURE__ */ jsxDEV(IconCourse, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
            lineNumber: 70,
            columnNumber: 23
          }, this),
          label: text("filter_course"),
          chosen: course,
          scope: props.scope,
          courseid: 0,
          text,
          onChange: onCourse
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 68,
          columnNumber: 41
        },
        this
      ),
      props.showsactivityfilter && /* @__PURE__ */ jsxDEV(
        PickerFilter,
        {
          type: "activity",
          icon: /* @__PURE__ */ jsxDEV(IconActivity, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
            lineNumber: 80,
            columnNumber: 23
          }, this),
          label: text("filter_activity"),
          chosen: activity,
          scope: props.scope,
          courseid: filters.courseid,
          text,
          onChange: onActivity
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 78,
          columnNumber: 43
        },
        this
      ),
      props.showsgroupfilter && /* @__PURE__ */ jsxDEV(
        GroupFilter,
        {
          groups: props.groups,
          offersAll: props.offersallgroups,
          chosen: filters.groupid,
          text,
          onChange: (groupid) => onFilters({ groupid })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 88,
          columnNumber: 40
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        StatusFilter,
        {
          options: props.statuses,
          chosen: filters.status,
          text,
          onChange: (status) => onFilters({ status })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 95,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        DateFilter,
        {
          from: filters.datefrom,
          to: filters.dateto,
          text,
          onChange: (datefrom, dateto) => onFilters({ datefrom, dateto })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 101,
          columnNumber: 13
        },
        this
      ),
      isNarrowed(filters) && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "arp-reset", onClick: onReset, "aria-label": text("filters_reset"), children: [
        /* @__PURE__ */ jsxDEV(IconReset, {}, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 108,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "arp-reset-text", children: text("filters_reset") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
          lineNumber: 109,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
        lineNumber: 107,
        columnNumber: 37
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
      lineNumber: 67,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/Toolbar.tsx",
    lineNumber: 55,
    columnNumber: 12
  }, this);
}
__name(Toolbar, "Toolbar");
export {
  Toolbar as default
};
//# sourceMappingURL=Toolbar.dev.js.map
