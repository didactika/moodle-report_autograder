# Changelog

All notable changes to this plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
.github/workflows/release.yml reads this file: when $plugin->release changes
in version.php on `main` OR on any MOODLE_XXX_STABLE branch, it looks for a
"## [<that release>]" heading below and uses everything under it, verbatim,
as the GitHub Release body. If no such heading exists yet, the release still
happens but with a generic one-line release note instead.

Keep an "## [Unreleased]" section above the latest release for changes that
have not shipped yet; rename it to "## [x.y.z]" (matching $plugin->release)
when you cut that release, and start a fresh "## [Unreleased]" above it. Each
branch keeps its own CHANGELOG.md history from the point it was cut, same as
its own $plugin->release line -- no need to reconcile entries across branches.
-->

## [Unreleased]

## [1.1.0-m503] - 2026-10-19

First release of the Moodle 5.3 line, on `main`. The Moodle 4.0 to 5.2 line is on `MOODLE_400_STABLE` (1.1.0-m400).

### Changed

- The report is a React component written in TypeScript, mounted by Moodle's own `core/react_autoinit`, with a new design: a bar of pills for the search and the filters, a table with coloured states, hints that open a short explanation, and pagination with the size of the page. Filtering, sorting and paging are still done by the server.
- The filters follow what the viewer may do: course and activity pickers that search from the server as the reader types, a status filter that takes several states at once, a group picker where groups are in play, and a date filter with ranges that are chosen with one press and two date fields. The date fields are the ones of the browser, so the calendar library that shipped with the plugin is gone.
- On a narrow screen every row of the table becomes a card that names each value, and the page follows the colour modes of Moodle and the colours of the theme.
- The page of the graders is a React component that reads the graders and one page of the students through the new function `report_autograder_get_graders`.
- The forum grader of Moodle still opens from the button of a row.
- The AMD modules, the Mustache templates and the bundled libraries (moment and the date range picker) are gone.
- The styles are written as nested SCSS compiled into `styles.css`, with every colour taken from the theme.

### Added

- Behat scenarios for the report (rows, search, status filter, sorting) and for the page of the graders, and the screenshots of the manual taken from the real report.

## [1.0.3-m405] - 2026-10-13

### Changed

- The release number now indicates the lowest Moodle version the plugin supports: -m405

### Fixed

- Moment.js and the date range picker of the grading date filter are AMD modules (`report_autograder/datelib/moment` and `report_autograder/datelib/daterangepicker`) imported by the filters, instead of scripts added to the page with `define()` hidden and `window.jQuery` and `window.$` set. While `define()` was hidden, any other AMD module requested at the same moment failed with "define is not a function". The libraries are unchanged and are still declared in `thirdpartylibs.xml`.
- The all-courses search of the graders page (`report_autograder_search_filter_options`, type `anycourse`) answers only at site level, where `report/autograder:viewsite` was checked. Somebody who could read the report of one activity or one course could use it to list the name of every course of the site, hidden ones included.

## [1.0.1] - 2026-10-06

### Fixed

- The icons that explain a status or a grading problem open their popover again on Moodle 5.0 and later, which reads Bootstrap 5's own attribute names.

### Changed

- Compatibility with Moodle 5.3 (now 4.5 to 5.3).
- Tests set the group mode through the course format actions on Moodle 5.2+, instead of `set_coursemodule_groupmode()`, which 5.2 deprecated (MDL-86857).
- CI runs Moodle 5.3 against PostgreSQL 17 and MariaDB 11.4, the minimum versions it requires.
- CI tests the two ends of the supported range plus any version listed in MOODLE_EXTRA_VERSIONS, so raising the ceiling no longer quietly stops testing the version below it. It currently tests 4.5, 5.2 and 5.3.

## [1.0.0] - 2026-09-30

First public release.

### Added

- Report of Autograder's decisions at three levels: one activity, one course and the whole site.
- For each student: their status, when they will be or were graded and on what basis, the grade, and the teacher it is or would be attributed to.
- Flagging of pending students who have nobody able to grade them, so the problem can be fixed before the date arrives.
- Counts of students per status on the course and site reports, each opening the matching list.
- Filters by course, activity, group, status and grading date, and search by student.
- *Graders by course* page showing which teacher each student of a course would be graded as.
- Respect for separate groups, and a dedicated capability to see failed gradings and their reasons.
- Privacy API support: the report stores no personal data of its own.
