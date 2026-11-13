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
import { useEffect, useMemo, useRef, useState } from "react";
import { Empty, Icon, Pager, SearchBox, SelectMenu, TableBox, useStableColumns } from "./components/ui";
import { createText } from "./engine/text";
import { DEFAULT_PAGE_SIZE } from "./lib/paging";
import { useDebounced } from "./hooks/useDebounced";
import { describeError, getGraders, getGradersOverview } from "./services/api";
const TONES = { ready: "success", fallback: "warning", nobody: "danger" };
const State = /* @__PURE__ */ __name(({ state, text }) => /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft badge-dot rounded-pill text-bg-${TONES[state]}`, children: text(`graders:state_${state}`) }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 35,
  columnNumber: 69
}), "State");
const Skeleton = /* @__PURE__ */ __name(({ columns }) => /* @__PURE__ */ jsxDEV(Fragment, { children: Array.from({ length: 6 }, (_, row) => /* @__PURE__ */ jsxDEV("tr", { "aria-hidden": "true", children: Array.from({ length: columns }, (__, cell) => /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "dd-skeleton" }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 47,
  columnNumber: 69
}) }, cell, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 47,
  columnNumber: 54
})) }, row, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 46,
  columnNumber: 42
})) }, void 0, false, {
  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
  lineNumber: 45,
  columnNumber: 52
}), "Skeleton");
const Overview = /* @__PURE__ */ __name(({ props, text }) => {
  const [typed, setTyped] = useState("");
  const search = useDebounced(typed.trim(), 300);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(DEFAULT_PAGE_SIZE);
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
  const coursesTable = useRef(null);
  useStableColumns(coursesTable, courses.length > 0);
  let overviewEmpty = null;
  if (failed !== "") {
    overviewEmpty = /* @__PURE__ */ jsxDEV(
      Empty,
      {
        icon: "i/warning",
        message: text("error:apirequest", failed),
        action: text("error:retry"),
        onAction: () => setPage(page),
        text
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 95,
        columnNumber: 25
      }
    );
  } else if (!loading && courses.length === 0) {
    overviewEmpty = /* @__PURE__ */ jsxDEV(
      Empty,
      {
        icon: search === "" ? "i/report" : "a/search",
        message: search === "" ? text("graders:empty") : text("graders:emptysearch"),
        text
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 98,
        columnNumber: 25
      }
    );
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar", children: /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar-start", children: /* @__PURE__ */ jsxDEV(SearchBox, { value: typed, onChange: setTyped, label: text("graders:search"), text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 105,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 104,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 103,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(TableBox, { busy: loading, empty: overviewEmpty, children: /* @__PURE__ */ jsxDEV("table", { className: "table", ref: coursesTable, children: [
      /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden sr-only", children: text("graders:heading") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 110,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:course") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 113,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", "data-col": "count", children: text("graders:activities") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 114,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:graders") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 115,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", "data-col": "count", children: text("graders:students") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 116,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", "data-col": "status", children: text("graders:state") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 117,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", className: "table-actions", children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: text("graders:openreport") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 118,
          columnNumber: 67
        }) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 118,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 112,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 111,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("tbody", { children: [
        loading && data === null && /* @__PURE__ */ jsxDEV(Skeleton, { columns: 6 }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 122,
          columnNumber: 50
        }),
        courses.map((course) => /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("td", { children: [
            /* @__PURE__ */ jsxDEV("a", { className: "fw-bold", href: course.studentsurl, children: course.name }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 125,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "small text-muted text-truncate", children: course.fullname }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 126,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 124,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("td", { children: course.activities }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 128,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("td", { children: [
            course.graders.length === 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 130,
              columnNumber: 61
            }),
            course.graders.join(", "),
            course.moregraders > 0 && /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: [
              " ",
              text("graders:more", course.moregraders)
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 132,
              columnNumber: 56
            })
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 129,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("td", { children: course.studentcount }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 134,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(State, { state: course.state, text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 135,
            columnNumber: 29
          }) }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 135,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("td", { className: "table-actions", children: [
            /* @__PURE__ */ jsxDEV(
              "a",
              {
                className: "btn btn-link btn-icon btn-sm text-primary",
                href: course.studentsurl,
                title: text("graders:seestudents"),
                "aria-label": text("graders:seestudents"),
                children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/users", text }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                  lineNumber: 142,
                  columnNumber: 30
                })
              },
              void 0,
              false,
              {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 137,
                columnNumber: 29
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "a",
              {
                className: "btn btn-link btn-icon btn-sm text-info",
                href: course.reporturl,
                title: text("graders:openreport"),
                "aria-label": text("graders:openreport"),
                children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/report", text }, void 0, false, {
                  fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                  lineNumber: 148,
                  columnNumber: 30
                })
              },
              void 0,
              false,
              {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 143,
                columnNumber: 29
              }
            )
          ] }, void 0, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 136,
            columnNumber: 25
          })
        ] }, course.id, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 123,
          columnNumber: 46
        }))
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 121,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 109,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 108,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      Pager,
      {
        page: data?.page ?? 0,
        perpage,
        total: data?.total ?? 0,
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
        lineNumber: 154,
        columnNumber: 9
      }
    )
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 102,
    columnNumber: 12
  });
}, "Overview");
const Course = /* @__PURE__ */ __name(({ props, text }) => {
  const [typed, setTyped] = useState("");
  const search = useDebounced(typed.trim(), 300);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState("");
  const [loading, setLoading] = useState(true);
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
  const studentsTable = useRef(null);
  useStableColumns(studentsTable, students.length > 0);
  let studentsEmpty = null;
  if (failed !== "") {
    studentsEmpty = /* @__PURE__ */ jsxDEV(
      Empty,
      {
        icon: "i/warning",
        message: text("error:apirequest", failed),
        action: text("error:retry"),
        onAction: () => setPage(page),
        text
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 216,
        columnNumber: 25
      }
    );
  } else if (!loading && students.length === 0) {
    studentsEmpty = /* @__PURE__ */ jsxDEV(
      Empty,
      {
        icon: search !== "" || filter !== "all" ? "a/search" : "i/users",
        message: search !== "" || filter !== "all" ? text("graders:emptysearch") : text("graders:none"),
        text
      },
      void 0,
      false,
      {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 219,
        columnNumber: 25
      }
    );
  }
  const teachers = data?.graders.filter((grader) => !grader.isfallback) ?? [];
  let alert = "";
  if (data && !data.hasgraders) {
    alert = text("graders:nograders");
  } else if (data && teachers.length === 0) {
    alert = text("graders:onlyfallback");
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2", children: [
      /* @__PURE__ */ jsxDEV("a", { className: "btn btn-link px-0", href: props.overviewurl, children: [
        /* @__PURE__ */ jsxDEV(Icon, { name: "i/previous", text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 233,
          columnNumber: 17
        }),
        " ",
        text("graders:back")
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 232,
        columnNumber: 13
      }),
      data && /* @__PURE__ */ jsxDEV(
        "a",
        {
          className: "btn btn-link btn-icon text-info",
          href: data.reporturl,
          title: text("graders:openreport"),
          "aria-label": text("graders:openreport"),
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "i/report", text }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 240,
            columnNumber: 14
          })
        },
        void 0,
        false,
        {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 235,
          columnNumber: 22
        }
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 231,
      columnNumber: 9
    }),
    data && /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-baseline gap-3", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "h4 mb-0", children: data.course }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 243,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: [
        /* @__PURE__ */ jsxDEV("strong", { className: "text-body", children: data.gradercount }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 245,
          columnNumber: 17
        }),
        " ",
        text("graders:gradercount"),
        " \xB7 ",
        /* @__PURE__ */ jsxDEV("strong", { className: "text-body", children: data.studentcount }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 247,
          columnNumber: 17
        }),
        " ",
        text("graders:studentcount")
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 244,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 242,
      columnNumber: 18
    }),
    alert !== "" && /* @__PURE__ */ jsxDEV("div", { className: `alert ${data && !data.hasgraders ? "alert-danger" : "alert-warning"} mb-0`, role: "alert", children: alert }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 250,
      columnNumber: 26
    }),
    data && data.hasgraders && /* @__PURE__ */ jsxDEV("div", { className: "card", children: /* @__PURE__ */ jsxDEV("div", { className: "card-body", children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "h6 mb-2", children: text("graders:possible") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 253,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-unstyled d-flex flex-wrap gap-2 mb-2", children: data.graders.map((grader) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft rounded-pill ${grader.isfallback ? "text-bg-secondary" : "text-bg-primary"}`, children: [
        grader.name,
        grader.isfallback && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          " \xB7 ",
          text("graders:viafallback")
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 257,
          columnNumber: 64
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 256,
        columnNumber: 25
      }) }, grader.id, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 255,
        columnNumber: 51
      })) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 254,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "small text-muted mb-0", children: text("graders:associationnote") }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 261,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 252,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 251,
      columnNumber: 37
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar", children: /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar-start", children: [
        /* @__PURE__ */ jsxDEV(SearchBox, { value: typed, onChange: setTyped, label: text("graders:search_students"), text }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 267,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          SelectMenu,
          {
            label: text("graders:show"),
            value: filter,
            base: "all",
            text,
            options: ["all", "fallback", "nobody"].map((option) => ({
              value: option,
              label: text(`graders:filter_${option}`)
            })),
            onChange: (option) => setFilter(option)
          },
          void 0,
          false,
          {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 268,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 266,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 265,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(TableBox, { busy: loading, empty: studentsEmpty, children: /* @__PURE__ */ jsxDEV("table", { className: "table", ref: studentsTable, children: [
        /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden sr-only", children: text("graders:students") }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 283,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:student") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 286,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:grader") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 287,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: text("graders:note") }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 288,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 285,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 284,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: [
          loading && data === null && /* @__PURE__ */ jsxDEV(Skeleton, { columns: 3 }, void 0, false, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 292,
            columnNumber: 54
          }),
          students.map((student, index) => /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("td", { className: "fw-bold", children: student.name }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 294,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("td", { children: student.hasgrader ? student.grader : /* @__PURE__ */ jsxDEV("span", { className: "text-muted", children: "\u2014" }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 295,
              columnNumber: 71
            }) }, void 0, false, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 295,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("td", { children: [
              !student.hasgrader && /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft badge-dot rounded-pill text-bg-danger", children: text("graders:nobodyfor") }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 297,
                columnNumber: 56
              }),
              student.viafallback && student.hasgrader && /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft rounded-pill text-bg-secondary", children: text("graders:viafallback") }, void 0, false, {
                fileName: "public/report/autograder/js/esm/src/Graders.tsx",
                lineNumber: 298,
                columnNumber: 78
              })
            ] }, void 0, true, {
              fileName: "public/report/autograder/js/esm/src/Graders.tsx",
              lineNumber: 296,
              columnNumber: 29
            })
          ] }, `${student.name}-${index}`, true, {
            fileName: "public/report/autograder/js/esm/src/Graders.tsx",
            lineNumber: 293,
            columnNumber: 59
          }))
        ] }, void 0, true, {
          fileName: "public/report/autograder/js/esm/src/Graders.tsx",
          lineNumber: 291,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 282,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "public/report/autograder/js/esm/src/Graders.tsx",
        lineNumber: 281,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        Pager,
        {
          page: data?.studentlist.page ?? 0,
          perpage,
          total: data?.studentlist.total ?? 0,
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
          lineNumber: 304,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 264,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 230,
    columnNumber: 12
  });
}, "Course");
function Graders(props) {
  const text = useMemo(() => createText(props.strings), [props.strings]);
  return /* @__PURE__ */ jsxDEV("div", { id: "autograder-report-container", className: "arp arp-graders", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-muted mb-0", children: text("lead_graders") }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 332,
      columnNumber: 9
    }, this),
    props.courseid > 0 ? /* @__PURE__ */ jsxDEV(Course, { props, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 333,
      columnNumber: 31
    }, this) : /* @__PURE__ */ jsxDEV(Overview, { props, text }, void 0, false, {
      fileName: "public/report/autograder/js/esm/src/Graders.tsx",
      lineNumber: 333,
      columnNumber: 70
    }, this)
  ] }, void 0, true, {
    fileName: "public/report/autograder/js/esm/src/Graders.tsx",
    lineNumber: 331,
    columnNumber: 12
  }, this);
}
__name(Graders, "Graders");
export {
  Graders as default
};
//# sourceMappingURL=Graders.dev.js.map
