var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The statuses of the report as chips with the number of students in each: one press narrows the report to a status, another
 * lifts it. The numbers are counted inside every other filter, so they say what the report would show.
 *
 * @module     report_autograder/components/StatusTabs
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function StatusTabs({ options, counts, chosen, total, text, onChange }) {
  if (counts.length === 0) {
    return null;
  }
  const all = counts.reduce((sum, item) => sum + item.count, 0);
  const shown = (counts.length > 0 ? counts : options.map((option) => ({ ...option, count: 0 }))).filter((item) => item.count > 0 || chosen.includes(item.key));
  return /* @__PURE__ */ jsxDEV("div", { className: "arp-statuses", role: "group", "aria-label": text("filter_status"), children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: `arp-status${chosen.length === 0 ? " arp-status-on" : ""}`,
        "aria-pressed": chosen.length === 0,
        onClick: () => onChange([]),
        children: [
          text("status_all"),
          " ",
          /* @__PURE__ */ jsxDEV("span", { className: "arp-status-count", children: chosen.length === 0 && total > 0 ? total : all }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
            lineNumber: 45,
            columnNumber: 34
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
        lineNumber: 39,
        columnNumber: 9
      },
      this
    ),
    shown.map((item) => {
      const on = chosen.includes(item.key);
      return /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `arp-status${on ? " arp-status-on" : ""}`,
          "aria-pressed": on,
          onClick: () => onChange(on ? [] : [item.key]),
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: `arp-dot arp-dot-${item.key}` }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
              lineNumber: 56,
              columnNumber: 17
            }, this),
            item.label,
            " ",
            /* @__PURE__ */ jsxDEV("span", { className: "arp-status-count", children: item.count }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
              lineNumber: 57,
              columnNumber: 30
            }, this)
          ]
        },
        item.key,
        true,
        {
          fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
          lineNumber: 49,
          columnNumber: 20
        },
        this
      );
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/StatusTabs.tsx",
    lineNumber: 38,
    columnNumber: 12
  }, this);
}
__name(StatusTabs, "StatusTabs");
export {
  StatusTabs as default
};
//# sourceMappingURL=StatusTabs.dev.js.map
