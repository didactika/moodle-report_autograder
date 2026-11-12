---
id: UC-003
name: viewGraders
title: See who would grade each course
status: draft
origin: code
sourceOfTruth: code
---

# UC-003 See who would grade each course — implementation

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../../requirements/use-case-overview.svg) | [Requirements](../../../requirements/use-cases/viewGraders/README.md) | [Analysis](../../../analysis/use-cases/viewGraders/README.md) | [Design](../../../design/use-cases/viewGraders/README.md) | **Implementation** | [Tests](../../../implementation/use-cases/viewGraders/README.md#tests) |

Design: [README](../../../design/use-cases/viewGraders/README.md)

## Code

| Element | Kind | Location | Verified |
| --- | --- | --- | --- |
| Page of the graders | page | `graders.php` | yes |
| Graders screen | AMD module and template | `amd/src/ui/graders.js`, `templates/graders.mustache` | yes |

## Tests

| Test | Covers | Location |
| --- | --- | --- |
| The list of graders | main flow | `tests/local/grader_list_test.php` |
| The grader a pending student would get | RN-005 | `tests/local/prospective_grader_test.php` |
