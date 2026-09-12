import $ from 'jquery';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';

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
 * Draws one page of rows.
 *
 * @param {Array} records The rows the server returned.
 * @param {Function} [onRenderComplete] Called once they are on screen.
 */
export const renderTable = (records, onRenderComplete) => {
    const container = $(`${ROOT} tbody`);
    const done = () => {
        if (typeof onRenderComplete === 'function') {
            onRenderComplete();
        }
    };

    container.empty();

    if (!records || records.length === 0) {
        getString('feedback:nothing_to_show', 'report_autograder').then(msg => {
            container.html(
                `<tr><td colspan="${columnCount()}" class="align-content-center text-center">` +
                `<p class="m-0 p-0">${msg}</p></td></tr>`
            );
            done();

            return null;
        }).catch(done);

        return;
    }

    templates.render('report_autograder/table_rows', { records })
        .then(html => {
            container.html(html);
            done();

            return null;
        })
        .catch(done);
};

/**
 * The placeholder rows shown while a page is on its way.
 *
 * Written inline rather than rendered from a template so that it appears in
 * the same tick the request goes out, instead of after a round trip of its
 * own.
 */
export const showLoading = () => {
    const container = $(`${ROOT} tbody`);
    const cell = (w) => `<td class="border-0"><div class="autograder-skeleton" style="width:${w}px;"></div></td>`;
    const middle = new Array(Math.max(1, columnCount() - 2)).fill(cell(90)).join('');
    const row = `<tr>
        <td class="d-flex align-items-center border-0">
            <div class="autograder-skeleton avatar mr-2"></div>
            <div class="autograder-skeleton" style="width:150px;"></div>
        </td>
        ${middle}
        <td class="border-0"><div class="autograder-skeleton button"></div></td>
    </tr>`;

    container.html(row + row + row + row);
};
