import $ from 'jquery';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';
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
 * Draws one page of rows.
 *
 * @param {Array} records The rows the server returned.
 * @param {Function} [onRenderComplete] Called once they are on screen.
 * @param {Function} isCurrent Whether this request is still the latest one.
 */
export const renderTable = (records, onRenderComplete, isCurrent = () => true) => {
    const container = $(`${ROOT} tbody`);
    const done = () => {
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
        getString('feedback:nothing_to_show', 'report_autograder').then(msg => {
            if (!isCurrent()) {
                return null;
            }
            const cell = $('<td>').attr('colspan', columnCount()).addClass('text-center');
            cell.append($('<p>').addClass('m-0 p-0').text(msg));
            container.empty().append($('<tr>').append(cell));
            done();

            return null;
        }).catch(failed);

        return;
    }

    templates.render('report_autograder/table_rows', { records })
        .then(html => {
            if (!isCurrent()) {
                return null;
            }
            container.html(html);
            done();

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
    const container = $(`${ROOT} tbody`);
    const cell = (w) => `<td class="border-0"><div class="autograder-skeleton" style="width:${w}px;"></div></td>`;
    const middle = new Array(Math.max(1, columnCount() - 2)).fill(cell(90)).join('');
    const row = `<tr aria-hidden="true">
        <td class="autograder-student-cell border-0">
            <div class="autograder-skeleton avatar mr-2"></div>
            <div class="autograder-skeleton" style="width:150px;"></div>
        </td>
        ${middle}
        <td class="border-0"><div class="autograder-skeleton button"></div></td>
    </tr>`;

    container.html(row + row + row + row);
};
