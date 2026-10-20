var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The button of a filter in the bar: a pill with the name of the filter or what it is set to, an arrow, and a button that clears
 * it once it is on. Its panel hangs from it.
 *
 * @module     report_autograder/components/common/Chip
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useRef, useState } from "react";
import { IconChevron, IconClose } from "./Icons";
import Floating from "./Floating";
function Chip({ icon, label, value, onClear, clearLabel, minWidth = 240, children }) {
  const wrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const on = value !== "";
  return /* @__PURE__ */ jsxDEV("div", { ref: wrapper, className: `arp-chip${on ? " arp-chip-on" : ""}${open ? " arp-chip-open" : ""}`, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "arp-chip-button",
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: () => setOpen(!open),
        children: [
          /* @__PURE__ */ jsxDEV("span", { className: "arp-chip-icon", children: icon }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
            lineNumber: 51,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "arp-chip-text", children: on ? value : label }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
            lineNumber: 52,
            columnNumber: 13
          }, this),
          !on && /* @__PURE__ */ jsxDEV("span", { className: "arp-chip-arrow", children: /* @__PURE__ */ jsxDEV(IconChevron, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
            lineNumber: 53,
            columnNumber: 54
          }, this) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
            lineNumber: 53,
            columnNumber: 21
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
        lineNumber: 44,
        columnNumber: 9
      },
      this
    ),
    on && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "arp-chip-clear", "aria-label": clearLabel, onClick: onClear, children: /* @__PURE__ */ jsxDEV(IconClose, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
      lineNumber: 56,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
      lineNumber: 55,
      columnNumber: 16
    }, this),
    open && /* @__PURE__ */ jsxDEV(Floating, { anchor: wrapper, onClose: () => setOpen(false), minWidth, label, children: children(() => setOpen(false)) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
      lineNumber: 58,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/common/Chip.tsx",
    lineNumber: 43,
    columnNumber: 12
  }, this);
}
__name(Chip, "Chip");
export {
  Chip as default
};
//# sourceMappingURL=Chip.dev.js.map
