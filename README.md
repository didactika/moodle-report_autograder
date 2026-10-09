<div align="center">

<img src="pix/icon.svg" width="96" alt="Autograder Icon">

# Autograder Report for Moodle

*Shows what [Autograder](https://github.com/didactika/moodle-local_autograder)  decided for every student, per activity, course and site*

[![Release](https://img.shields.io/github/v/release/didactika/moodle-report_autograder?style=flat-square)](https://github.com/didactika/moodle-report_autograder/releases)
[![Moodle](https://img.shields.io/badge/Moodle-4.5+-f98012?style=flat-square&logo=moodle&logoColor=white)](https://moodle.org)
[![PHP](https://img.shields.io/badge/PHP-8.1+-777bb4?style=flat-square&logo=php&logoColor=white)](https://www.php.net)
[![License](https://img.shields.io/badge/License-GPL_v3-blue?style=flat-square)](LICENSE)

[Overview](#overview) • [Installation](#installation) • [Usage](#usage) • [Capabilities](#capabilities) • [Troubleshooting](#troubleshooting)

</div>

The Autograder report (`report_autograder`) is the companion to [Autograder](https://github.com/didactika/moodle-local_autograder) (`local_autograder`), the plugin that automatically grades completed activities that a teacher hasn't graded. Autograder does the grading; this report is where teachers and administrators review what it decided and follow each student's progress.

> [!IMPORTANT]
> This report requires [Autograder](https://github.com/didactika/moodle-local_autograder) (`local_autograder`) to be installed. It reads Autograder's records and does not grade anything itself.

## Overview

For every student in every activity where Autograder is enabled, the report shows:

- **Status:** where the student stands, as described below.
- **Date:** when the student will be graded, or when they were, and what the date is based on: the due date, an override, or when the student finished.
- **Grade:** the grade the student will receive, or the one now in the gradebook.
- **Grader:** the teacher the grade is attributed to, or, for a pending student, the teacher it would be attributed to if it were given now.

| Status | Meaning |
|---|---|
| Pending | The student is scheduled to be graded on the date shown |
| Autograded | Autograder has graded the student |
| Graded by a teacher | A teacher graded the student first, so Autograder did not |
| Failed | Autograder tried to grade the student and could not. Only shown to users who can see failures |
| Not autograded | Autograder will not grade this student, for example because the grading was cancelled |
| Not submitted | The student has not done the activity yet |

> [!TIP]
> A pending student with **nobody** as their grader will fail to be graded when the date arrives, because no teacher can currently grade them. The report flags these students so the problem can be fixed in advance.

## Installation

**Requirements:** Moodle 4.5 or later, PHP 8.1 or later, and [Autograder](https://github.com/didactika/moodle-local_autograder).

**From a release:** download the latest release ZIP files of both Autograder and this report, go to **Site administration → Plugins → Install plugins**, upload each file and follow the prompts.

**From Git:**

```bash
cd /path/to/moodle
git clone https://github.com/didactika/moodle-local_autograder.git local/autograder
git clone https://github.com/didactika/moodle-report_autograder.git report/autograder
php admin/cli/upgrade.php
```

## Usage

The report is available at three levels:

| Report | Where to find it | Typical use |
|---|---|---|
| Activity | The activity's menu | A teacher following the students of one activity |
| Course | The course's **Reports** menu | A teacher or course manager reviewing every activity in a course |
| Site | **Site administration → Reports → Autograder report → Grading report** | An administrator checking that nothing is stuck |

The activity and course reports only appear where Autograder is enabled on the activity, or on at least one activity in the course.

The course and site reports open with a count of students in each status, and each count opens the matching list. Every report can be filtered by course, activity, group, status and grading date, and searched by student. The site report only runs once a course, an activity or another filter is chosen, so that it never queries every enrolment on the site at once.

### Graders by course

**Site administration → Reports → Autograder report → Graders by course** shows, for a chosen course, which teachers can grade there and which teacher each student would be graded as. It is useful for checking a course before any grade is due. A course where nobody can grade is flagged, since every grade in it would fail unless a fallback grader is configured in Autograder.

### Groups and failures

- **Groups:** in an activity with separate groups, teachers only see the students in their own groups, exactly as they would in the activity itself.
- **Failures:** failed gradings, and the reason for each, are only shown to users with `report/autograder:viewfailed`. Other users see these students as *Not autograded*.

## Capabilities

| Capability | Context | Default roles | Allows the user to |
|---|---|---|---|
| `report/autograder:view` | Activity | Editing teacher, Manager | View the report for an activity |
| `report/autograder:viewcourse` | Course | Editing teacher, Manager | View the report for a whole course |
| `report/autograder:viewsite` | System | Manager | View the site report and the *Graders by course* page |
| `report/autograder:viewfailed` | Course | Manager | See which gradings failed, and why |

## Troubleshooting

| Problem | Possible cause |
|---|---|
| The report is not in the activity or course menu | Autograder is not enabled on that activity, or on any activity in the course, or you do not have the capability for that level |
| A pending student shows nobody as their grader | None of the student's teachers can grade the activity or see the student's group, and no fallback grader is configured in Autograder |
| A student is missing from the report | They are not actively enrolled with a role the gradebook grades, or, in an activity with separate groups, they are not in one of your groups |
| The site report asks for a filter | This is expected: choose a course, an activity or another filter |

## Getting help

To report a bug or request a feature, please open an [issue](https://github.com/didactika/moodle-report_autograder/issues). Include your Moodle and PHP versions, the report level you were using, and a description of the expected and actual behaviour.
