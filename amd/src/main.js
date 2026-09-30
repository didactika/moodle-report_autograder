// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Entry point of the Autograder report page.
 *
 * @module     report_autograder/main
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';
import IconSystem from 'core/icon_system';

import {
    init as initState,
    getScope,
    setCurrentPage,
    setFilters,
    getFilters,
    setRecordsPerPage,
    setRequestedLimit,
    getRequestedLimit,
    getCurrentPage,
    getSortColumn,
    getSortDirection,
    setSort,
    resetSort,
} from './state';
import { getReportData } from './service/repository';
import { showLoading, renderTable } from './ui/report';
import { renderPagination } from './ui/pagination';
import { attachFilterListeners, collectFilters } from './ui/form';
import { init as initFiltersUi } from './ui/filters';
import { updateSortHeaderUI } from './ui/table_sort';

let requestId = 0;

// The last row count the server actually made, reused while turning pages.
let knownTotal = 0;

/**
 * @param {'user_name'|'completed_at_sort'} key
 */
const toggleColumnSort = (key) => {
    if (getSortColumn() === key) {
        setSort(key, getSortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
        setSort(key, key === 'completed_at_sort' ? 'desc' : 'asc');
    }
};

/**
 * Says the report is waiting to be narrowed, instead of drawing a table.
 *
 * The site-wide report refuses to run unfiltered — see get_report — so there
 * is nothing to draw and nothing to page through until the reader picks
 * something.
 */
const showNeedsFilter = async () => {
    const message = await getString('needsfilter', 'report_autograder');

    $('#autograder-pagination-container').empty();
    $('#autograder-table-body').html(
        $('<tr>').append(
            $('<td>').attr('colspan', 99).addClass('text-center text-muted py-5').text(message)
        )
    );
};

/**
 * Asks the server for one page and draws it.
 *
 * @param {number} page Zero-based.
 */
const fetchAndRenderReport = (page) => {
    const currentRequest = ++requestId;
    const isCurrent = () => currentRequest === requestId;
    setCurrentPage(page);
    showLoading();
    $('#autograder-pagination-container').empty();

    const sortCol = getSortColumn();

    // Counting the rows runs the whole query a second time, so it is asked for
    // only when the answer can have changed — a new set of filters, which
    // always lands on page 0. Turning a page reuses the number already known.
    const withTotal = page === 0;

    getReportData(
        getScope(),
        page,
        getFilters(),
        getRequestedLimit(),
        sortCol || '',
        sortCol ? getSortDirection() : 'asc',
        withTotal,
    )
        .then((response) => {
            if (!isCurrent()) {
                return response;
            }
            const rows = response.data || [];
            const limit = response.limit || getRequestedLimit();

            // The site-wide report will not run until it is narrowed: asking
            // it for the whole campus at once is what holds the database down.
            if (response.needsfilter) {
                showNeedsFilter();
                return response;
            }

            setRecordsPerPage(limit);

            // -1 is the server saying it did not count, because nothing that
            // could change the count has happened since it last did.
            if (response.totalrecords >= 0) {
                knownTotal = response.totalrecords;
            }

            const $reportRoot = $('#autograder-report-container');

            renderTable(rows, () => {
                updateSortHeaderUI($reportRoot);
                renderPagination(
                    knownTotal,
                    rows,
                    page,
                    limit,
                    fetchAndRenderReport,
                    (newLimit) => {
                        setRequestedLimit(newLimit);
                        fetchAndRenderReport(0);
                    },
                    null,
                    isCurrent,
                );
            }, isCurrent);

            return response;
        })
        .catch(async (error) => {
            if (!isCurrent()) {
                return;
            }
            const msg = await getString(
                'error:apirequest',
                'report_autograder',
                error.message,
            );
            if (!isCurrent()) {
                return;
            }
            notification.addNotification({ message: msg, type: 'error' });

            renderTable([], null, isCurrent);
        });
};

/**
 * @param {{cmid?: number, courseid?: number}} scope Which report this is.
 * @param {string} [presetStatus] The status the page was opened on, when it
 *        was reached from one of the summary tiles.
 */
export const init = (scope, presetStatus) => {
    initState(scope);

    if (presetStatus) {
        $('#status').val(presetStatus);
        setFilters([{ name: 'status', value: presetStatus }]);
    }

    const container = $('#autograder-report-container');

    if (!container.length) {
        return;
    }

    // The forum grader reads data-initialuserid from the root
    // [data-gradable-itemtype] container, not from the clicked button. Copy it
    // in the capturing phase so the grader's bubbling-phase listener sees the
    // right user.
    const rawContainer = container.get(0);

    if (rawContainer && rawContainer.dataset.gradableItemtype) {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-grade-action="launch"][data-initialuserid]');

            if (btn && rawContainer.contains(btn)) {
                rawContainer.dataset.initialuserid = btn.dataset.initialuserid;
            }
        }, true);
    }

    initFiltersUi(presetStatus);

    // The bar can arrive with something already chosen — a status from a
    // summary tile, or the group the viewer was last looking at, which in an
    // activity that separates groups is not optional. So the first page is
    // asked for with whatever the bar says, not with nothing.
    setFilters(collectFilters());

    attachFilterListeners(
        (filters) => {
            setFilters(filters);
            resetSort();
            fetchAndRenderReport(0);
        },
        () => {
            setFilters([]);
            resetSort();
            fetchAndRenderReport(0);
        },
    );

    container.on('click', '[data-autograder-sort]', function (e) {
        e.preventDefault();
        const key = this.getAttribute('data-autograder-sort');

        if (key !== 'user_name' && key !== 'completed_at_sort') {
            return;
        }

        toggleColumnSort(key);
        fetchAndRenderReport(getCurrentPage());
    });

    IconSystem.instance().then(() => {
        fetchAndRenderReport(0);

        return null;
    }).catch(() => {
        fetchAndRenderReport(0);
    });
};
