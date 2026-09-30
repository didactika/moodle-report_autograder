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
 * What the report page is showing, and what it has been asked to show.
 *
 * @module     report_autograder/state
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BASE_ITEMS_PER_PAGE} from "./ui/pagination";

/**
 * What the page is looking at and what it has been asked to show.
 *
 * There is no longer a cache of "every row for these filters": the server now
 * returns one page at a time, because the site-wide report cannot send every
 * row to the browser and let it do the slicing.
 */

/** @type {{cmid?: number, courseid?: number}} Which report this is. */
let scope = {};
let currentPage = 0;
let recordsPerPage = BASE_ITEMS_PER_PAGE;
let requestedLimit = BASE_ITEMS_PER_PAGE;
let currentFilters = [];

/** @type {'user_name'|'completed_at_sort'|null} Active sort column; null = default order. */
let sortColumn = null;
/** @type {'asc'|'desc'} */
let sortDirection = 'asc';

export const getSortColumn = () => sortColumn;

export const getSortDirection = () => sortDirection;

/**
 * @param {'user_name'|'completed_at_sort'} col
 * @param {'asc'|'desc'} dir
 */
export const setSort = (col, dir) => {
    sortColumn = col;
    sortDirection = dir;
};

export const resetSort = () => {
    sortColumn = null;
    sortDirection = 'asc';
};

/**
 * @param {{cmid?: number, courseid?: number}} scopeParams Empty for the site report.
 */
export const init = (scopeParams) => {
    scope = scopeParams || {};
    currentPage = 0;
    currentFilters = [];
    recordsPerPage = BASE_ITEMS_PER_PAGE;
    requestedLimit = BASE_ITEMS_PER_PAGE;
    resetSort();
};

export const getScope = () => scope;

export const setCurrentPage = (page) => {
    currentPage = page;
};

export const getCurrentPage = () => currentPage;

export const setRecordsPerPage = (rpp) => {
    recordsPerPage = rpp;
};

export const getRecordsPerPage = () => recordsPerPage;

export const setRequestedLimit = (limit) => {
    requestedLimit = limit;
};

export const getRequestedLimit = () => requestedLimit;

export const setFilters = (filters) => {
    currentFilters = filters || [];
};

export const getFilters = () => currentFilters;
