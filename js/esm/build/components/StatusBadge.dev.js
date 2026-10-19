var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The badge of a status, and the reason of a failure next to it.
 *
 * @module     report_autograder/components/StatusBadge
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Hint from "./common/Hint";
import { IconFailed } from "./common/Icons";
function StatusBadge({ row, text }) {
  return /* @__PURE__ */ jsxDEV("span", { className: "arp-status", children: [
    /* @__PURE__ */ jsxDEV("span", { className: `arp-badge arp-badge-${row.status_key}`, children: [
      /* @__PURE__ */ jsxDEV("span", { className: "arp-dot" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/StatusBadge.tsx",
        lineNumber: 30,
        columnNumber: 13
      }, this),
      row.status
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/StatusBadge.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, this),
    row.failure_reason && /* @__PURE__ */ jsxDEV(Hint, { text: row.failure_reason, label: text("info:failure"), icon: /* @__PURE__ */ jsxDEV(IconFailed, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/StatusBadge.tsx",
      lineNumber: 33,
      columnNumber: 99
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/StatusBadge.tsx",
      lineNumber: 33,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/StatusBadge.tsx",
    lineNumber: 28,
    columnNumber: 12
  }, this);
}
__name(StatusBadge, "StatusBadge");
export {
  StatusBadge as default
};
//# sourceMappingURL=StatusBadge.dev.js.map
