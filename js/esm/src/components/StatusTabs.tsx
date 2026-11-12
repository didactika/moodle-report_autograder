/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The statuses of the report as chips with the number of students in each: one press narrows the report to a status, another
 * lifts it. The numbers are counted inside every other filter, so they say what the report would show.
 *
 * @module     report_autograder/components/StatusTabs
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {StatusCount, StatusOption, Text} from '../types';

interface StatusTabsProps {
    options: StatusOption[];
    counts: StatusCount[];
    chosen: string[];
    total: number;
    text: Text;
    onChange: (chosen: string[]) => void;
}

/**
 * The chips of the statuses.
 *
 * @param props The statuses, how many students each has, the ones that are chosen and what to do when they change.
 * @returns The chips, or nothing while the numbers are not known.
 */
export default function StatusTabs({options, counts, chosen, total, text, onChange}: StatusTabsProps) {
    if (counts.length === 0) {
        return null;
    }
    const all = counts.reduce((sum, item) => sum + item.count, 0);
    const shown = (counts.length > 0 ? counts : options.map((option) => ({...option, count: 0})))
        .filter((item) => item.count > 0 || chosen.includes(item.key));

    return <div className="arp-statuses" role="group" aria-label={text('filter_status')}>
        <button
            type="button"
            className={`arp-status${chosen.length === 0 ? ' arp-status-on' : ''}`}
            aria-pressed={chosen.length === 0}
            onClick={() => onChange([])}
        >
            {text('status_all')} <span className="arp-status-count">{chosen.length === 0 && total > 0 ? total : all}</span>
        </button>
        {shown.map((item) => {
            const on = chosen.includes(item.key);
            return <button
                key={item.key}
                type="button"
                className={`arp-status${on ? ' arp-status-on' : ''}`}
                aria-pressed={on}
                onClick={() => onChange(on ? [] : [item.key])}
            >
                <span className={`arp-dot arp-dot-${item.key}`} />
                {item.label} <span className="arp-status-count">{item.count}</span>
            </button>;
        })}
    </div>;
}
