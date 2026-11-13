var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the grade, the
 * teacher it is graded as, and at its end the explanations of the row and the button that opens the grading screen of the activity.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Hint, Icon } from "./ui";
const TONES = {
  graded: "success",
  pending: "primary",
  manual: "info",
  failed: "danger",
  notautograded: "warning",
  notengaged: "secondary"
};
const notesOf = /* @__PURE__ */ __name((row, text) => {
  const notes = [];
  if (row.failure_reason) {
    notes.push({ title: text("info:failure"), message: row.failure_reason, tone: "danger" });
  }
  if (!row.grade && row.grade_problem) {
    notes.push({ title: text("info:problem"), message: row.grade_problem, tone: "warning" });
  }
  if (!row.graded_by && row.will_grade_problem) {
    notes.push({ title: text("info:grader"), message: row.will_grade_problem, tone: "warning" });
  }
  if (row.date_reason) {
    notes.push({ title: text("info:date"), message: row.date_reason, tone: "info" });
  }
  if (!row.grade && row.provisional_grade) {
    notes.push({ title: text("info:grade"), message: text("grade_provisional_help"), tone: "info" });
  }
  if (!row.graded_by && row.will_grade) {
    notes.push({ title: text("gradedby_prospective"), message: text("gradedby_prospective_help"), tone: "info" });
  }
  return notes;
}, "notesOf");
const Notes = /* @__PURE__ */ __name(({ notes, text }) => {
  if (notes.length === 0) {
    return null;
  }
  const tone = notes[0].tone;
  return /* @__PURE__ */ jsxDEV(
    Hint,
    {
      label: text("info:row"),
      icon: tone === "info" ? "i/info" : "i/warning",
      tone,
      text,
      message: /* @__PURE__ */ jsxDEV("ul", { className: "list-unstyled d-grid gap-2 mb-0", children: notes.map((note) => /* @__PURE__ */ jsxDEV("li", { className: `border-start border-3 border-${note.tone} ps-2`, children: [
        /* @__PURE__ */ jsxDEV("strong", { className: `d-block text-${note.tone}`, children: note.title }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 89,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("span", { className: "text-body", children: note.message }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 90,
          columnNumber: 17
        })
      ] }, note.title, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 88,
        columnNumber: 34
      })) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 87,
        columnNumber: 18
      })
    },
    void 0,
    false,
    {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 82,
      columnNumber: 12
    }
  );
}, "Notes");
function ReportRow({ row, columns, forumgrade, text }) {
  const tone = TONES[row.status_key] ?? "secondary";
  return /* @__PURE__ */ jsxDEV("tr", { "data-record-id": row.rowkey, children: [
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "d-flex align-items-center", children: [
      /* @__PURE__ */ jsxDEV("img", { className: "userpicture", src: row.user_picture_url, alt: "", width: 35, height: 35, loading: "lazy" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 107,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: row.user_profile_url, children: row.user_name }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 108,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 106,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 105,
      columnNumber: 9
    }, this),
    columns.course && /* @__PURE__ */ jsxDEV("td", { children: row.course_name && /* @__PURE__ */ jsxDEV("a", { href: row.course_url, children: row.course_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 111,
      columnNumber: 52
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 111,
      columnNumber: 28
    }, this),
    columns.activity && /* @__PURE__ */ jsxDEV("td", { children: row.activity_name && /* @__PURE__ */ jsxDEV("a", { href: row.activity_url, children: row.activity_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 112,
      columnNumber: 56
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 112,
      columnNumber: 30
    }, this),
    columns.group && /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", children: row.groups }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 113,
      columnNumber: 27
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft badge-dot rounded-pill text-bg-${tone}`, children: row.status }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 114,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 114,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", "data-sort-value": row.completed_at_sort, children: row.completed_at }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 115,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: [
      row.grade && /* @__PURE__ */ jsxDEV("strong", { children: row.grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 117,
        columnNumber: 27
      }, this),
      !row.grade && row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "fst-italic text-muted", children: row.provisional_grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 118,
        columnNumber: 53
      }, this),
      !row.grade && !row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 119,
        columnNumber: 54
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", children: [
      row.graded_by,
      !row.graded_by && row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "fst-italic text-muted", children: row.will_grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 123,
        columnNumber: 50
      }, this),
      !row.graded_by && !row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 124,
        columnNumber: 51
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 121,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "table-actions", children: [
      /* @__PURE__ */ jsxDEV(Notes, { notes: notesOf(row, text), text }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 127,
        columnNumber: 13
      }, this),
      row.grade_user_url && /* @__PURE__ */ jsxDEV(
        "a",
        {
          className: "btn btn-link btn-icon btn-sm text-primary",
          href: row.grade_user_url,
          title: text("gradeuser"),
          "aria-label": text("gradeuser"),
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/grades", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
            lineNumber: 133,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 128,
          columnNumber: 36
        },
        this
      ),
      !row.grade_user_url && row.show_forum_grader && forumgrade && /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "btn btn-link btn-icon btn-sm text-primary",
          title: text("gradeuser"),
          "aria-label": text("gradeuser"),
          "data-grade-action": "launch",
          "data-grading-component": forumgrade.gradingcomponent,
          "data-grading-component-subtype": forumgrade.gradingcomponentsubtype,
          "data-experimental-display-mode": forumgrade.experimentaldisplaymode,
          "data-initialuserid": row.moodle_userid,
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/grades", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
            lineNumber: 144,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 134,
          columnNumber: 76
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 126,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 104,
    columnNumber: 12
  }, this);
}
__name(ReportRow, "ReportRow");
export {
  ReportRow as default
};
//# sourceMappingURL=ReportRow.dev.js.map
