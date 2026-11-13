var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The filters of the report. Each one is a menu with the shape of a select, in one row beside the search: the status, with the number
 * of students in each; the course and the activity, which are searched as the reader types; the group; and the grading date. A menu
 * that narrows the report is tinted and says what it is narrowed to, so there is no second row of applied filters to read.
 *
 * Every filter answers at once, as the design system asks: the report behind the menu changes as each one is chosen.
 *
 * @module     report_autograder/components/Filters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Menu } from "./ui";
import { useDebounced } from "../hooks/useDebounced";
import { datePresets } from "../lib/filters";
import { searchOptions } from "../services/api";
function StatusMenu({ statuses, counts, chosen, text, onChange }) {
  const id = useId();
  const label = text("filter_status");
  const options = counts.length > 0 ? counts : statuses.map((status) => ({ ...status, count: -1 }));
  let button = label;
  if (chosen.length === 1) {
    button = statuses.find((status) => status.key === chosen[0])?.label ?? chosen[0];
  } else if (chosen.length > 1) {
    button = `${label}: ${chosen.length}`;
  }
  return /* @__PURE__ */ jsxDEV(Menu, { button, label, name: "status", active: chosen.length > 0, text, onClear: () => onChange([]), children: () => options.map((option) => /* @__PURE__ */ jsxDEV("label", { className: "dropdown-item", htmlFor: `${id}-${option.key}`, children: [
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "checkbox",
        className: "form-check-input",
        id: `${id}-${option.key}`,
        checked: chosen.includes(option.key),
        onChange: () => onChange(chosen.includes(option.key) ? chosen.filter((key) => key !== option.key) : [...chosen, option.key])
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 49,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("span", { children: option.label }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 58,
      columnNumber: 13
    }, this),
    option.count >= 0 && /* @__PURE__ */ jsxDEV("span", { className: "dd-chip-count", children: option.count }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 59,
      columnNumber: 35
    }, this)
  ] }, option.key, true, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 48,
    columnNumber: 40
  }, this)) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 47,
    columnNumber: 12
  }, this);
}
__name(StatusMenu, "StatusMenu");
function PickerMenu({ type, label, chosen, scope, courseid, text, onPick }) {
  return /* @__PURE__ */ jsxDEV(
    Menu,
    {
      button: chosen ? chosen.name : label,
      label,
      name: type,
      active: chosen !== null,
      text,
      onClear: () => onPick(null),
      children: (close) => /* @__PURE__ */ jsxDEV(
        PickerList,
        {
          type,
          label,
          chosen,
          scope,
          courseid,
          text,
          onPick: (option) => {
            close();
            onPick(option);
          }
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
          lineNumber: 92,
          columnNumber: 21
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 84,
      columnNumber: 12
    },
    this
  );
}
__name(PickerMenu, "PickerMenu");
const PickerList = /* @__PURE__ */ __name(({ type, label, chosen, scope, courseid, text, onPick }) => {
  const field = useRef(null);
  const [query, setQuery] = useState("");
  const typed = useDebounced(query.trim(), 250);
  const [found, setFound] = useState({ options: [], loading: true });
  useEffect(() => {
    field.current?.focus();
  }, []);
  useEffect(() => {
    let current = true;
    setFound((before) => ({ ...before, loading: true }));
    searchOptions(type, typed, scope, courseid).then((response) => {
      if (current) {
        setFound({ options: response.options, loading: false });
      }
    }).catch(() => {
      if (current) {
        setFound({ options: [], loading: false });
      }
    });
    return () => {
      current = false;
    };
  }, [type, typed, courseid, scope.cmid, scope.courseid]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "dd-menu-form", children: /* @__PURE__ */ jsxDEV(
      "input",
      {
        ref: field,
        type: "search",
        className: "form-control form-control-sm",
        value: query,
        placeholder: text("search:typetosearch"),
        "aria-label": label,
        autoComplete: "off",
        onChange: (event) => setQuery(event.target.value)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 150,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 149,
      columnNumber: 9
    }),
    found.options.map((option) => /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        role: "option",
        className: "dropdown-item",
        "aria-selected": chosen?.id === option.id,
        onClick: () => onPick(option),
        children: option.name
      },
      option.id,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 161,
        columnNumber: 40
      }
    )),
    found.options.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "dropdown-item disabled", role: "status", children: found.loading ? text("search:loading") : text("search:nomatches") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 169,
      columnNumber: 40
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 148,
    columnNumber: 12
  });
}, "PickerList");
function DateMenu({ from, to, text, onChange }) {
  const fromId = useId();
  const toId = useId();
  const label = text("filter_grading_date");
  const presets = datePresets(/* @__PURE__ */ new Date());
  const preset = presets.find((item) => item.from === from && item.to === to);
  let button = label;
  if (preset) {
    button = text(`filter_date_${preset.key}`);
  } else if (from !== "" && to !== "") {
    button = text("filter_date_range", { from, to });
  } else if (from !== "") {
    button = text("filter_date_since", from);
  } else if (to !== "") {
    button = text("filter_date_until", to);
  }
  return /* @__PURE__ */ jsxDEV(Menu, { button, label, name: "date", active: from !== "" || to !== "", text, onClear: () => onChange("", ""), children: (close) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
    presets.map((item) => /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        role: "option",
        className: "dropdown-item",
        "aria-selected": preset?.key === item.key,
        onClick: () => {
          close();
          onChange(item.from, item.to);
        },
        children: text(`filter_date_${item.key}`)
      },
      item.key,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 200,
        columnNumber: 36
      },
      this
    )),
    /* @__PURE__ */ jsxDEV("hr", {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 211,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "dd-menu-form", children: /* @__PURE__ */ jsxDEV("div", { className: "dd-menu-dates", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "form-label small mb-1", htmlFor: fromId, children: text("datepicker_from") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
          lineNumber: 215,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: fromId,
            type: "date",
            className: "form-control form-control-sm",
            value: from,
            max: to || void 0,
            onChange: (event) => onChange(event.target.value, to)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
            lineNumber: 216,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 214,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { className: "form-label small mb-1", htmlFor: toId, children: text("datepicker_to") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
          lineNumber: 220,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: toId,
            type: "date",
            className: "form-control form-control-sm",
            value: to,
            min: from || void 0,
            onChange: (event) => onChange(from, event.target.value)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
            lineNumber: 221,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 219,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 213,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 212,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 199,
    columnNumber: 21
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 198,
    columnNumber: 12
  }, this);
}
__name(DateMenu, "DateMenu");
const SEARCH_ROOM = 160;
function FilterGroup({ count, text, children }) {
  const [grouped, setGrouped] = useState(false);
  const box = useRef(null);
  const needed = useRef(0);
  useLayoutEffect(() => {
    const row = box.current?.parentElement;
    if (!box.current || !row) {
      return void 0;
    }
    const measure = /* @__PURE__ */ __name(() => {
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const room = row.clientWidth - SEARCH_ROOM - gap;
      if (!grouped) {
        const menus = Array.from(box.current?.children ?? []);
        const width = menus.reduce((sum, menu) => sum + menu.offsetWidth, 0) + gap * Math.max(0, menus.length - 1);
        if (width > room) {
          needed.current = width;
          setGrouped(true);
        }
      } else if (room >= needed.current) {
        setGrouped(false);
      }
    }, "measure");
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  });
  return /* @__PURE__ */ jsxDEV("div", { ref: box, "data-region": "filter-menus", children: grouped ? /* @__PURE__ */ jsxDEV(
    Menu,
    {
      button: count > 0 ? `${text("filters")} (${count})` : text("filters"),
      label: text("filters"),
      name: "filters",
      active: count > 0,
      place: "end",
      children: () => /* @__PURE__ */ jsxDEV("div", { "data-region": "filter-panel", children }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
        lineNumber: 279,
        columnNumber: 20
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
      lineNumber: 272,
      columnNumber: 20
    },
    this
  ) : children }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/Filters.tsx",
    lineNumber: 271,
    columnNumber: 12
  }, this);
}
__name(FilterGroup, "FilterGroup");
export {
  DateMenu,
  FilterGroup,
  PickerMenu,
  StatusMenu
};
//# sourceMappingURL=Filters.dev.js.map
