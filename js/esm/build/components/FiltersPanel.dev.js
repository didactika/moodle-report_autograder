var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The panel of the Filters button: the status, the group, the course and the activity, and the grading date.
 *
 * Every filter answers at once, as the design system asks, so the panel has no button to apply them: the results behind it change as
 * each one is chosen and the numbers beside the statuses are the ones that choice leaves.
 *
 * @module     report_autograder/components/FiltersPanel
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useState } from "react";
import { useDebounced } from "../hooks/useDebounced";
import { datePresets } from "../lib/filters";
import { searchOptions } from "../services/api";
const Picker = /* @__PURE__ */ __name(({ type, label, chosen, scope, courseid, text, onPick }) => {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const typed = useDebounced(query.trim(), 250);
  const [found, setFound] = useState({ options: [], loading: false });
  useEffect(() => {
    if (!open) {
      return void 0;
    }
    let current = true;
    setFound((before) => ({ ...before, loading: true }));
    searchOptions(type, typed, scope, courseid).then((response) => {
      if (current) {
        setFound({ options: response.options, loading: false });
      }
    }).catch(() => {
      if (current) {
        setFound({ options: [], loading: false });
      }
    });
    return () => {
      current = false;
    };
  }, [open, type, typed, courseid, scope.cmid, scope.courseid]);
  return /* @__PURE__ */ jsxDEV("div", { className: "mb-3 position-relative", children: [
    /* @__PURE__ */ jsxDEV("label", { className: "form-label", htmlFor: id, children: label }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 82,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        id,
        type: "search",
        className: "form-control",
        value: open ? query : chosen?.name ?? "",
        placeholder: chosen ? chosen.name : text("search:typetosearch"),
        autoComplete: "off",
        onFocus: () => {
          setQuery("");
          setOpen(true);
        },
        onChange: (event) => setQuery(event.target.value)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 83,
        columnNumber: 9
      }
    ),
    open && /* @__PURE__ */ jsxDEV("div", { className: "list-group mt-1 position-absolute w-100 shadow", role: "listbox", "aria-label": label, "aria-busy": found.loading, children: [
      chosen && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "list-group-item list-group-item-action text-muted", onClick: () => {
        onPick(null);
        setOpen(false);
      }, children: text("filter_clear") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 97,
        columnNumber: 24
      }),
      found.options.map((option) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          role: "option",
          "aria-selected": chosen?.id === option.id,
          className: `list-group-item list-group-item-action${chosen?.id === option.id ? " active" : ""}`,
          onClick: () => {
            onPick(option);
            setOpen(false);
          },
          children: option.name
        },
        option.id,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 101,
          columnNumber: 44
        }
      )),
      !found.loading && found.options.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "list-group-item text-muted", children: text("search:nomatches") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 112,
        columnNumber: 62
      }),
      found.loading && found.options.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "list-group-item text-muted", children: text("search:loading") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 113,
        columnNumber: 61
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 96,
      columnNumber: 18
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
    lineNumber: 81,
    columnNumber: 12
  });
}, "Picker");
function FiltersPanel({ props, filters, counts, course, activity, text, onFilters, onCourse, onActivity, onReset, canReset }) {
  const groupId = useId();
  const fromId = useId();
  const toId = useId();
  const options = counts.length > 0 ? counts : props.statuses.map((status) => ({ ...status, count: 0 }));
  const toggle = /* @__PURE__ */ __name((key) => {
    const chosen = filters.status.includes(key) ? filters.status.filter((item) => item !== key) : [...filters.status, key];
    onFilters({ status: chosen });
  }, "toggle");
  return /* @__PURE__ */ jsxDEV("div", { className: "p-3", children: [
    /* @__PURE__ */ jsxDEV("fieldset", { className: "mb-3", children: [
      /* @__PURE__ */ jsxDEV("legend", { className: "h6 mb-2", children: text("filter_status") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 136,
        columnNumber: 13
      }, this),
      options.map((option) => /* @__PURE__ */ jsxDEV("div", { className: "form-check", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "checkbox",
            className: "form-check-input",
            id: `${groupId}-${option.key}`,
            checked: filters.status.includes(option.key),
            onChange: () => toggle(option.key)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
            lineNumber: 138,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("label", { className: "form-check-label d-flex align-items-center justify-content-between gap-3", htmlFor: `${groupId}-${option.key}`, children: [
          option.label,
          /* @__PURE__ */ jsxDEV("span", { className: "badge badge-secondary bg-secondary rounded-pill", children: option.count }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
            lineNumber: 147,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 145,
          columnNumber: 17
        }, this)
      ] }, option.key, true, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 137,
        columnNumber: 38
      }, this))
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 135,
      columnNumber: 9
    }, this),
    props.showscoursefilter && /* @__PURE__ */ jsxDEV(
      Picker,
      {
        type: "course",
        label: text("filter_course"),
        chosen: course,
        scope: props.scope,
        courseid: 0,
        text,
        onPick: onCourse
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 151,
        columnNumber: 37
      },
      this
    ),
    props.showsactivityfilter && /* @__PURE__ */ jsxDEV(
      Picker,
      {
        type: "activity",
        label: text("filter_activity"),
        chosen: activity,
        scope: props.scope,
        courseid: filters.courseid,
        text,
        onPick: onActivity
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 160,
        columnNumber: 39
      },
      this
    ),
    props.showsgroupfilter && /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxDEV("label", { className: "form-label", htmlFor: `${groupId}-group`, children: text("filter_group") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 170,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          id: `${groupId}-group`,
          className: "form-select custom-select",
          value: filters.groupid,
          onChange: (event) => onFilters({ groupid: Number(event.target.value) }),
          children: [
            props.offersallgroups && /* @__PURE__ */ jsxDEV("option", { value: 0, children: text("filter_group_placeholder") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
              lineNumber: 177,
              columnNumber: 43
            }, this),
            props.groups.map((group) => /* @__PURE__ */ jsxDEV("option", { value: group.id, children: group.name }, group.id, false, {
              fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
              lineNumber: 178,
              columnNumber: 46
            }, this))
          ]
        },
        void 0,
        true,
        {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 171,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 169,
      columnNumber: 36
    }, this),
    /* @__PURE__ */ jsxDEV("fieldset", { className: "mb-3", children: [
      /* @__PURE__ */ jsxDEV("legend", { className: "h6 mb-2", children: text("filter_grading_date") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 182,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap gap-1 mb-2", children: datePresets(/* @__PURE__ */ new Date()).map((preset) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `btn btn-sm btn-outline-secondary${filters.datefrom === preset.from && filters.dateto === preset.to ? " active" : ""}`,
          onClick: () => onFilters({ datefrom: preset.from, dateto: preset.to }),
          children: text(`filter_date_${preset.key}`)
        },
        preset.key,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 184,
          columnNumber: 58
        },
        this
      )) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 183,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "row g-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "col-6 col-sm-6", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "form-label small", htmlFor: fromId, children: text("datepicker_from") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
            lineNumber: 193,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: fromId,
              type: "date",
              className: "form-control",
              value: filters.datefrom,
              max: filters.dateto || void 0,
              onChange: (event) => onFilters({ datefrom: event.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
              lineNumber: 194,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 192,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "col-6 col-sm-6", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "form-label small", htmlFor: toId, children: text("datepicker_to") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
            lineNumber: 198,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: toId,
              type: "date",
              className: "form-control",
              value: filters.dateto,
              min: filters.datefrom || void 0,
              onChange: (event) => onFilters({ dateto: event.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
              lineNumber: 199,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
          lineNumber: 197,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
        lineNumber: 191,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 181,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex justify-content-end", children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-link", disabled: !canReset, onClick: onReset, children: text("filters_reset") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 205,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
      lineNumber: 204,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/FiltersPanel.tsx",
    lineNumber: 134,
    columnNumber: 12
  }, this);
}
__name(FiltersPanel, "FiltersPanel");
export {
  FiltersPanel as default
};
//# sourceMappingURL=FiltersPanel.dev.js.map
