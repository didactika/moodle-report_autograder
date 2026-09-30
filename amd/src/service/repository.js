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
 * Fetches pages of the report from the server.
 *
 * @module     report_autograder/service/repository
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ajax from 'core/ajax';

/**
 * Fetches one page of the report.
 *
 * Everything — filtering, sorting and paging — is done by the server, because
 * the site-wide report can have more rows than a browser should ever be sent.
 *
 * @param {{cmid?: number, courseid?: number}} scope Which report: one activity,
 *        one course, or neither for the whole site.
 * @param {number} page Zero-based page number.
 * @param {Array} filters What to narrow the table to.
 * @param {number} limit Rows per page.
 * @param {string} [sortcolumn] user_name | completed_at_sort | ''
 * @param {string} [sortdir] asc | desc
 * @param {boolean} [withTotal] Whether to count the rows. False when turning a
 *        page, where the count cannot have changed and counting again would
 *        run the whole query a second time for nothing.
 * @returns {Promise}
 */
export const getReportData = (
    scope,
    page,
    filters = [],
    limit = 0,
    sortcolumn = '',
    sortdir = 'asc',
    withTotal = true
) => {
    const params = {
        cmid: scope.cmid || 0,
        courseid: scope.courseid || 0,
        page,
        limit,
        filters,
        sortcolumn: sortcolumn || '',
        sortdir: sortdir === 'desc' ? 'desc' : 'asc',
        withtotal: withTotal,
    };

    return ajax.call([{methodname: 'report_autograder_get_report', args: params}])[0];
};
