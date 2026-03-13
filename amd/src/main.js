import $ from 'jquery';
import { get_string as getString } from 'core/str';
import notification from 'core/notification';

import {
    init as initState,
    getCmid,
    getCurrentPage,
    getFilters,
    getMaxGrade,
    setCurrentPage,
    setFilters,
    setMaxGrade,
    setRecordsPerPage
} from './state';
import { getReportData, updateUserGrade } from './service/api';
import { showLoading, renderTable, renderReportTable } from './ui/report';
import { renderPagination } from './ui/pagination';
import { attachFilterListeners, attachManualGradeButtonListeners } from './ui/form';

const handleGradeUpdate = (completionId, grade, onComplete) => {
    updateUserGrade(completionId, grade)
        .then(() => {
            fetchAndRenderReport(getCurrentPage(), getFilters());
        })
        .catch(async (error) => {
            // eslint-disable-next-line no-console
            console.error('Error updating grade:', error);
            const msg = await getString('error:updatefailed', 'report_autograder');
            notification.addNotification({ message: msg, type: 'error' });
        })
        .always(() => {
            if (typeof onComplete === 'function') {
                onComplete();
            }
        });
};

const fetchAndRenderReport = (page, filters = []) => {
    setCurrentPage(page);
    setFilters(filters);
    showLoading();

    getReportData(getCmid(), page, filters)
        .then(response => {
            setRecordsPerPage(response.limit);
            setMaxGrade(response.maxgrade);

            renderTable(response.data, () => {
                attachManualGradeButtonListeners(getMaxGrade(), handleGradeUpdate);
            });
            renderPagination(response.totalrecords, response.data, page, response.limit, fetchAndRenderReport);
        })
        .catch(async (error) => {
            const msg = await getString('error:apirequest', 'report_autograder', error.message);
            notification.addNotification({ message: msg, type: 'error' });

            renderTable([]);
        });
};

const hideMoodleCompletionBlocks = () => {
    const intervalId = setInterval(() => {
        const blocks = document.querySelectorAll('.activity-header');
        if (blocks.length) {
            blocks.forEach(block => {
                block.style.display = 'none';
            });
            clearInterval(intervalId);
        }
    }, 200);
};

export const init = cmid => {
    initState(cmid);
    const container = $('#autograder-report-container');

    if (!container.length) {
        return;
    }

    hideMoodleCompletionBlocks();

    renderReportTable(() => {
        attachFilterListeners(
            (filters) => fetchAndRenderReport(0, filters),
            () => fetchAndRenderReport(0, [])
        );
        fetchAndRenderReport(0);
    });
};