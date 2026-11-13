var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pieces the screens of the report are made of, written with the classes of Bootstrap and Moodle: the icon, the search, the
 * Filters button with its panel, the sortable header, the pager and the hint. What makes them look as the design system draws them
 * is in the styles, as overrides of those classes inside the report; a theme restyles them by restyling Bootstrap.
 *
 * @module     report_autograder/components/ui
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useRef, useState } from "react";
import { pageRange } from "../lib/paging";
function Icon({ name, text }) {
  return /* @__PURE__ */ jsxDEV("span", { className: "d-inline-flex", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: text(`pix:${name}`) } }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 26,
    columnNumber: 12
  }, this);
}
__name(Icon, "Icon");
function SearchBox({ value, onChange, label, text }) {
  const id = useId();
  return /* @__PURE__ */ jsxDEV("div", { className: "input-group", role: "search", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "input-group-text", children: /* @__PURE__ */ jsxDEV(Icon, { name: "a/search", text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 38,
      columnNumber: 44
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("label", { className: "visually-hidden sr-only", htmlFor: id, children: label }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 39,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        className: "form-control",
        type: "search",
        id,
        value,
        placeholder: `${label}\u2026`,
        autoComplete: "off",
        onChange: (event) => onChange(event.target.value),
        onKeyDown: (event) => event.key === "Enter" && event.preventDefault()
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 40,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 37,
    columnNumber: 12
  }, this);
}
__name(SearchBox, "SearchBox");
function FiltersMenu({ label, applied, text, children }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    const outside = /* @__PURE__ */ __name((event) => {
      if (!root.current?.contains(event.target)) {
        setOpen(false);
      }
    }, "outside");
    const keys = /* @__PURE__ */ __name((event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }, "keys");
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keys, true);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keys, true);
    };
  }, [open]);
  return /* @__PURE__ */ jsxDEV("div", { className: "dropdown", ref: root, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: `btn btn-outline-secondary dropdown-toggle${applied > 0 ? " active" : ""}`,
        "aria-expanded": open,
        "aria-controls": id,
        onClick: () => setOpen(!open),
        children: [
          /* @__PURE__ */ jsxDEV(Icon, { name: "i/filter", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 94,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: label }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 95,
            columnNumber: 13
          }, this),
          applied > 0 && /* @__PURE__ */ jsxDEV("span", { className: "badge badge-primary bg-primary rounded-pill", children: applied }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 96,
            columnNumber: 29
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 87,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { id, className: `dropdown-menu${open ? " show" : ""}`, role: "group", "aria-label": label, children }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 86,
    columnNumber: 12
  }, this);
}
__name(FiltersMenu, "FiltersMenu");
function SortHeader({ label, help, active, direction, onSort }) {
  let ariaSort;
  if (active) {
    ariaSort = direction === "asc" ? "ascending" : "descending";
  }
  return /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-sort": ariaSort, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "table-sort", "aria-label": help, onClick: onSort, children: label }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 122,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 121,
    columnNumber: 12
  }, this);
}
__name(SortHeader, "SortHeader");
function Pager({ page, perpage, total, sizes, disabled, text, onChange }) {
  const { from, to } = pageRange(page, perpage, total);
  const id = useId();
  return /* @__PURE__ */ jsxDEV("div", { className: "table-foot", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-3 text-muted small", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-none d-sm-flex align-items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: id, children: text("pagination:results_per_page") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 146,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id,
          className: "form-select custom-select custom-select-sm form-select-sm w-auto",
          value: perpage,
          onChange: (event) => onChange({ perpage: Number(event.target.value), page: 0 }),
          children: sizes.map((size) => /* @__PURE__ */ jsxDEV("option", { value: size, children: size }, size, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 153,
            columnNumber: 42
          }, this))
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 147,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 145,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-3", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-body", role: "status", children: text("pagination:showing", { from, to, total }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 157,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "btn-group", role: "group", "aria-label": text("pagination:label"), children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm",
            disabled: disabled || page === 0,
            title: text("pagination:previous"),
            "aria-label": text("pagination:previous"),
            onClick: () => onChange({ page: page - 1 }),
            children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/previous", text }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 169,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 161,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm",
            disabled: disabled || to >= total,
            title: text("pagination:next"),
            "aria-label": text("pagination:next"),
            onClick: () => onChange({ page: page + 1 }),
            children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/next", text }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 179,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 171,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 160,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 156,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 144,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 143,
    columnNumber: 12
  }, this);
}
__name(Pager, "Pager");
function Hint({ message, label, icon, text }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    const outside = /* @__PURE__ */ __name((event) => {
      if (!root.current?.contains(event.target)) {
        setOpen(false);
      }
    }, "outside");
    document.addEventListener("pointerdown", outside, true);
    return () => document.removeEventListener("pointerdown", outside, true);
  }, [open]);
  return /* @__PURE__ */ jsxDEV("span", { className: "position-relative d-inline-block", ref: root, children: [
    /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-link btn-sm p-0", "aria-label": label, "aria-expanded": open, onClick: () => setOpen(!open), children: /* @__PURE__ */ jsxDEV(Icon, { name: icon, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 212,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 211,
      columnNumber: 9
    }, this),
    open && /* @__PURE__ */ jsxDEV("div", { className: "popover show bs-popover-bottom", role: "dialog", "aria-label": label, children: /* @__PURE__ */ jsxDEV("div", { className: "popover-body", children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 215,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 214,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 210,
    columnNumber: 12
  }, this);
}
__name(Hint, "Hint");
function Empty({ message, action, onAction }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "text-center text-muted p-5", role: "status", children: [
    /* @__PURE__ */ jsxDEV("p", { children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 228,
      columnNumber: 9
    }, this),
    action && onAction && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onAction, children: action }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 229,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 227,
    columnNumber: 12
  }, this);
}
__name(Empty, "Empty");
export {
  Empty,
  FiltersMenu,
  Hint,
  Icon,
  Pager,
  SearchBox,
  SortHeader
};
//# sourceMappingURL=ui.dev.js.map
