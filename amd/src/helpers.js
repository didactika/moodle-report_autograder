import $ from 'jquery';

/**
 *
 * @param {string} value
 * @returns {number|*}
 */
export const parseInteger = (value)=>{
    return parseInt(value) || value;
};

/**
 *
 * @param {object} form
 * @param {string} inputName
 * @returns {*|string|jQuery}
 */
export const getValueInputByForm = (form, inputName) => {
    return $(form.find(`input[name='${inputName}']`)).val();
};

/**
 *
 * @param {string}  value
 * @param {string}  decimalPoints
 * @param {string} separator
 * @returns {string}
 */
export const format_number = (value,decimalPoints,separator)=>{
    let formatDecimalMapping = {
        '.' : ",",
        ',' : ".",
    };
    value = parseFloat(value.replace(',','.')).toFixed(decimalPoints);
    return value.replace(formatDecimalMapping[separator],separator);
};