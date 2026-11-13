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
 * Draws the report's table.
 *
 * @module     report_autograder/ui/report
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import templates from 'core/templates';
import {get_string as getString, get_strings as getStrings} from 'core/str';
import notification from 'core/notification';

/** The table's own root, which every helper here works inside. */
const ROOT = '#autograder-report-container';

/**
 * How many columns the table has, so anything spanning it spans all of it.
 *
 * The course and activity columns only exist on some of the three reports, so
 * this is counted rather than assumed.
 *
 * @returns {number}
 */
const columnCount = () => $(`${ROOT} thead th`).length || 5;

/**
 * Puts the empty state with its icon in the place of the table, which keeps its height, or brings the table back.
 *
 * @param {string|null} icon The icon of the state (search, filter or grades), or null to show the table.
 * @param {string} message What the state says.
 */
export const showEmpty = (icon, message = '') => {
    const empty = $(`${ROOT} [data-region="empty"]`);

    $(`${ROOT} table`).prop('hidden', icon !== null);
    empty.prop('hidden', icon === null);
    empty.find('[data-empty-icon]').each(function() {
        this.hidden = this.getAttribute('data-empty-icon') !== icon;
    });
    empty.find('[data-empty-text]').text(message);
};

/** The texts of the explanations of a row, read once. */
let noteStrings = null;

/**
 * Adds to each row what it explains, from the most serious: why it failed, why there is no grade or no grader, then why the date,
 * what the provisional grade is and whose name the grade will carry.
 *
 * @param {Array} records The rows.
 * @returns {Promise<Array>} The rows with their explanations.
 */
const withNotes = async(records) => {
    if (!noteStrings) {
        const keys = ['info:failure', 'info:problem', 'info:grader', 'info:date', 'info:grade', 'gradedby_prospective',
            'grade_provisional_help', 'gradedby_prospective_help'];
        const texts = await getStrings(keys.map((key) => ({key, component: 'report_autograder'})));
        noteStrings = Object.fromEntries(keys.map((key, index) => [key, texts[index]]));
    }
    const t = noteStrings;
    return records.map((row) => {
        const notes = [];
        const add = (title, message, tone) => notes.push({title, message, tone});
        if (row.failure_reason) {
            add(t['info:failure'], row.failure_reason, 'danger');
        }
        if (!row.grade && row.grade_problem) {
            add(t['info:problem'], row.grade_problem, 'warning');
        }
        if (!row.graded_by && row.will_grade_problem) {
            add(t['info:grader'], row.will_grade_problem, 'warning');
        }
        if (row.date_reason) {
            add(t['info:date'], row.date_reason, 'info');
        }
        if (!row.grade && row.provisional_grade) {
            add(t['info:grade'], t.grade_provisional_help, 'info');
        }
        if (!row.graded_by && row.will_grade) {
            add(t.gradedby_prospective, t.gradedby_prospective_help, 'info');
        }
        const tone = notes.length ? notes[0].tone : 'info';
        return {...row, notes, hasnotes: notes.length > 0, notestone: tone, notesinfo: tone === 'info'};
    });
};

/**
 * Draws one page of rows.
 *
 * @param {Array} records The rows the server returned.
 * @param {Function} [onRenderComplete] Called once they are on screen.
 * @param {Function} isCurrent Whether this request is still the latest one.
 */
export const renderTable = (records, onRenderComplete, isCurrent = () => true) => {
    const container = $(`${ROOT} tbody`);
    const finishRendering = () => {
        if (!isCurrent()) {
            return;
        }
        $(ROOT).attr('aria-busy', 'false');
        if (typeof onRenderComplete === 'function') {
            onRenderComplete();
        }
    };

    const failed = (error) => {
        if (isCurrent()) {
            container.empty();
            $(ROOT).attr('aria-busy', 'false');
            notification.exception(error);
        }
    };

    if (!records || records.length === 0) {
        const narrowed = $('#autograder-filter-clear').length > 0 && !$('#autograder-filter-clear').prop('disabled');

        getString(narrowed ? 'table:empty' : 'feedback:nothing_to_show', 'report_autograder').then(msg => {
            if (!isCurrent()) {
                return null;
            }
            container.empty();
            showEmpty(narrowed ? 'search' : 'grades', msg);
            finishRendering();

            return null;
        }).catch(failed);

        return;
    }

    withNotes(records)
        .then((rows) => templates.render('report_autograder/table_rows', {records: rows}))
        .then(html => {
            if (!isCurrent()) {
                return null;
            }
            showEmpty(null);
            container.html(html);
            finishRendering();

            return null;
        })
        .catch(failed);
};

/**
 * The placeholder rows shown while a page is on its way.
 *
 * Written inline rather than rendered from a template so that it appears in
 * the same tick the request goes out, instead of after a round trip of its
 * own.
 */
export const showLoading = () => {
    $(ROOT).attr('aria-busy', 'true');
    showEmpty(null);
    const container = $(`${ROOT} tbody`);
    const row = `<tr aria-hidden="true">${'<td><span class="dd-skeleton"></span></td>'.repeat(columnCount())}</tr>`;

    container.html(row.repeat(4));
};
