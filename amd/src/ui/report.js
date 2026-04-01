import $ from 'jquery';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';

/**
 * Renders the data rows in the table.
 *
 * @param {Array} records The array of records to render.
 * @param {Function} onRenderComplete Callback function to be called when rendering is complete.
 */
export const renderTable = (records, onRenderComplete) => {
    const container = $('#autograder-report-container tbody');
    container.empty();

    if (!records || records.length === 0) {
        getString('feedback:nothing_to_show', 'report_autograder').then(msg => {
            container.html(
                `<tr><td colspan="6" class="align-content-center text-center"><p class="m-0 p-0">${msg}</p></td></tr>`
            );
            if (typeof onRenderComplete === 'function') {
                onRenderComplete();
            }
        });
        return;
    }

    templates.render('report_autograder/table_rows', { records }).then(html => {
        container.html(html);
        if (typeof onRenderComplete === 'function') {
            onRenderComplete();
        }
    }).catch(() => {});
};

export const showLoading = () => {
    const container = $('#autograder-report-container tbody');
    // Inline static HTML skeleton — synchronous, no async template round-trip,
    // so it always appears immediately before the API responds.
    const cell = (w) => `<td class="border-0"><div class="autograder-skeleton" style="width:${w}px;"></div></td>`;
    const row = `<tr>
        <td class="d-flex align-items-center border-0">
            <div class="autograder-skeleton avatar mr-2"></div>
            <div class="autograder-skeleton" style="width:150px;"></div>
        </td>
        ${cell(100)}${cell(80)}${cell(100)}${cell(80)}
        <td class="border-0"><div class="autograder-skeleton button"></div></td>
    </tr>`;
    container.html(row + row + row + row);
};

export const renderReportTable = (onRenderComplete) => {
    const container = $('#autograder-report-container');
    templates.render('report_autograder/report_table', {})
        .then(html => {
            container.html(html);
            if (typeof onRenderComplete === 'function') {
                onRenderComplete();
            }
        });
};
