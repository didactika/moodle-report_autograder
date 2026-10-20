/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The grading date filter: ranges that can be chosen with one press, and two date fields for any other range. The fields are the
 * date inputs of the browser, so the calendar is the one of the person's own system and no library ships with the plugin.
 *
 * @module     report_autograder/components/DateFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useMemo} from 'react';
import Chip from './common/Chip';
import {IconCalendar} from './common/Icons';
import {datePresets} from '../lib/filters';
import type {Text} from '../types';

interface DateFilterProps {
    from: string;
    to: string;
    text: Text;
    onChange: (from: string, to: string) => void;
}

/**
 * What the pill says for a range.
 *
 * @param from First day, or empty.
 * @param to Last day, or empty.
 * @param text Looks a text up.
 * @returns The words, or an empty text while no range is on.
 */
const describe = (from: string, to: string, text: Text): string => {
    if (from !== '' && to !== '') {
        return from === to ? from : text('filter_date_range', {from, to});
    }
    if (from !== '') {
        return text('filter_date_since', from);
    }
    return to === '' ? '' : text('filter_date_until', to);
};

/**
 * The date filter.
 *
 * @param props The range that is chosen, how to look texts up and what to do when it changes.
 * @returns The filter.
 */
export default function DateFilter({from, to, text, onChange}: DateFilterProps) {
    const presets = useMemo(() => datePresets(new Date()), []);
    return <Chip
        icon={<IconCalendar />}
        label={text('filter_grading_date')}
        value={describe(from, to, text)}
        clearLabel={text('filter_clear')}
        onClear={() => onChange('', '')}
        minWidth={280}
    >
        {(close) => <div className="arp-dates">
            <ul className="arp-presets">
                {presets.map((preset) => <li key={preset.key}>
                    <button
                        type="button"
                        className={`arp-preset${preset.from === from && preset.to === to ? ' arp-preset-on' : ''}`}
                        onClick={() => {
                            onChange(preset.from, preset.to);
                            close();
                        }}
                    >
                        {text(`filter_date_${preset.key}`)}
                    </button>
                </li>)}
            </ul>
            <div className="arp-date-fields">
                <label className="arp-date-field">
                    <span>{text('datepicker_from')}</span>
                    <input type="date" value={from} max={to || undefined} onChange={(event) => onChange(event.target.value, to)} />
                </label>
                <label className="arp-date-field">
                    <span>{text('datepicker_to')}</span>
                    <input type="date" value={to} min={from || undefined} onChange={(event) => onChange(from, event.target.value)} />
                </label>
            </div>
        </div>}
    </Chip>;
}
