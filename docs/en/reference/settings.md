---
title: Settings
summary: The setting of the report and what it changes.
order: 42
---

The report has one setting, in **Site administration > Reports > Autograder report > Settings of the report**. You need the capability `moodle/site:config`.

| Setting | Default | What it does |
|---|---|---|
| Require the guided tour (`report_autograder/tourrequired`) | Off | When on, the [guided tour](page:guides/guided-tour) of the report of an activity and of a course cannot be skipped: its steps have no **Skip tour** button and the tour ends on its last step. When off, the tour can be skipped at any step. |

Everything else that decides what the report shows is set in Autograder and in the capabilities of the report (see [Capabilities](page:reference/capabilities)).
