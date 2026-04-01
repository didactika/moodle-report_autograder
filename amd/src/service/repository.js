import ajax from 'core/ajax';

/**
 * Fetches and renders the report data for a specific page.
 *
 * @param {number} cmid The course module id.
 * @param {number} page The page number to fetch.
 * @param {Array} filters Optional filters for the report.
 * @param {number} limit Optional limit for the number of records per page.
 * @returns {Promise}
 */
export const getReportData = (cmid, page, filters = [], limit = 0) => {
    const params = {
        cmid: cmid,
        page: page,
        limit: limit,
        filters: filters
    };
    return ajax.call([{ methodname: 'report_autograder_get_report_data', args: params }])[0];
};
