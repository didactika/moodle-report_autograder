var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
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
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fitPageSizes, pageRange } from "../lib/paging";
function Icon({ name, text }) {
  return /* @__PURE__ */ jsxDEV("span", { className: "d-inline-flex", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: text(`pix:${name}`) } }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 27,
    columnNumber: 12
  }, this);
}
__name(Icon, "Icon");
function SearchBox({ value, onChange, label, text }) {
  const id = useId();
  return /* @__PURE__ */ jsxDEV("div", { className: "dd-searchbox", role: "search", children: [
    /* @__PURE__ */ jsxDEV(Icon, { name: "a/search", text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 39,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("label", { className: "visually-hidden", htmlFor: id, children: label }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 40,
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
        lineNumber: 41,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 38,
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
        lineNumber: 105,
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
          lineNumber: 125,
          columnNumber: 19
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 115,
        columnNumber: 23
      },
      this
    ),
    open && /* @__PURE__ */ jsxDEV("div", { id, className: "dd-select-menu", role: "group", "aria-label": label, children: children(() => {
      setOpen(false);
      toggle.current?.focus();
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 126,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 104,
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
          lineNumber: 164,
          columnNumber: 45
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 155,
      columnNumber: 12
    },
    this
  );
}
__name(SelectMenu, "SelectMenu");
function SortHeader({ label, help, active, direction, onSort, col }) {
  let ariaSort;
  if (active) {
    ariaSort = direction === "asc" ? "ascending" : "descending";
  }
  return /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-sort": ariaSort, "data-col": col, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "table-sort", title: help, onClick: onSort, children: label }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 199,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 198,
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
        lineNumber: 227,
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
          lineNumber: 228,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 226,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "dd-pager-end", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "dd-pager-range", role: "status", children: text("pagination:range", { from, to, total }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 238,
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
              lineNumber: 248,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 240,
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
              lineNumber: 258,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 250,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 239,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 237,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 225,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 224,
    columnNumber: 12
  }, this);
}
__name(Pager, "Pager");
const TABLE_MIN = 288;
const TABLE_ROOM = 24;
function useFitHeight(box) {
  useLayoutEffect(() => {
    const fit = /* @__PURE__ */ __name(() => {
      const element = box.current;
      if (!element) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const card2 = element.closest(".card")?.getBoundingClientRect();
      const below = card2 ? Math.max(0, card2.bottom - rect.bottom) : 0;
      const height = Math.max(TABLE_MIN, window.innerHeight - top - below - TABLE_ROOM);
      (element.closest(".card") ?? element).style.setProperty("--dd-table-h", height + "px");
    }, "fit");
    fit();
    const observer = new ResizeObserver(() => fit());
    observer.observe(document.body);
    const card = box.current?.closest(".card");
    if (card) {
      observer.observe(card);
    }
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
}
__name(useFitHeight, "useFitHeight");
function TableBox({ busy, empty, children }) {
  const box = useRef(null);
  useFitHeight(box);
  return /* @__PURE__ */ jsxDEV("div", { ref: box, className: "table-responsive", "data-region": "tablewrap", "aria-busy": busy, children: empty || children }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 321,
    columnNumber: 12
  }, this);
}
__name(TableBox, "TableBox");
function Empty({ icon, message, action, onAction, text }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "dd-empty", "data-region": "empty", role: "status", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "dd-tile dd-tile-lg", children: /* @__PURE__ */ jsxDEV(Icon, { name: icon, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 341,
      columnNumber: 46
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 341,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "dd-empty-text", children: message }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 342,
      columnNumber: 9
    }, this),
    action && onAction && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onAction, children: action }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 343,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 340,
    columnNumber: 12
  }, this);
}
__name(Empty, "Empty");
function Dialog({ title, children, onClose, text }) {
  const root = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    document.body.classList.add("modal-open");
    root.current?.querySelector(".modal-footer .btn")?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      previous?.focus();
    };
  }, []);
  return createPortal(/* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: root,
        className: "modal show d-block",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        tabIndex: -1,
        onKeyDown: (event) => event.key === "Escape" && onClose(),
        onMouseDown: (event) => event.target === event.currentTarget && onClose(),
        children: /* @__PURE__ */ jsxDEV("div", { className: "modal-dialog modal-dialog-scrollable", children: /* @__PURE__ */ jsxDEV("div", { className: "modal-content", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "modal-header", children: [
            /* @__PURE__ */ jsxDEV("h5", { className: "modal-title", id: titleId, children: title }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 380,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn-close", "aria-label": text("details:close"), onClick: onClose }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
              lineNumber: 381,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 379,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "modal-body", children }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 383,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "modal-footer", children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-secondary", onClick: onClose, children: text("details:close") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 385,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
            lineNumber: 384,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 378,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
          lineNumber: 377,
          columnNumber: 13
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
        lineNumber: 367,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop show" }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
      lineNumber: 390,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ui.tsx",
    lineNumber: 366,
    columnNumber: 25
  }, this), document.body);
}
__name(Dialog, "Dialog");
function useStableColumns(table, ready) {
  useLayoutEffect(() => {
    const element = table.current;
    const box = element?.parentElement;
    if (!element || !box || !ready) {
      return void 0;
    }
    const freeze = /* @__PURE__ */ __name(() => {
      const heads = Array.from(element.tHead?.rows[0]?.cells ?? []);
      element.style.tableLayout = "";
      heads.forEach((head) => {
        head.style.width = "";
      });
      const widths = heads.map((head) => head.getBoundingClientRect().width);
      heads.forEach((head, index) => {
        head.style.width = `${widths[index]}px`;
      });
      element.style.tableLayout = "fixed";
    }, "freeze");
    freeze();
    let width = box.clientWidth;
    const observer = new ResizeObserver(() => {
      if (Math.abs(box.clientWidth - width) > 1) {
        width = box.clientWidth;
        freeze();
      }
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [ready]);
}
__name(useStableColumns, "useStableColumns");
export {
  Dialog,
  Empty,
  Icon,
  Menu,
  Pager,
  SearchBox,
  SelectMenu,
  SortHeader,
  TableBox,
  useFitHeight,
  useStableColumns
};
//# sourceMappingURL=ui.dev.js.map
