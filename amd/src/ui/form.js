import $ from 'jquery';
import notification from 'core/notification';
import {get_string as getString} from 'core/str';
import templates from 'core/templates';

//eslint-disable-next-line no-unused-vars
export const attachFilterListeners = (onFilterChange, onFilterClear) => {
    $('#autograder-filter-form').on('submit', e => {
        e.preventDefault();

        const filters = [];
        const searchName = $('#searchname').val();
        if (searchName) {
            filters.push({name: 'nameUser', value: searchName});
        }
        const submissionDateFrom = $('#submission_date_from').val();
        if (submissionDateFrom) {
            filters.push({name: 'dateDelivered', value: submissionDateFrom});
        }
        const submissionDateTo = $('#submission_date_to').val();
        if (submissionDateTo) {
            filters.push({name: 'dateDeliveredTo', value: submissionDateTo});
        }
        const gradingDateFrom = $('#grading_date_from').val();
        if (gradingDateFrom) {
            filters.push({name: 'dateGraded', value: gradingDateFrom});
        }
        const gradingDateTo = $('#grading_date_to').val();
        if (gradingDateTo) {
            filters.push({name: 'dateGradedTo', value: gradingDateTo});
        }
        const grade = $('#grade').val();
        if (grade) {
            filters.push({name: 'grade', value: grade});
        }
        const status = $('#status').val();
        if (status) {
            filters.push({name: 'status', value: status});
        }

        if (typeof onFilterChange === 'function') {
            onFilterChange(filters);
        }
    });
};

export const attachManualGradeButtonListeners = (maxGrade, cmid) => {
    const container = $('#autograder-report-container');

    container.off('click', '.manual-grade-btn');

    container.on('click', '.manual-grade-btn', async function(e) {
        e.preventDefault();

        const button = $(this);
        const userid = button.data('userid');

        const row = button.closest('tr');
        const gradeInput = row.find('.manual-grade-input');
        const grade = gradeInput.val();

        if (grade === '' || isNaN(parseFloat(grade))) {
            const msg = await getString('error:invalidgrade', 'report_autograder');
            notification.addNotification({message: msg, type: 'error'});
            return;
        }

        const gradeVal = parseFloat(grade);

        if (maxGrade !== null && gradeVal > maxGrade) {
            const msg = await getString('error:gradetoolarge', 'report_autograder', {maxgrade: maxGrade});
            notification.addNotification({message: msg, type: 'error'});
            return;
        }

        if (gradeVal < 0) {
            const msg = await getString('error:negativegrade', 'report_autograder');
            notification.addNotification({message: msg, type: 'error'});
            return;
        }

        const spinner = await templates.render('core/loading', {});
        button.html(spinner).prop('disabled', true);

        const baseUrl = `${M.cfg.wwwroot}/report/autograder/action/send_grade.php`;
        const queryParams = `cmid=${cmid}&userid=${userid}&grade=${gradeVal}&sesskey=${M.cfg.sesskey}`;
        const url = `${baseUrl}?${queryParams}`;

        window.location.href = url;
    });
};