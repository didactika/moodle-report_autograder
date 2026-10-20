/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A small icon that opens a short explanation when it is pressed, for the dates, the grades and the graders that need one.
 *
 * @module     report_autograder/components/common/Hint
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useRef, useState, type ReactNode} from 'react';
import Floating from './Floating';

interface HintProps {
    /** The explanation. */
    text: string;
    /** What the button is called for people who use a screen reader. */
    label: string;
    /** The icon that opens it. */
    icon: ReactNode;
    className?: string;
}

/**
 * The icon and its explanation.
 *
 * @param props The explanation, the label of the button and its icon.
 * @returns The button, and the explanation while it is open.
 */
export default function Hint({text, label, icon, className}: HintProps) {
    const button = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return <>
        <button
            ref={button}
            type="button"
            className={`arp-hint${className ? ` ${className}` : ''}`}
            aria-label={label}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
        >
            {icon}
        </button>
        {open && <Floating anchor={button} onClose={() => setOpen(false)} minWidth={200} className="arp-hint-panel" label={label}>
            <p className="arp-hint-text">{text}</p>
        </Floating>}
    </>;
}
