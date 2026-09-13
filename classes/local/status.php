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

namespace report_autograder\local;

use local_autograder\local\decision_repository;

/**
 * What a row's state is called, in the teacher's words rather than the
 * plugin's.
 *
 * local_autograder keeps six states plus "no decision at all"; a teacher needs
 * to tell apart four things: it will be graded, it was graded, a person graded
 * it, and nothing is going to happen. The mapping is spelled out here rather
 * than left as "anything I do not recognise is pending", which is what the
 * previous version did and which quietly turned failures into promises.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class status {
    /** @var string Waiting for its moment; the row carries the date. */
    public const PENDING = 'pending';

    /** @var string Autograder graded it. */
    public const GRADED = 'graded';

    /** @var string A person graded first, so autograder stood down. */
    public const MANUAL = 'manual';

    /** @var string Autograder tried and could not. */
    public const FAILED = 'failed';

    /** @var string Called off, or never applicable. */
    public const NOT_AUTOGRADED = 'notautograded';

    /** @var string The student has not done anything that starts the clock. */
    public const NOT_ENGAGED = 'notengaged';

    /**
     * What one decision is called in the report.
     *
     * @param string|null $decisionstatus A `local_autograder_decision.status`,
     *                                    or null when the student has none.
     * @param bool $canseefailures Whether this viewer holds
     *                             `report/autograder:viewfailed`.
     * @return string One of this class's constants.
     */
    public static function from_decision(?string $decisionstatus, bool $canseefailures): string {
        if ($decisionstatus === null || $decisionstatus === '') {
            return self::NOT_ENGAGED;
        }

        switch ($decisionstatus) {
            case decision_repository::STATUS_PENDING:
                return self::PENDING;

            case decision_repository::STATUS_GRADED:
                return self::GRADED;

            case decision_repository::STATUS_MANUAL:
                return self::MANUAL;

            case decision_repository::STATUS_FAILED:
                // Without the capability a failure is still shown — the row is
                // about a real student — but as the plain fact that autograder
                // did not grade it, with none of the technical detail.
                return $canseefailures ? self::FAILED : self::NOT_AUTOGRADED;

            default:
                // Cancelled and skipped: autograder is not going to act.
                return self::NOT_AUTOGRADED;
        }
    }

    /**
     * The `local_autograder_decision.status` values behind one report status.
     *
     * What the status filter turns into in the query.
     *
     * @param string $status One of this class's constants.
     * @return string[] Empty for NOT_ENGAGED, which is the absence of a row.
     */
    public static function decision_statuses(string $status): array {
        switch ($status) {
            case self::PENDING:
                return [decision_repository::STATUS_PENDING];

            case self::GRADED:
                return [decision_repository::STATUS_GRADED];

            case self::MANUAL:
                return [decision_repository::STATUS_MANUAL];

            case self::FAILED:
                return [decision_repository::STATUS_FAILED];

            case self::NOT_AUTOGRADED:
                return [
                    decision_repository::STATUS_CANCELLED,
                    decision_repository::STATUS_SKIPPED,
                    decision_repository::STATUS_FAILED,
                ];

            default:
                return [];
        }
    }

    /**
     * What the viewer may filter by.
     *
     * "Failed" is only on the list for somebody who can tell failures apart in
     * the first place; offering a filter whose results are indistinguishable
     * from another filter's would be worse than not offering it.
     *
     * @param bool $canseefailures
     * @return string[]
     */
    public static function filterable(bool $canseefailures): array {
        $statuses = [self::PENDING, self::GRADED, self::MANUAL];

        if ($canseefailures) {
            $statuses[] = self::FAILED;
        }

        $statuses[] = self::NOT_AUTOGRADED;
        $statuses[] = self::NOT_ENGAGED;

        return $statuses;
    }

    /**
     * What this state is called on screen.
     *
     * @param string $status One of this class's constants.
     * @return string The label shown in the badge and the filter.
     */
    public static function label(string $status): string {
        return get_string("status:{$status}", 'report_autograder');
    }

    /**
     * The badge's class.
     *
     * One class per state, painted from this plugin's own CSS rather than from
     * Bootstrap's colour names. That is not only so each state can carry its
     * own tone: Bootstrap 4 and Bootstrap 5 do not name their badge colours the
     * same way (`badge-success` against `text-bg-success`), and this report is
     * drawn on Moodle branches that ship both, so a colour class picked from
     * either would simply do nothing on the other. The state modifier is a
     * hook for this plugin's stylesheet, not a colour.
     *
     * @param string $status One of this class's constants.
     * @return string
     */
    public static function badge_class(string $status): string {
        return 'autograder-badge autograder-badge-' . $status;
    }

    /**
     * Whether a row in this state is still going to be graded, which is what
     * decides if its date is a promise or a record.
     *
     * @param string $status One of this class's constants.
     * @return bool
     */
    public static function is_awaiting(string $status): bool {
        return $status === self::PENDING;
    }
}
