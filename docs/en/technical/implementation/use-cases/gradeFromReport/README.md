---
id: UC-005
name: gradeFromReport
title: Grade a student from the report
status: draft
origin: code
sourceOfTruth: code
---

# UC-005 Grade a student from the report — implementation

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../../requirements/use-case-overview.svg) | [Requirements](../../../requirements/use-cases/gradeFromReport/README.md) | [Analysis](../../../analysis/use-cases/gradeFromReport/README.md) | [Design](../../../design/use-cases/gradeFromReport/README.md) | **Implementation** | [Tests](../../../implementation/use-cases/gradeFromReport/README.md#tests) |

Design: [README](../../../design/use-cases/gradeFromReport/README.md)

## Code

| Element | Kind | Location | Verified |
| --- | --- | --- | --- |
| `grader_ui` | class | `classes/local/page/grader_ui.php` | yes |
| `row_formatter` | class | `classes/local/format/row_formatter.php` | yes |
| Report row | file | `js/esm/src/components/ReportRow.tsx` | yes |

## Tests

| Test | Covers | Location |
| --- | --- | --- |
| The behat journey of the report | main flow | `tests/behat/report.feature` |
