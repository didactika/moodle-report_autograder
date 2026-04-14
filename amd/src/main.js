import $ from 'jquery';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';

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
    getRequestedLimit
} from './state';
import { getReportData } from './service/repository';
import { showLoading, renderTable } from './ui/report';
import { renderPagination } from './ui/pagination';
import { attachFilterListeners, attachManualGradeButtonListeners } from './ui/form';
import { init as initFiltersUi } from './ui/filters';

const fetchAndRenderReport = (page) => {
    const filters = getFilters();
    setCurrentPage(page);
    showLoading();

    getReportData(getCmid(), page, filters, getRequestedLimit())
        .then(response => {
            setRecordsPerPage(response.limit);
            setMaxGrade(response.maxgrade);

            // Keep requested page size in sync when totals shrink (e.g. filters) so we do not keep asking for 96 when only 2 exist.
            if (response.totalrecords > 0 && getRequestedLimit() > response.totalrecords) {
                setRequestedLimit(response.totalrecords);
            }

            // Render table first, then pagination sequentially to avoid a race
            // condition in Moodle's icon system (SystemClass is not a constructor).
            renderTable(response.data, () => {
                attachManualGradeButtonListeners(getMaxGrade(), getCmid());
                renderPagination(
                    response.totalrecords,
                    response.data,
                    page,
                    response.limit,
                    fetchAndRenderReport,
                    (newLimit) => {
                        setRequestedLimit(newLimit);
                        fetchAndRenderReport(0);
                    }
                );
            }, response.maxgrade);
        })
        .catch(async (error) => {
            const msg = await getString('error:apirequest', 'report_autograder', error.message);
            notification.addNotification({ message: msg, type: 'error' });

            renderTable([]);
        });
};


export const init = cmid => {
    initState(cmid);
    const container = $('#autograder-report-container');

    if (!container.length) {
        return;
    }

    initFiltersUi();
    attachFilterListeners(
        (filters) => {
            setFilters(filters);
            fetchAndRenderReport(0);
        },
        () => {
            setFilters([]);
            fetchAndRenderReport(0);
        }
    );
    // Defer first fetch by one animation frame so Moodle's own AMD modules
    // (drawers, nav, etc.) finish initialising the icon system first.
    requestAnimationFrame(() => fetchAndRenderReport(0));
};