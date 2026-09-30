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
 * Data source for the course and activity pickers.
 *
 * @module     report_autograder/service/filter_datasource
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ajax from 'core/ajax';

/**
 * The data source behind the course and activity pickers.
 *
 * `core/form-autocomplete` takes the name of a module like this one and calls
 * its two functions to do the searching, instead of filtering over options
 * already in the page. Which is the whole point here: a site with a hundred
 * thousand courses cannot put its course list in a `<select>`.
 *
 * The picker element carries what the search needs as data attributes, so that
 * one module serves both pickers without either of them needing its own copy.
 */

/**
 * Reads the scope and kind of one picker off the element itself.
 *
 * @param {String} selector The selector form-autocomplete was enhanced with.
 * @returns {{type: String, cmid: Number, courseid: Number, filtercourseid: Number}}
 */
const contextOf = (selector) => {
    const element = document.querySelector(selector);

    if (!element) {
        return {type: 'course', cmid: 0, courseid: 0, filtercourseid: 0};
    }

    const courseFilter = document.querySelector('#autograder-filter-course');

    const declared = element.dataset.optiontype;

    return {
        type: ['activity', 'anycourse', 'course'].indexOf(declared) === -1 ? 'course' : declared,
        cmid: parseInt(element.dataset.scopecmid || 0, 10),
        courseid: parseInt(element.dataset.scopecourseid || 0, 10),
        // An activity search follows whatever course the reader already picked,
        // the same way the table does.
        filtercourseid: parseInt(courseFilter ? courseFilter.value || 0 : 0, 10),
    };
};

/**
 * Fetches the matches for what the reader typed.
 *
 * @param {String} selector The selector of the element being searched.
 * @param {String} query What the reader typed.
 * @param {Function} success Called with the raw response.
 * @param {Function} failure Called with the error.
 * @returns {Promise}
 */
export const transport = (selector, query, success, failure) => {
    return searchOptions(selector, query).then(success).catch(failure);
};

/**
 * The matches for what the reader typed, as the service returns them.
 *
 * The searchable chips (ui/searchable_select) call this directly; transport()
 * above is the same thing wrapped in the callback shape form-autocomplete
 * expects.
 *
 * @param {String} selector The element being searched.
 * @param {String} query What the reader typed.
 * @returns {Promise<{options: Array, hasmore: Boolean}>}
 */
export const searchOptions = (selector, query) => {
    const context = contextOf(selector);

    return ajax.call([{
        methodname: 'report_autograder_search_filter_options',
        args: {
            type: context.type,
            query: query || '',
            cmid: context.cmid,
            courseid: context.courseid,
            filtercourseid: context.type === 'activity' ? context.filtercourseid : 0,
        },
    }])[0];
};

/**
 * Turns the response into the shape form-autocomplete expects.
 *
 * @param {String} selector Unused; part of the interface.
 * @param {{options: Array}} results What the service returned.
 * @returns {Array<{value: Number, label: String}>}
 */
export const processResults = (selector, results) => {
    if (!results || !Array.isArray(results.options)) {
        return [];
    }

    return results.options.map((option) => ({
        value: option.id,
        label: option.name,
    }));
};
