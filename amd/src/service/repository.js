import ajax from 'core/ajax';

/**
 * Fetches report data (sorting applied server-side: API order for date, Moodle for name).
 *
 * @param {number} cmid The course module id.
 * @param {number} page The page number to fetch.
 * @param {Array} filters Optional filters for the report.
 * @param {number} limit Optional limit for the number of records per page.
 * @param {string} [sortcolumn] user_name | completed_at_sort | ''
 * @param {string} [sortdir] asc | desc
 * @returns {Promise}
 */
export const getReportData = (cmid, page, filters = [], limit = 0, sortcolumn = '', sortdir = 'asc') => {
    const params = {
        cmid,
        page,
        limit,
        filters,
        sortcolumn: sortcolumn || '',
        sortdir: sortdir === 'desc' ? 'desc' : 'asc',
    };
    return ajax.call([{ methodname: 'report_autograder_get_report_data', args: params }])[0];
};
