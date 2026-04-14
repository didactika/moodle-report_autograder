import $ from "jquery";
import templates from "core/templates";

const BASE_ITEMS_PER_PAGE = 12;
const STEP_ITEMS_PER_PAGE = [24, 48, 96];

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
        if (step < totalRecords) {
            values.push(step);
        }
    });
    values.push(totalRecords);
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
 * @param {string|null} [allResultsLabelOverride] Optional plain text (or HTML) to replace the "All" lang string from Mustache.
 */
export const renderPagination = (
    totalRecords,
    currentRecords,
    currentPage,
    recordsPerPage,
    onPageClick,
    onPerPageChange,
    allResultsLabelOverride = null,
) => {
    const container = $("#autograder-pagination-container");
    container.empty();

    if (totalRecords === 0) {
        return;
    }

    const from = currentPage * recordsPerPage + 1;
    // Use actual count of received records for `to` — more accurate than arithmetic
    // since the last page (or filtered results) may return fewer than the limit.
    const to = from + currentRecords.length - 1;
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
        const isAllOption =
            val === totalRecords && totalRecords > BASE_ITEMS_PER_PAGE;
        const onlyAllMode = totalRecords <= BASE_ITEMS_PER_PAGE;
        const isAll = isAllOption || onlyAllMode;
        return {
            value: val,
            is_all: isAll,
            selected: val === selectedLimit,
            all_results_label: override,
        };
    });

    const selectedOpt = peroptions.find((o) => o.selected);
    const currentIsAll = selectedOpt ? selectedOpt.is_all : true;
    const currentNumeric =
        selectedOpt && !selectedOpt.is_all ? String(selectedOpt.value) : "";

    const context = {
        from,
        to,
        total: totalRecords,
        current_is_all: currentIsAll,
        current_numeric: currentNumeric,
        all_results_label: override,
        hasprev,
        hasnext,
        prevpage: currentPage - 1,
        nextpage: currentPage + 1,
        peroptions,
    };

    templates
        .render("report_autograder/pagination", context)
        .then((html) => {
            container.html(html);

            // Per-page custom dropdown toggle
            const dropdown = container.find("#autograder-per-page-dropdown");
            const toggle = dropdown.find(".autograder-per-page-toggle");

            toggle.off("click.pgn").on("click.pgn", function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.toggleClass("is-open");
                toggle.attr(
                    "aria-expanded",
                    dropdown.hasClass("is-open") ? "true" : "false",
                );
            });

            dropdown
                .find(".autograder-per-page-item")
                .off("click.pgn")
                .on("click.pgn", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const newLimit = parseInt($(this).data("limit"), 10);
                    dropdown.removeClass("is-open");
                    if (typeof onPerPageChange === "function") {
                        onPerPageChange(newLimit);
                    }
                });

            $(document)
                .off("click.pgn.outside")
                .on("click.pgn.outside", () => {
                    dropdown.removeClass("is-open");
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
        })
        .catch(() => {
            // Handle error silently.
        });
};
