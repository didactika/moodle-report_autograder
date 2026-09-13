import $ from 'jquery';

/**
 * Collects what the filter bar is currently asking for.
 *
 * The names are the ones the server understands directly: there is no longer
 * a translation step between "filters Moodle can answer" and "filters the
 * external service can answer", because there is no external service.
 *
 * @returns {Array<{name: string, value: string}>}
 */
export const collectFilters = () => {
    const filters = [];
    const add = (name, value) => {
        if (value) {
            filters.push({ name, value: String(value) });
        }
    };

    add('searchname', $('#searchname').val());
    add('grading_date_from', $('#grading_date_from').val());
    add('grading_date_to', $('#grading_date_to').val());
    add('status', $('#status').val());
    add('courseid', $('#autograder-filter-course').val());
    add('cmid', $('#autograder-filter-activity').val());
    add('groupid', $('#autograder-filter-group').val());

    return filters;
};

/**
 * Marks the course and activity pickers as "on" when something is chosen, the
 * same way the date and status chips mark themselves.
 */
const markChosenPickers = () => {
    $('.autograder-select-chip').each(function () {
        $(this).toggleClass('autograder-filter-active', Boolean($(this).val()));
    });
};

/**
 * @param {Function} onFilterChange Called with the new filter list.
 * @param {Function} onFilterClear Called when everything is cleared.
 */
export const attachFilterListeners = (onFilterChange, onFilterClear) => {
    const form = $('#autograder-filter-form');

    markChosenPickers();

    form.on('submit', e => {
        e.preventDefault();

        if (typeof onFilterChange === 'function') {
            onFilterChange(collectFilters());
        }
    });

    // The course and activity pickers are ordinary selects: changing one is
    // the whole interaction, so it applies itself rather than waiting for a
    // button the rest of the bar does not have either.
    form.on('change', '#autograder-filter-course, #autograder-filter-activity, #autograder-filter-group', () => {
        markChosenPickers();

        if (typeof onFilterChange === 'function') {
            onFilterChange(collectFilters());
        }
    });

    form.on('click', '#autograder-filter-clear', e => {
        e.preventDefault();
        form[0].reset();
        $('#searchname, #grading_date_from, #grading_date_to, #status').val('');

        if (typeof onFilterClear === 'function') {
            onFilterClear();
        }
    });
};
