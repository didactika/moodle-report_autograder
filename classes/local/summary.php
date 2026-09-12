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
 * What a course or the whole site looks like at a glance.
 *
 * Somebody opening the site-wide report is rarely looking for a student: they
 * are asking "is anything stuck?". A table of thousands of rows does not
 * answer that, and filtering blind to find out is worse. So the wide reports
 * open with the counts, each one a way into the table already filtered.
 *
 * It deliberately describes the whole scope rather than the current filter.
 * A summary that moved with the filter would only ever repeat the table's own
 * row count, which the pagination already says.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class summary {
    /**
     * The tiles to draw above the table, or none where the table is small
     * enough to just read.
     *
     * @param scope $scope
     * @return array{show: bool, total: int, tiles: array}
     */
    public static function for_scope(scope $scope): array {
        if ($scope->level() === scope::LEVEL_ACTIVITY) {
            // One activity's table is short enough to be its own summary.
            return ['show' => false, 'total' => 0, 'tiles' => []];
        }

        $counts = report_query::count_by_decision_status($scope, new filters());
        $canseefailures = $scope->can_see_failures();
        $tiles = [];
        $total = 0;

        foreach (self::buckets($canseefailures) as $reportstatus => $decisionstatuses) {
            $count = 0;

            foreach ($decisionstatuses as $decisionstatus) {
                $count += $counts[$decisionstatus] ?? 0;
            }

            $total += $count;

            $tiles[] = [
                'key' => $reportstatus,
                'label' => status::label($reportstatus),
                'count' => $count,
                'class' => status::badge_class($reportstatus),
                'url' => $scope->url(['status' => $reportstatus])->out(false),
                'empty' => $count === 0,
                'attention' => $reportstatus === status::FAILED && $count > 0,
            ];
        }

        return ['show' => true, 'total' => $total, 'tiles' => $tiles];
    }

    /**
     * Which decision states each tile counts.
     *
     * Every row lands in exactly one tile, so the tiles add up to the table.
     * Where failures may not be seen they fall in with the rest of what
     * autograder is not going to grade, which is what such a viewer is told
     * everywhere else too.
     *
     * @param bool $canseefailures
     * @return array<string, string[]>
     */
    private static function buckets(bool $canseefailures): array {
        $notautograded = [
            decision_repository::STATUS_CANCELLED,
            decision_repository::STATUS_SKIPPED,
        ];

        $buckets = [
            status::PENDING => [decision_repository::STATUS_PENDING],
            status::GRADED => [decision_repository::STATUS_GRADED],
            status::MANUAL => [decision_repository::STATUS_MANUAL],
        ];

        if ($canseefailures) {
            $buckets[status::FAILED] = [decision_repository::STATUS_FAILED];
        } else {
            $notautograded[] = decision_repository::STATUS_FAILED;
        }

        $buckets[status::NOT_AUTOGRADED] = $notautograded;
        // The absence of a decision, which the query reports under an empty
        // bucket name.
        $buckets[status::NOT_ENGAGED] = [''];

        return $buckets;
    }
}
