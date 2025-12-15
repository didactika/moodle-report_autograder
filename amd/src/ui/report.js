import $ from 'jquery';
import templates from 'core/templates';

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
        templates.render('report_autograder/_no_data_message', {}).then(html => {
            container.html(html);
        });
        return;
    }

    templates.render('report_autograder/table_rows', { records }).then(html => {
        container.html(html);
        if (typeof onRenderComplete === 'function') {
            onRenderComplete();
        }
    }).catch(() => {
        // Handle error
    });
};

/**
 * Shows a loading state in the table.
 */
export const showLoading = () => {
    const container = $('#autograder-report-container tbody');
    container.empty();
    templates.render('core/loading', {}).then(html => {
        container.html(html);
    });
};

/**
 * Renders the initial report table structure.
 * @param {Function} onRenderComplete Callback to be executed after rendering.
 */
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
