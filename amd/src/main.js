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
    getFiltersFingerprint,
    clearClientReportCache,
    setClientReportCache,
    getClientReportCache,
} from './state';
import { getReportData } from './service/repository';
import { showLoading, renderTable } from './ui/report';
import { renderPagination } from './ui/pagination';
import { attachFilterListeners, attachManualGradeButtonListeners } from './ui/form';
import { init as initFiltersUi } from './ui/filters';

/** Matches {@link pagination} default first step when the list is large enough. */
const DEFAULT_PAGE_SIZE = 12;

/**
 * @param {Array} fullRows
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
    renderTable(slice, () => {
        attachManualGradeButtonListeners(getMaxGrade(), getCmid());
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
    const fingerprint = getFiltersFingerprint(filters);
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

    getReportData(getCmid(), 0, filters, getRequestedLimit())
        .then((response) => {
            setMaxGrade(response.maxgrade);

            const total = response.totalrecords;
            let limit = getRequestedLimit();

            const maxSensible =
                total > 0 ? Math.min(DEFAULT_PAGE_SIZE, total) : DEFAULT_PAGE_SIZE;
            if (limit < maxSensible) {
                setRequestedLimit(maxSensible);
                limit = maxSensible;
            }
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

    initFiltersUi();
    attachFilterListeners(
        (filters) => {
            setFilters(filters);
            clearClientReportCache();
            fetchAndRenderReport(0);
        },
        () => {
            setFilters([]);
            clearClientReportCache();
            fetchAndRenderReport(0);
        },
    );

    IconSystem.instance().then(() => {
        fetchAndRenderReport(0);
    });
};
