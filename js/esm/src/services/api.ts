/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Every web service call of the report, in one place.
 *
 * @module     report_autograder/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {fetchOne} from '@moodle/lms/core/ajax';
import {toRequest} from '../lib/filters';
import type {Filters, GradersResponse, OptionsResponse, ReportProps, ReportResponse, Sort} from '../types';

/** Which report is asked for. */
export type Scope = ReportProps['scope'];

/** What one page of the report is asked with. */
export interface PageRequest {
    scope: Scope;
    page: number;
    limit: number;
    filters: Filters;
    sort: Sort;
    /** Whether to count the rows; false when turning a page, where the count cannot have changed. */
    withtotal: boolean;
}

/**
 * Read one page of the report. Filtering, sorting and paging are done by the server, because the report of a site can have more
 * rows than a browser should ever be sent.
 *
 * @param request What is asked for.
 * @returns The page.
 */
export const getReport = (request: PageRequest): Promise<ReportResponse> => fetchOne<ReportResponse>({
    methodname: 'report_autograder_get_report',
    args: {
        cmid: request.scope.cmid ?? 0,
        courseid: request.scope.courseid ?? 0,
        page: request.page,
        limit: request.limit,
        filters: toRequest(request.filters),
        sortcolumn: request.sort.column,
        sortdir: request.sort.direction,
        withtotal: request.withtotal,
    },
});

/** The pickers that search from the server as the reader types. */
export type PickerType = 'course' | 'activity' | 'anycourse';

/**
 * Search the course or activity picker.
 *
 * @param type Which picker.
 * @param query What the reader typed.
 * @param scope The report the picker belongs to.
 * @param filtercourseid The course that an activity search is narrowed to, or 0.
 * @returns The options that match.
 */
export const searchOptions = (type: PickerType, query: string, scope: Scope, filtercourseid: number): Promise<OptionsResponse> =>
    fetchOne<OptionsResponse>({
        methodname: 'report_autograder_search_filter_options',
        args: {
            type,
            query,
            cmid: scope.cmid ?? 0,
            courseid: scope.courseid ?? 0,
            filtercourseid: type === 'activity' ? filtercourseid : 0,
        },
    });

/**
 * Read who Autograder would grade as in a course, and a page of its students when asked.
 *
 * @param courseid The course.
 * @param students Whether to list a page of the students.
 * @param page Zero-based page of the students.
 * @param perpage Students on a page.
 * @returns The graders and the students.
 */
export const getGraders = (courseid: number, students: boolean, page: number, perpage: number): Promise<GradersResponse> =>
    fetchOne<GradersResponse>({
        methodname: 'report_autograder_get_graders',
        args: {courseid, students, page, perpage},
    });

/**
 * What a failed web service call says, whether it came as an error or as the object that the web service gives.
 *
 * @param error What the call failed with.
 * @returns The message.
 */
export const describeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (error !== null && typeof error === 'object' && 'message' in error) {
        return String((error as {message: unknown}).message);
    }
    return String(error);
};
