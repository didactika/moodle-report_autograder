import $ from 'jquery';
import notification from 'core/notification';
import {get_string as getString} from 'core/str';
import templates from 'core/templates';

/**
 * Converts a YYYY-MM-DD date string to a local ISO 8601 datetime with timezone offset.
 * @param {string} dateStr - Date in YYYY-MM-DD format.
 * @param {boolean} endOfDay - If true, sets time to 23:59:59; otherwise 00:00:00.
 * @returns {string} ISO 8601 string with local timezone offset.
 */
const toLocalISO = (dateStr, endOfDay) => {
    const offset = new Date().getTimezoneOffset(); // minutes, negative for UTC+
    const sign = offset <= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const h = String(Math.floor(absOffset / 60)).padStart(2, '0');
    const m = String(absOffset % 60).padStart(2, '0');
    const time = endOfDay ? 'T23:59:59' : 'T00:00:00';
    return dateStr + time + sign + h + ':' + m;
};

//eslint-disable-next-line no-unused-vars
export const attachFilterListeners = (onFilterChange, onFilterClear) => {
    $('#autograder-filter-form').on('submit', e => {
        e.preventDefault();

        const filters = [];
        const searchName = $('#searchname').val();
        if (searchName) {
            filters.push({name: 'nameUser', value: searchName});
        }
        const completedAtFrom = $('#submission_date_from').val();
        if (completedAtFrom) {
            filters.push({name: 'completedAtFrom', value: toLocalISO(completedAtFrom, false)});
        }
        const completedAtTo = $('#submission_date_to').val();
        if (completedAtTo) {
            filters.push({name: 'completedAtTo', value: toLocalISO(completedAtTo, true)});
        }
        const gradingDateFrom = $('#grading_date_from').val();
        if (gradingDateFrom) {
            filters.push({name: 'scheduledOrGradingTimeFrom', value: toLocalISO(gradingDateFrom, false)});
        }
        const gradingDateTo = $('#grading_date_to').val();
        if (gradingDateTo) {
            filters.push({name: 'scheduledOrGradingTimeTo', value: toLocalISO(gradingDateTo, true)});
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