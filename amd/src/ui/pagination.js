import $ from 'jquery';
import templates from 'core/templates';

/**
 * Renders the pagination controls.
 *
 * @param {number} totalRecords The total number of records available.
 * @param {Array} currentRecords The records for the current page.
 * @param {number} currentPage The current 0-indexed page number.
 * @param {number} recordsPerPage The number of records per page.
 * @param {Function} onPageClick Callback function for page clicks.
 */
export const renderPagination = (totalRecords, currentRecords, currentPage, recordsPerPage, onPageClick) => {
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
                const newPage = parseInt($(e.currentTarget).data('page'), 10);
                if (typeof onPageClick === 'function') {
                    onPageClick(newPage);
                }
            });
        })
        .catch(() => {
            // Handle error
        });
};
