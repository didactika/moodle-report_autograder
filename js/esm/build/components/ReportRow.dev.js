var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One student of one activity: who, where, in which state, when, with which grade, graded as whom, and the way to grade.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Hint from "./common/Hint";
import { IconInfo, IconWarning } from "./common/Icons";
import StatusBadge from "./StatusBadge";
const Grade = /* @__PURE__ */ __name(({ row, text }) => {
  if (row.grade) {
    return /* @__PURE__ */ jsxDEV("span", { className: "arp-grade", children: row.grade }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 32,
      columnNumber: 16
    });
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "arp-grade arp-grade-provisional", children: [
      row.provisional_grade,
      /* @__PURE__ */ jsxDEV(Hint, { text: text("grade_provisional_help"), label: text("info:grade"), icon: /* @__PURE__ */ jsxDEV(IconInfo, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 37,
        columnNumber: 90
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 37,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 35,
      columnNumber: 35
    }),
    row.grade_problem && /* @__PURE__ */ jsxDEV(Hint, { text: row.grade_problem, label: text("info:problem"), icon: /* @__PURE__ */ jsxDEV(IconWarning, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 39,
      columnNumber: 97
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 39,
      columnNumber: 31
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 34,
    columnNumber: 12
  });
}, "Grade");
const Grader = /* @__PURE__ */ __name(({ row, text }) => {
  if (row.graded_by) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: row.graded_by }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 51,
      columnNumber: 16
    });
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "arp-prospective", children: [
      row.will_grade,
      /* @__PURE__ */ jsxDEV(Hint, { text: text("gradedby_prospective_help"), label: text("gradedby_prospective"), icon: /* @__PURE__ */ jsxDEV(IconInfo, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 56,
        columnNumber: 103
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 56,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 54,
      columnNumber: 28
    }),
    row.will_grade_problem && /* @__PURE__ */ jsxDEV(Hint, { text: row.will_grade_problem, label: text("info:problem"), icon: /* @__PURE__ */ jsxDEV(IconWarning, {}, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 58,
      columnNumber: 107
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 58,
      columnNumber: 36
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 53,
    columnNumber: 12
  });
}, "Grader");
function ReportRow({ row, columns, forumgrade, text }) {
  return /* @__PURE__ */ jsxDEV("tr", { "data-record-id": row.rowkey, children: [
    /* @__PURE__ */ jsxDEV("td", { className: "arp-cell-student", "data-label": text("header:student"), children: /* @__PURE__ */ jsxDEV("a", { className: "arp-student", href: row.user_profile_url, children: [
      /* @__PURE__ */ jsxDEV("img", { className: "arp-avatar", src: row.user_picture_url, alt: "", width: 36, height: 36, loading: "lazy" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 72,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "arp-student-name", children: row.user_name }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 73,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 71,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this),
    columns.course && /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:course"), children: row.course_name && /* @__PURE__ */ jsxDEV("a", { href: row.course_url, children: row.course_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 77,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 76,
      columnNumber: 28
    }, this),
    columns.activity && /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:activity"), children: row.activity_name && /* @__PURE__ */ jsxDEV("a", { href: row.activity_url, children: row.activity_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 80,
      columnNumber: 35
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 79,
      columnNumber: 30
    }, this),
    columns.group && /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:groups"), children: row.groups }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 82,
      columnNumber: 27
    }, this),
    /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:external_status"), children: /* @__PURE__ */ jsxDEV(StatusBadge, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 83,
      columnNumber: 57
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 83,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:completed_at"), "data-sort-value": row.completed_at_sort, children: [
      row.completed_at,
      row.date_reason && /* @__PURE__ */ jsxDEV(Hint, { text: row.date_reason, label: text("info:date"), icon: /* @__PURE__ */ jsxDEV(IconInfo, {}, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 86,
        columnNumber: 94
      }, this) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 86,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 84,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "arp-cell-grade", "data-label": text("header:grade"), children: /* @__PURE__ */ jsxDEV(Grade, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 88,
      columnNumber: 74
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 88,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { "data-label": text("header:gradedby"), children: /* @__PURE__ */ jsxDEV(Grader, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 89,
      columnNumber: 50
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 89,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "arp-cell-action", children: [
      row.grade_user_url && /* @__PURE__ */ jsxDEV("a", { className: "arp-action", href: row.grade_user_url, children: text("gradeuser") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 91,
        columnNumber: 36
      }, this),
      !row.grade_user_url && row.show_forum_grader && forumgrade && /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "arp-action",
          "data-grade-action": "launch",
          "data-grading-component": forumgrade.gradingcomponent,
          "data-grading-component-subtype": forumgrade.gradingcomponentsubtype,
          "data-experimental-display-mode": forumgrade.experimentaldisplaymode,
          "data-initialuserid": row.moodle_userid,
          children: text("gradeuser")
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 92,
          columnNumber: 76
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 90,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 69,
    columnNumber: 12
  }, this);
}
__name(ReportRow, "ReportRow");
export {
  ReportRow as default
};
//# sourceMappingURL=ReportRow.dev.js.map
