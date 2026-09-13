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

namespace report_autograder\privacy;

use core_privacy\local\metadata\null_provider;

/**
 * This report stores nothing about anybody.
 *
 * Every personal detail it shows belongs to somewhere else and is exported and
 * deleted from there: the decisions are local_autograder's and declared by its
 * own provider, the grades are the gradebook's, the names and pictures the
 * user's. A report that reads those and stores nothing of its own has nothing
 * of its own to hand over.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class provider implements null_provider {
    /**
     * Why there is nothing to describe.
     *
     * @return string The identifier of a string explaining it.
     */
    public static function get_reason(): string {
        return 'privacy:metadata';
    }
}
