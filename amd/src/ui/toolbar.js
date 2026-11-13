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
 * The bar above the table: the search, the Filters button and its panel, and the filters that are applied.
 *
 * Every filter answers at once, so there is no button to apply them: the report is asked again as each one changes. The numbers
 * beside the statuses are the ones that the server counts inside every other filter, and the applied filters are shown as badges
 * with a button that lifts each one, with the number of results.
 *
 * @module     report_autograder/ui/toolbar
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import ajax from 'core/ajax';

const FORM = '#autograder-filter-form';
const PANEL = '#autograder-filters-panel';

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
 * The statuses that are ticked, from the boxes of the panel.
 *
 * @returns {string[]} Their keys.
 */
const chosenStatuses = () => $(`${PANEL} input[type="checkbox"]:checked`).map((i, box) => box.value).get();

/**
 * Writes the ticked statuses in the field that the filter reads.
 */
const syncStatus = () => {
    $('#status').val(chosenStatuses().join(','));
};

/**
 * Ticks the boxes of the statuses that the field says, as a link that arrives already narrowed asks.
 */
const readStatus = () => {
    const keys = String($('#status').val() || '').split(',').filter(Boolean);

    $(`${PANEL} input[type="checkbox"]`).each((i, box) => {
        box.checked = keys.includes(box.value);
    });
};

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
 * The filters that are applied, among the ones that the report offers, as a list of labels with the way to lift each one.
 *
 * @returns {Array<{key: string, label: string, lift: Function}>} The applied filters.
 */
const applied = () => {
    const form = $(FORM);
    const label = (name) => form.data(name);
    const list = [];

    chosenStatuses().forEach((key) => {
        const box = $(`#status-${key}`);

        list.push({
            key: `status-${key}`,
            label: `${label('labelStatus')}: ${box.data('label')}`,
            lift: () => {
                box.prop('checked', false);
                syncStatus();
            },
        });
    });

    [['course', 'labelCourse'], ['activity', 'labelActivity']].forEach(([name, text]) => {
        const field = $(`#autograder-filter-${name}`);

        if (field.length && field.val()) {
            list.push({
                key: name,
                label: `${label(text)}: ${$(`#autograder-filter-${name}-text`).val()}`,
                lift: () => {
                    field.val('');
                    $(`#autograder-filter-${name}-text`).val('');

                    if (name === 'course') {
                        $('#autograder-filter-activity, #autograder-filter-activity-text').val('');
                    }
                },
            });
        }
    });

    const group = $('#autograder-filter-group');

    if (group.length && group.val()) {
        list.push({
            key: 'group',
            label: `${label('labelGroup')}: ${group.find('option:selected').text()}`,
            lift: () => group.val(''),
        });
    }

    const from = $('#grading_date_from').val();
    const to = $('#grading_date_to').val();

    if (from || to) {
        let range = label('range').replace('__from__', from).replace('__to__', to);

        if (!to) {
            range = label('since').replace('__a__', from);
        } else if (!from) {
            range = label('until').replace('__a__', to);
        }

        list.push({
            key: 'date',
            label: `${label('labelDate')}: ${range}`,
            lift: () => $('#grading_date_from, #grading_date_to').val(''),
        });
    }

    return list;
};

/**
 * Draws the applied filters, the number on the Filters button and the number of results.
 *
 * @param {number} total The rows that the report has with these filters.
 */
export const renderApplied = (total) => {
    const list = applied();
    const row = $('#autograder-applied');
    const items = $('#autograder-applied-list').empty();
    const count = $('#autograder-filters-count');
    const form = $(FORM);

    count.text(list.length).toggleClass('d-none', list.length === 0);
    $('#autograder-filters-toggle').toggleClass('active', list.length > 0);

    list.forEach((item) => {
        const remove = form.data('remove').replace('__a__', item.label);
        const button = $('<button type="button" class="btn btn-link btn-sm p-0">')
            .attr({'aria-label': remove, title: remove})
            .html('&times;')
            .on('click', () => {
                item.lift();
                form.trigger('autograder:filters');
            });

        items.append($('<li>').append(
            $('<span class="badge badge-secondary badge-pill rounded-pill">').text(item.label + ' ').append(button)
        ));
    });

    $('#autograder-results').text(form.data('results').replace('__a__', total));
    row.toggleClass('d-none', list.length === 0);
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
 * Whether anything narrows the report, the search included.
 *
 * @returns {boolean} True when a filter or a search is applied.
 */
export const isNarrowed = () => collectFilters().length > 0;

/**
 * Makes a picker search the server as the reader types and list what it finds under its field.
 *
 * @param {jQuery} picker The element of the picker.
 * @param {Function} changed What to do when a choice is made.
 */
const initPicker = (picker, changed) => {
    const text = picker.find('input[type="search"]');
    const value = picker.find('input[type="hidden"]');
    const results = picker.find('.list-group');
    const form = $(FORM);
    let timer = null;
    let ticket = 0;

    const item = (label, onPick, muted) => $('<button type="button" class="list-group-item list-group-item-action">')
        .toggleClass('text-muted', Boolean(muted))
        .text(label)
        .on('click', onPick);

    const close = () => results.prop('hidden', true);

    const search = (query) => {
        const mine = ++ticket;
        const type = picker.data('optiontype');
        const filterCourse = parseInt($('#autograder-filter-course').val() || 0, 10);

        results.empty().append($('<span class="list-group-item text-muted">').text(form.data('loading'))).prop('hidden', false);

        ajax.call([{
            methodname: 'report_autograder_search_filter_options',
            args: {
                type,
                query,
                cmid: parseInt(picker.data('scopecmid') || 0, 10),
                courseid: parseInt(picker.data('scopecourseid') || 0, 10),
                filtercourseid: type === 'activity' ? filterCourse : 0,
            },
        }])[0].then((response) => {
            if (mine !== ticket) {
                return null;
            }

            results.empty();

            if (value.val()) {
                results.append(item(form.data('clear'), () => {
                    value.val('');
                    text.val('');
                    close();

                    if (type === 'course') {
                        $('#autograder-filter-activity, #autograder-filter-activity-text').val('');
                    }

                    changed();
                }, true));
            }

            response.options.forEach((option) => {
                results.append(item(option.name, () => {
                    value.val(option.id);
                    text.val(option.name);
                    close();

                    if (type === 'course') {
                        $('#autograder-filter-activity, #autograder-filter-activity-text').val('');
                    }

                    changed();
                }));
            });

            if (response.options.length === 0) {
                results.append($('<span class="list-group-item text-muted">').text(form.data('nomatches')));
            }

            return null;
        }).catch(() => {
            if (mine === ticket) {
                close();
            }
        });
    };

    text.on('focus', () => {
        text.select();
        search('');
    });

    text.on('input', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => search(String(text.val()).trim()), TYPING_DELAY);
    });

    $(document).on('pointerdown', (event) => {
        if (!picker.get(0).contains(event.target)) {
            close();
            // What was typed and not chosen goes back to what is chosen.
            text.val(value.val() ? text.val() : '');
        }
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
    const panel = $(PANEL);
    const toggle = $('#autograder-filters-toggle');
    let timer = null;

    readStatus();

    const changed = () => {
        syncStatus();
        onChange(collectFilters());
    };

    form.on('submit', (event) => {
        event.preventDefault();
    });
    form.on('autograder:filters', changed);

    const open = (show) => {
        panel.toggleClass('show', show);
        toggle.attr('aria-expanded', show ? 'true' : 'false');
    };

    toggle.on('click', () => open(!panel.hasClass('show')));

    $(document).on('pointerdown', (event) => {
        if (panel.hasClass('show') && !$('#autograder-filters').get(0).contains(event.target)) {
            open(false);
        }
    });

    $(document).on('keydown', (event) => {
        if (event.key === 'Escape' && panel.hasClass('show')) {
            open(false);
            toggle.trigger('focus');
        }
    });

    $('#searchname').on('input', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(changed, TYPING_DELAY);
    });

    panel.on('change', 'input[type="checkbox"], select, input[type="date"]', changed);

    panel.on('click', '[data-preset]', function() {
        const [from, to] = presets()[this.getAttribute('data-preset')];

        $('#grading_date_from').val(from);
        $('#grading_date_to').val(to);
        changed();
    });

    panel.find('[data-picker]').each(function() {
        initPicker($(this), changed);
    });

    $('#autograder-filter-clear').on('click', () => {
        $('#searchname, #grading_date_from, #grading_date_to, #status').val('');
        panel.find('input[type="checkbox"]').prop('checked', false);
        $('#autograder-filter-course, #autograder-filter-activity').val('');
        $('#autograder-filter-course-text, #autograder-filter-activity-text').val('');
        $('#autograder-filter-group').prop('selectedIndex', 0);
        renderApplied(0);
        onClear();
    });
};
