/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The status filter: the states that the viewer may filter by, as options that can be switched on together.
 *
 * @module     report_autograder/components/StatusFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Chip from './common/Chip';
import {IconCheck} from './common/Icons';
import type {StatusOption, Text} from '../types';

interface StatusFilterProps {
    options: StatusOption[];
    chosen: string[];
    text: Text;
    onChange: (chosen: string[]) => void;
}

/**
 * The status filter.
 *
 * @param props The states that can be chosen, the ones that are, and what to do when they change.
 * @returns The filter.
 */
export default function StatusFilter({options, chosen, text, onChange}: StatusFilterProps) {
    const labelOf = (key: string): string => options.find((option) => option.key === key)?.label ?? key;
    let value = '';
    if (chosen.length === 1) {
        value = labelOf(chosen[0]);
    } else if (chosen.length > 1) {
        value = text('filter_status_count', chosen.length);
    }
    const toggle = (key: string): void => {
        onChange(chosen.includes(key) ? chosen.filter((item) => item !== key) : [...chosen, key]);
    };
    return <Chip
        icon={<span className={`arp-dot arp-dot-${chosen.length === 1 ? chosen[0] : 'any'}`} />}
        label={text('filter_status')}
        value={value}
        clearLabel={text('filter_clear')}
        onClear={() => onChange([])}
        minWidth={230}
    >
        {() => <ul className="arp-options" role="listbox" aria-multiselectable="true" aria-label={text('filter_status')}>
            {options.map((option) => {
                const on = chosen.includes(option.key);
                return <li key={option.key} role="option" aria-selected={on}>
                    <button type="button" className={`arp-option${on ? ' arp-option-on' : ''}`} onClick={() => toggle(option.key)}>
                        <span className={`arp-dot arp-dot-${option.key}`} />
                        <span className="arp-option-label">{option.label}</span>
                        {on && <span className="arp-option-check"><IconCheck /></span>}
                    </button>
                </li>;
            })}
        </ul>}
    </Chip>;
}
