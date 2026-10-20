var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A filter whose options are searched from the server as the reader types, for the courses and the activities: the list is never
 * sent whole, because a site can have a hundred thousand courses.
 *
 * @module     report_autograder/components/PickerFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import Chip from "./common/Chip";
import { IconCheck } from "./common/Icons";
import { useDebounced } from "../hooks/useDebounced";
import { searchOptions } from "../services/api";
function PickerFilter({ type, icon, label, chosen, scope, courseid, text, onChange }) {
  return /* @__PURE__ */ jsxDEV(
    Chip,
    {
      icon,
      label,
      value: chosen?.name ?? "",
      clearLabel: text("filter_clear"),
      onClear: () => onChange(null),
      minWidth: 280,
      children: (close) => /* @__PURE__ */ jsxDEV(
        Search,
        {
          type,
          label,
          chosen,
          scope,
          courseid,
          text,
          onPick: (option) => {
            onChange(option);
            close();
          }
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
          lineNumber: 55,
          columnNumber: 21
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
      lineNumber: 47,
      columnNumber: 12
    },
    this
  );
}
__name(PickerFilter, "PickerFilter");
const Search = /* @__PURE__ */ __name(({ type, label, chosen, scope, courseid, text, onPick }) => {
  const field = useRef(null);
  const [query, setQuery] = useState("");
  const typed = useDebounced(query.trim(), 250);
  const [found, setFound] = useState({ options: [], hasmore: false, loading: true, failed: false });
  useEffect(() => {
    field.current?.focus();
  }, []);
  useEffect(() => {
    let current = true;
    setFound((before) => ({ ...before, loading: true, failed: false }));
    searchOptions(type, typed, scope, courseid).then((response) => {
      if (current) {
        setFound({ options: response.options, hasmore: response.hasmore, loading: false, failed: false });
      }
    }).catch(() => {
      if (current) {
        setFound({ options: [], hasmore: false, loading: false, failed: true });
      }
    });
    return () => {
      current = false;
    };
  }, [type, typed, courseid, scope.cmid, scope.courseid]);
  let status = "";
  if (found.loading) {
    status = text("search:loading");
  } else if (found.failed) {
    status = text("error:retry");
  } else if (found.options.length === 0) {
    status = text("search:nomatches");
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "arp-picker", children: [
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        ref: field,
        type: "search",
        className: "arp-picker-field",
        value: query,
        placeholder: text("search:typetosearch"),
        "aria-label": label,
        onChange: (event) => setQuery(event.target.value)
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
        lineNumber: 110,
        columnNumber: 9
      }
    ),
    /* @__PURE__ */ jsxDEV("ul", { className: "arp-options", role: "listbox", "aria-label": label, "aria-busy": found.loading, children: found.options.map((option) => {
      const on = chosen?.id === option.id;
      return /* @__PURE__ */ jsxDEV("li", { role: "option", "aria-selected": on, children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: `arp-option${on ? " arp-option-on" : ""}`, onClick: () => onPick(option), children: [
        /* @__PURE__ */ jsxDEV("span", { className: "arp-option-label", children: option.name }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
          lineNumber: 124,
          columnNumber: 25
        }),
        on && /* @__PURE__ */ jsxDEV("span", { className: "arp-option-check", children: /* @__PURE__ */ jsxDEV(IconCheck, {}, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
          lineNumber: 125,
          columnNumber: 67
        }) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
          lineNumber: 125,
          columnNumber: 32
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
        lineNumber: 123,
        columnNumber: 21
      }) }, option.id, false, {
        fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
        lineNumber: 122,
        columnNumber: 24
      });
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
      lineNumber: 119,
      columnNumber: 9
    }),
    status !== "" && /* @__PURE__ */ jsxDEV("p", { className: "arp-picker-status", role: "status", children: status }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
      lineNumber: 130,
      columnNumber: 27
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/PickerFilter.tsx",
    lineNumber: 109,
    columnNumber: 12
  });
}, "Search");
export {
  PickerFilter as default
};
//# sourceMappingURL=PickerFilter.dev.js.map
