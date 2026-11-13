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
import {get_string as getString} from 'core/str';
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
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

/**
 * Keeps the columns of the table still: once the table has rows, the width the browser gives each column is measured and kept, so a
 * filter, a sort or another page never moves them. They are measured again only when the box of the table changes width.
 *
 * @param {HTMLTableElement} table The table.
 */
const freezeColumns = (table) => {
    const heads = Array.from(table.tHead?.rows[0]?.cells ?? []);
    table.style.tableLayout = '';
    heads.forEach((head) => {
        head.style.width = '';
    });
    const widths = heads.map((head) => head.getBoundingClientRect().width);
    heads.forEach((head, index) => {
        head.style.width = `${widths[index]}px`;
    });
    table.style.tableLayout = 'fixed';
};

/** Whether the columns are kept, and the width of the box they were measured in. */
const columns = {frozen: false, width: 0, observer: null};

/**
 * Keeps the columns once the table has rows, and measures them again when its box changes width.
 */
const keepColumns = () => {
    const table = document.querySelector(`${ROOT} table`);
    const box = table?.parentElement;
    if (!table || !box || columns.frozen) {
        return;
    }
    freezeColumns(table);
    columns.frozen = true;
    columns.width = box.clientWidth;
    columns.observer = new ResizeObserver(() => {
        if (Math.abs(box.clientWidth - columns.width) > 1) {
            columns.width = box.clientWidth;
            freezeColumns(table);
        }
    });
    columns.observer.observe(box);
};

/** The rows of the page that is shown, by their key, for their details. */
const shown = new Map();

/**
 * Adds to each row whether it has something to explain and the colour of the most serious thing: red when the grading failed,
 * amber when there is no grade or no grader, blue when it only informs.
 *
 * @param {Array} records The rows.
 * @returns {Array} The rows.
 */
const withDetails = (records) => records.map((row) => {
    let tone = 'info';
    if (row.failure_reason) {
        tone = 'danger';
    } else if ((!row.grade && row.grade_problem) || (!row.graded_by && row.will_grade_problem)) {
        tone = 'warning';
    }
    const hasdetails = Boolean(row.failure_reason || row.grade_problem || row.will_grade_problem || row.date_reason
        || (!row.grade && row.provisional_grade) || (!row.graded_by && row.will_grade));
    shown.set(String(row.rowkey), row);
    return {...row, hasdetails, detailstone: tone, detailsinfo: tone === 'info'};
});

/**
 * Opens the details of a row in a dialog of Moodle.
 *
 * @param {string} rowkey The key of the row.
 */
export const showDetails = async(rowkey) => {
    const row = shown.get(String(rowkey));
    if (!row) {
        return;
    }
    const modal = await ModalFactory.create({
        title: row.user_name || '',
        body: templates.render('report_autograder/table/row_details', row),
        large: false,
    });
    modal.getRoot().on(ModalEvents.hidden, () => modal.destroy());
    modal.show();
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

    shown.clear();
    templates.render('report_autograder/table_rows', {records: withDetails(records)})
        .then(html => {
            if (!isCurrent()) {
                return null;
            }
            showEmpty(null);
            container.html(html);
            keepColumns();
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
