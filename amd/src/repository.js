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
 * A javascript module to retrieve autograder from the server.
 *
 * @module block_recent_novelties/repository
 * @copyright  2022 Michael Alejandro
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';
import * as Constants from 'report_autograder/constants';

/**
 *
 * @param {object}  args
 * @returns {object}
 */
export  const saveGrade = async (args) => {
    try {
        let methodSelected = Constants.MAP_METHOD[args.module];
        let payload = {...methodSelected.additional_data_default};
        for (const [key, value] of Object.entries(args)) {
            if ( !methodSelected.mapped.hasOwnProperty(key)) {
                continue;
            }
            let mappedKey = methodSelected.mapped[key];
            payload[mappedKey.key] = `${mappedKey.concat_value || ''}`+ value;
        }
        return await executeRequest(methodSelected.method, payload);
    }catch (error){
        return error;
    }

};

/**
 *
 * @param {string} method
 * @param {object} args
 * @returns {object}
 */
const executeRequest = async (method, args) => {
    const request = {
        methodname: method,
        args: args
    };
    return await Ajax.call([request])[0];
};

