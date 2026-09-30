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
 * Pagination of the report's table.
 *
 * @module     report_autograder/ui/pagination
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from "jquery";
import templates from "core/templates";

/** Default page size (must match initial {@link ../state} requestedLimit). */
export const BASE_ITEMS_PER_PAGE = 12;
const STEP_ITEMS_PER_PAGE = [24, 48, 96];

// The largest page this report will ever ask for. 'All' is deliberately not
// on offer: site-wide there can be tens of thousands of rows.
const MAX_ITEMS_PER_PAGE = 96;

/**
 * Values shown in the per-page dropdown (mirrors course-finder: no 24+ when total ≤ 12).
 *
 * @param {number} totalRecords
 * @returns {number[]}
 */
const buildPerPageValues = (totalRecords) => {
    if (totalRecords <= BASE_ITEMS_PER_PAGE) {
        return [totalRecords];
    }

    const values = [BASE_ITEMS_PER_PAGE];

    STEP_ITEMS_PER_PAGE.forEach((step) => {
        if (step < totalRecords && step <= MAX_ITEMS_PER_PAGE) {
            values.push(step);
        }
    });

    // No "all". A site-wide report can have tens of thousands of rows, and
    // asking for them in one page is a request no server should be given the
    // chance to accept — so the largest page is the largest step, and the
    // total is only offered when it is smaller than that.
    if (totalRecords <= MAX_ITEMS_PER_PAGE) {
        values.push(totalRecords);
    } else if (values.indexOf(MAX_ITEMS_PER_PAGE) === -1) {
        values.push(MAX_ITEMS_PER_PAGE);
    }

    return values;
};

/**
 * Which option should appear selected when the API limit does not match the list (e.g. limit 96, total 2).
 *
 * @param {number[]} optionValues
 * @param {number} recordsPerPage
 * @param {number} totalRecords
 * @returns {number}
 */
const resolveSelectedLimit = (optionValues, recordsPerPage, totalRecords) => {
    const target = Math.min(recordsPerPage, totalRecords);
    if (optionValues.includes(target)) {
        return target;
    }
    if (optionValues.includes(recordsPerPage)) {
        return recordsPerPage;
    }
    if (totalRecords <= BASE_ITEMS_PER_PAGE) {
        return totalRecords;
    }
    if (recordsPerPage >= totalRecords) {
        return totalRecords;
    }
    const notAll = optionValues.filter((v) => v < totalRecords);
    const fitting = notAll.filter((v) => v <= recordsPerPage);
    if (fitting.length) {
        return Math.max(...fitting);
    }
    return optionValues[0];
};

/**
 * Renders the pagination controls.
 *
 * @param {number} totalRecords The total number of records available.
 * @param {Array} currentRecords The records for the current page.
 * @param {number} currentPage The current 0-indexed page number.
 * @param {number} recordsPerPage The number of records per page.
 * @param {Function} onPageClick Callback for page navigation.
 * @param {Function} onPerPageChange Callback when per-page count changes.
 * @param {string|null} [allResultsLabelOverride] Optional plain text to replace the "All" lang string from Mustache.
 * @param {Function} isCurrent Whether this request is still the latest one.
 */
export const renderPagination = (
    totalRecords,
    currentRecords,
    currentPage,
    recordsPerPage,
    onPageClick,
    onPerPageChange,
    allResultsLabelOverride = null,
    isCurrent = () => true,
) => {
    const container = $("#autograder-pagination-container");

    if (totalRecords === 0) {
        if (isCurrent()) {
            container.empty();
        }
        return;
    }

    const from = currentRecords.length ? currentPage * recordsPerPage + 1 : 0;
    // Use actual count of received records for `to` — more accurate than arithmetic
    // since the last page (or filtered results) may return fewer than the limit.
    const to = currentRecords.length ? from + currentRecords.length - 1 : 0;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const hasprev = currentPage > 0;
    // Use actual records received — if fewer than limit came back there is no next page
    // regardless of what totalPages math says (avoids phantom last page from API rounding).
    const hasnext =
        currentRecords.length >= recordsPerPage && currentPage + 1 < totalPages;

    let optionValues = buildPerPageValues(totalRecords);
    // Include the active slice size so the dropdown can match (e.g. 12) when BASE/STEPS omit it.
    if (
        recordsPerPage > 0 &&
        recordsPerPage < totalRecords &&
        !optionValues.includes(recordsPerPage)
    ) {
        optionValues = [...optionValues, recordsPerPage].sort((a, b) => a - b);
    }
    const selectedLimit = resolveSelectedLimit(
        optionValues,
        recordsPerPage,
        totalRecords,
    );

    const override =
        allResultsLabelOverride !== null && allResultsLabelOverride !== ""
            ? allResultsLabelOverride
            : null;

    const peroptions = optionValues.map((val) => {
        const isAllOption =
            val === totalRecords && totalRecords > BASE_ITEMS_PER_PAGE;
        const onlyAllMode = totalRecords <= BASE_ITEMS_PER_PAGE;
        const isAll = isAllOption || onlyAllMode;
        return {
            value: val,
            'is_all': isAll,
            selected: val === selectedLimit,
            'all_results_label': override,
        };
    });

    const context = {
        from,
        to,
        total: totalRecords,
        'all_results_label': override,
        hasprev,
        hasnext,
        prevpage: currentPage - 1,
        nextpage: currentPage + 1,
        peroptions,
    };

    templates
        .render("report_autograder/pagination", context)
        .then((html) => {
            if (!isCurrent()) {
                return null;
            }
            container.html(html);

            container.find('#autograder-per-page').on('change.pgn', function() {
                if (typeof onPerPageChange === 'function') {
                    onPerPageChange(parseInt($(this).val(), 10));
                }
            });

            // Page nav (chevron buttons)
            container
                .off("click.pgn", "button.autograder-page-nav[data-page]")
                .on(
                    "click.pgn",
                    "button.autograder-page-nav[data-page]",
                    (e) => {
                        e.preventDefault();
                        const btn = $(e.currentTarget);
                        if (btn.prop("disabled")) {
                            return;
                        }
                        const newPage = parseInt(btn.data("page"), 10);
                        if (typeof onPageClick === "function") {
                            onPageClick(newPage);
                        }
                    },
                );

            return null;
        })
        .catch(() => {
            // Handle error silently.
        });
};
