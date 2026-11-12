---
id: ACT
status: draft
origin: code
sourceOfTruth: code
---

# Actors

| Actor | Type | Goal | Related use cases |
| --- | --- | --- | --- |
| Teacher | Primary | Follow the students of an activity or of a course and know who is waiting. Holds `report/autograder:view` or `report/autograder:viewcourse`. | [UC-001](./use-cases/viewReport/README.md), [UC-004](./use-cases/narrowReport/README.md), [UC-005](./use-cases/gradeFromReport/README.md) |
| Administrator | Primary | Check across the site that nothing is stuck and prepare the courses before any grade is due. Holds `report/autograder:viewsite`. | [UC-002](./use-cases/viewSiteReport/README.md), [UC-003](./use-cases/viewGraders/README.md), [UC-004](./use-cases/narrowReport/README.md) |
| Autograder | Secondary | Records the decisions and chooses the graders that the report shows. | all |
| Moodle | Secondary | Provides capabilities, groups, the gradebook and the web services the report relies on. | all |
