---
id: UC-004
name: narrowReport
title: Narrow the report
actor: Teacher, Administrator
package: Reading
requirement: RF-005
includes: 
extends: 
status: draft
origin: code
sourceOfTruth: code
---

# UC-004 Narrow the report

| Overview | Requirements | Analysis | Design | Implementation | Tests |
| --- | --- | --- | --- | --- | --- |
| [Use cases](../../use-case-overview.svg) | **Requirements** | [Analysis](../../../analysis/use-cases/narrowReport/README.md) | [Design](../../../design/use-cases/narrowReport/README.md) | [Implementation](../../../implementation/use-cases/narrowReport/README.md) | [Tests](../../../implementation/use-cases/narrowReport/README.md#tests) |

## Use-case information

| Field | Value |
| --- | --- |
| Actor | Teacher, Administrator |
| Package | Reading |
| Goal | Find the students that matter in the report by name, status, group, grading date, activity or course. |
| Type | Primary, essential |
| Level | User goal |
| Requirement | RF-005 |
| Domain entities | Filter, Status, ReportRow, GroupAccess |

## Context

A report can list thousands of rows. The toolbar narrows it, and the chips of the statuses show how many students are in each status, counted inside every other filter, so that the numbers add up to the rows the report would show.

## Preconditions

- The reader has opened a report and holds its capability.

## Postconditions

- Success: the table shows the students that match, with the total and the number of each status.
- Failure: a filter that is not valid is ignored and the report keeps what it showed.

## Main flow

| Step | Actor | System |
| --- | --- | --- |
| 1 | Types a name, or chooses a status chip, a group, a period of grading dates, an activity or a course. | For the activity and the course, searches the options as the reader types, among the ones the reader may see. |
| 2 |  | Asks for the first page again with the filters, the total and the students of each status. |
| 3 |  | Shows the rows, the total and the chips, and marks the chips and filters that are active. |
| 4 | Presses a chip again, or **Clear every filter**. | Lifts the filter and shows the report as it was. |

## Alternative flows

| ID | Starts at step | Condition | Behaviour | Ends |
| --- | --- | --- | --- | --- |
| A1 | 2 | The report is the one of the site and the reader has not narrowed it. | Asks for a filter before it runs. | Step 1 |
| A2 | 2 | The reader cannot see failures. | Offers no chip of failed students and counts them as not autograded. | Step 3 |
| A3 | 3 | A status has no students. | Does not offer its chip, unless it is the one chosen. | Step 4 |

## Business rules

| ID | Rule |
| --- | --- |
| RN-008 | The count of each status is computed inside every other filter except the status, so that choosing a status does not hide the numbers of the others. |
| RN-002 | The report of the site does not run without a filter. |
| RN-003 | Failures are shown only to readers who can see them. |
| RN-004 | A teacher sees only the groups they can see. |

## Specification

Behaviour source of truth: [specification.puml](./specification.puml)

![Specification](./specification.svg)

## Wireframes

![Wireframes](./wireframes.svg)
