<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * The autograder report, at whichever level it was asked for.
 *
 * `cmid` gives one activity, `courseid` a whole course, and neither the whole
 * site. One page rather than three, because they are the same table with a
 * different reach.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../config.php');
// The admin_externalpage_setup() call below lives in adminlib, and a page
// under /report/ does not get that file loaded for it.
require_once($CFG->libdir . '/adminlib.php');

use report_autograder\local\page\grader_ui;
use report_autograder\local\page\page_context;
use report_autograder\local\query\filters;
use report_autograder\local\query\scope;
use report_autograder\local\format\status;

$cmid = optional_param('cmid', 0, PARAM_INT);
$courseid = optional_param('courseid', 0, PARAM_INT);

$scope = scope::from_params($cmid, $courseid);

switch ($scope->level()) {
    case scope::LEVEL_ACTIVITY:
        require_login($scope->course(), false, $scope->cm());
        break;

    case scope::LEVEL_COURSE:
        require_login($scope->course());
        break;

    default:
        require_login();
        admin_externalpage_setup('reportautograder');
        break;
}

$PAGE->set_context($scope->context());
$PAGE->set_url($scope->url());

// This report's stylesheet hangs off this class rather than off the page id:
// the site-level report goes through admin_externalpage_setup(), which
// prefixes the page type with "admin-", so the id differs between the three
// levels and scoping by it would leave one of them unstyled.
$PAGE->add_body_class('report-autograder-page');
$PAGE->set_title(get_string('pluginname', 'report_autograder'));
$PAGE->set_heading($scope->heading());

if ($scope->level() !== scope::LEVEL_SITE) {
    $PAGE->set_pagelayout('report');
}

$scope->require_capability();

// The date filter's calendar, from the copy that ships with this plugin. Asked
// for here rather than injected by the module that uses it, because a
// stylesheet has to be in the page before the header goes out.
$PAGE->requires->css(new moodle_url('/report/autograder/lib/daterangepicker/daterangepicker.css'));

// The forum grader is launched from the activity's own report, where the page
// has been set up to carry its data attributes.
$forumgrade = null;

if ($scope->level() === scope::LEVEL_ACTIVITY) {
    $forumgrade = grader_ui::get_forum_grade_context($scope->course(), $scope->cm(), $USER);
}

echo $OUTPUT->header();

// No summary tiles. Counting every row of every state meant a grouped pass
// over the whole report — every enrolment, every decision, every grade item —
// before the page could send a single byte, and on a site-wide report that is
// the most expensive question this plugin can ask. The table below answers
// the same thing a page at a time, as it is scrolled.
// A link can arrive already narrowed — a bookmark, or one somebody was sent —
// so the bar is drawn showing what the URL asks for rather than blank. The
// table is fetched with the same values a moment later.
// Each filter is read as the narrowest type that holds it; filters::from_request()
// then checks the values themselves, such as a status against the known list.
$filtertypes = [
    'searchname' => PARAM_TEXT,
    'status' => PARAM_TAGLIST,
    'grading_date_from' => PARAM_TEXT,
    'grading_date_to' => PARAM_TEXT,
    'courseid' => PARAM_INT,
    'cmid' => PARAM_INT,
    'groupid' => PARAM_INT,
];
$openingfilters = filters::from_request(
    array_map(
        static fn(string $name, string $type): array => [
            'name' => $name,
            'value' => trim((string) optional_param($name, '', $type)),
        ],
        array_keys($filtertypes),
        $filtertypes
    ),
    $scope->can_see_failures()
);

echo $OUTPUT->render_from_template(
    'report_autograder/partials/filters',
    page_context::filters($scope, $openingfilters)
);
echo $OUTPUT->render_from_template(
    'report_autograder/report_table',
    page_context::table($scope, $forumgrade)
);

// A link can still arrive with a state in it (a bookmark, or a link from
// elsewhere), so the table opens on that rather than on everything.
$presetstatus = optional_param('status', '', PARAM_ALPHANUMEXT);

if (!in_array($presetstatus, status::filterable($scope->can_see_failures()), true)) {
    $presetstatus = '';
}

$PAGE->requires->js_call_amd(
    'report_autograder/main',
    'init',
    [$scope->url_params(), $presetstatus]
);

if ($forumgrade !== null) {
    $PAGE->requires->js_call_amd('mod_forum/grades/grader', 'registerLaunchListeners');
}

echo $OUTPUT->footer();
