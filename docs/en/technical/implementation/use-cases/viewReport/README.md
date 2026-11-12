---
id: UC-001
name: viewReport
title: View the report of an activity or a course
status: draft
origin: code
sourceOfTruth: code
---

# UC-001 View the report of an activity or a course — implementation

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../../requirements/use-case-overview.svg) | [Requirements](../../../requirements/use-cases/viewReport/README.md) | [Analysis](../../../analysis/use-cases/viewReport/README.md) | [Design](../../../design/use-cases/viewReport/README.md) | **Implementation** | [Tests](../../../implementation/use-cases/viewReport/README.md#tests) |

Design: [README](../../../design/use-cases/viewReport/README.md)

## Code

| Element | Kind | Location | Verified |
| --- | --- | --- | --- |
| `get_report` | web service | `classes/external/get_report.php` | yes |
| Page of the report | page | `index.php` | yes |
| Status chips | AMD module | `amd/src/ui/status_chips.js` | yes |
| Report screen | AMD module | `amd/src/ui/report.js` | yes |

## Tests

| Test | Covers | Location |
| --- | --- | --- |
| One page of rows, filters, sort and the counts of the statuses | main flow | `tests/external/get_report_test.php` |
| The query of the rows | main flow, RN-001 | `tests/local/report_query_test.php` |
| Groups of the reader | RN-004 | `tests/local/group_access_test.php` |
| Provisional grade and grader | RN-005 | `tests/local/provisional_grade_test.php` |
