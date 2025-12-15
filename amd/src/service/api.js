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

/**
 * Calls the webservice to update a user's grade.
 *
 * @param {number} completionId The completion ID from the record.
 * @param {number} grade The new grade.
 * @returns {Promise}
 */
export const updateUserGrade = (completionId, grade) => {
    const params = {
        completion_id: completionId,
        status: 'MANUAL_GRADING',
        grade
    };
    return ajax.call([{ methodname: 'report_autograder_update_user_grade', args: params }])[0];
};
