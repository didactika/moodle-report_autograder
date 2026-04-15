import { BASE_ITEMS_PER_PAGE } from "./ui/pagination";

let currentCmid = null;
let currentPage = 0;
let recordsPerPage = BASE_ITEMS_PER_PAGE;
let requestedLimit = BASE_ITEMS_PER_PAGE;
let maxGrade = null;
let currentFilters = [];

/** @type {Array|null} Full enriched rows for the current filter set (this page load only). */
let clientCachedFullRows = null;
/** @type {string|null} Fingerprint of {@link currentFilters} when the cache was filled. */
let clientCacheFiltersFingerprint = null;

/** @type {'user_name'|'completed_at_sort'|null} Active sort column; null = API order. */
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

export const init = (cmid) => {
    currentCmid = cmid;
    currentPage = 0;
    resetSort();
};

export const setCmid = (cmid) => {
    currentCmid = cmid;
};

export const getCmid = () => currentCmid;

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

export const setMaxGrade = (grade) => {
    maxGrade = grade;
};

export const getMaxGrade = () => maxGrade;

export const setFilters = (filters) => {
    currentFilters = filters;
};

export const getFilters = () => currentFilters;

/**
 * Stable string for comparing filter sets (pagination / per-page must not be part of this).
 *
 * @param {Array} filters
 * @returns {string}
 */
export const getFiltersFingerprint = (filters) => {
    if (!filters || !filters.length) {
        return "[]";
    }
    const normalized = filters
        .map((f) => ({
            name: String(f.name || ""),
            value: String(f.value ?? ""),
        }))
        .sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));
    return JSON.stringify(normalized);
};

/**
 * Drops the in-memory report rows (e.g. after filter change; full reload clears JS anyway).
 */
export const clearClientReportCache = () => {
    clientCachedFullRows = null;
    clientCacheFiltersFingerprint = null;
    resetSort();
};

/**
 * @param {Array} rows Full enriched rows from the last webservice response.
 * @param {string} fingerprint From {@link getFiltersFingerprint}.
 */
export const setClientReportCache = (rows, fingerprint) => {
    clientCachedFullRows = Array.isArray(rows) ? rows : [];
    clientCacheFiltersFingerprint = fingerprint;
};

/**
 * @param {string} fingerprint
 * @returns {Array|null}
 */
export const getClientReportCache = (fingerprint) => {
    if (
        clientCachedFullRows !== null &&
        clientCacheFiltersFingerprint === fingerprint
    ) {
        return clientCachedFullRows;
    }
    return null;
};
