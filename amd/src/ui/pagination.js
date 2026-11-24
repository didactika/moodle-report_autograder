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

/** The sizes a page may have, besides all of it. */
const PAGE_SIZES = [12, 24, 48, 96];

/** What the service is sent to ask for every row at once; it caps the answer. */
export const ALL_ROWS = -1;

/**
 * The sizes the pager offers: the ones smaller than the list, and All. A list of up to 12 rows offers All only; one of 13 to 24
 * offers 12 and All; and so on up to 12, 24, 48, 96 and All.
 *
 * @param {number} totalRecords
 * @returns {number[]}
 */
const buildPerPageValues = (totalRecords) => [...PAGE_SIZES.filter((size) => size < totalRecords), ALL_ROWS];

/**
 * The size the select shows: the one in use when it is offered, and All when every row fits on the page.
 *
 * @param {number[]} optionValues
 * @param {number} recordsPerPage
 * @param {number} totalRecords
 * @returns {number}
 */
const resolveSelectedLimit = (optionValues, recordsPerPage, totalRecords) =>
    (recordsPerPage > 0 && recordsPerPage < totalRecords && optionValues.includes(recordsPerPage) ? recordsPerPage : ALL_ROWS);

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

    const optionValues = buildPerPageValues(totalRecords);
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
        return {
            value: val,
            'is_all': val === ALL_ROWS,
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
