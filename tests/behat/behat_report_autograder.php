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

// NOTE: no MOODLE_INTERNAL test here. This file is required by Behat before the Moodle environment is set up.

require_once(__DIR__ . '/../../../../lib/behat/behat_base.php');

use Behat\Gherkin\Node\TableNode;
use local_autograder\local\config\config_repository;

/**
 * Steps of the autograder report: the decisions that the report shows, and what is drawn on the page.
 *
 * @package     report_autograder
 * @copyright   2026 Didactika.org
 * @author      Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_report_autograder extends behat_base {
    /**
     * Turn Autograder on in an activity, and give it the decisions that the table lists.
     *
     * | activity | user | status | when | reason |
     * The activity is the idnumber of the course module, the user a username, the status one of Autograder's states and the
     * moment a number of days from now, written with its sign.
     *
     * @Given /^the following autograder decisions exist:$/
     * @param TableNode $table The decisions.
     */
    public function the_following_autograder_decisions_exist(TableNode $table): void {
        global $DB;

        foreach ($table->getHash() as $row) {
            $cm = $DB->get_record('course_modules', ['idnumber' => $row['activity']], '*', MUST_EXIST);
            $user = $DB->get_record('user', ['username' => $row['user']], '*', MUST_EXIST);
            // The activity was given a configuration that is off when it was created, so it is turned on here.
            config_repository::upsert_for_cm((int) $cm->id, (int) $cm->course, true, 'point', 70.0, null, DAYSECS, 2);
            $at = time() + (int) ($row['when'] ?? 0) * DAYSECS;
            $status = $row['status'];
            $DB->insert_record('local_autograder_decision', (object) [
                'cmid' => (int) $cm->id,
                'courseid' => (int) $cm->course,
                'userid' => (int) $user->id,
                'status' => $status,
                'baselineduedate' => $at - DAYSECS,
                'duedatereason' => $row['reason'] ?? 'submission',
                'scheduledgradetime' => $at,
                'graderid' => $status === 'graded' ? 2 : null,
                'gradedvalue' => $status === 'graded' ? 70.0 : null,
                'failurereason' => $status === 'failed' ? 'no_grader' : null,
                'timecreated' => $at - DAYSECS,
                'timemodified' => $at,
            ]);
        }
    }

    /**
     * Open the report of an activity, by the idnumber of its course module.
     *
     * @Given /^I open the autograder report of "([^"]+)"$/
     * @param string $idnumber Idnumber of the activity.
     */
    public function i_open_the_autograder_report_of(string $idnumber): void {
        global $DB;

        $cm = $DB->get_record('course_modules', ['idnumber' => $idnumber], '*', MUST_EXIST);
        $this->getSession()->visit($this->locate_path('/report/autograder/index.php?cmid=' . $cm->id));
    }

    /**
     * Open the page of the graders.
     *
     * @Given /^I open the graders page of the autograder report$/
     */
    public function i_open_the_graders_page(): void {
        $this->getSession()->visit($this->locate_path('/report/autograder/graders.php'));
    }

    /**
     * Save a screenshot of the whole page, for looking at it.
     *
     * @Then /^I capture the report as "([^"]+)"$/
     * @param string $name Screenshot name.
     */
    public function i_capture_the_report(string $name): void {
        global $CFG;
        $file = ($CFG->behat_faildump_path ?? sys_get_temp_dir()) . '/' . clean_param($name, PARAM_ALPHANUMEXT) . '.png';
        file_put_contents($file, $this->getSession()->getScreenshot());
    }

    /**
     * Wait until the table of the report has drawn its rows.
     *
     * @When /^I wait for the report rows$/
     */
    public function i_wait_for_the_report_rows(): void {
        $this->getSession()->wait(
            15000,
            "document.querySelectorAll('.arp-table tbody tr[data-record-id]').length > 0"
            . " || document.querySelector('.arp-empty') !== null"
        );
    }

    /**
     * Check how many rows the table shows.
     *
     * @Then /^the report should show (\d+) rows?$/
     * @param string $count The number of rows.
     */
    public function the_report_should_show_rows(string $count): void {
        $shown = (int) $this->getSession()->evaluateScript(
            "document.querySelectorAll('.arp-table tbody tr[data-record-id]').length"
        );
        if ($shown !== (int) $count) {
            throw new \Behat\Mink\Exception\ExpectationException(
                'The report shows ' . $shown . ' rows, not ' . $count . '.',
                $this->getSession()
            );
        }
    }
}
