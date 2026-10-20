/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The group filter, for the reports where groups are in play: the groups that the viewer may see, and all of them when the viewer
 * may.
 *
 * @module     report_autograder/components/GroupFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Chip from './common/Chip';
import {IconCheck, IconGroup} from './common/Icons';
import type {Option, Text} from '../types';

interface GroupFilterProps {
    groups: Option[];
    /** Whether the filter may be left on every group. */
    offersAll: boolean;
    chosen: number;
    text: Text;
    onChange: (groupid: number) => void;
}

/**
 * The group filter.
 *
 * @param props The groups, whether all of them can be chosen, the one that is chosen and what to do when it changes.
 * @returns The filter.
 */
export default function GroupFilter({groups, offersAll, chosen, text, onChange}: GroupFilterProps) {
    const current = groups.find((group) => group.id === chosen);
    // A viewer who may not see every group is always on one of them, so the pill shows it and has nothing to clear.
    const value = current && (offersAll || groups.length > 1) ? current.name : '';
    const entries: Option[] = offersAll ? [{id: 0, name: text('filter_group_placeholder')}, ...groups] : groups;
    return <Chip
        icon={<IconGroup />}
        label={offersAll ? text('filter_group') : (current?.name ?? text('filter_group'))}
        value={value}
        clearLabel={text('filter_clear')}
        onClear={() => onChange(0)}
        minWidth={220}
    >
        {(close) => <ul className="arp-options" role="listbox" aria-label={text('filter_group')}>
            {entries.map((group) => {
                const on = group.id === chosen;
                return <li key={group.id} role="option" aria-selected={on}>
                    <button
                        type="button"
                        className={`arp-option${on ? ' arp-option-on' : ''}`}
                        onClick={() => {
                            onChange(group.id);
                            close();
                        }}
                    >
                        <span className="arp-option-label">{group.name}</span>
                        {on && <span className="arp-option-check"><IconCheck /></span>}
                    </button>
                </li>;
            })}
        </ul>}
    </Chip>;
}
