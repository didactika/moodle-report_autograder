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
