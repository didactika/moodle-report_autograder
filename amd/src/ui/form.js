import $ from 'jquery';

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