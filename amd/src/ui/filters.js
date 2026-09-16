import $ from 'jquery';
import * as Autocomplete from 'core/form-autocomplete';

const FORMAT = 'YYYY-MM-DD';
const SEPARATOR = ' - ';

let debounceTimer = null;

const parseLang = () => {
  const rawLang = ((document.documentElement && document.documentElement.lang) ||
    (window.M && M.cfg && M.cfg.lang) ||
    'en').toLowerCase();

  return rawLang.split('-')[0].split('_')[0];
};

const getTexts = () => {
  const form = $('#autograder-filter-form');

  return {
    statusPlaceholder: form.data('status-placeholder') || 'Status...',
    gradingDate: form.data('grading-label') || 'Grading date',
    dpApply: form.data('dp-apply') || 'Apply',
    dpCancel: form.data('dp-cancel') || 'Clear',
    dpFrom: form.data('dp-from') || 'From',
    dpTo: form.data('dp-to') || 'To',
    dpCustom: form.data('dp-custom') || 'Custom',
    dpWeek: form.data('dp-week') || 'Wk'
  };
};

/**
 * The label of each status, read off the menu the server drew.
 *
 * Which statuses there are depends on the viewer — only somebody who may see
 * failures is offered "Failed" — so the list cannot be fixed here.
 *
 * @returns {Object<string, string>}
 */
const getStatusLabels = () => {
  const labels = {};

  $('#autograder-status-multiselect .autograder-status-label').each(function () {
    const input = $(this).closest('.dropdown-item').find('input[type="checkbox"]');

    if (input.length) {
      labels[input.val()] = $(this).text().trim();
    }
  });

  return labels;
};

const triggerFilterSubmit = () => {
  $('#autograder-filter-form').trigger('submit');
};

const debounceSubmit = (delay = 300) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerFilterSubmit();
  }, delay);
};

const syncSearchHidden = () => {
  const quickSearch = $('#autograder-quick-search-input').val() || '';
  $('#searchname').val(quickSearch.trim());
};

const syncStatusHidden = () => {
  const selectedValues = [];
  $('#autograder-status-multiselect input[type="checkbox"]:checked').each(function () {
    selectedValues.push($(this).val());
  });
  $('#status').val(selectedValues.join(','));
};

const renderStatusSelection = (texts, statusLabels) => {
  const selectedText = $('#selected-status-text');
  const selectionCount = $('#status-selection-count');
  const clearStatus = $('#clear-status');
  const chevron = $('#status-chevron');
  const toggle = $('#status-multiselect-toggle');
  const selectedValues = [];

  $('#autograder-status-multiselect input[type="checkbox"]:checked').each(function () {
    selectedValues.push($(this).val());
  });

  // Highlight dropdown items that are selected
  $('#autograder-status-multiselect .dropdown-item').each(function () {
    const cb = $(this).find('input[type="checkbox"]');
    $(this).toggleClass('autograder-filter-active', cb.prop('checked'));
  });

  if (!selectedValues.length) {
    selectedText.text(texts.statusPlaceholder);
    selectionCount.addClass('d-none').text('');
    clearStatus.addClass('d-none');
    chevron.removeClass('d-none');
    toggle.removeClass('autograder-filter-active');
    return;
  }

  selectedText.text(statusLabels[selectedValues[0]] || selectedValues[0]);

  if (selectedValues.length > 1) {
    selectionCount.text(' (+' + (selectedValues.length - 1) + ')').removeClass('d-none');
  } else {
    selectionCount.addClass('d-none').text('');
  }

  clearStatus.removeClass('d-none');
  chevron.addClass('d-none');
  toggle.addClass('autograder-filter-active');
};

const initStatusMultiselect = (texts, statusLabels) => {
  const wrapper = $('#autograder-status-multiselect');
  const toggle = $('#status-multiselect-toggle');
  const hiddenStatus = $('#status').val();

  if (!wrapper.length || !toggle.length) {
    return;
  }

  if (hiddenStatus) {
    const statuses = hiddenStatus.split(',');
    wrapper.find('input[type="checkbox"]').each(function () {
      if (statuses.indexOf($(this).val()) !== -1) {
        $(this).prop('checked', true);
      }
    });
  }

  toggle.off('click.autograder').on('click.autograder', function (e) {
    e.preventDefault();
    e.stopPropagation();
    wrapper.toggleClass('is-open');
    toggle.attr('aria-expanded', wrapper.hasClass('is-open') ? 'true' : 'false');
  });

  $('#clear-status').off('click.autograder').on('click.autograder', function (e) {
    e.preventDefault();
    e.stopPropagation();
    wrapper.find('input[type="checkbox"]').prop('checked', false);
    syncStatusHidden();
    renderStatusSelection(texts, statusLabels);
    toggle.trigger('focus');
    debounceSubmit(150);
  });

  wrapper.off('keydown.autograder').on('keydown.autograder', function (e) {
    if (e.key === 'Escape') {
      wrapper.removeClass('is-open');
      toggle.attr('aria-expanded', 'false').trigger('focus');
    }
  });

  wrapper.find('.autograder-status-menu').off('click.autograder').on('click.autograder', function (e) {
    e.stopPropagation();
  });

  wrapper.find('input[type="checkbox"]').off('change.autograder').on('change.autograder', function () {
    syncStatusHidden();
    renderStatusSelection(texts, statusLabels);
    debounceSubmit(150);
  });

  $(document).off('click.autograder.status').on('click.autograder.status', () => {
    wrapper.removeClass('is-open');
    toggle.attr('aria-expanded', 'false');
  });

  syncStatusHidden();
  renderStatusSelection(texts, statusLabels);
};

const renderDateChip = (fromValue, toValue, buttonId, clearBtnId, textSpanId, texts) => {
  const btn = $('#' + buttonId);
  const clearBtn = $('#' + clearBtnId);
  const textSpan = $('#' + textSpanId);
  const arrowBtn = $('#' + buttonId.replace('-button', '-arrow'));

  if (fromValue && toValue) {
    textSpan.text(fromValue + SEPARATOR + toValue);
    clearBtn.removeClass('d-none');
    arrowBtn.addClass('d-none');
    btn.addClass('autograder-filter-active autograder-chip-has-clear');
    return;
  }

  textSpan.text(texts.gradingDate);
  clearBtn.addClass('d-none');
  arrowBtn.removeClass('d-none');
  btn.removeClass('autograder-filter-active autograder-chip-has-clear');
};

const updatePickerTitle = (picker, titleText) => {
  if (!picker || !picker.container) {
    return;
  }

  const leftCalendar = picker.container.find('.drp-calendar.left');
  if (!leftCalendar.length) {
    return;
  }

  let titleNode = leftCalendar.find('.autograder-picker-title');
  if (!titleNode.length) {
    leftCalendar.prepend('<div class="autograder-picker-title"></div>');
    titleNode = leftCalendar.find('.autograder-picker-title');
  }

  titleNode.text(titleText || '');
};

const initDateChipInteraction = (buttonId, clearBtnId, inputId, fromId, toId, texts) => {
  const button = $('#' + buttonId);
  const clearBtn = $('#' + clearBtnId);
  const input = $('#' + inputId);
  const fromInput = $('#' + fromId);
  const toInput = $('#' + toId);

  button.off('click.autograder').on('click.autograder', function (e) {
    e.preventDefault();
    input.removeClass('d-none');
    input.focus();
    input.click();
  });

  clearBtn.off('click.autograder').on('click.autograder', function (e) {
    e.preventDefault();
    e.stopPropagation();
    fromInput.val('');
    toInput.val('');
    input.val('');
    input.addClass('d-none');
    const picker = input.data('daterangepicker');
    if (picker && typeof window.moment !== 'undefined') {
      const today = window.moment();
      picker.setStartDate(today);
      picker.setEndDate(today);
    }
    renderDateChip('', '', buttonId, clearBtnId, buttonId.replace('-button', '-text'), texts);
    button.trigger('focus');
    triggerFilterSubmit();
  });
};

/**
 * Turns the course and activity pickers into searchable ones.
 *
 * They are fetched from the server as the reader types rather than rendered
 * into the page: a site-wide report on a campus of a hundred thousand courses
 * cannot put its course list in a `<select>`, and its activity list is worse.
 *
 * The arguments of enhance() are positional — selector, tags, the ajax module,
 * placeholder, case sensitivity, and then *show suggestions*, which has to be
 * true or the field takes what is typed and never offers anything back.
 *
 * @returns {Promise}
 */
const initSearchablePickers = () => {
  const pickers = [
    ['#autograder-filter-course', 'filter_course_placeholder'],
    ['#autograder-filter-activity', 'filter_activity_placeholder'],
  ];

  return Promise.all(pickers.map(([selector, placeholderKey]) => {
    const element = $(selector);

    if (!element.length) {
      return Promise.resolve();
    }

    return Autocomplete.enhance(
      selector,
      false,
      'report_autograder/service/filter_datasource',
      element.data(placeholderKey.replace(/_/g, '-')) || element.data('placeholder') || '',
      false,
      true
    ).catch(() => {
      // An enhancement that fails leaves the plain select behind, which still
      // submits — worse to search with, but never a dead filter bar.
      return;
    });
  }));
};

const initTopFiltersAutoApply = () => {
  $('#autograder-quick-search-input').off('input.autograder').on('input.autograder', function () {
    syncSearchHidden();
    debounceSubmit(350);
  });
};

const loadScript = (src, forceGlobal) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="' + src + '"]')) {
      resolve();
      return;
    }

    let previousDefine = null;
    if (forceGlobal && typeof window.define === 'function' && window.define.amd) {
      previousDefine = window.define;
      window.define = undefined;
    }

    const restoreDefine = () => {
      if (previousDefine) {
        window.define = previousDefine;
      }
    };

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      restoreDefine();
      resolve();
    };
    script.onerror = () => {
      restoreDefine();
      reject();
    };
    document.head.appendChild(script);
  });
};

/**
 * Loads the calendar and the date library it needs, from the copies that ship
 * with this plugin. Their addresses come from the form, which the server built:
 * nothing here reaches out to the internet.
 *
 * Both are loaded as plain scripts with AMD hidden, because each would
 * otherwise register itself as an anonymous module and Moodle's loader only
 * accepts named ones. Their stylesheet is asked for by the page itself.
 *
 * @returns {Promise}
 */
const ensureDateRangeAssets = () => {
  const form = $('#autograder-filter-form');
  const momentUrl = form.data('moment-url');
  const pickerUrl = form.data('picker-url');

  if (!momentUrl || !pickerUrl) {
    return Promise.reject(new Error('The date filter has no libraries to load.'));
  }

  if (!window.jQuery) {
    window.jQuery = $;
  }

  if (!window.$) {
    window.$ = $;
  }

  return Promise.resolve()
    .then(() => {
      if (typeof window.moment === 'undefined') {
        return loadScript(momentUrl, true);
      }
      return Promise.resolve();
    })
    .then(() => {
      if (!$.fn.daterangepicker) {
        return loadScript(pickerUrl, true);
      }
      return Promise.resolve();
    });
};

const initRangePicker = (inputSelector, fromSelector, toSelector, buttonId, clearBtnId, textSpanId, texts, activeLang) => {
  const input = $(inputSelector);
  const fromInput = $(fromSelector);
  const toInput = $(toSelector);
  const pickerTitle = input.data('picker-title') || '';

  if (!input.length || !fromInput.length || !toInput.length || !$.fn.daterangepicker || typeof window.moment === 'undefined') {
    return;
  }

  window.moment.locale(activeLang);
  const localeData = window.moment.localeData();

  const options = {
    autoUpdateInput: false,
    linkedCalendars: false,
    opens: 'left',
    locale: {
      format: FORMAT,
      separator: SEPARATOR,
      applyLabel: texts.dpApply,
      cancelLabel: texts.dpCancel,
      fromLabel: texts.dpFrom,
      toLabel: texts.dpTo,
      customRangeLabel: texts.dpCustom,
      weekLabel: texts.dpWeek,
      daysOfWeek: localeData.weekdaysMin(),
      monthNames: localeData.months(),
      firstDay: localeData.firstDayOfWeek()
    }
  };

  if (fromInput.val() && toInput.val()) {
    options.startDate = window.moment(fromInput.val(), FORMAT);
    options.endDate = window.moment(toInput.val(), FORMAT);
    input.val(fromInput.val() + SEPARATOR + toInput.val());
  }

  input.daterangepicker(options);

  const picker = input.data('daterangepicker');
  if (picker && picker.container) {
    picker.container.addClass('autograder-single-calendar');
    picker.container.find('.drp-calendar.right').hide();
    updatePickerTitle(picker, pickerTitle);
  }

  input.off('show.daterangepicker').on('show.daterangepicker', (ev, currentPicker) => {
    $('#' + buttonId).closest('.autograder-date-field-wrapper').addClass('is-open');
    if (currentPicker && currentPicker.container) {
      currentPicker.container.addClass('autograder-single-calendar');
      currentPicker.container.find('.drp-calendar.right').hide();
      updatePickerTitle(currentPicker, pickerTitle);
    }
  });

  input.off('hide.daterangepicker').on('hide.daterangepicker', () => {
    $('#' + buttonId).closest('.autograder-date-field-wrapper').removeClass('is-open');
  });

  input.off('apply.daterangepicker').on('apply.daterangepicker', (ev, currentPicker) => {
    const start = currentPicker.startDate.format(FORMAT);
    const end = currentPicker.endDate.format(FORMAT);
    fromInput.val(start);
    toInput.val(end);
    input.val(start + SEPARATOR + end);
    input.addClass('d-none');
    renderDateChip(start, end, buttonId, clearBtnId, textSpanId, texts);
    triggerFilterSubmit();
  });

  input.off('cancel.daterangepicker').on('cancel.daterangepicker', (ev, currentPicker) => {
    fromInput.val('');
    toInput.val('');
    input.val('');
    input.addClass('d-none');
    if (currentPicker && typeof window.moment !== 'undefined') {
      const today = window.moment();
      currentPicker.setStartDate(today);
      currentPicker.setEndDate(today);
    }
    renderDateChip('', '', buttonId, clearBtnId, textSpanId, texts);
    triggerFilterSubmit();
  });
};

/**
 * @param {string} [presetStatus] A status the page was opened on, from a
 *        summary tile. It has to be applied after the inputs are cleared,
 *        or the clearing would throw it away.
 */
export const init = (presetStatus) => {
  const form = $('#autograder-filter-form');
  if (!form.length) {
    return;
  }

  const texts = getTexts();
  const activeLang = parseLang();
  const statusLabels = getStatusLabels();

  // Clear all filter inputs on load — prevents browser form restoration from
  // showing stale values that won't be applied to the current data fetch.
  $('#grading_date_from, #grading_date_to, #grading_date_range').val('');
  $('#status').val('');
  $('#autograder-status-multiselect input[type="checkbox"]').prop('checked', false);
  $('#autograder-quick-search-input, #searchname').val('');

  if (presetStatus) {
    $(`#autograder-status-multiselect input[type="checkbox"][value="${presetStatus}"]`)
      .prop('checked', true);
    $('#status').val(presetStatus);
  }

  initStatusMultiselect(texts, statusLabels);
  initSearchablePickers();
  initTopFiltersAutoApply();
  initDateChipInteraction('grading-date-button',
    'grading-date-clear',
    'grading_date_range',
    'grading_date_from',
    'grading_date_to',
    texts);
  syncSearchHidden();

  ensureDateRangeAssets().then(() => {
    initRangePicker(
      '#grading_date_range',
      '#grading_date_from',
      '#grading_date_to',
      'grading-date-button',
      'grading-date-clear',
      'grading-date-text',
      texts,
      activeLang
    );

    renderDateChip(
      $('#grading_date_from').val(),
      $('#grading_date_to').val(),
      'grading-date-button',
      'grading-date-clear',
      'grading-date-text',
      texts
    );
  }).catch(() => {
    return;
  });
};
