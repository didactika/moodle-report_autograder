var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The status filter: the states that the viewer may filter by, as options that can be switched on together.
 *
 * @module     report_autograder/components/StatusFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Chip from "./common/Chip";
import { IconCheck } from "./common/Icons";
function StatusFilter({ options, chosen, text, onChange }) {
  const labelOf = /* @__PURE__ */ __name((key) => options.find((option) => option.key === key)?.label ?? key, "labelOf");
  let value = "";
  if (chosen.length === 1) {
    value = labelOf(chosen[0]);
  } else if (chosen.length > 1) {
    value = text("filter_status_count", chosen.length);
  }
  const toggle = /* @__PURE__ */ __name((key) => {
    onChange(chosen.includes(key) ? chosen.filter((item) => item !== key) : [...chosen, key]);
  }, "toggle");
  return /* @__PURE__ */ jsxDEV(
    Chip,
    {
      icon: /* @__PURE__ */ jsxDEV("span", { className: `arp-dot arp-dot-${chosen.length === 1 ? chosen[0] : "any"}` }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
        lineNumber: 41,
        columnNumber: 15
      }, this),
      label: text("filter_status"),
      value,
      clearLabel: text("filter_clear"),
      onClear: () => onChange([]),
      minWidth: 230,
      children: () => /* @__PURE__ */ jsxDEV("ul", { className: "arp-options", role: "listbox", "aria-multiselectable": "true", "aria-label": text("filter_status"), children: options.map((option) => {
        const on = chosen.includes(option.key);
        return /* @__PURE__ */ jsxDEV("li", { role: "option", "aria-selected": on, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: `arp-option${on ? " arp-option-on" : ""}`, onClick: () => toggle(option.key), children: [
          /* @__PURE__ */ jsxDEV("span", { className: `arp-dot arp-dot-${option.key}` }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
            lineNumber: 53,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "arp-option-label", children: option.label }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
            lineNumber: 54,
            columnNumber: 25
          }, this),
          on && /* @__PURE__ */ jsxDEV("span", { className: "arp-option-check", children: /* @__PURE__ */ jsxDEV(IconCheck, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
            lineNumber: 55,
            columnNumber: 67
          }, this) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
            lineNumber: 55,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
          lineNumber: 52,
          columnNumber: 21
        }, this) }, option.key, false, {
          fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
          lineNumber: 51,
          columnNumber: 24
        }, this);
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
        lineNumber: 48,
        columnNumber: 16
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/StatusFilter.tsx",
      lineNumber: 40,
      columnNumber: 12
    },
    this
  );
}
__name(StatusFilter, "StatusFilter");
export {
  StatusFilter as default
};
//# sourceMappingURL=StatusFilter.dev.js.map
