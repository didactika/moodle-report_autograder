var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A small icon that opens a short explanation when it is pressed, for the dates, the grades and the graders that need one.
 *
 * @module     report_autograder/components/common/Hint
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useRef, useState } from "react";
import Floating from "./Floating";
function Hint({ text, label, icon, className }) {
  const button = useRef(null);
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: button,
        type: "button",
        className: `arp-hint${className ? ` ${className}` : ""}`,
        "aria-label": label,
        "aria-expanded": open,
        onClick: () => setOpen(!open),
        children: icon
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/common/Hint.tsx",
        lineNumber: 35,
        columnNumber: 9
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV(Floating, { anchor: button, onClose: () => setOpen(false), minWidth: 200, className: "arp-hint-panel", label, children: /* @__PURE__ */ jsxDEV("p", { className: "arp-hint-text", children: text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Hint.tsx",
      lineNumber: 46,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Hint.tsx",
      lineNumber: 45,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/common/Hint.tsx",
    lineNumber: 34,
    columnNumber: 12
  }, this);
}
__name(Hint, "Hint");
export {
  Hint as default
};
//# sourceMappingURL=Hint.dev.js.map
