var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Who Autograder would grade as. Without a course it is the list of the courses where Autograder is switched on, each with the
 * people who could grade there and a state that says whether grading would work; with a course it is that course, its graders and
 * its students with the teacher each would get, which can be searched and narrowed to the ones that would be graded by the fallback
 * grader or by nobody.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes.
 *
 * @module     report_autograder/Graders
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useMemo, useState } from "react";
import { Empty, FiltersMenu, Icon, Pager, SearchBox } from "./components/ui";
import { createText } from "./engine/text";
import { useDebounced } from "./hooks/useDebounced";
import { describeError, getGraders, getGradersOverview } from "./services/api";
const TONES = { ready: "success", fallback: "warning", nobody: "danger" };
const State = /* @__PURE__ */ __name(({ state, text }) => /* @__PURE__ */ jsxDEV("span", { className: `badge bg-${TONES[state]} badge-${TONES[state]}`, children: text(`graders:state_${state}`) }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 33,
  columnNumber: 69
}), "State");
const Skeleton = /* @__PURE__ */ __name(({ columns }) => /* @__PURE__ */ jsxDEV(Fragment, { children: Array.from({ length: 6 }, (_, row) => /* @__PURE__ */ jsxDEV("tr", { "aria-hidden": "true", children: Array.from({ length: columns }, (__, cell) => /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "placeholder-glow", children: /* @__PURE__ */ jsxDEV("span", { className: "placeholder col-8" }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 45,
  columnNumber: 104
}) }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 45,
  columnNumber: 69
}) }, cell, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 45,
  columnNumber: 54
})) }, row, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 44,
  columnNumber: 42
})) }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 43,
  columnNumber: 52
}), "Skeleton");
const Overview = /* @__PURE__ */ __name(({ props, text }) => {
  const [typed, setTyped] = useState("");
  const search = useDebounced(typed.trim(), 300);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(props.perpage);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setPage(0);
  }, [search, perpage]);
  useEffect(() => {
    let current = true;
    setLoading(true);
    setFailed("");
    getGradersOverview(search, page, perpage).then((response) => {
      if (current) {
        setData(response);
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
  }, [search, page, perpage]);
  const courses = data?.courses ?? [];
  return /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2 flex-grow-1", children: /* @__PURE__ */ jsxDEV(SearchBox, { value: typed, onChange: setTyped, label: text("graders:search"), text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 93,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 92,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 91,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "table-responsive", "aria-busy": loading, children: [
      /* @__PURE__ */ jsxDEV("table", { className: "table", children: [
        /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden sr-only", children: text("graders:heading") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 98,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:course") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 101,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:activities") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 102,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:graders") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 103,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:students") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 104,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:state") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 105,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden sr-only", children: text("graders:openreport") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 106,
            columnNumber: 41
          }) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 106,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 100,
          columnNumber: 21
        }) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 99,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: [
          loading && data === null && /* @__PURE__ */ jsxDEV(Skeleton, { columns: 6 }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 110,
            columnNumber: 50
          }),
          courses.map((course) => /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("td", { children: [
              /* @__PURE__ */ jsxDEV("a", { className: "fw-bold text-decoration-none", href: course.studentsurl, children: course.name }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 113,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "small text-muted text-truncate", children: course.fullname }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 114,
                columnNumber: 29
              })
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 112,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { children: course.activities }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 116,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { children: [
              course.graders.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 118,
                columnNumber: 61
              }),
              course.graders.join(", "),
              course.moregraders > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: [
                " ",
                text("graders:more", course.moregraders)
              ] }, void 0, true, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 120,
                columnNumber: 56
              })
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 117,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { children: course.studentcount }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 122,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(State, { state: course.state, text }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 123,
              columnNumber: 29
            }) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 123,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { className: "text-end text-nowrap", children: [
              /* @__PURE__ */ jsxDEV("a", { className: "btn btn-outline-secondary btn-sm", href: course.studentsurl, children: text("graders:seestudents") }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 125,
                columnNumber: 29
              }),
              " ",
              /* @__PURE__ */ jsxDEV("a", { className: "btn btn-outline-secondary btn-sm", href: course.reporturl, children: text("graders:openreport") }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 127,
                columnNumber: 29
              })
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 124,
              columnNumber: 25
            })
          ] }, course.id, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 111,
            columnNumber: 46
          }))
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 109,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 97,
        columnNumber: 13
      }),
      failed !== "" && /* @__PURE__ */ jsxDEV(Empty, { message: text("error:apirequest", failed), action: text("error:retry"), onAction: () => setPage(page) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 132,
        columnNumber: 31
      }),
      !loading && failed === "" && courses.length === 0 && /* @__PURE__ */ jsxDEV(Empty, { message: search === "" ? text("graders:empty") : text("graders:emptysearch") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 133,
        columnNumber: 67
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 96,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      Pager,
      {
        page: data?.page ?? 0,
        perpage: data?.perpage ?? perpage,
        total: data?.total ?? 0,
        sizes: props.pagesizes,
        disabled: loading,
        text,
        onChange: ({ page: next, perpage: size }) => {
          if (size !== void 0) {
            setPerpage(size);
          } else if (next !== void 0) {
            setPage(next);
          }
        }
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 135,
        columnNumber: 9
      }
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 90,
    columnNumber: 12
  });
}, "Overview");
const Course = /* @__PURE__ */ __name(({ props, text }) => {
  const [typed, setTyped] = useState("");
  const search = useDebounced(typed.trim(), 300);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(props.perpage);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState("");
  const [loading, setLoading] = useState(true);
  const groupId = useId();
  useEffect(() => {
    setPage(0);
  }, [search, filter, perpage]);
  useEffect(() => {
    let current = true;
    setLoading(true);
    setFailed("");
    getGraders(props.courseid, true, page, perpage, search, filter).then((response) => {
      if (current) {
        setData(response);
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
  }, [props.courseid, search, filter, page, perpage]);
  const students = data?.studentlist.students ?? [];
  const teachers = data?.graders.filter((grader) => !grader.isfallback) ?? [];
  let alert = "";
  if (data && !data.hasgraders) {
    alert = text("graders:nograders");
  } else if (data && teachers.length === 0) {
    alert = text("graders:onlyfallback");
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2", children: [
      /* @__PURE__ */ jsxDEV("a", { className: "btn btn-link px-0", href: props.overviewurl, children: [
        /* @__PURE__ */ jsxDEV(Icon, { name: "i/previous", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 206,
          columnNumber: 17
        }),
        " ",
        text("graders:back")
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 205,
        columnNumber: 13
      }),
      data && /* @__PURE__ */ jsxDEV("a", { className: "btn btn-outline-secondary", href: data.reporturl, children: text("graders:openreport") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 208,
        columnNumber: 22
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 204,
      columnNumber: 9
    }),
    data && /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-baseline gap-3", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "h4 mb-0", children: data.course }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 211,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: [
        /* @__PURE__ */ jsxDEV("strong", { className: "text-body", children: data.gradercount }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 213,
          columnNumber: 17
        }),
        " ",
        text("graders:gradercount"),
        " \xB7 ",
        /* @__PURE__ */ jsxDEV("strong", { className: "text-body", children: data.studentcount }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 215,
          columnNumber: 17
        }),
        " ",
        text("graders:studentcount")
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 212,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 210,
      columnNumber: 18
    }),
    alert !== "" && /* @__PURE__ */ jsxDEV("div", { className: `alert ${data && !data.hasgraders ? "alert-danger" : "alert-warning"} mb-0`, role: "alert", children: alert }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 218,
      columnNumber: 26
    }),
    data && data.hasgraders && /* @__PURE__ */ jsxDEV("div", { className: "card", children: /* @__PURE__ */ jsxDEV("div", { className: "card-body", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "h6 mb-2", children: text("graders:possible") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 221,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-unstyled d-flex flex-wrap gap-2 mb-2", children: data.graders.map((grader) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("span", { className: `badge ${grader.isfallback ? "bg-secondary badge-secondary" : "bg-primary badge-primary"}`, children: [
        grader.name,
        grader.isfallback && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          " \xB7 ",
          text("graders:viafallback")
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 225,
          columnNumber: 64
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 224,
        columnNumber: 25
      }) }, grader.id, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 223,
        columnNumber: 51
      })) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 222,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "small text-muted mb-0", children: text("graders:associationnote") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 229,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 220,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 219,
      columnNumber: 37
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2 flex-grow-1", children: [
        /* @__PURE__ */ jsxDEV(SearchBox, { value: typed, onChange: setTyped, label: text("graders:search_students"), text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 235,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(FiltersMenu, { label: text("filters"), applied: filter === "all" ? 0 : 1, text, children: /* @__PURE__ */ jsxDEV("fieldset", { className: "p-3 mb-0", children: [
          /* @__PURE__ */ jsxDEV("legend", { className: "h6 mb-2", children: text("graders:show") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 238,
            columnNumber: 29
          }),
          ["all", "fallback", "nobody"].map((option) => /* @__PURE__ */ jsxDEV("div", { className: "form-check", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "radio",
                className: "form-check-input",
                name: groupId,
                id: `${groupId}-${option}`,
                checked: filter === option,
                onChange: () => setFilter(option)
              },
              void 0,
              false,
              {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 240,
                columnNumber: 33
              }
            ),
            /* @__PURE__ */ jsxDEV("label", { className: "form-check-label", htmlFor: `${groupId}-${option}`, children: text(`graders:filter_${option}`) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 248,
              columnNumber: 33
            })
          ] }, option, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 239,
            columnNumber: 97
          }))
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 237,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 236,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 234,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 233,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "table-responsive", "aria-busy": loading, children: [
        /* @__PURE__ */ jsxDEV("table", { className: "table", children: [
          /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden sr-only", children: text("graders:students") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 256,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:student") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 259,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:grader") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 260,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:note") }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 261,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 258,
            columnNumber: 25
          }) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 257,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("tbody", { children: [
            loading && data === null && /* @__PURE__ */ jsxDEV(Skeleton, { columns: 3 }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 265,
              columnNumber: 54
            }),
            students.map((student, index) => /* @__PURE__ */ jsxDEV("tr", { children: [
              /* @__PURE__ */ jsxDEV("td", { className: "fw-bold", children: student.name }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 267,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("td", { children: student.hasgrader ? student.grader : /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 268,
                columnNumber: 71
              }) }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 268,
                columnNumber: 29
              }),
              /* @__PURE__ */ jsxDEV("td", { children: [
                !student.hasgrader && /* @__PURE__ */ jsxDEV("span", { className: "badge bg-danger badge-danger", children: text("graders:nobodyfor") }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                  lineNumber: 270,
                  columnNumber: 56
                }),
                student.viafallback && student.hasgrader && /* @__PURE__ */ jsxDEV("span", { className: "badge bg-secondary badge-secondary", children: text("graders:viafallback") }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                  lineNumber: 271,
                  columnNumber: 78
                })
              ] }, void 0, true, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 269,
                columnNumber: 29
              })
            ] }, `${student.name}-${index}`, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 266,
              columnNumber: 59
            }))
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 264,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 255,
          columnNumber: 17
        }),
        failed !== "" && /* @__PURE__ */ jsxDEV(Empty, { message: text("error:apirequest", failed), action: text("error:retry"), onAction: () => setPage(page) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 276,
          columnNumber: 35
        }),
        !loading && failed === "" && students.length === 0 && /* @__PURE__ */ jsxDEV(Empty, { message: search !== "" || filter !== "all" ? text("graders:emptysearch") : text("graders:none") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 277,
          columnNumber: 72
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 254,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        Pager,
        {
          page: data?.studentlist.page ?? 0,
          perpage: data?.studentlist.perpage ?? perpage,
          total: data?.studentlist.total ?? 0,
          sizes: props.pagesizes,
          disabled: loading,
          text,
          onChange: ({ page: next, perpage: size }) => {
            if (size !== void 0) {
              setPerpage(size);
            } else if (next !== void 0) {
              setPage(next);
            }
          }
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 279,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 232,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 203,
    columnNumber: 12
  });
}, "Course");
function Graders(props) {
  const text = useMemo(() => createText(props.strings), [props.strings]);
  return /* @__PURE__ */ jsxDEV("div", { id: "autograder-report-container", className: "arp arp-graders", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-muted mb-3", children: text("lead_graders") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 308,
      columnNumber: 9
    }, this),
    props.courseid > 0 ? /* @__PURE__ */ jsxDEV(Course, { props, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 309,
      columnNumber: 31
    }, this) : /* @__PURE__ */ jsxDEV(Overview, { props, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 309,
      columnNumber: 70
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 307,
    columnNumber: 12
  }, this);
}
__name(Graders, "Graders");
export {
  Graders as default
};
//# sourceMappingURL=Graders.dev.js.map
