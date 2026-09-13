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
 * Asks the server for one page and draws it.
 *
 * @param {number} page Zero-based.
 */
const fetchAndRenderReport = (page) => {
    setCurrentPage(page);
    showLoading();

    const sortCol = getSortColumn();

    getReportData(
        getScope(),
        page,
        getFilters(),
        getRequestedLimit(),
        sortCol || '',
        sortCol ? getSortDirection() : 'asc',
    )
        .then((response) => {
            const rows = response.data || [];
            const limit = response.limit || getRequestedLimit();

            setRecordsPerPage(limit);

            const $reportRoot = $('#autograder-report-container');

            renderTable(rows, () => {
                updateSortHeaderUI($reportRoot);
                renderPagination(
                    response.totalrecords,
                    rows,
                    page,
                    limit,
                    fetchAndRenderReport,
                    (newLimit) => {
                        setRequestedLimit(newLimit);
                        fetchAndRenderReport(0);
                    },
                );
            });

            return response;
        })
        .catch(async (error) => {
            const msg = await getString(
                'error:apirequest',
                'report_autograder',
                error.message,
            );
            notification.addNotification({ message: msg, type: 'error' });

            renderTable([]);
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
