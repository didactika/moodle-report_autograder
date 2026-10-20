var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The group filter, for the reports where groups are in play: the groups that the viewer may see, and all of them when the viewer
 * may.
 *
 * @module     report_autograder/components/GroupFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Chip from "./common/Chip";
import { IconCheck, IconGroup } from "./common/Icons";
function GroupFilter({ groups, offersAll, chosen, text, onChange }) {
  const current = groups.find((group) => group.id === chosen);
  const value = current && (offersAll || groups.length > 1) ? current.name : "";
  const entries = offersAll ? [{ id: 0, name: text("filter_group_placeholder") }, ...groups] : groups;
  return /* @__PURE__ */ jsxDEV(
    Chip,
    {
      icon: /* @__PURE__ */ jsxDEV(IconGroup, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
        lineNumber: 38,
        columnNumber: 15
      }, this),
      label: offersAll ? text("filter_group") : current?.name ?? text("filter_group"),
      value,
      clearLabel: text("filter_clear"),
      onClear: () => onChange(0),
      minWidth: 220,
      children: (close) => /* @__PURE__ */ jsxDEV("ul", { className: "arp-options", role: "listbox", "aria-label": text("filter_group"), children: entries.map((group) => {
        const on = group.id === chosen;
        return /* @__PURE__ */ jsxDEV("li", { role: "option", "aria-selected": on, children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: `arp-option${on ? " arp-option-on" : ""}`,
            onClick: () => {
              onChange(group.id);
              close();
            },
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "arp-option-label", children: group.name }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
                lineNumber: 57,
                columnNumber: 25
              }, this),
              on && /* @__PURE__ */ jsxDEV("span", { className: "arp-option-check", children: /* @__PURE__ */ jsxDEV(IconCheck, {}, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
                lineNumber: 58,
                columnNumber: 67
              }, this) }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
                lineNumber: 58,
                columnNumber: 32
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
            lineNumber: 49,
            columnNumber: 21
          },
          this
        ) }, group.id, false, {
          fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
          lineNumber: 48,
          columnNumber: 24
        }, this);
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
        lineNumber: 45,
        columnNumber: 21
      }, this)
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/GroupFilter.tsx",
      lineNumber: 37,
      columnNumber: 12
    },
    this
  );
}
__name(GroupFilter, "GroupFilter");
export {
  GroupFilter as default
};
//# sourceMappingURL=GroupFilter.dev.js.map
