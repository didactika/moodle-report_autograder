import $ from 'jquery';
import { getSortColumn, getSortDirection } from '../state';

/**
 * Client-side sort for report rows (API order preserved when column is null).
 *
 * @param {Array<object>} rows
 * @param {string|null} column 'user_name' | 'completed_at_sort'
 * @param {'asc'|'desc'} direction
 * @returns {Array<object>}
 */
export const sortReportRows = (rows, column, direction) => {
    if (!column || !Array.isArray(rows) || rows.length === 0) {
        return Array.isArray(rows) ? [...rows] : [];
    }
    const mult = direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
        if (column === 'user_name') {
            return (
                mult *
                String(a.user_name || '').localeCompare(String(b.user_name || ''), undefined, {
                    sensitivity: 'base',
                })
            );
        }
        if (column === 'completed_at_sort') {
            const va = Number(a.completed_at_sort) || 0;
            const vb = Number(b.completed_at_sort) || 0;
            return mult * (va - vb);
        }
        return 0;
    });
};

/**
 * Updates sort icons and aria-sort on thead buttons (static DOM, survives tbody refresh).
 *
 * @param {import('jquery')} $container Wrapped `#autograder-report-container`
 */
export const updateSortHeaderUI = ($container) => {
    const col = getSortColumn();
    const dir = getSortDirection();

    $container.find('[data-autograder-sort]').each(function () {
        const key = this.getAttribute('data-autograder-sort');
        const $btn = $(this);
        const $th = $btn.closest('th');
        const $wrap = $btn.find('.autograder-sort-icon-wrap');
        const $icon = $btn.find('.autograder-sort-glyph');

        $icon.removeClass('fa-sort fa-sort-up fa-sort-down text-muted');

        if (col === key) {
            $th.attr('aria-sort', dir === 'asc' ? 'ascending' : 'descending');
            $btn.attr('aria-pressed', 'true');
            $wrap.removeClass('d-none');
            $icon.addClass(dir === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
        } else {
            $th.attr('aria-sort', 'none');
            $btn.attr('aria-pressed', 'false');
            $wrap.addClass('d-none');
        }
    });
};
