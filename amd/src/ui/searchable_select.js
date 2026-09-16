import $ from 'jquery';
import { searchOptions } from '../service/filter_datasource';

/**
 * A chip that searches the server, built here rather than taken from core.
 *
 * `core/form-autocomplete` was tried first and does not fit this bar. It
 * replaces the select with a field and a separate removable tag, and what
 * is chosen ends up read as a stray label under the row instead of on the
 * control itself — in a row of chips that reads as broken, whatever is done
 * to it with CSS.
 *
 * So this is the chip the other filters already are: a button showing the
 * current choice, and a panel with a search box and the matches. The
 * original `<select>` stays in the form and is what is actually submitted,
 * so nothing downstream — collectFilters(), the change listener — needs to
 * know any of this happened.
 */

/** How long to wait after a keystroke before asking the server. */
const DEBOUNCE_MS = 250;

let openPanel = null;

/**
 * Closes whichever panel is open.
 */
const closeOpenPanel = () => {
    if (openPanel) {
        openPanel.wrapper.removeClass('is-open');
        openPanel.button.attr('aria-expanded', 'false');
        openPanel = null;
    }
};

/**
 * The label to show on the chip for what is chosen.
 *
 * @param {jQuery} select
 * @param {String} placeholder
 * @returns {{label: String, chosen: Boolean}}
 */
const currentChoice = (select, placeholder) => {
    const option = select.find('option:selected').first();
    const label = option.length ? (option.text() || '').trim() : '';
    const chosen = Boolean(select.val()) && label !== '';

    return { label: chosen ? label : placeholder, chosen };
};

/**
 * Paints the chip to match what is chosen.
 *
 * @param {Object} parts
 * @param {String} placeholder
 */
const paint = (parts, placeholder) => {
    const { label, chosen } = currentChoice(parts.select, placeholder);

    parts.text.text(label);
    // Exactly what the date chip does: the active colour, the clear button in
    // place of the arrow rather than on top of it, and room made for it.
    parts.button.toggleClass('autograder-filter-active autograder-chip-has-clear', chosen);
    parts.clear.toggleClass('d-none', !chosen);
    parts.arrow.toggleClass('d-none', chosen);
};

/**
 * Draws the matches, or says there were none.
 *
 * @param {Object} parts
 * @param {Array} options
 * @param {String} emptyText
 */
const renderOptions = (parts, options, emptyText) => {
    parts.list.empty();

    if (!options.length) {
        parts.list.append($('<li>').addClass('autograder-searchable-empty').text(emptyText));
        return;
    }

    options.forEach((option) => {
        parts.list.append(
            $('<li>').append(
                $('<button>')
                    .attr({ type: 'button', 'data-value': option.id })
                    .addClass('autograder-searchable-option')
                    .text(option.name)
            )
        );
    });
};

/**
 * Wires one select up as a searchable chip.
 *
 * @param {String} selector The original select.
 * @param {String} emptyText Shown when a search matches nothing.
 * @param {String} loadingText Shown while a search is in flight.
 * @param {String} clearLabel The label of the clear button.
 */
const enhanceOne = (selector, emptyText, loadingText, clearLabel) => {
    const select = $(selector);

    if (!select.length || select.data('autograderSearchable')) {
        return;
    }

    select.data('autograderSearchable', true);

    const placeholder = select.data('placeholder') || '';
    const wrapper = select.closest('.autograder-search-chip-wrapper');
    const text = $('<span>').addClass('autograder-searchable-text');
    // The same clear button and the same arrow as every other chip, so that
    // this one is not a lookalike but the thing itself.
    const clear = $('<button>')
        .attr({ type: 'button', 'aria-label': clearLabel })
        .addClass('autograder-chip-clear-btn autograder-searchable-clear d-none')
        .append($('<i>').addClass('fa fa-times-circle').attr('aria-hidden', 'true'));
    const arrow = $('<span>')
        .addClass('autograder-searchable-arrow')
        .attr('aria-hidden', 'true')
        .append($('<i>').addClass('fa fa-chevron-down'));
    const button = $('<button>')
        .attr({ type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'listbox' })
        .addClass('autograder-select-chip autograder-searchable-button')
        .append(text)
        .append(arrow);
    const input = $('<input>')
        .attr({ type: 'text', placeholder: placeholder })
        .addClass('form-control autograder-searchable-input');
    const list = $('<ul>').addClass('autograder-searchable-list').attr('role', 'listbox');
    const panel = $('<div>').addClass('autograder-searchable-panel').append(input).append(list);

    select.addClass('sr-only').attr('tabindex', '-1').attr('aria-hidden', 'true');
    wrapper.append(button).append(clear).append(panel);

    const parts = { select, button, text, clear, arrow, list };
    let timer = null;
    let token = 0;

    const search = (query) => {
        const mine = ++token;

        renderOptions(parts, [], loadingText);

        searchOptions(selector, query)
            .then((response) => {
                if (mine === token) {
                    renderOptions(parts, (response && response.options) || [], emptyText);
                }
                return response;
            })
            .catch(() => {
                if (mine === token) {
                    renderOptions(parts, [], emptyText);
                }
            });
    };

    button.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const wasOpen = wrapper.hasClass('is-open');

        closeOpenPanel();

        if (wasOpen) {
            return;
        }

        wrapper.addClass('is-open');
        button.attr('aria-expanded', 'true');
        openPanel = { wrapper, button };
        input.val('');
        input.trigger('focus');
        search('');
    });

    input.on('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => search(input.val() || ''), DEBOUNCE_MS);
    });

    input.on('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOpenPanel();
            button.trigger('focus');
        }
    });

    panel.on('click', (e) => e.stopPropagation());

    list.on('click', '.autograder-searchable-option', function (e) {
        e.preventDefault();

        const value = $(this).attr('data-value');
        const label = $(this).text();

        // The option may not be in the select yet — the list is fetched, not
        // rendered — so it is put there before being chosen, which is what
        // makes the plain form submit the right thing.
        if (!select.find(`option[value="${value}"]`).length) {
            select.append($('<option>').attr('value', value).text(label));
        }

        select.val(value);
        paint(parts, placeholder);
        closeOpenPanel();
        select.trigger('change');
    });

    clear.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        select.val('');
        paint(parts, placeholder);
        select.trigger('change');
    });

    paint(parts, placeholder);
};

/**
 * Turns every searchable chip on the page into one.
 *
 * @param {String[]} selectors The selects to enhance.
 * @param {String} emptyText Shown when a search matches nothing.
 * @param {String} loadingText Shown while a search is in flight.
 * @param {String} clearLabel The label of the clear button.
 */
export const init = (selectors, emptyText, loadingText, clearLabel = '') => {
    selectors.forEach((selector) => enhanceOne(selector, emptyText, loadingText, clearLabel));

    $(document).off('click.autograder.searchable').on('click.autograder.searchable', closeOpenPanel);
};
