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
 * The course picker on the graders page.
 *
 * @module     report_autograder/ui/graders
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import { init as initSearchableSelects } from './searchable_select';

/**
 * The course picker on the graders page.
 *
 * A searchable chip rather than a list: the page is site-level, so its choices
 * are every course on the campus and there can be a hundred thousand of them.
 * The same chip the report's own filter bar uses, searching through the same
 * service — asked here for any course rather than only the autograded ones.
 *
 * @param {String} emptyText Shown when a search matches nothing.
 * @param {String} loadingText Shown while a search is in flight.
 * @param {String} clearLabel The label of the clear button.
 */
export const init = (emptyText, loadingText, clearLabel) => {
    const select = $('#graders-courseid');

    if (!select.length) {
        return;
    }

    // Choosing is the whole interaction, so it applies itself rather than
    // waiting for the button — which stays for anyone without JavaScript.
    select.on('change', () => {
        if (select.val()) {
            $('#graders-form').trigger('submit');
        }
    });

    // The page-size chooser is a plain select in a plain GET form: changing it
    // is the whole interaction, so it applies itself the way the report's own
    // does, rather than waiting for a button nobody would look for.
    const perpage = $('#graders-perpage');

    if (perpage.length) {
        perpage.on('change', () => perpage.closest('form').trigger('submit'));
    }

    initSearchableSelects(['#graders-courseid'], emptyText, loadingText, clearLabel);
};
