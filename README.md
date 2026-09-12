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

## Failures

`report/autograder:viewfailed` — manager only by default — decides whether a
grading that failed is named as such, with the reason. Without it the row is
still there, because hiding a student would read as "this person is not here";
it just says the activity was not autograded, with no technical detail. A
failure is a fact about the installation, and acting on one is an
administrator's job.

## Licence

GNU GPL v3 or later. See [LICENSE.md](LICENSE.md).
