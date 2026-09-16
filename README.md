# report_autograder

The autograder report, at three levels: one activity, one course, and the
whole site.

It shows, for every student of every activity autograder is switched on for:
what state they are in, when they will be graded (or when they were), the
grade they are going to get (or the one they have), and which teacher the
grade was posted as.

## What it depends on

`local_autograder`, and nothing else. Version 3 reads that plugin's own tables
directly; there is no external service, no web service credentials, and no
settings to point it anywhere. The previous version fetched its rows over HTTP
from `autograder-service` and matched them to Moodle users by `idnumber` — all
of that is gone, along with the plugin settings that configured it.

## The three levels

| Level | Reached from | Capability |
|---|---|---|
| One activity | The activity's own menu | `report/autograder:view` |
| One course | The course's Reports menu | `report/autograder:viewcourse` |
| The whole site | Administration → Reports | `report/autograder:viewsite` |

The course and site reports open with a strip of counts — how many are
pending, graded, taken over by a teacher, and so on — because somebody looking
at a whole site is usually asking "is anything stuck?" rather than looking for
a particular student. Each count is a way into the table already filtered.

## Who is in the table

Every student the gradebook would list: actively enrolled, holding one of the
roles in `$CFG->gradebookroles`. That includes the ones who have not submitted
anything yet, shown as such — a report that only listed students autograder
already has an opinion about would answer half the question a teacher is
asking.

A student whose enrolment has not started, or has ended, is not there, because
autograder would not grade them either.

## Groups

An activity set to separate groups shows a teacher only their own groups, and
this report shows no more than the activity itself would. Each activity is
judged by its own group mode, so one course report can hide a student in one
activity and list them in the next.

Where groups are in play the table gains a group column and the filter bar a
group picker. It opens on the same group Moodle would have opened on: all of
them for somebody with `moodle/site:accessallgroups`, otherwise the teacher's
own — and for them there is no "all groups" to choose. The site report has no
picker, since a group belongs to one course and a list of them across every
course would be a list of names with nothing in common; it still hides what it
must.

## Who a waiting row will be graded as

Autograder posts every grade in a real teacher's name, chosen at the moment of
grading. A waiting row names who that would be today — the one thing about a
row that cannot be found anywhere else before it happens — and says so plainly
where nobody qualifies, because that row is heading for a failure that can
still be fixed.

## Failures

`report/autograder:viewfailed` — manager only by default — decides whether a
grading that failed is named as such, with the reason. Without it the row is
still there, because hiding a student would read as "this person is not here";
it just says the activity was not autograded, with no technical detail. A
failure is a fact about the installation, and acting on one is an
administrator's job.

## Licence

GNU GPL v3 or later. See [LICENSE.md](LICENSE.md).

## Selection and performance

Pending rows use the same activity-aware resolver as the worker, including the
validated fallback. The course graders page shows association, not a promise
that a teacher may grade every activity: activity overrides and groups are
checked in the activity report. Course candidates use only the configured
local_resume role family; unrelated gradebook users are not added.

Student group membership is fetched in batches for the current page. Module,
teacher eligibility and association data are reused within each request.
Filtered site queries restrict enrolment, group and availability discovery to
the selected course/activity. Counts omit gradebook joins, and page turns reuse
the initial count. Empty results do not run the row query. Both student lists
respect enrolment start/end dates and clamp pages when a total is available.

Filters, association tables and pagination share responsive control dimensions
and theme colours. CSS is flat for Moodle's CSS pipeline. Search pickers support
keyboard navigation, Escape, labels and visible focus; AMD builds accompany the
source changes. Database performance at production scale still requires an
EXPLAIN/ANALYZE run on representative data.
