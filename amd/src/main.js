// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript to initialise.
 *
 * @copyright  2022 Michael Alejandro
 * @license    http://www.gnuobject.org/copyleft/gpl.html GNU GPL v3 or later
 */
import * as Repository from 'report_autograder/repository';
import $ from 'jquery';
import * as Helpers from 'report_autograder/helpers';
import * as Str from 'core/str';


/**
 * Initialise
 *
 * @param {object} root The root element for the recent novelties block.
 * @param {object} config configuration of moodle.
 */
export const init = (root,config) => {

    $('.number').on('keydown',event=>{
         let pattern = new RegExp(`^[0-9|${config.separator_decimals}]+$`);
         const keyCodesPermitted = [13,8,37,39,36,40,35];
         const input = event.target;
         if (!pattern.test(event.key) && !keyCodesPermitted.includes(event.keyCode) ||
             (event.key === config.separator_decimals && input.value.indexOf(config.separator_decimals) !== -1)) {
             event.preventDefault();
         }
    });

    $(root).on('submit', '.form-grade', async function (event) {
        event.preventDefault();
        let form = $(this);
        let loading = form.find('.loading');
        let textDescriptionAction = form.find('.text-action-description');
        let successIcon = form.find('.success-icon');
        let inputGrade = form.find('input[name="grade"]');

        try{
            let grade = Helpers.getValueInputByForm(form, 'grade');
            //reset components
            inputGrade.removeClass('is-invalid');
            textDescriptionAction.hide();
            inputGrade.attr('data-original-title',null);
            //
            if (!grade || (grade && grade.length === 0) || grade === config.separator_decimals ) {
                throw new Error(await Str.get_string('grade_required', 'report_autograder'));
            }

            let args = {
                userid: Helpers.getValueInputByForm(form, 'userid'),
                context_id: Helpers.getValueInputByForm(form, 'context_id'),
                course_id: Helpers.getValueInputByForm(form, 'course_id'),
                modid: Helpers.getValueInputByForm(form, 'modid'),
                module: Helpers.getValueInputByForm(form, 'module'),
                component: 'mod_' + Helpers.getValueInputByForm(form, 'module'),
                "grade": grade
            };
            loading.show();
            inputGrade.attr('disabled',true);
            let result = await Repository.saveGrade(args);
            inputGrade.removeAttr('disabled');
            loading.hide();
            if (result && result.hasOwnProperty('message')) {
                throw new Error(result.message);
            }
            inputGrade.val(Helpers.format_number(grade,config.points_decimals,config.separator_decimals));
            successIcon.show();
            setTimeout(() => {
                successIcon.hide();
                textDescriptionAction.show();
                location.reload();
            }, 1000);

        }catch (error){
            inputGrade.addClass('is-invalid');
            inputGrade.attr('data-original-title',error.message);
            textDescriptionAction.show();
        }
    });
};


