/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What the report is narrowed to, as the server asks for it, and what is counted as a filter that is on. Pure functions, so they
 * can be tested alone.
 *
 * @module     report_autograder/lib/filters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {Filters, Sort, SortColumn} from '../types';

/** The filters of a report that is not narrowed. */
export const NO_FILTERS: Filters = {
    searchname: '', status: [], datefrom: '', dateto: '', courseid: 0, cmid: 0, groupid: 0,
};

/**
 * The filters in the list of name and value that the web service takes; a filter that is not on is left out.
 *
 * @param filters What the report is narrowed to.
 * @returns The list.
 */
export const toRequest = (filters: Filters): {name: string; value: string}[] => {
    const entries: [string, string][] = [
        ['searchname', filters.searchname.trim()],
        ['status', filters.status.join(',')],
        ['grading_date_from', filters.datefrom],
        ['grading_date_to', filters.dateto],
        ['courseid', filters.courseid > 0 ? String(filters.courseid) : ''],
        ['cmid', filters.cmid > 0 ? String(filters.cmid) : ''],
        ['groupid', filters.groupid > 0 ? String(filters.groupid) : ''],
    ];
    return entries.filter(([, value]) => value !== '').map(([name, value]) => ({name, value}));
};

/**
 * How many of the filters beyond the search box are on, for the badge of the filters button.
 *
 * @param filters What the report is narrowed to.
 * @returns The number.
 */
export const countFilters = (filters: Filters): number => [
    filters.status.length > 0,
    filters.datefrom !== '' || filters.dateto !== '',
    filters.courseid > 0,
    filters.cmid > 0,
    filters.groupid > 0,
].filter(Boolean).length;

/**
 * Whether anything narrows the report.
 *
 * @param filters What the report is narrowed to.
 * @returns True when the search box or a filter is on.
 */
export const isNarrowed = (filters: Filters): boolean => filters.searchname.trim() !== '' || countFilters(filters) > 0;

/**
 * The next sort when a header is pressed: the same column turns round, another one starts the way that suits it.
 *
 * @param current The sort now.
 * @param column The header that was pressed.
 * @returns The sort to ask for.
 */
export const nextSort = (current: Sort, column: SortColumn): Sort => {
    if (current.column === column) {
        return {column, direction: current.direction === 'asc' ? 'desc' : 'asc'};
    }
    return {column, direction: column === 'completed_at_sort' ? 'desc' : 'asc'};
};

/**
 * The numbers of the pages to link, with a gap where pages are left out.
 *
 * @param page The page now, counting from zero.
 * @param pages How many pages there are.
 * @returns Page numbers counting from zero, and -1 where there is a gap.
 */
export const pageList = (page: number, pages: number): number[] => {
    if (pages <= 7) {
        return Array.from({length: pages}, (_, index) => index);
    }
    const shown = new Set<number>([0, pages - 1, page - 1, page, page + 1]);
    const list: number[] = [];
    let last = -1;
    for (const number of [...shown].filter((n) => n >= 0 && n < pages).sort((a, b) => a - b)) {
        if (last >= 0 && number - last > 1) {
            list.push(-1);
        }
        list.push(number);
        last = number;
    }
    return list;
};

/**
 * A date as the date inputs write it.
 *
 * @param date The date.
 * @returns Year, month and day, joined by hyphens.
 */
export const isoDay = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
};

/** A range of dates that can be chosen with one press. */
export interface DatePreset {
    key: 'today' | 'week' | 'month' | 'last30';
    from: string;
    to: string;
}

/**
 * The ranges that can be chosen with one press, counted from a day.
 *
 * @param today The day to count from.
 * @returns The ranges: today, the last seven days, the month so far and the last thirty days.
 */
export const datePresets = (today: Date): DatePreset[] => {
    const back = (days: number): Date => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
    return [
        {key: 'today', from: isoDay(today), to: isoDay(today)},
        {key: 'week', from: isoDay(back(6)), to: isoDay(today)},
        {key: 'month', from: isoDay(new Date(today.getFullYear(), today.getMonth(), 1)), to: isoDay(today)},
        {key: 'last30', from: isoDay(back(29)), to: isoDay(today)},
    ];
};
