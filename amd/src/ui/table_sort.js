import $ from 'jquery';
import { getSortColumn, getSortDirection } from '../state';

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
