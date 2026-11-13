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
import { fitPageSizes, pageRange } from "../lib/paging";
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
function Menu({ button, label, name, active = false, small = false, place = "", onClear, text, children }) {
  const clearable = active && onClear !== void 0;
  const clear = text ? `${text("filter_clear")}: ${label}` : label;
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
  return /* @__PURE__ */ jsxDEV("span", { className: `dd-menu${place ? ` dd-menu-${place}` : ""}${onClear ? " dd-select-filter" : ""}`, "data-menu": name, ref: root, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: toggle,
        type: "button",
        className: `form-select dd-select${small ? " form-select-sm" : ""}${active ? " border-primary" : ""}${clearable ? " dd-select-set" : ""}`,
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
        lineNumber: 104,
        columnNumber: 9
      },
      this
    ),
    clearable && /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "dd-select-clear",
        title: clear,
        "aria-label": clear,
        onClick: () => {
          setOpen(false);
          onClear();
          toggle.current?.focus();
        },
        children: text && /* @__PURE__ */ jsxDEV(Icon, { name: "e/cancel", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 124,
          columnNumber: 19
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 114,
        columnNumber: 23
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { id, className: "dd-select-menu", role: "group", "aria-label": label, children: children(() => {
      setOpen(false);
      toggle.current?.focus();
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 125,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 103,
    columnNumber: 12
  }, this);
}
__name(Menu, "Menu");
function SelectMenu({ options: all, value, label, small = false, place = "", base, text, onChange }) {
  const chosen = all.find((option) => option.value === value);
  const options = base === void 0 ? all : all.filter((option) => option.value !== base);
  const set = base !== void 0 && value !== base;
  return /* @__PURE__ */ jsxDEV(
    Menu,
    {
      button: chosen?.label ?? label,
      label,
      small,
      place,
      active: set,
      text,
      onClear: base === void 0 ? void 0 : () => onChange(base),
      children: (close) => options.map((option) => /* @__PURE__ */ jsxDEV(
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
          lineNumber: 163,
          columnNumber: 45
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 154,
      columnNumber: 12
    },
    this
  );
}
__name(SelectMenu, "SelectMenu");
function SortHeader({ label, help, active, direction, onSort }) {
  let ariaSort;
  if (active) {
    ariaSort = direction === "asc" ? "ascending" : "descending";
  }
  return /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-sort": ariaSort, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "table-sort", title: help, onClick: onSort, children: label }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 197,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 196,
    columnNumber: 12
  }, this);
}
__name(SortHeader, "SortHeader");
function Pager({ page, perpage, total, disabled, text, onChange }) {
  if (total === 0) {
    return null;
  }
  const { from, to } = pageRange(page, perpage, total);
  const { sizes, shown } = fitPageSizes(perpage, total);
  return /* @__PURE__ */ jsxDEV("div", { className: "table-foot", children: /* @__PURE__ */ jsxDEV("div", { className: "dd-pager", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-size", children: [
      /* @__PURE__ */ jsxDEV("span", { children: text("pagination:results_per_page") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 225,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV(
        SelectMenu,
        {
          small: true,
          place: "up",
          label: text("pagination:results_per_page"),
          value: String(shown),
          options: sizes.map((size) => ({ value: String(size), label: size ? String(size) : text("pagination:all") })),
          onChange: (size) => onChange({ perpage: Number(size), page: 0 })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 226,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 224,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-end", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "dd-pager-range", role: "status", children: text("pagination:range", { from, to, total }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 236,
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
              lineNumber: 246,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 238,
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
              lineNumber: 256,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 248,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 237,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 235,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 223,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 222,
    columnNumber: 12
  }, this);
}
__name(Pager, "Pager");
function Hint({ message, label, icon, tone = "info", text }) {
  const [place, setPlace] = useState(null);
  const root = useRef(null);
  const button = useRef(null);
  const open = place !== null;
  const show = /* @__PURE__ */ __name(() => {
    const box = button.current?.getBoundingClientRect();
    if (!box) {
      return;
    }
    const width = Math.min(288, window.innerWidth - 16);
    const up = box.bottom + 160 > window.innerHeight && box.top > 160;
    setPlace({
      top: up ? box.top - 6 : box.bottom + 6,
      left: Math.max(8, Math.min(box.left, window.innerWidth - width - 8)),
      up
    });
  }, "show");
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    const close = /* @__PURE__ */ __name((event) => {
      if (event.type !== "pointerdown" || !root.current?.contains(event.target)) {
        setPlace(null);
      }
    }, "close");
    const keys = /* @__PURE__ */ __name((event) => {
      if (event.key === "Escape") {
        setPlace(null);
        button.current?.focus();
      }
    }, "keys");
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", keys, true);
    window.addEventListener("scroll", close, { capture: true, passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("keydown", keys, true);
      window.removeEventListener("scroll", close, { capture: true });
      window.removeEventListener("resize", close);
    };
  }, [open]);
  return /* @__PURE__ */ jsxDEV("span", { className: "d-inline-block", ref: root, children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: button,
        type: "button",
        className: `btn btn-link btn-icon btn-sm btn-hint text-${tone}`,
        title: label,
        "aria-label": label,
        "aria-expanded": open,
        onClick: () => open ? setPlace(null) : show(),
        children: /* @__PURE__ */ jsxDEV(Icon, { name: icon, text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 329,
          columnNumber: 13
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 320,
        columnNumber: 9
      },
      this
    ),
    place && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `popover show ${place.up ? "bs-popover-top" : "bs-popover-bottom"}`,
        role: "dialog",
        "aria-label": label,
        style: { top: place.top, left: place.left, transform: place.up ? "translateY(-100%)" : "none" },
        children: /* @__PURE__ */ jsxDEV("div", { className: "popover-body", children: message }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 337,
          columnNumber: 13
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 331,
        columnNumber: 19
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 319,
    columnNumber: 12
  }, this);
}
__name(Hint, "Hint");
function TableBox({ busy, empty, children }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "table-responsive", "data-region": "tablewrap", "aria-busy": busy, children: empty || children }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 350,
    columnNumber: 12
  }, this);
}
__name(TableBox, "TableBox");
function Empty({ icon, message, action, onAction, text }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "dd-empty", "data-region": "empty", role: "status", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "dd-tile dd-tile-lg", children: /* @__PURE__ */ jsxDEV(Icon, { name: icon, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 370,
      columnNumber: 46
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 370,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "dd-empty-text", children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 371,
      columnNumber: 9
    }, this),
    action && onAction && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onAction, children: action }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 372,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 369,
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
  SortHeader,
  TableBox
};
//# sourceMappingURL=ui.dev.js.map
