---
id: UC-002
name: viewSiteReport
title: View the report of the site
status: draft
origin: code
sourceOfTruth: code
---

# UC-002 View the report of the site — implementation

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../../requirements/use-case-overview.svg) | [Requirements](../../../requirements/use-cases/viewSiteReport/README.md) | [Analysis](../../../analysis/use-cases/viewSiteReport/README.md) | [Design](../../../design/use-cases/viewSiteReport/README.md) | **Implementation** | [Tests](../../../implementation/use-cases/viewSiteReport/README.md#tests) |

Design: [README](../../../design/use-cases/viewSiteReport/README.md)

## Code

| Element | Kind | Location | Verified |
| --- | --- | --- | --- |
| Page of the report | page | `index.php` | yes |
| `search_filter_options` | web service | `classes/external/search_filter_options.php` | yes |
| Filter bar | React components | `js/esm/src/components/` | yes |

## Tests

| Test | Covers | Location |
| --- | --- | --- |
| The options of the pickers | main flow | `tests/external/search_filter_options_test.php` |
| The page of the report | main flow | `tests/page_test.php` |
| Behat journey of the report | main flow | `tests/behat/report.feature` |
