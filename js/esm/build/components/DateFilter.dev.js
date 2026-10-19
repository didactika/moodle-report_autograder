var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The grading date filter: ranges that can be chosen with one press, and two date fields for any other range. The fields are the
 * date inputs of the browser, so the calendar is the one of the person's own system and no library ships with the plugin.
 *
 * @module     report_autograder/components/DateFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useMemo } from "react";
import Chip from "./common/Chip";
import { IconCalendar } from "./common/Icons";
import { datePresets } from "../lib/filters";
const describe = /* @__PURE__ */ __name((from, to, text) => {
  if (from !== "" && to !== "") {
    return from === to ? from : text("filter_date_range", { from, to });
  }
  if (from !== "") {
    return text("filter_date_since", from);
  }
  return to === "" ? "" : text("filter_date_until", to);
}, "describe");
function DateFilter({ from, to, text, onChange }) {
  const presets = useMemo(() => datePresets(/* @__PURE__ */ new Date()), []);
  return /* @__PURE__ */ jsxDEV(
    Chip,
    {
      icon: /* @__PURE__ */ jsxDEV(IconCalendar, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
        lineNumber: 53,
        columnNumber: 15
      }, this),
      label: text("filter_grading_date"),
      value: describe(from, to, text),
      clearLabel: text("filter_clear"),
      onClear: () => onChange("", ""),
      minWidth: 280,
      children: (close) => /* @__PURE__ */ jsxDEV("div", { className: "arp-dates", children: [
        /* @__PURE__ */ jsxDEV("ul", { className: "arp-presets", children: presets.map((preset) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: `arp-preset${preset.from === from && preset.to === to ? " arp-preset-on" : ""}`,
            onClick: () => {
              onChange(preset.from, preset.to);
              close();
            },
            children: text(`filter_date_${preset.key}`)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
            lineNumber: 63,
            columnNumber: 21
          },
          this
        ) }, preset.key, false, {
          fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
          lineNumber: 62,
          columnNumber: 42
        }, this)) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
          lineNumber: 61,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "arp-date-fields", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "arp-date-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: text("datepicker_from") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
              lineNumber: 77,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "date", value: from, max: to || void 0, onChange: (event) => onChange(event.target.value, to) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
              lineNumber: 78,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
            lineNumber: 76,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "arp-date-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: text("datepicker_to") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
              lineNumber: 81,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("input", { type: "date", value: to, min: from || void 0, onChange: (event) => onChange(from, event.target.value) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
              lineNumber: 82,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
            lineNumber: 80,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
          lineNumber: 75,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
        lineNumber: 60,
        columnNumber: 21
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/DateFilter.tsx",
      lineNumber: 52,
      columnNumber: 12
    },
    this
  );
}
__name(DateFilter, "DateFilter");
export {
  DateFilter as default
};
//# sourceMappingURL=DateFilter.dev.js.map
