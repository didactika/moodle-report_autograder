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
 * The statuses of the report as chips with the number of students in each: one press narrows the report to a status, another
 * lifts it. The numbers are counted by the server inside every other filter, so they say what the report would show.
 *
 * The chips drive the same checkboxes as the status menu, which stays in the page, so that the filter that is asked for and the
 * one that is shown are always the same.
 *
 * @module     report_autograder/ui/status_chips
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';

const CONTAINER = '#autograder-status-chips';

/** The last counts, to paint the chips again when one is pressed. */
let lastCounts = [];

/**
 * The statuses that are chosen now, from the field that the filter sends.
 *
 * @returns {Array<string>}
 */
const chosen = () => String($('#status').val() || '').split(',').filter(Boolean);

/**
 * Draws the chips.
 *
 * @param {Array<{key: string, label: string, count: number}>} counts The students of each status.
 */
export const render = (counts) => {
    lastCounts = counts;
    const container = $(CONTAINER);
    const selected = chosen();
    const all = counts.reduce((sum, item) => sum + item.count, 0);
    const chip = (key, label, count, on) => $('<button>')
        .attr({type: 'button', 'data-status': key, 'aria-pressed': on ? 'true' : 'false'})
        .addClass('autograder-status' + (on ? ' autograder-status-on' : ''))
        .append(key ? $('<span>').addClass('autograder-dot autograder-dot-' + key) : null)
        .append(document.createTextNode(label + ' '))
        .append($('<span>').addClass('autograder-status-count').text(count));

    container.empty().append(chip('', container.data('all'), all, selected.length === 0));
    counts.filter((item) => item.count > 0 || selected.includes(item.key))
        .forEach((item) => container.append(chip(item.key, item.label, item.count, selected.includes(item.key))));
    container.prop('hidden', false);
};

/**
 * Makes the chips work.
 */
export const init = () => {
    $(CONTAINER).on('click', '[data-status]', function() {
        const key = $(this).data('status');
        const boxes = $('#autograder-status-multiselect input[type="checkbox"]');
        const wasOn = $(this).attr('aria-pressed') === 'true';

        boxes.prop('checked', false);

        if (key && !wasOn) {
            boxes.filter('#status-' + key).prop('checked', true);
        }

        // The menu listens to its checkboxes: this is what makes it send the filter and the report ask again.
        boxes.first().trigger('change');
        render(lastCounts);
    });
};
