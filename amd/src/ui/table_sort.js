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
 * Sorting of the report's table by column.
 *
 * @module     report_autograder/ui/table_sort
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import { getSortColumn, getSortDirection } from '../state';

/**
 * Updates sort icons and aria-sort on thead buttons (static DOM, survives tbody refresh).
 *
 * @param {import('jquery')} $container Wrapped `#autograder-report-container`
 */
export const updateSortHeaderUI = ($container) => {
    const col = getSortColumn();
    const dir = getSortDirection();

    $container.find('[data-autograder-sort]').each(function () {
        const key = this.getAttribute('data-autograder-sort');
        const $btn = $(this);
        const $th = $btn.closest('th');
        const $wrap = $btn.find('.autograder-sort-icon-wrap');
        const $icon = $btn.find('.autograder-sort-glyph');

        $icon.removeClass('fa-sort fa-sort-up fa-sort-down text-muted');

        if (col === key) {
            $th.attr('aria-sort', dir === 'asc' ? 'ascending' : 'descending');
            $btn.attr('aria-pressed', 'true');
            $wrap.removeClass('d-none');
            $icon.addClass(dir === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
        } else {
            $th.attr('aria-sort', 'none');
            $btn.attr('aria-pressed', 'false');
            $wrap.addClass('d-none');
        }
    });
};
