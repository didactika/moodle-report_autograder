---
title: Troubleshooting
summary: What to check when something does not work as expected.
order: 70
---

| Problem | Possible cause |
|---|---|
| The report is not in the menu of the activity or of the course | Autograder is not enabled in that activity, or in any activity of the course, or you do not have the capability for that level |
| A pending student shows nobody as their grader | None of the teachers of the student can grade the activity or see the group of the student, and no fallback grader is configured in Autograder |
| A student is missing from the report | They are not actively enrolled with a role that the gradebook grades, or, in an activity with separate groups, they are not in one of your groups |
| The site report asks for a filter | This is expected: choose a course, an activity or another filter |
| A student shows as **Not autograded** and a manager sees **Failed** | Failed gradings and their reasons are only shown to the users who have `report/autograder:viewfailed` |
