---
id: RQ
status: draft
origin: code
sourceOfTruth: code
---

# Requirements catalogue

## Functional

| ID | Requirement | Priority | Origin | Use cases |
| --- | --- | --- | --- | --- |
| RF-001 | A teacher can read the report of an activity or of a course, search, filter and sort it, and see only the groups they can see. | Must | `index.php`, `classes/external/get_report.php` | UC-001 |
| RF-002 | An administrator can read the report of the site, which runs only with a filter. | Must | `classes/local/query/filters.php` | UC-002 |
| RF-003 | An administrator can see, for a course, which teachers could grade and which one each student would get. | Should | `graders.php`, `classes/external/get_graders.php` | UC-003 |
| RF-004 | Failed gradings and their reasons are shown only to readers with the capability to see failures. | Must | `classes/local/format/status.php` | UC-001, UC-002 |
| RF-005 | A reader can narrow the report by name, status, group, grading date, activity and course, and see how many students are in each status. | Must | `classes/local/query/filters.php`, `classes/external/search_filter_options.php` | UC-004 |
| RF-006 | A teacher can go from a row of the report to the grading screen of the activity. | Should | `classes/local/page/grader_ui.php` | UC-005 |

## Non-functional

| ID | Quality attribute | Requirement | Measure | Priority |
| --- | --- | --- | --- | --- |
| RNF-001 | Integrity | The report only reads. | the three web-service functions are `read` | Must |
| RNF-002 | Security | Each level asks for its own capability. | `scope::require_capability` | Must |
| RNF-003 | Performance | The report of the site never runs unfiltered. | `filters` | Must |
| RNF-004 | Privacy | The plugin stores no personal data. | `classes/privacy/provider.php` (null provider) | Must |

## Business rules

Rules live in the [domain model dictionary](../domain/README.md#business-rules). Rules that change behaviour are repeated here with their ID.
