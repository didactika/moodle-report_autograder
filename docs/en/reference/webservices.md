---
title: Web services
summary: The functions that feed the pages of the report, and what each one reads.
order: 41
---

The pages of the report read their data through four web-service functions. They only read, they are available to the pages of Moodle (AJAX) and they require a logged-in user who has the capability of the level they ask for.

| Function | Reads | Parameters |
|---|---|---|
| `report_autograder_get_report` | One page of the report of an activity, a course or the site | `cmid`, `courseid`, `page`, `limit` (0 for 12 rows, -1 for every row up to 1000), `filters` (a list of name and value), `sortcolumn`, `sortdir`, `withtotal` |
| `report_autograder_search_filter_options` | The options of the course and activity pickers of the filter bar | `type` (course or activity), `query`, `cmid`, `courseid`, `filtercourseid` |
| `report_autograder_get_graders_overview` | The courses where Autograder is enabled, with who could grade in each | `search`, `page`, `perpage` (0 for 12 rows, -1 for every row) |
| `report_autograder_get_graders` | Who Autograder would grade as in a course, and for which students | `courseid`, `students`, `page`, `perpage` (0 for 12 rows, -1 for every row), `search`, `filter` (all, fallback or nobody) |

The function also returns, once for each set of filters and with the total, the number of students in each status: the key, the name and the count of each status, counted inside every other filter but the status itself. A page turn returns no counts.

## Filters

The filters of `report_autograder_get_report` are pairs of a name and a value. They narrow the table to a search text, a period of grading dates, one or more statuses, a course, an activity or a group.

## Privacy

The report stores no personal data of its own: it reads the records of Autograder, and the Privacy API of Autograder covers them.
