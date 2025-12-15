import $ from 'jquery';
import notification from 'core/notification';
import { get_string as getString } from 'core/str';
import templates from 'core/templates';

/**
 * Attaches event listeners to the filter buttons.
 *
 * @param {Function} onFilterChange Callback for when filters are applied.
 * @param {Function} onFilterClear Callback for when filters are cleared.
 */
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

/**
 * Attaches click listeners to all manual grade buttons.
 * @param {number} maxGrade The maximum allowed grade.
 * @param {Function} onGradeUpdate Callback for when a grade should be updated.
 */
export const attachManualGradeButtonListeners = (maxGrade, onGradeUpdate) => {
    const buttons = $('.manual-grade-btn');

    buttons.off('click');

    buttons.on('click', async function() {
        const button = $(this);
        const completionId = button.data('completion-id');
        const row = button.closest('tr');
        const gradeInput = row.find('.manual-grade-input');
        const grade = gradeInput.val();

        const validateAndProceed = async () => {
            if (grade === '' || isNaN(parseFloat(grade))) {
                notification.add(
                    await getString('error:invalidgrade', 'report_autograder'),
                    'error'
                );
                return;
            }

            const gradeVal = parseFloat(grade);

            if (maxGrade !== null && gradeVal > maxGrade) {
                notification.add(
                    await getString(
                        'error:gradetoolarge',
                        'report_autograder',
                        { maxgrade: maxGrade }
                    ),
                    'error'
                );
                return;
            }

            if (gradeVal < 0) {
                notification.add(
                    await getString('error:negativegrade', 'report_autograder'),
                    'error'
                );
                return;
            }

            const originalButtonContent = button.html();

            try {
                const spinner = await templates.render('core/loading', {});
                button.html(spinner).prop('disabled', true);

                if (typeof onGradeUpdate === 'function') {
                    onGradeUpdate(completionId, gradeVal, () => {
                        button.html(originalButtonContent).prop('disabled', false);
                    });
                }
            } catch (err) {
                button.html(originalButtonContent).prop('disabled', false);
            }
        };

        await validateAndProceed();
    });
};

