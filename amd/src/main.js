import $ from 'jquery';
import ajax from 'core/ajax';
import templates from 'core/templates';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';

let currentCmid = null;
let currentPage = 0;
let recordsPerPage = 20;
let maxGrade = null;
let currentFilters = [];

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

        // eslint-disable-next-line no-console
        console.log('Updating grade with params:', params);
        ajax.call([{ methodname: 'report_autograder_update_user_grade', args: params }])[0]
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('Grade updated successfully.');
                getReportData(currentPage, currentFilters);
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error updating grade:', error);
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
                getReportData(parseInt($(e.currentTarget).data('page'), 10), currentFilters);
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
 * @param {Array} filters Optional filters for the report.
 */
const getReportData = (page, filters = []) => {
    currentPage = page;
    currentFilters = filters; // Update currentFilters when data is fetched
    const tableBody = $('#autograder-report-container tbody');

    const params = {
        cmid: currentCmid,
        page: currentPage,
        filters: currentFilters
    };

    // eslint-disable-next-line no-console
    console.log('Fetching report data with params:', params);

    ajax.call([{ methodname: 'report_autograder_get_report_data', args: params }])[0]
        .then(response => {
            // eslint-disable-next-line no-console
            console.log('Successfully fetched report data:', response);
            recordsPerPage = response.limit;
            maxGrade = response.maxgrade;
            renderTable(response.data);
            renderPagination(response.totalrecords, response.data);
        })
        .catch(async (error) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching report data:', error);
            const msg = await getString('error:apirequest', 'report_autograder');
            tableBody.html(`<div class="alert alert-danger">${msg}</div>`);
        });
};

/**
 * Attaches event listeners to the filter buttons.
 */
const attachFilterListeners = () => {
    $('#autograder-filter-form').on('submit', e => {
        e.preventDefault();
        const filters = [];
        const searchName = $('#searchname').val();
        if (searchName) {
            filters.push({ name: 'nameUser', value: searchName });
        }
        const dateFrom = $('#datefrom').val();
        if (dateFrom) {
            filters.push({ name: 'Date_delivered', value: dateFrom });
        }
        const dateTo = $('#dateto').val();
        if (dateTo) {
            filters.push({ name: 'Date_graded', value: dateTo });
        }
        const grade = $('#grade').val();
        if (grade) {
            filters.push({ name: 'grade', value: grade });
        }
        const status = $('#status').val();
        if (status) {
            filters.push({ name: 'status', value: status });
        }
        // eslint-disable-next-line no-console
        console.log('Applying filters:', filters);
        getReportData(0, filters);
    });

    $('.autograder-filter-dropdown-menu .btn-secondary').on('click', e => {
        e.preventDefault();
        $('#searchname').val('');
        $('#datefrom').val('');
        $('#dateto').val('');
        $('#grade').val('');
        $('#status').val('');
        getReportData(0, []);
    });
};

/**
 * Oculta el bloque de completion automático de Moodle (activity-header / completion-info)
 */
const hideMoodleCompletionBlocks = () => {
    const intervalId = setInterval(() => {
        const blocks = document.querySelectorAll('.activity-header');
        if (blocks.length) {
            blocks.forEach(block => {
                block.style.display = 'none';
            });
            clearInterval(intervalId);
        }
    }, 200);
};

/**
 * Initializes the autograder report.
 *
 * @param {number} cmid The course module ID.
 * @export
 */
export const init = cmid => {
    // eslint-disable-next-line no-console
    console.log('Initializing autograder report with cmid:', cmid);
    currentCmid = cmid;
    const container = $('#autograder-report-container');

    if (!container.length) {
        // eslint-disable-next-line no-console
        console.error('Report container not found. Aborting initialization.');
        return;
    }

    hideMoodleCompletionBlocks();

    templates.render('report_autograder/report_table', {})
        .then(html => {
            container.html(html);
            attachFilterListeners();
            getReportData(0);
        })
        .catch(async () => {
            const msg = await getString('error:building_report_data', 'report_autograder');
            container.html(`<div class="alert alert-danger">${msg}</div>`);
        });
};