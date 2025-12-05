import $ from 'jquery';
import ajax from 'core/ajax';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';

// Module state.
let currentCmid = null;
let currentPage = 0;
let recordsPerPage = 20; // Default, will be updated from webservice response.
let maxGrade = null;

/**
 * Attaches click listeners to all manual grade buttons.
 */
const attachManualGradeButtonListeners = () => {
    const buttons = $('.manual-grade-btn');

    buttons.off('click');

    buttons.on('click', async function() {
        const button = $(this);
        const completionId = button.data('completion-id');
        const row = button.closest('tr');
        const gradeInput = row.find('.manual-grade-input');
        const grade = gradeInput.val();

        if (grade === '' || isNaN(parseFloat(grade))) {
            notification.add(await getString('error:invalidgrade', 'report_autograder'), 'error');
            return;
        }

        const gradeVal = parseFloat(grade);

        if (maxGrade !== null && gradeVal > maxGrade) {
            notification.add(await getString('error:gradetoolarge', 'report_autograder', { maxgrade: maxGrade }), 'error');
            return;
        }

        if (gradeVal < 0) {
            notification.add(await getString('error:negativegrade', 'report_autograder'), 'error');
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

    templates.render('core/loading_icon_small', {}).then(spinner => {
        button.html(spinner);
        button.prop('disabled', true);

        const params = {
            completion_id: completionId,
            status: 'MANUAL_GRADING',
            grade
        };

        ajax.call([{ methodname: 'report_autograder_update_user_grade', args: params }])[0]
            .then(() => {
                getReportData(currentPage);
            })
            .catch(() => {
                // Error log removido para ESLint
            })
            .always(() => {
                button.html(originalButtonContent);
                button.prop('disabled', false);
            });
    });
};


/**
 * Renders the data rows in the table.
 *
 * @param {Array} records The array of records to render.
 */
const renderTable = records => {
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
        attachManualGradeButtonListeners();
    }).catch(() => {
        // Error log removido para ESLint
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
        nextpage: currentPage + 1
    };

    templates.render('report_autograder/pagination', context)
        .then(html => {
            container.html(html);
            container.off('click', 'a[data-page]').on('click', 'a[data-page]', e => {
                e.preventDefault();
                getReportData(parseInt($(e.currentTarget).data('page'), 10));
            });
        })
        .catch(() => {
            // Error log removido para ESLint
        });
};



/**
 * Fetches and renders the report data for a specific page.
 *
 * @param {number} page The page number to fetch.
 */
const getReportData = page => {
    currentPage = page;
    const tableBody = $('#autograder-report-container tbody');

    if (!tableBody.find('.loading-row').length) {
        templates.render('report_autograder/report_table', {}).then(html => {
            tableBody.html($(html).find('tbody').html());
        });
    }

    ajax.call([{ methodname: 'report_autograder_get_report_data', args: { cmid: currentCmid, page: currentPage } }])[0]
        .then(response => {
            recordsPerPage = response.limit;
            maxGrade = response.maxgrade;
            renderTable(response.data);
            renderPagination(response.totalrecords, response.data);
        })
        .catch(async () => {
            const msg = await getString('error:apirequest', 'report_autograder');
            $('#autograder-report-container').html(`<div class="alert alert-danger">${msg}</div>`);
        });
};

/**
 * Oculta el bloque de completion automático de Moodle (activity-header / completion-info)
 */
const hideMoodleCompletionBlocks = () => {
    const intervalId = setInterval(() => {
        const blocks = document.querySelectorAll('.activity-header');
        if (blocks.length) {
            blocks.forEach(block => block.style.display = 'none');
            clearInterval(intervalId); // detenemos el intervalo
        }
    }, 200); // revisa cada 200ms
};



/**
 * Initializes the autograder report.
 *
 * @param {number} cmid The course module ID.
 * @export
 */
export const init = cmid => {
    currentCmid = cmid;
    const container = $('#autograder-report-container');

    if (!container.length) {
        return;
    }
    hideMoodleCompletionBlocks();
    templates.render('report_autograder/report_table', {})
        .then(html => {
            container.html(html);
            getReportData(0);
        })
        .catch(async () => {
            const msg = await getString('error:building_report_data', 'report_autograder');
            container.html(`<div class="alert alert-danger">${msg}</div>`);
        });

    $(document).off('click', '.manual-grade-btn');
};


