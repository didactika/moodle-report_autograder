import $ from 'jquery';
import ajax from 'core/ajax';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';

// eslint-disable-next-line no-console
console.error("DEBUG: main.js from report_autograder loaded and executed!"); // Force a visible sign of execution
// alert("DEBUG: main.js from report_autograder loaded!"); // Use alert only if console.error is not enough

// Module state.
let currentCmid = null;
let currentPage = 0;
let recordsPerPage = 20; // Default, will be updated from webservice response.
let maxGrade = null;

/**
 * Attaches click listeners to all manual grade buttons.
 */
const attachManualGradeButtonListeners = () => {
    // eslint-disable-next-line no-console
    console.log('Attaching click listeners to manual grade buttons.');

    // Remove any existing listeners to prevent duplicates if called multiple times.
    $('.manual-grade-btn').off('click');
    $('.manual-grade-btn').on('click', async function() {
        // eslint-disable-next-line no-console
        console.log('Manual grade button clicked. (Directly attached listener)');

        const button = $(this);
        const completionId = button.data('completion-id');
        const row = button.closest('tr');
        const gradeInput = row.find('.manual-grade-input');
        const grade = gradeInput.val();

        // eslint-disable-next-line no-console
        console.log('Completion ID:', completionId);
        // eslint-disable-next-line no-console
        console.log('Grade input value:', grade);

        if (grade === '' || isNaN(parseFloat(grade))) {
            const message = await getString('error:invalidgrade', 'report_autograder');
            notification.add(message, 'error');
            return;
        }

        const gradeVal = parseFloat(grade);

        if (maxGrade !== null && gradeVal > maxGrade) {
            const message = await getString('error:gradetoolarge', 'report_autograder', {maxgrade: maxGrade});
            notification.add(message, 'error');
            return;
        }

        if (gradeVal < 0) {
            const message = await getString('error:negativegrade', 'report_autograder');
            notification.add(message, 'error');
            return;
        }

        updateUserGrade(completionId, gradeVal, button);
    });
};


/**
 * Calls the webservice to update a user's grade.
 *
 * @param {number} completionId The completion ID from the record.
 * @param {number} grade The new grade.
 * @param {jQuery} button The button that was clicked.
 */
const updateUserGrade = (completionId, grade, button) => {
    const originalButtonContent = button.html();
    const spinner = templates.render('core/loading_icon_small', {});
    button.html(spinner);
    button.prop('disabled', true);

    const params = {
        completion_id: completionId,
        status: 'MANUAL_GRADING',
        grade: parseFloat(grade)
    };

    // eslint-disable-next-line no-console
    console.log('Calling "report_autograder_update_user_grade" webservice with params:', params);

    ajax.call([{
        methodname: 'report_autograder_update_user_grade',
        args: params
    }])[0]
    .then(async (response) => {
        // eslint-disable-next-line no-console
        console.log('API Response after grade update:', response); // Log API response.
        const message = await getString('success:gradeupdated', 'report_autograder');
        notification.add(message, 'success');
        getReportData(currentPage); // Reload the data after successful update.
    })
    .catch(async (error) => {
        // eslint-disable-next-line no-console
        console.error('Error: Update webservice call failed:', error); // Log detailed error.
        const message = await getString('error:updatefailed', 'report_autograder');
        notification.add(`${message} ${error.message}`, 'error');
    })
    .always(() => {
        // eslint-disable-next-line no-console
        console.log('Webservice call for update completed.');
        button.html(originalButtonContent);
        button.prop('disabled', false);
    });
};

/**
 * Renders the data rows in the table.
 *
 * @param {Array} records The array of records to render.
 */
const renderTable = (records) => {
    const container = $('#autograder-report-container tbody');
    container.empty();

    if (!records || records.length === 0) {
        templates.render('report_autograder/_no_data_message', {}).then((html) => {
            container.html(html);
        });
        return;
    }

    templates.render('report_autograder/table_rows', { records: records }).then((html) => {
        container.html(html);
        attachManualGradeButtonListeners(); // Attach listeners after rendering new buttons
    }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error rendering table rows:', error);
    });
};

/**
 * Renders the pagination controls.
 *
 * @param {number} totalRecords The total number of records available.
 * @param {Array} currentRecords The records for the current page.
 */
const renderPagination = (totalRecords, currentRecords) => {
    const container = $('#autograder-pagination-container');
    container.empty();

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    if (totalPages <= 1) {
        return;
    }

    const hasNext = currentRecords.length >= recordsPerPage && (currentPage + 1) < totalPages;

    const context = {
        currentpage: currentPage + 1,
        totalpages: totalPages,
        hasprev: currentPage > 0,
        prevpage: currentPage - 1,
        hasnext: hasNext,
        nextpage: currentPage + 1,
    };

    templates.render('report_autograder/pagination', context).then((html) => {
        container.html(html);
        container.off('click', 'a[data-page]').on('click', 'a[data-page]', (e) => {
            e.preventDefault();
            const newPage = parseInt($(e.currentTarget).data('page'), 10);
            getReportData(newPage);
        });
    }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error rendering pagination:', error);
    });
};

/**
 * Fetches and renders the report data for a specific page.
 *
 * @param {number} page The page number to fetch.
 */
const getReportData = (page) => {
    currentPage = page;

    // The loading spinner is now part of the initial template,
    // so we just need to make sure it's visible if we are re-loading.
    const tableBody = $('#autograder-report-container tbody');
    if (!tableBody.find('.loading-row').length) {
        templates.render('report_autograder/report_table', {}).then(html => {
            const newBody = $(html).find('tbody').html();
            tableBody.html(newBody);
        });
    }

    const ajaxPromise = ajax.call([{
        methodname: 'report_autograder_get_report_data',
        args: { cmid: currentCmid, page: currentPage }
    }])[0];

    ajaxPromise.then((response) => {
        recordsPerPage = response.limit;
        maxGrade = response.maxgrade;
        renderTable(response.data);
        renderPagination(response.totalrecords, response.data);

    }).catch(async(error) => {
        // eslint-disable-next-line no-console
        console.error('Error: Webservice call failed.', error);
        const message = await getString('error:apirequest', 'report_autograder');
        $('#autograder-report-container').html(`<div class="alert alert-danger">${message}</div>`);
    });
};

/**
 * Initializes the autograder report.
 *
 * @param {number} cmid The course module ID.
 * @export
 */
export const init = (cmid) => {
    currentCmid = cmid;
    const container = $('#autograder-report-container');

    // eslint-disable-next-line no-console
    console.log('Initializing report with CMID:', cmid);
    // eslint-disable-next-line no-console
    console.log('Autograder report container:', container); // Check if container is found

    if (!container.length) {
        // eslint-disable-next-line no-console
        console.error('Error: Report container #autograder-report-container not found on page.');
        return;
    }

    // Render the initial table skeleton which includes the loading spinner.
    templates.render('report_autograder/report_table', {}).then((html) => {
        container.html(html);
        getReportData(0);
    }).catch(async(error) => {
        // eslint-disable-next-line no-console
        console.error('Error rendering initial table skeleton:', error);
        const message = await getString('error:building_report_data', 'report_autograder');
        container.html(`<div class="alert alert-danger">${message}</div>`);
    });

    // Remove the old delegated listener from document
    $(document).off('click', '.manual-grade-btn');
    // eslint-disable-next-line no-console
    console.log('Delegated click event listener removed from DOCUMENT.');
};