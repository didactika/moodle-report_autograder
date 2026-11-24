---
id: REQ
status: draft
origin: requirements
sourceOfTruth: model
---

# Requirements

## Index

- [Actors](./actors.md)
- [Requirements catalogue](./requirements.md)

## Use cases

<!-- rup-flow:use-cases:start -->

| ID | Use case | Actor | Package | Requirement | Analysis | Design | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UC-001 | [View the report of an activity or a course](./use-cases/viewReport/README.md) | Teacher | Reading | RF-001 | [card](../analysis/use-cases/viewReport/README.md) | [card](../design/use-cases/viewReport/README.md) | [card](../implementation/use-cases/viewReport/README.md) |
| UC-002 | [View the report of the site](./use-cases/viewSiteReport/README.md) | Administrator | Reading | RF-002 | [card](../analysis/use-cases/viewSiteReport/README.md) | [card](../design/use-cases/viewSiteReport/README.md) | [card](../implementation/use-cases/viewSiteReport/README.md) |
| UC-003 | [See who would grade each course](./use-cases/viewGraders/README.md) | Administrator | Reading | RF-003 | [card](../analysis/use-cases/viewGraders/README.md) | [card](../design/use-cases/viewGraders/README.md) | [card](../implementation/use-cases/viewGraders/README.md) |
| UC-004 | [Narrow the report](./use-cases/narrowReport/README.md) | Teacher, Administrator | Reading | RF-005 | [card](../analysis/use-cases/narrowReport/README.md) | [card](../design/use-cases/narrowReport/README.md) | [card](../implementation/use-cases/narrowReport/README.md) |
| UC-005 | [Grade a student from the report](./use-cases/gradeFromReport/README.md) | Teacher | Reading | RF-006 | [card](../analysis/use-cases/gradeFromReport/README.md) | [card](../design/use-cases/gradeFromReport/README.md) | [card](../implementation/use-cases/gradeFromReport/README.md) |

### Use-case diagram

![Use cases](./use-case-overview.svg)

### By actor

#### Administrator

![Administrator](./use-cases-administrator.svg)

#### Teacher

![Teacher](./use-cases-teacher.svg)

<!-- rup-flow:use-cases:end -->

The index and its diagrams are generated from the use-case cards by the `index` command. Edit the cards (front matter: `actor`, `package`, `includes`, `extends`), not this block.

## Conventions

- `specification.puml` is the behavioural source of truth of a use case: a statechart with the Actor/System conversation.
- `wireframes.puml` is the interface prototype, even when it holds a single screen.
- Each use-case folder holds `README.md`, `specification.puml` and `wireframes.puml`.
