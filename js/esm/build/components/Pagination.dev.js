var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What is under a table: which rows are shown, the pages, and how many rows a page has.
 *
 * @module     report_autograder/components/Pagination
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { IconChevronLeft, IconChevronRight } from "./common/Icons";
import { pageList } from "../lib/filters";
function Pagination({ page, limit, total, sizes, showing, disabled, text, onPage, onSize }) {
  if (total <= 0) {
    return null;
  }
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = page * limit + 1;
  const to = Math.min(total, (page + 1) * limit);
  return /* @__PURE__ */ jsxDEV("nav", { className: "arp-pagination", "aria-label": text("pagination:label"), children: [
    /* @__PURE__ */ jsxDEV("p", { className: "arp-pagination-showing", children: showing || text("pagination:showing", { from, to, total }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("label", { className: "arp-pagination-size", children: [
      /* @__PURE__ */ jsxDEV("span", { children: text("pagination:results_per_page") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 48,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("select", { value: limit, disabled, onChange: (event) => onSize(Number(event.target.value)), children: (sizes.includes(limit) ? sizes : [...sizes, limit].sort((a, b) => a - b)).map((size) => /* @__PURE__ */ jsxDEV("option", { value: size, children: size }, size, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 50,
        columnNumber: 106
      }, this)) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 49,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this),
    pages > 1 && /* @__PURE__ */ jsxDEV("ul", { className: "arp-pages", children: [
      /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "arp-page",
          "aria-label": text("pagination:previous"),
          disabled: disabled || page === 0,
          onClick: () => onPage(page - 1),
          children: /* @__PURE__ */ jsxDEV(IconChevronLeft, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
            lineNumber: 64,
            columnNumber: 21
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
          lineNumber: 57,
          columnNumber: 17
        },
        this
      ) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 56,
        columnNumber: 13
      }, this),
      pageList(page, pages).map((number, index) => /* @__PURE__ */ jsxDEV("li", { children: number < 0 ? /* @__PURE__ */ jsxDEV("span", { className: "arp-page-gap", "aria-hidden": "true", children: "\u2026" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 68,
        columnNumber: 31
      }, this) : /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `arp-page${number === page ? " arp-page-on" : ""}`,
          "aria-current": number === page ? "page" : void 0,
          "aria-label": text("pagination:page", { page: number + 1, pages }),
          disabled,
          onClick: () => onPage(number),
          children: number + 1
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
          lineNumber: 68,
          columnNumber: 92
        },
        this
      ) }, `${number}-${index}`, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 67,
        columnNumber: 59
      }, this)),
      /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "arp-page",
          "aria-label": text("pagination:next"),
          disabled: disabled || page + 1 >= pages,
          onClick: () => onPage(page + 1),
          children: /* @__PURE__ */ jsxDEV(IconChevronRight, {}, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
            lineNumber: 87,
            columnNumber: 21
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
          lineNumber: 80,
          columnNumber: 17
        },
        this
      ) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
        lineNumber: 79,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
      lineNumber: 55,
      columnNumber: 23
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/Pagination.tsx",
    lineNumber: 45,
    columnNumber: 12
  }, this);
}
__name(Pagination, "Pagination");
export {
  Pagination as default
};
//# sourceMappingURL=Pagination.dev.js.map
