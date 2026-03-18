import $ from 'jquery';
import notification from 'core/notification';
import { get_string as getString } from 'core/str';
import templates from 'core/templates';

export const attachFilterListeners = (onFilterChange, onFilterClear) => {
    $('#autograder-filter-form').on('submit', e => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log('Filter form submitted'); //NoEslint

        const filters = [];
        const searchName = $('#searchname').val();
        if (searchName) {
            filters.push({ name: 'nameUser', value: searchName });
        }
        const dateFrom = $('#datefrom').val();
        if (dateFrom) {
            filters.push({ name: 'dateDelivered', value: dateFrom });
        }
        const dateTo = $('#dateto').val();
        if (dateTo) {
            filters.push({ name: 'dateGraded', value: dateTo });
        }
        const grade = $('#grade').val();
        if (grade) {
            filters.push({ name: 'grade', value: grade });
        }
        const status = $('#status').val();
        if (status) {
            filters.push({ name: 'status', value: status });
        }

        if (typeof onFilterChange === 'function') {
            // eslint-disable-next-line no-console
            console.log('Applying filters:', filters); //NoEslint
            onFilterChange(filters);
        }
    });

    $('.autograder-filter-dropdown-menu .btn-secondary').on('click', e => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log('Clear filters clicked'); //NoEslint
        $('#searchname').val('');
        $('#datefrom').val('');
        $('#dateto').val('');
        $('#grade').val('');
        $('#status').val('');
        if (typeof onFilterClear === 'function') {
            onFilterClear();
        }
    });
};

export const attachManualGradeButtonListeners = (maxGrade, cmid) => {
    const container = $('#autograder-report-container');

    container.off('click', '.manual-grade-btn');

    container.on('click', '.manual-grade-btn', async function(e) {
        e.preventDefault();

        // eslint-disable-next-line no-console
        console.log("¡Clic detectado! Preparando redirección...");

        const button = $(this);
        const userid = button.data('userid');

        const row = button.closest('tr');
        const gradeInput = row.find('.manual-grade-input');
        const grade = gradeInput.val();

        if (grade === '' || isNaN(parseFloat(grade))) {
            const msg = await getString('error:invalidgrade', 'report_autograder');
            notification.addNotification({ message: msg, type: 'error' });
            return;
        }

        const gradeVal = parseFloat(grade);

        if (maxGrade !== null && gradeVal > maxGrade) {
            const msg = await getString('error:gradetoolarge', 'report_autograder', { maxgrade: maxGrade });
            notification.addNotification({ message: msg, type: 'error' });
            return;
        }

        if (gradeVal < 0) {
            const msg = await getString('error:negativegrade', 'report_autograder');
            notification.addNotification({ message: msg, type: 'error' });
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