import $ from 'jquery';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';
import IconSystem from 'core/icon_system';

import {
    init as initState,
    getCmid,
    getMaxGrade,
    setCurrentPage,
    setFilters,
    getFilters,
    setRecordsPerPage,
    setMaxGrade,
    setRequestedLimit,
    getRequestedLimit,
    getReportCacheFingerprint,
    clearClientReportCache,
    setClientReportCache,
    getClientReportCache,
    getCurrentPage,
    getSortColumn,
    getSortDirection,
    setSort,
    resetSort,
} from './state';
import { getReportData } from './service/repository';
import { showLoading, renderTable } from './ui/report';
import { renderPagination } from './ui/pagination';
import { attachFilterListeners, attachManualGradeButtonListeners } from './ui/form';
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
 * @param {Array} fullRows Rows from webservice (already sorted server-side when applicable).
 * @param {number} page 0-based
 * @param {number} limit per-page
 * @param {number|null} maxgrade
 */
const renderPageSlice = (fullRows, page, limit, maxgrade) => {
    const total = fullRows.length;
    let effectiveLimit = limit;
    if (total > 0 && effectiveLimit > total) {
        effectiveLimit = total;
    }
    setRecordsPerPage(effectiveLimit);
    const slice = fullRows.slice(
        page * effectiveLimit,
        page * effectiveLimit + effectiveLimit,
    );
    const $reportRoot = $('#autograder-report-container');
    renderTable(slice, () => {
        attachManualGradeButtonListeners(getMaxGrade(), getCmid());
        updateSortHeaderUI($reportRoot);
        renderPagination(
            total,
            slice,
            page,
            effectiveLimit,
            fetchAndRenderReport,
            (newLimit) => {
                setRequestedLimit(newLimit);
                fetchAndRenderReport(0);
            },
        );
    }, maxgrade);
};

const fetchAndRenderReport = (page) => {
    const filters = getFilters();
    const fingerprint = getReportCacheFingerprint(filters);
    const cached = getClientReportCache(fingerprint);

    setCurrentPage(page);

    if (cached !== null) {
        let limit = getRequestedLimit();
        if (cached.length > 0 && limit > cached.length) {
            setRequestedLimit(cached.length);
            limit = cached.length;
        }
        renderPageSlice(cached, page, limit, getMaxGrade());
        return;
    }

    showLoading();

    const sortCol = getSortColumn();
    const sortDir = getSortDirection();

    getReportData(
        getCmid(),
        0,
        filters,
        getRequestedLimit(),
        sortCol || '',
        sortCol ? sortDir : 'asc',
    )
        .then((response) => {
            setMaxGrade(response.maxgrade);

            const total = response.totalrecords;
            let limit = getRequestedLimit();

            if (total > 0 && getRequestedLimit() > total) {
                setRequestedLimit(total);
            }

            const fullRows = response.data || [];
            setClientReportCache(fullRows, fingerprint);

            limit = getRequestedLimit();
            if (fullRows.length > 0 && limit > fullRows.length) {
                setRequestedLimit(fullRows.length);
                limit = fullRows.length;
            }

            renderPageSlice(fullRows, page, limit, response.maxgrade);
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

export const init = (cmid) => {
    initState(cmid);
    const container = $('#autograder-report-container');

    if (!container.length) {
        return;
    }

    // The forum grader reads data-initialuserid from the root [data-gradable-itemtype]
    // container, not from the clicked button.  Copy it in the capturing phase so the
    // grader's bubbling-phase listener sees the right user.
    const rawContainer = container.get(0);
    if (rawContainer && rawContainer.dataset.gradableItemtype) {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-grade-action="launch"][data-initialuserid]');
            if (btn && rawContainer.contains(btn)) {
                rawContainer.dataset.initialuserid = btn.dataset.initialuserid;
            }
        }, true);
    }

    initFiltersUi();
    attachFilterListeners(
        (filters) => {
            setFilters(filters);
            resetSort();
            clearClientReportCache();
            fetchAndRenderReport(0);
        },
        () => {
            setFilters([]);
            resetSort();
            clearClientReportCache();
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
    });
};
