var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the
 * grade, the teacher it is graded as, and at its end the button that opens what the row has to explain and the one that opens
 * the grading screen of the activity.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import { Dialog, Icon } from "./ui";
const TONES = {
  graded: "success",
  pending: "primary",
  manual: "info",
  failed: "danger",
  notautograded: "warning",
  notengaged: "secondary"
};
const toneOf = /* @__PURE__ */ __name((row) => {
  if (row.failure_reason) {
    return "danger";
  }
  if (!row.grade && row.grade_problem || !row.graded_by && row.will_grade_problem) {
    return "warning";
  }
  return "info";
}, "toneOf");
const explains = /* @__PURE__ */ __name((row) => Boolean(row.failure_reason || row.grade_problem || row.will_grade_problem || row.date_reason || !row.grade && row.provisional_grade || !row.graded_by && row.will_grade), "explains");
const Expected = /* @__PURE__ */ __name(({ grade, text }) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: grade }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 67,
    columnNumber: 5
  }),
  " ",
  /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft rounded-pill text-bg-secondary", children: text("grade_expected") }, void 0, false, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 68,
    columnNumber: 10
  })
] }, void 0, true, {
  fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
  lineNumber: 66,
  columnNumber: 66
}), "Expected");
const Details = /* @__PURE__ */ __name(({ row, text }) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  row.failure_reason && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", role: "alert", children: [
    /* @__PURE__ */ jsxDEV("strong", { className: "d-block", children: text("info:failure") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 79,
      columnNumber: 9
    }),
    row.failure_reason
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 78,
    columnNumber: 28
  }),
  !row.grade && row.grade_problem && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-warning", role: "alert", children: [
    /* @__PURE__ */ jsxDEV("strong", { className: "d-block", children: text("info:problem") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 82,
      columnNumber: 9
    }),
    row.grade_problem
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 81,
    columnNumber: 41
  }),
  !row.graded_by && row.will_grade_problem && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-warning", role: "alert", children: [
    /* @__PURE__ */ jsxDEV("strong", { className: "d-block", children: text("info:grader") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 85,
      columnNumber: 9
    }),
    row.will_grade_problem
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 84,
    columnNumber: 50
  }),
  /* @__PURE__ */ jsxDEV("dl", { className: "row mb-0", children: [
    row.activity_name && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("dt", { className: "col-sm-4", children: text("header:activity") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 89,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("dd", { className: "col-sm-8", children: row.activity_name }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 90,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 88,
      columnNumber: 31
    }),
    /* @__PURE__ */ jsxDEV("dt", { className: "col-sm-4", children: text("header:external_status") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 92,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dd", { className: "col-sm-8", children: /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft badge-dot rounded-pill text-bg-${TONES[row.status_key] ?? "secondary"}`, children: row.status }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 94,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 93,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dt", { className: "col-sm-4", children: text("header:completed_at") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 98,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dd", { className: "col-sm-8", children: [
      row.completed_at,
      row.date_reason && /* @__PURE__ */ jsxDEV("div", { className: "small text-muted", children: row.date_reason }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 101,
        columnNumber: 33
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 99,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dt", { className: "col-sm-4", children: text("header:grade") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 103,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dd", { className: "col-sm-8", children: [
      row.grade && /* @__PURE__ */ jsxDEV("strong", { children: row.grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 105,
        columnNumber: 27
      }),
      !row.grade && row.provisional_grade && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Expected, { grade: row.provisional_grade, text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 107,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "small text-muted", children: text("details:grade_expected", row.completed_at) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 108,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 106,
        columnNumber: 53
      }),
      !row.grade && !row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 110,
        columnNumber: 54
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 104,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dt", { className: "col-sm-4", children: text("header:gradedby") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 112,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("dd", { className: "col-sm-8 mb-0", children: [
      row.graded_by,
      !row.graded_by && row.will_grade && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: row.will_grade }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 116,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "small text-muted", children: text("gradedby_prospective_help") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 117,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 115,
        columnNumber: 50
      }),
      !row.graded_by && !row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 119,
        columnNumber: 51
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 113,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 87,
    columnNumber: 5
  })
] }, void 0, true, {
  fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
  lineNumber: 77,
  columnNumber: 58
}), "Details");
const RowDetails = /* @__PURE__ */ __name(({ row, text }) => {
  const [open, setOpen] = useState(false);
  if (!explains(row)) {
    return null;
  }
  const tone = toneOf(row);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: `btn btn-link btn-icon btn-sm btn-hint text-${tone}`,
        title: text("info:row"),
        "aria-label": text("info:row"),
        "aria-haspopup": "dialog",
        onClick: () => setOpen(true),
        children: /* @__PURE__ */ jsxDEV(Icon, { name: tone === "info" ? "i/info" : "i/warning", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 144,
          columnNumber: 10
        })
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 137,
        columnNumber: 9
      }
    ),
    open && /* @__PURE__ */ jsxDEV(Dialog, { title: row.user_name, onClose: () => setOpen(false), text, children: /* @__PURE__ */ jsxDEV(Details, { row, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 146,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 145,
      columnNumber: 18
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 136,
    columnNumber: 12
  });
}, "RowDetails");
function ReportRow({ row, columns, forumgrade, text }) {
  const tone = TONES[row.status_key] ?? "secondary";
  return /* @__PURE__ */ jsxDEV("tr", { "data-record-id": row.rowkey, children: [
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "d-flex align-items-center", children: [
      /* @__PURE__ */ jsxDEV("img", { className: "userpicture", src: row.user_picture_url, alt: "", width: 35, height: 35, loading: "lazy" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 162,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: row.user_profile_url, children: row.user_name }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 163,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 161,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 160,
      columnNumber: 9
    }, this),
    columns.course && /* @__PURE__ */ jsxDEV("td", { children: row.course_name && /* @__PURE__ */ jsxDEV("a", { href: row.course_url, children: row.course_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 166,
      columnNumber: 52
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 166,
      columnNumber: 28
    }, this),
    columns.activity && /* @__PURE__ */ jsxDEV("td", { children: row.activity_name && /* @__PURE__ */ jsxDEV("a", { href: row.activity_url, children: row.activity_name }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 167,
      columnNumber: 56
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 167,
      columnNumber: 30
    }, this),
    columns.group && /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", children: row.groups }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 168,
      columnNumber: 27
    }, this),
    /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft badge-dot rounded-pill text-bg-${tone}`, children: row.status }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 169,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 169,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", "data-sort-value": row.completed_at_sort, children: row.completed_at }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 170,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", children: [
      row.grade && /* @__PURE__ */ jsxDEV("strong", { children: row.grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 172,
        columnNumber: 27
      }, this),
      !row.grade && row.provisional_grade && /* @__PURE__ */ jsxDEV(Expected, { grade: row.provisional_grade, text }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 173,
        columnNumber: 53
      }, this),
      !row.grade && !row.provisional_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 174,
        columnNumber: 54
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 171,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "text-nowrap", children: [
      row.graded_by,
      !row.graded_by && row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: row.will_grade }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 178,
        columnNumber: 50
      }, this),
      !row.graded_by && !row.will_grade && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 179,
        columnNumber: 51
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 176,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("td", { className: "table-actions", children: [
      /* @__PURE__ */ jsxDEV(RowDetails, { row, text }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
        lineNumber: 182,
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
            lineNumber: 188,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 183,
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
            lineNumber: 199,
            columnNumber: 14
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
          lineNumber: 189,
          columnNumber: 76
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
      lineNumber: 181,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/components/ReportRow.tsx",
    lineNumber: 159,
    columnNumber: 12
  }, this);
}
__name(ReportRow, "ReportRow");
export {
  ReportRow as default
};
//# sourceMappingURL=ReportRow.dev.js.map
