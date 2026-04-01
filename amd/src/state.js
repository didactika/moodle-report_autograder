let currentCmid = null;
let currentPage = 0;
let recordsPerPage = 12;
let requestedLimit = 12;
let maxGrade = null;
let currentFilters = [];

export const init = (cmid) => {
    currentCmid = cmid;
    currentPage = 0;
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
