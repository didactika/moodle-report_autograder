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
 * Reads what the report's filter bar is asking for.
 *
 * @module     report_autograder/ui/form
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';

/**
 * Collects what the filter bar is currently asking for.
 *
 * The names are the ones the server understands directly: there is no longer
 * a translation step between "filters Moodle can answer" and "filters the
 * external service can answer", because there is no external service.
 *
 * @returns {Array<{name: string, value: string}>}
 */
export const collectFilters = () => {
    const filters = [];
    const add = (name, value) => {
        if (value) {
            filters.push({name, value: String(value)});
        }
    };

    add('searchname', $('#searchname').val());
    add('grading_date_from', $('#grading_date_from').val());
    add('grading_date_to', $('#grading_date_to').val());
    add('status', $('#status').val());
    add('courseid', $('#autograder-filter-course').val());
    add('cmid', $('#autograder-filter-activity').val());
    add('groupid', $('#autograder-filter-group').val());

    return filters;
};

/**
 * Marks a plain picker as "on" when something is chosen, the same way the date
 * and status chips mark themselves.
 *
 * Selects only, and only the ones still drawn as selects. A searchable picker
 * hides its select and draws a button that carries the same class — and a
 * button has no value, so including it here read every searchable chip as
 * empty and stripped the "on" colour off it a moment after it was chosen. Its
 * own paint() is what marks it, from the option actually selected.
 */
const markChosenPickers = () => {
    $('select.autograder-select-chip').each(function() {
        const select = $(this);

        if (select.data('autograderSearchable')) {
            return;
        }

        select.toggleClass('autograder-filter-active', Boolean(select.val()));
    });
};

/**
 * @param {Function} onFilterChange Called with the new filter list.
 * @param {Function} onFilterClear Called when everything is cleared.
 */
export const attachFilterListeners = (onFilterChange, onFilterClear) => {
    const form = $('#autograder-filter-form');

    markChosenPickers();

    form.on('submit', e => {
        e.preventDefault();

        if (typeof onFilterChange === 'function') {
            onFilterChange(collectFilters());
        }
    });

    // The course and activity pickers are ordinary selects: changing one is
    // the whole interaction, so it applies itself rather than waiting for a
    // button the rest of the bar does not have either.
    form.on('change', '#autograder-filter-course, #autograder-filter-activity, #autograder-filter-group', () => {
        markChosenPickers();

        if (typeof onFilterChange === 'function') {
            onFilterChange(collectFilters());
        }
    });

    form.on('click', '#autograder-filter-clear', e => {
        e.preventDefault();
        form[0].reset();
        $('#searchname, #grading_date_from, #grading_date_to, #status').val('');

        if (typeof onFilterClear === 'function') {
            onFilterClear();
        }
    });
};
