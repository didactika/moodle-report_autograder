var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Who Autograder would grade as in one course, before it grades anything: the people who could grade there and, on request, the
 * grader that each student would get.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes.
 *
 * @module     report_autograder/Graders
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useMemo, useState } from "react";
import { IconCourse } from "./components/common/Icons";
import Pagination from "./components/Pagination";
import PickerFilter from "./components/PickerFilter";
import { createText } from "./engine/text";
import { describeError, getGraders } from "./services/api";
const remember = /* @__PURE__ */ __name((courseid, students) => {
  const url = new URL(window.location.href);
  url.searchParams.delete("courseid");
  url.searchParams.delete("students");
  if (courseid > 0) {
    url.searchParams.set("courseid", String(courseid));
  }
  if (students) {
    url.searchParams.set("students", "1");
  }
  window.history.replaceState(null, "", url);
}, "remember");
function Graders(props) {
  const text = useMemo(() => createText(props.strings), [props.strings]);
  const [courseid, setCourseid] = useState(props.courseid);
  const [students, setStudents] = useState(props.students);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(props.perpage);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(props.courseid > 0);
  const [failed, setFailed] = useState("");
  const [chosen, setChosen] = useState(null);
  useEffect(() => {
    if (courseid <= 0) {
      setData(null);
      setLoading(false);
      return void 0;
    }
    let current = true;
    setLoading(true);
    setFailed("");
    getGraders(courseid, students, page, perpage).then((response) => {
      if (current) {
        setData(response);
        setChosen({ id: courseid, name: response.course });
        setLoading(false);
      }
    }).catch((error) => {
      if (current) {
        setFailed(describeError(error));
        setLoading(false);
      }
    });
    return () => {
      current = false;
    };
  }, [courseid, students, page, perpage]);
  const pick = /* @__PURE__ */ __name((option) => {
    const id = option?.id ?? 0;
    setChosen(option);
    setCourseid(id);
    setStudents(false);
    setPage(0);
    remember(id, false);
  }, "pick");
  const open = /* @__PURE__ */ __name((show) => {
    setStudents(show);
    setPage(0);
    remember(courseid, show);
  }, "open");
  return /* @__PURE__ */ jsxDEV("div", { className: "arp arp-graders", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "arp-toolbar", children: /* @__PURE__ */ jsxDEV("div", { className: "arp-filters", children: /* @__PURE__ */ jsxDEV(
      PickerFilter,
      {
        type: "anycourse",
        icon: /* @__PURE__ */ jsxDEV(IconCourse, {}, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 104,
          columnNumber: 27
        }, this),
        label: text("graders:pickcourse"),
        chosen,
        scope: {},
        courseid: 0,
        text,
        onChange: pick
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 102,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 101,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 100,
      columnNumber: 9
    }, this),
    courseid <= 0 && /* @__PURE__ */ jsxDEV("p", { className: "arp-intro", children: text("graders:intro") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 114,
      columnNumber: 27
    }, this),
    failed !== "" && /* @__PURE__ */ jsxDEV("div", { className: "arp-empty", role: "alert", children: /* @__PURE__ */ jsxDEV("p", { className: "arp-empty-text", children: text("error:apirequest", failed) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 115,
      columnNumber: 67
    }, this) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 115,
      columnNumber: 27
    }, this),
    loading && data === null && /* @__PURE__ */ jsxDEV("p", { className: "arp-intro", role: "status", children: text("graders:loading") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 116,
      columnNumber: 38
    }, this),
    data && /* @__PURE__ */ jsxDEV("section", { className: "arp-card", "aria-busy": loading, children: [
      /* @__PURE__ */ jsxDEV("header", { className: "arp-card-head", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "arp-card-title", children: data.course }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 120,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "arp-counts", children: [
            /* @__PURE__ */ jsxDEV("span", { children: [
              /* @__PURE__ */ jsxDEV("strong", { children: data.gradercount }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 122,
                columnNumber: 31
              }, this),
              " ",
              text("graders:gradercount")
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 122,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              /* @__PURE__ */ jsxDEV("strong", { children: data.studentcount }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 123,
                columnNumber: 31
              }, this),
              " ",
              text("graders:studentcount")
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 123,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 121,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 119,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("a", { className: "arp-action arp-action-quiet", href: data.reporturl, children: text("graders:openreport") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 126,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 118,
        columnNumber: 13
      }, this),
      !data.hasgraders && /* @__PURE__ */ jsxDEV("p", { className: "arp-alert arp-alert-danger", role: "alert", children: text("graders:nograders") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 128,
        columnNumber: 34
      }, this),
      data.hasgraders && /* @__PURE__ */ jsxDEV("div", { className: "arp-panel", children: [
        /* @__PURE__ */ jsxDEV("h4", { className: "arp-panel-title", children: text("graders:possible") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 130,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("ul", { className: "arp-graders-names", children: data.graders.map((grader) => /* @__PURE__ */ jsxDEV("li", { children: [
          grader.name,
          grader.isfallback && /* @__PURE__ */ jsxDEV("span", { className: "arp-badge arp-badge-manual", children: text("graders:viafallback") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 134,
            columnNumber: 47
          }, this)
        ] }, grader.id, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 132,
          columnNumber: 51
        }, this)) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 131,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "arp-note", children: text("graders:associationnote") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 137,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 129,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "arp-students-toggle", children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "arp-action", onClick: () => open(!students), children: students ? text("graders:hidestudents") : text("graders:seestudents") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 140,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 139,
        columnNumber: 13
      }, this),
      students && data.hasstudents && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        data.studentlist.students.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "arp-intro", children: text("graders:none") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 145,
          columnNumber: 60
        }, this),
        data.studentlist.students.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "arp-table-scroll", tabIndex: 0, role: "region", "aria-label": text("graders:students"), children: /* @__PURE__ */ jsxDEV("table", { className: "arp-table", children: [
          /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:student") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 150,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:grader") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 151,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 149,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 148,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("tbody", { children: data.studentlist.students.map((student, index) => /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("td", { "data-label": text("graders:student"), children: student.name }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 156,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV("td", { "data-label": text("graders:grader"), children: [
              student.hasgrader ? student.grader : /* @__PURE__ */ jsxDEV("span", { className: "arp-badge arp-badge-failed", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "arp-dot" }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                  lineNumber: 159,
                  columnNumber: 41
                }, this),
                text("graders:nobodyfor")
              ] }, void 0, true, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 158,
                columnNumber: 75
              }, this),
              student.viafallback && /* @__PURE__ */ jsxDEV("span", { className: "arp-badge arp-badge-manual", children: text("graders:viafallback") }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 162,
                columnNumber: 61
              }, this)
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 157,
              columnNumber: 33
            }, this)
          ] }, `${student.name}-${index}`, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 155,
            columnNumber: 80
          }, this)) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 154,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 147,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 146,
          columnNumber: 58
        }, this),
        /* @__PURE__ */ jsxDEV(
          Pagination,
          {
            page: data.studentlist.page,
            limit: data.studentlist.perpage,
            total: data.studentlist.total,
            sizes: props.pagesizes,
            showing: text("graders:showing", {
              from: data.studentlist.from,
              to: data.studentlist.to,
              total: data.studentlist.total
            }),
            disabled: loading,
            text,
            onPage: setPage,
            onSize: (size) => {
              setPerpage(size);
              setPage(0);
            }
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 168,
            columnNumber: 17
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 144,
        columnNumber: 46
      }, this)
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 117,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 99,
    columnNumber: 12
  }, this);
}
__name(Graders, "Graders");
export {
  Graders as default
};
//# sourceMappingURL=Graders.dev.js.map
