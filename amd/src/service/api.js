import ajax from 'core/ajax';

/**
 * Fetches and renders the report data for a specific page.
 *
 * @param {number} cmid The course module id.
 * @param {number} page The page number to fetch.
 * @param {Array} filters Optional filters for the report.
 * @returns {Promise}
 */
export const getReportData = (cmid, page, filters = []) => {
    const params = {
        cmid: cmid,
        page: page,
        filters: filters
    };
    return ajax.call([{ methodname: 'report_autograder_get_report_data', args: params }])[0];
};
