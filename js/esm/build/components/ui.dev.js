var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pieces the screens of the report are made of, drawn with the classes of Bootstrap, Moodle and the Didactika design system, as
 * the plugin Delegate account draws its lists: the icon, the search, the menu with the shape of a select, the sortable header, the
 * pager, the explanation that opens on a button and what a list says when it has nothing.
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
  return /* @__PURE__ */ jsxDEV("div", { className: "dd-searchbox", role: "search", children: [
    /* @__PURE__ */ jsxDEV(Icon, { name: "a/search", text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("label", { className: "visually-hidden", htmlFor: id, children: label }, void 0, false, {
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
        placeholder: label,
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
function Menu({ button, label, active = false, small = false, place = "", children }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const toggle = useRef(null);
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
        toggle.current?.focus();
      }
    }, "keys");
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keys, true);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keys, true);
    };
  }, [open]);
  return /* @__PURE__ */ jsxDEV("span", { className: `dd-menu${place ? ` dd-menu-${place}` : ""}`, ref: root, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: toggle,
        type: "button",
        className: `form-select dd-select${small ? " form-select-sm" : ""}${active ? " border-primary" : ""}`,
        "aria-label": label,
        "aria-haspopup": "true",
        "aria-expanded": open,
        "aria-controls": open ? id : void 0,
        onClick: () => setOpen(!open),
        children: button
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 96,
        columnNumber: 9
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { id, className: "dd-select-menu", role: "group", "aria-label": label, children: children(() => {
      setOpen(false);
      toggle.current?.focus();
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 106,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 95,
    columnNumber: 12
  }, this);
}
__name(Menu, "Menu");
function SelectMenu({ options, value, label, small = false, place = "", active = false, onChange }) {
  const chosen = options.find((option) => option.value === value);
  return /* @__PURE__ */ jsxDEV(Menu, { button: chosen?.label ?? label, label, small, place, active, children: (close) => options.map((option) => /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      role: "option",
      className: "dropdown-item",
      "aria-selected": option.value === value,
      onClick: () => {
        close();
        if (option.value !== value) {
          onChange(option.value);
        }
      },
      children: option.label
    },
    option.value,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 132,
      columnNumber: 45
    },
    this
  )) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 131,
    columnNumber: 12
  }, this);
}
__name(SelectMenu, "SelectMenu");
function SortHeader({ label, help, active, direction, onSort }) {
  let ariaSort;
  if (active) {
    ariaSort = direction === "asc" ? "ascending" : "descending";
  }
  return /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-sort": ariaSort, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "table-sort", title: help, onClick: onSort, children: label }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 166,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 165,
    columnNumber: 12
  }, this);
}
__name(SortHeader, "SortHeader");
function Pager({ page, perpage, total, sizes, disabled, text, onChange }) {
  const { from, to } = pageRange(page, perpage, total);
  return /* @__PURE__ */ jsxDEV("div", { className: "table-foot", children: /* @__PURE__ */ jsxDEV("div", { className: "dd-pager", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-size", children: [
      /* @__PURE__ */ jsxDEV("span", { children: text("pagination:results_per_page") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 189,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        SelectMenu,
        {
          small: true,
          place: "up",
          label: text("pagination:results_per_page"),
          value: String(perpage),
          options: sizes.map((size) => ({ value: String(size), label: String(size) })),
          onChange: (size) => onChange({ perpage: Number(size), page: 0 })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 190,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 188,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-end", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "dd-pager-range", role: "status", children: text("pagination:range", { from, to, total }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 200,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-arrows", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm btn-icon",
            disabled: disabled || page === 0,
            title: text("pagination:previous"),
            "aria-label": text("pagination:previous"),
            onClick: () => onChange({ page: page - 1 }),
            children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/previous", text }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 210,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 202,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm btn-icon",
            disabled: disabled || to >= total,
            title: text("pagination:next"),
            "aria-label": text("pagination:next"),
            onClick: () => onChange({ page: page + 1 }),
            children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/next", text }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 220,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 212,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 201,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 199,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 187,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 186,
    columnNumber: 12
  }, this);
}
__name(Pager, "Pager");
function Hint({ message, label, icon, tone = "info", text }) {
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
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: `btn btn-link btn-icon btn-sm btn-hint text-${tone}`,
        title: label,
        "aria-label": label,
        "aria-expanded": open,
        onClick: () => setOpen(!open),
        children: /* @__PURE__ */ jsxDEV(Icon, { name: icon, text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 260,
          columnNumber: 13
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 252,
        columnNumber: 9
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { className: "popover show bs-popover-bottom", role: "dialog", "aria-label": label, children: /* @__PURE__ */ jsxDEV("div", { className: "popover-body", children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 263,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 262,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 251,
    columnNumber: 12
  }, this);
}
__name(Hint, "Hint");
function Empty({ message, action, onAction }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "dd-empty", role: "status", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "dd-empty-text", children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 276,
      columnNumber: 9
    }, this),
    action && onAction && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onAction, children: action }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 277,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 275,
    columnNumber: 12
  }, this);
}
__name(Empty, "Empty");
export {
  Empty,
  Hint,
  Icon,
  Menu,
  Pager,
  SearchBox,
  SelectMenu,
  SortHeader
};
//# sourceMappingURL=ui.dev.js.map
