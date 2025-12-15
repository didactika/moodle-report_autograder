let currentCmid = null;
let currentPage = 0;
let recordsPerPage = 20;
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

export const setMaxGrade = (grade) => {
    maxGrade = grade;
};

export const getMaxGrade = () => maxGrade;

export const setFilters = (filters) => {
    currentFilters = filters;
};

export const getFilters = () => currentFilters;
