var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the grade, the
 * teacher it is graded as and the button that opens the grading screen of the activity.
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
const Grade = /* @__PURE__ */ __name(({ row, text }) => {
  if (row.grade) {
    return /* @__PURE__ */ jsxDEV("strong", { children: row.grade }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 41,
      columnNumber: 16
    });
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "fst-italic text-muted", children: [
      row.provisional_grade,
      " ",
      /* @__PURE__ */ jsxDEV(Hint, { message: text("grade_provisional_help"), label: text("info:grade"), icon: "i/info", text }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 45,
        columnNumber: 37
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 44,
      columnNumber: 35
    }),
    row.grade_problem && /* @__PURE__ */ jsxDEV(Hint, { message: row.grade_problem, label: text("info:problem"), icon: "i/warning", tone: "warning", text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 47,
      columnNumber: 31
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 43,
    columnNumber: 12
  });
}, "Grade");
const Grader = /* @__PURE__ */ __name(({ row, text }) => {
  if (row.graded_by) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: row.graded_by }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 59,
      columnNumber: 16
    });
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: [
      row.will_grade,
      " ",
      /* @__PURE__ */ jsxDEV(Hint, { message: text("gradedby_prospective_help"), label: text("gradedby_prospective"), icon: "i/info", text }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 63,
        columnNumber: 30
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 62,
      columnNumber: 28
    }),
    row.will_grade_problem && /* @__PURE__ */ jsxDEV(Hint, { message: row.will_grade_problem, label: text("info:problem"), icon: "i/warning", tone: "warning", text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 65,
      columnNumber: 36
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 61,
    columnNumber: 12
  });
}, "Grader");
function ReportRow({ row, columns, forumgrade, text }) {
  const tone = TONES[row.status_key] ?? "secondary";
  return /* @__PURE__ */ jsxDEV("tr", { "data-record-id": row.rowkey, children: [
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "d-flex align-items-center", children: [
      /* @__PURE__ */ jsxDEV("img", { className: "userpicture", src: row.user_picture_url, alt: "", width: 35, height: 35, loading: "lazy" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 80,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: row.user_profile_url, children: row.user_name }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 81,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 79,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 78,
      columnNumber: 9
    }, this),
    columns.course && /* @__PURE__ */ jsxDEV("td", { children: row.course_name && /* @__PURE__ */ jsxDEV("a", { href: row.course_url, children: row.course_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 84,
      columnNumber: 52
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 84,
      columnNumber: 28
    }, this),
    columns.activity && /* @__PURE__ */ jsxDEV("td", { children: row.activity_name && /* @__PURE__ */ jsxDEV("a", { href: row.activity_url, children: row.activity_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 85,
      columnNumber: 56
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 85,
      columnNumber: 30
    }, this),
    columns.group && /* @__PURE__ */ jsxDEV("td", { children: row.groups }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 86,
      columnNumber: 27
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: [
      /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft badge-dot rounded-pill text-bg-${tone}`, children: row.status }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 88,
        columnNumber: 13
      }, this),
      row.failure_reason && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        " ",
        /* @__PURE__ */ jsxDEV(Hint, { message: row.failure_reason, label: text("info:failure"), icon: "i/warning", tone: "danger", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 89,
          columnNumber: 39
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 89,
        columnNumber: 36
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 87,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { "data-sort-value": row.completed_at_sort, children: [
      row.completed_at,
      row.date_reason && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        " ",
        /* @__PURE__ */ jsxDEV(Hint, { message: row.date_reason, label: text("info:date"), icon: "i/info", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 93,
          columnNumber: 36
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 93,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 91,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(Grade, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 95,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 95,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(Grader, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 96,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 96,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "table-actions", children: [
      row.grade_user_url && /* @__PURE__ */ jsxDEV(
        "a",
        {
          className: "btn btn-link btn-icon btn-sm text-primary",
          href: row.grade_user_url,
          title: text("gradeuser"),
          "aria-label": text("gradeuser"),
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/grades", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
            lineNumber: 103,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 98,
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
            lineNumber: 114,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 104,
          columnNumber: 76
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 97,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 77,
    columnNumber: 12
  }, this);
}
__name(ReportRow, "ReportRow");
export {
  ReportRow as default
};
//# sourceMappingURL=ReportRow.dev.js.map
