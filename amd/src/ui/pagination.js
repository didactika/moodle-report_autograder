import $ from 'jquery';
import templates from 'core/templates';

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

/**
 * Renders the pagination controls.
 *
 * @param {number} totalRecords The total number of records available.
 * @param {Array} currentRecords The records for the current page.
 * @param {number} currentPage The current 0-indexed page number.
 * @param {number} recordsPerPage The number of records per page.
 * @param {Function} onPageClick Callback for page navigation.
 * @param {Function} onPerPageChange Callback when per-page count changes.
 */
export const renderPagination = (totalRecords, currentRecords, currentPage, recordsPerPage, onPageClick, onPerPageChange) => {
    const container = $('#autograder-pagination-container');
    container.empty();

    if (totalRecords === 0) {
        return;
    }

    const from = currentPage * recordsPerPage + 1;
    // Use actual count of received records for `to` — more accurate than arithmetic
    // since the last page (or filtered results) may return fewer than the limit.
    const to = from + currentRecords.length - 1;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const hasprev = currentPage > 0;
    // Use actual records received — if fewer than limit came back there is no next page
    // regardless of what totalPages math says (avoids phantom last page from API rounding).
    const hasnext = currentRecords.length >= recordsPerPage && (currentPage + 1) < totalPages;

    // Build options list
    let options = [...PER_PAGE_OPTIONS];
    if (!options.includes(recordsPerPage)) {
        options.push(recordsPerPage);
        options.sort((a, b) => a - b);
    }

    const peroptions = options.map(v => ({value: v, selected: v === recordsPerPage, label: String(v)}));

    const context = {
        from,
        to,
        total: totalRecords,
        currentlimit: recordsPerPage,
        hasprev,
        hasnext,
        prevpage: currentPage - 1,
        nextpage: currentPage + 1,
        peroptions
    };

    templates.render('report_autograder/pagination', context)
        .then(html => {
            container.html(html);

            // Per-page custom dropdown toggle
            const dropdown = container.find('#autograder-per-page-dropdown');
            const toggle = dropdown.find('.autograder-per-page-toggle');

            toggle.off('click.pgn').on('click.pgn', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.toggleClass('is-open');
                toggle.attr('aria-expanded', dropdown.hasClass('is-open') ? 'true' : 'false');
            });

            dropdown.find('.autograder-per-page-item').off('click.pgn').on('click.pgn', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const newLimit = parseInt($(this).data('limit'), 10);
                dropdown.removeClass('is-open');
                if (typeof onPerPageChange === 'function') {
                    onPerPageChange(newLimit);
                }
            });

            $(document).off('click.pgn.outside').on('click.pgn.outside', () => {
                dropdown.removeClass('is-open');
            });

            // Page nav buttons
            container.off('click.pgn', 'button[data-page]').on('click.pgn', 'button[data-page]', e => {
                e.preventDefault();
                const btn = $(e.currentTarget);
                if (btn.prop('disabled')) {
                    return;
                }
                const newPage = parseInt(btn.data('page'), 10);
                if (typeof onPageClick === 'function') {
                    onPageClick(newPage);
                }
            });
        })
        .catch(() => {
            // Handle error silently.
        });
};
