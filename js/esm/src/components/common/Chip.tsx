/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The button of a filter in the bar: a pill with the name of the filter or what it is set to, an arrow, and a button that clears
 * it once it is on. Its panel hangs from it.
 *
 * @module     report_autograder/components/common/Chip
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useRef, useState, type ReactNode} from 'react';
import {IconChevron, IconClose} from './Icons';
import Floating from './Floating';

interface ChipProps {
    /** The icon at the start of the pill. */
    icon: ReactNode;
    /** Name of the filter. */
    label: string;
    /** What the filter is set to; empty while it is off. */
    value: string;
    /** Clears the filter. */
    onClear: () => void;
    clearLabel: string;
    /** Minimum width of the panel. */
    minWidth?: number;
    /** The panel; it gets the function that closes it. */
    children: (close: () => void) => ReactNode;
}

/**
 * The pill and its panel.
 *
 * @param props The icon, the name, the value, how to clear it and the panel.
 * @returns The pill, and the panel while it is open.
 */
export default function Chip({icon, label, value, onClear, clearLabel, minWidth = 240, children}: ChipProps) {
    const wrapper = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const on = value !== '';
    return <div ref={wrapper} className={`arp-chip${on ? ' arp-chip-on' : ''}${open ? ' arp-chip-open' : ''}`}>
        <button
            type="button"
            className="arp-chip-button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
        >
            <span className="arp-chip-icon">{icon}</span>
            <span className="arp-chip-text">{on ? value : label}</span>
            {!on && <span className="arp-chip-arrow"><IconChevron /></span>}
        </button>
        {on && <button type="button" className="arp-chip-clear" aria-label={clearLabel} onClick={onClear}>
            <IconClose />
        </button>}
        {open && <Floating anchor={wrapper} onClose={() => setOpen(false)} minWidth={minWidth} label={label}>
            {children(() => setOpen(false))}
        </Floating>}
    </div>;
}
