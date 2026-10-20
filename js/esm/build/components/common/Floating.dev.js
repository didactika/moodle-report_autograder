var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A panel that floats next to the element that opened it, under it or over it where there is more room, and follows it while the
 * page scrolls. It closes with Escape and when something outside it is pressed.
 *
 * @module     report_autograder/components/common/Floating
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFollowAnchor } from "../../hooks/useFollowAnchor";
const GAP = 6;
const MARGIN = 12;
function Floating({ anchor, onClose, minWidth = 220, align = "start", className, label, children }) {
  const panel = useRef(null);
  const [place, setPlace] = useState({ visibility: "hidden" });
  const follow = /* @__PURE__ */ __name(() => {
    const element = anchor.current;
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      onClose();
      return;
    }
    const width = Math.min(Math.max(rect.width, minWidth), window.innerWidth - 2 * MARGIN);
    const wanted = align === "end" ? rect.right - width : rect.left;
    const left = Math.max(MARGIN, Math.min(wanted, window.innerWidth - width - MARGIN));
    const below = window.innerHeight - rect.bottom - MARGIN;
    const above = rect.top - MARGIN;
    if (below >= 240 || below >= above) {
      setPlace({ left, minWidth: width, top: rect.bottom + GAP, maxHeight: Math.max(160, below - GAP) });
    } else {
      setPlace({ left, minWidth: width, bottom: window.innerHeight - rect.top + GAP, maxHeight: Math.max(160, above - GAP) });
    }
  }, "follow");
  useLayoutEffect(follow, []);
  useFollowAnchor(true, follow, () => panel.current);
  useEffect(() => {
    const outside = /* @__PURE__ */ __name((event) => {
      const target = event.target;
      if (!panel.current?.contains(target) && !anchor.current?.contains(target)) {
        onClose();
      }
    }, "outside");
    const keys = /* @__PURE__ */ __name((event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        anchor.current?.focus();
      }
    }, "keys");
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keys, true);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keys, true);
    };
  }, []);
  return createPortal(
    /* @__PURE__ */ jsxDEV("div", { ref: panel, className: `arp-floating${className ? ` ${className}` : ""}`, style: place, role: "dialog", "aria-label": label, children }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/common/Floating.tsx",
      lineNumber: 93,
      columnNumber: 9
    }, this),
    document.body
  );
}
__name(Floating, "Floating");
export {
  Floating as default
};
//# sourceMappingURL=Floating.dev.js.map
