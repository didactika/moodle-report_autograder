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
 * The bar above the table: the search, one menu for each filter and the button that clears them all.
 *
 * Each filter is a menu with the shape of a select. A menu that narrows the report is tinted, says what it is narrowed to and has a
 * cross in place of its arrow that clears it: the base state of a filter is not one more option. And
 * every filter answers at once: the report is asked again as each one changes. The numbers beside the statuses are the ones that
 * the server counts inside every other filter.
 *
 * @module     report_autograder/ui/toolbar
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import ajax from 'core/ajax';

const FORM = '#autograder-filter-form';

/** How long to wait after the last key before asking again, in milliseconds. */
const TYPING_DELAY = 300;

/**
 * A date as the date field writes it.
 *
 * @param {Date} date The date.
 * @returns {string} Year, month and day.
 */
const iso = (date) => {
    const pad = (value) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * The ranges that the presets of the date stand for.
 *
 * @returns {Object} The first and the last day of each preset.
 */
const presets = () => {
    const today = new Date();
    const back = (days) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);

    return {
        today: [iso(today), iso(today)],
        week: [iso(back(6)), iso(today)],
        month: [iso(new Date(today.getFullYear(), today.getMonth(), 1)), iso(today)],
        last30: [iso(back(29)), iso(today)],
    };
};

/**
 * The menu of a filter.
 *
 * @param {string} name The filter.
 * @returns {jQuery} Its element.
 */
const menu = (name) => $(`${FORM} [data-menu="${name}"]`);

/**
 * The statuses that are ticked.
 *
 * @returns {string[]} Their keys.
 */
const chosenStatuses = () => menu('status').find('input[type="checkbox"]:checked').map((i, box) => box.value).get();

/**
 * What the report is narrowed to, as the filters of the web service.
 *
 * @returns {Array<{name: string, value: string}>} The filters that have a value.
 */
export const collectFilters = () => {
    const filters = [];
    const add = (name, value) => {
        if (value) {
            filters.push({name, value: String(value)});
        }
    };

    add('searchname', String($('#searchname').val() || '').trim());
    add('grading_date_from', $('#grading_date_from').val());
    add('grading_date_to', $('#grading_date_to').val());
    add('status', $('#status').val());
    add('courseid', $('#autograder-filter-course').val());
    add('cmid', $('#autograder-filter-activity').val());
    add('groupid', $('#autograder-filter-group').val());

    return filters;
};

/**
 * Says on each menu what the report is narrowed to, tints the ones that narrow it and lets the button that clears them be pressed.
 */
export const paint = () => {
    const form = $(FORM);
    const set = (name, label, active) => {
        menu(name).find('[data-menu-toggle]').text(label)
            .toggleClass('border-primary', active)
            .toggleClass('dd-select-set', active);
        menu(name).find('[data-menu-clear]').prop('hidden', !active);
    };

    const statuses = chosenStatuses();
    let status = form.data('labelStatus');

    if (statuses.length === 1) {
        status = $(`#status-${statuses[0]}`).data('label');
    } else if (statuses.length > 1) {
        status += `: ${statuses.length}`;
    }

    set('status', status, statuses.length > 0);

    [['course', 'labelCourse'], ['activity', 'labelActivity']].forEach(([name, text]) => {
        const field = $(`#autograder-filter-${name}`);

        if (field.length) {
            set(name, field.val() ? field.data('name') : form.data(text), Boolean(field.val()));
        }
    });

    const from = $('#grading_date_from').val();
    const to = $('#grading_date_to').val();
    const preset = Object.entries(presets()).find(([, range]) => range[0] === from && range[1] === to);

    set('date', dateLabel(form, from, to, preset), Boolean(from || to));
    menu('date').find('[data-preset]').each(function() {
        this.setAttribute('aria-selected', preset && preset[0] === this.getAttribute('data-preset') ? 'true' : 'false');
    });

    const group = $('#autograder-filter-group');
    const groupNarrows = group.length > 0 && group.find('option[value=""]').length > 0 && Boolean(group.val());

    group.toggleClass('border-primary', groupNarrows).toggleClass('dd-select-set', groupNarrows);
    $('[data-group-clear]').prop('hidden', !groupNarrows);

    const count = countApplied(statuses.length > 0, Boolean(from || to), groupNarrows);
    const searched = String($('#searchname').val() || '').trim() !== '';
    $('#autograder-filter-clear').prop('disabled', count === 0 && !searched);

    // The menu that groups the filters says how many narrow the report.
    const grouping = menu('filters').children('[data-menu-toggle]');
    grouping.text(count > 0 ? `${grouping.data('label')} (${count})` : grouping.data('label'))
        .toggleClass('border-primary', count > 0);
    fitFilters();
};

/**
 * What the menu of the grading date says: the preset chosen, the two days, or one of them.
 *
 * @param {jQuery} form The form of the filters, which carries the texts.
 * @param {string} from The first day, or empty.
 * @param {string} to The last day, or empty.
 * @param {Array|undefined} preset The preset the two days make, if they make one.
 * @returns {string} The label.
 */
const dateLabel = (form, from, to, preset) => {
    if (preset) {
        return menu('date').find(`[data-preset="${preset[0]}"]`).text();
    }
    if (from && to) {
        return form.data('range').replace('__from__', from).replace('__to__', to);
    }
    if (from) {
        return form.data('since').replace('__a__', from);
    }
    if (to) {
        return form.data('until').replace('__a__', to);
    }
    return form.data('labelDate');
};

/**
 * How many filters narrow the report, the search left aside.
 *
 * @param {boolean} status Whether a status is chosen.
 * @param {boolean} date Whether a period is chosen.
 * @param {boolean} group Whether a group is chosen.
 * @returns {number} The filters that narrow it.
 */
const countApplied = (status, date, group) => [
    status,
    date,
    group,
    Boolean($('#autograder-filter-course').val()),
    menu('activity').length > 0 && Boolean($('#autograder-filter-activity').val()),
].filter(Boolean).length;

/** The width the search keeps beside the filters before they are grouped, in pixels (10rem). */
const SEARCH_ROOM = 160;

/** Whether the filters are grouped, and the width they need to come back to the row. */
const fitting = {grouped: false, needed: 0};

/**
 * Keeps the toolbar in one row: when the filters do not fit beside the search, on a narrow screen or when the values chosen are
 * long, they move into one menu, Filters; they come back to the row when there is room again.
 */
const fitFilters = () => {
    const box = document.querySelector(`${FORM} [data-region="filter-menus"]`);
    const row = box?.parentElement;
    if (!box || !row) {
        return;
    }
    const panel = box.querySelector('[data-region="filter-panel"]');
    const group = box.querySelector('[data-menu="filters"]');
    const gap = parseFloat(window.getComputedStyle(row).columnGap) || 0;
    const room = row.clientWidth - SEARCH_ROOM - gap;
    if (!fitting.grouped) {
        const filters = Array.from(box.children).filter((child) => child !== group);
        const width = filters.reduce((sum, child) => sum + child.offsetWidth, 0) + gap * Math.max(0, filters.length - 1);
        if (width > room) {
            fitting.needed = width;
            fitting.grouped = true;
            filters.forEach((child) => panel.appendChild(child));
            group.hidden = false;
        }
    } else if (room >= fitting.needed) {
        fitting.grouped = false;
        open($(), false);
        Array.from(panel.children).forEach((child) => box.insertBefore(child, group));
        group.hidden = true;
    }
};

/**
 * Puts the number of students of each status beside it, as the server counted them inside the other filters.
 *
 * @param {Array<{key: string, count: number}>} counts The students of each status.
 */
export const renderCounts = (counts) => {
    counts.forEach((item) => {
        $(`[data-status-count="${item.key}"]`).text(item.count);
    });
};

/**
 * Opens or closes a menu, and closes the others.
 *
 * @param {jQuery} which The menu.
 * @param {boolean} show Whether to open it.
 */
const open = (which, show) => {
    $(`${FORM} [data-menu]`).each(function() {
        const mine = $(this);
        // A menu inside the one that groups the filters opens without closing it.
        const shown = show && (this === which.get(0) || this.contains(which.get(0)));

        mine.children('.dd-select-menu').prop('hidden', !shown);
        mine.children('[data-menu-toggle]').attr('aria-expanded', shown ? 'true' : 'false');
    });
};

/**
 * Makes a picker search the server as the reader types and list what it finds.
 *
 * @param {jQuery} picker The menu of the picker.
 * @param {Function} changed What to do when a choice is made.
 */
const initPicker = (picker, changed) => {
    const search = picker.find('[data-picker-search]');
    const value = picker.find('input[type="hidden"]');
    const results = picker.find('[data-picker-options]');
    const form = $(FORM);
    const type = picker.data('optiontype');
    let timer = null;
    let ticket = 0;

    const pick = (id, name) => {
        value.val(id).data('name', name);

        if (type === 'course') {
            $('#autograder-filter-activity').val('').data('name', '');
        }

        open(picker, false);
        changed();
    };

    const item = (label, onPick, selected) => $('<button type="button" class="dropdown-item" role="option">')
        .attr('aria-selected', selected ? 'true' : 'false')
        .text(label)
        .on('click', onPick);

    const find = (query) => {
        const mine = ++ticket;

        results.empty().append($('<span class="dropdown-item disabled">').text(form.data('loading')));

        ajax.call([{
            methodname: 'report_autograder_search_filter_options',
            args: {
                type,
                query,
                cmid: parseInt(picker.data('scopecmid') || 0, 10),
                courseid: parseInt(picker.data('scopecourseid') || 0, 10),
                filtercourseid: type === 'activity' ? parseInt($('#autograder-filter-course').val() || 0, 10) : 0,
            },
        }])[0].then((response) => {
            if (mine !== ticket) {
                return null;
            }

            results.empty();

            response.options.forEach((option) => {
                results.append(item(option.name, () => pick(option.id, option.name), String(option.id) === String(value.val())));
            });

            if (response.options.length === 0) {
                results.append($('<span class="dropdown-item disabled">').text(form.data('nomatches')));
            }

            return null;
        }).catch(() => {
            if (mine === ticket) {
                results.empty();
            }
        });
    };

    picker.find('[data-menu-toggle]').on('click', () => {
        search.val('');
        find('');
        window.setTimeout(() => search.trigger('focus'), 0);
    });

    search.on('input', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => find(String(search.val()).trim()), TYPING_DELAY);
    });
};

/**
 * Makes the bar work.
 *
 * @param {Function} onChange What to do when a filter changes: it receives the filters.
 * @param {Function} onClear What to do when every filter is cleared.
 */
export const init = (onChange, onClear) => {
    const form = $(FORM);
    let timer = null;

    // A link that arrives already narrowed ticks the boxes of its statuses.
    const keys = String($('#status').val() || '').split(',').filter(Boolean);

    menu('status').find('input[type="checkbox"]').each((i, box) => {
        box.checked = keys.includes(box.value);
    });

    const changed = () => {
        $('#status').val(chosenStatuses().join(','));
        paint();
        onChange(collectFilters());
    };

    form.on('submit', (event) => {
        event.preventDefault();
    });

    form.on('click', '[data-menu-toggle]', function() {
        const which = $(this).closest('[data-menu]');

        open(which, which.children('.dd-select-menu').prop('hidden'));
    });

    $(document).on('pointerdown', (event) => {
        if (!$(event.target).closest(`${FORM} [data-menu]`).length) {
            open($(), false);
        }
    });

    $(document).on('keydown', (event) => {
        if (event.key === 'Escape') {
            const shown = $(`${FORM} .dd-select-menu:not([hidden])`).closest('[data-menu]');

            if (shown.length) {
                open(shown, false);
                shown.find('[data-menu-toggle]').trigger('focus');
            }
        }
    });

    $('#searchname').on('input', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(changed, TYPING_DELAY);
    });

    menu('status').on('change', 'input[type="checkbox"]', changed);
    form.on('change', '#autograder-filter-group, #grading_date_from, #grading_date_to', changed);

    menu('date').on('click', '[data-preset]', function() {
        const [from, to] = presets()[this.getAttribute('data-preset')];

        $('#grading_date_from').val(from);
        $('#grading_date_to').val(to);
        open(menu('date'), false);
        changed();
    });

    // The cross of a menu takes its filter back to the base state.
    form.on('click', '[data-menu-clear]', function() {
        const which = $(this).closest('[data-menu]');
        const name = which.data('menu');

        if (name === 'status') {
            which.find('input[type="checkbox"]').prop('checked', false);
        } else if (name === 'date') {
            $('#grading_date_from, #grading_date_to').val('');
        } else {
            which.find('input[type="hidden"]').val('').data('name', '');

            if (name === 'course') {
                $('#autograder-filter-activity').val('').data('name', '');
            }
        }

        open(which, false);
        changed();
        which.find('[data-menu-toggle]').trigger('focus');
    });

    form.on('click', '[data-group-clear]', () => {
        $('#autograder-filter-group').val('').trigger('focus');
        changed();
    });

    form.find('[data-picker]').each(function() {
        initPicker($(this), changed);
    });

    $('#autograder-filter-clear').on('click', () => {
        $('#searchname, #grading_date_from, #grading_date_to, #status').val('');
        menu('status').find('input[type="checkbox"]').prop('checked', false);
        $('#autograder-filter-course, #autograder-filter-activity').val('').data('name', '');
        $('#autograder-filter-group').prop('selectedIndex', 0);
        paint();
        onClear();
    });

    paint();
    new ResizeObserver(() => fitFilters()).observe(form.get(0));
};
