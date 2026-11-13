---
id: UC-004
name: narrowReport
title: Narrow the report
status: draft
origin: code
sourceOfTruth: code
---

# UC-004 Narrow the report — implementation

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../../requirements/use-case-overview.svg) | [Requirements](../../../requirements/use-cases/narrowReport/README.md) | [Analysis](../../../analysis/use-cases/narrowReport/README.md) | [Design](../../../design/use-cases/narrowReport/README.md) | **Implementation** | [Tests](../../../implementation/use-cases/narrowReport/README.md#tests) |

Design: [README](../../../design/use-cases/narrowReport/README.md)

## Code

| Element | Kind | Location | Verified |
| --- | --- | --- | --- |
| `filters` | class | `classes/local/query/filters.php` | yes |
| `report_query` | class | `classes/local/query/report_query.php` | yes |
| `search_filter_options` | web service | `classes/external/search_filter_options.php` | yes |
| Filter menus and the button that clears them | React component | `js/esm/src/components/Filters.tsx`, `js/esm/src/components/ui.tsx` (`Menu`, `SelectMenu`), `js/esm/src/Report.tsx` | yes |
| Pager | React component | `js/esm/src/components/ui.tsx` (`Pager`), `js/esm/src/lib/paging.ts` | yes |

## Tests

| Test | Covers | Location |
| --- | --- | --- |
| The counts of the statuses, inside the filters | main flow, RN-008 | `tests/external/get_report_test.php` |
| The options of the pickers | main flow | `tests/external/search_filter_options_test.php` |
| A status can be chosen and cleared again | main flow | `tests/behat/report.feature` |
