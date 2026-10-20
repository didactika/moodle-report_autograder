/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A panel that floats next to the element that opened it, under it or over it where there is more room, and follows it while the
 * page scrolls. It closes with Escape and when something outside it is pressed.
 *
 * @module     report_autograder/components/common/Floating
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import {useFollowAnchor} from '../../hooks/useFollowAnchor';

const GAP = 6;
const MARGIN = 12;

interface FloatingProps {
    /** The element that the panel hangs from. */
    anchor: RefObject<HTMLElement | null>;
    /** Closes the panel. */
    onClose: () => void;
    /** Minimum width of the panel, in pixels; it is as wide as the anchor when that is more. */
    minWidth?: number;
    /** Where the panel lines up with the anchor. */
    align?: 'start' | 'end';
    className?: string;
    /** The label of the panel for people who use a screen reader. */
    label: string;
    children: ReactNode;
}

/**
 * The panel.
 *
 * @param props The anchor, how to close, how it lines up and what is inside.
 * @returns The panel, drawn at the end of the page.
 */
export default function Floating({anchor, onClose, minWidth = 220, align = 'start', className, label, children}: FloatingProps) {
    const panel = useRef<HTMLDivElement>(null);
    const [place, setPlace] = useState<CSSProperties>({visibility: 'hidden'});

    const follow = (): void => {
        const element = anchor.current;
        if (!element) {
            return;
        }
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
            onClose();
            return;
        }
        const width = Math.min(Math.max(rect.width, minWidth), window.innerWidth - 2 * MARGIN);
        const wanted = align === 'end' ? rect.right - width : rect.left;
        const left = Math.max(MARGIN, Math.min(wanted, window.innerWidth - width - MARGIN));
        const below = window.innerHeight - rect.bottom - MARGIN;
        const above = rect.top - MARGIN;
        if (below >= 240 || below >= above) {
            setPlace({left, minWidth: width, top: rect.bottom + GAP, maxHeight: Math.max(160, below - GAP)});
        } else {
            setPlace({left, minWidth: width, bottom: window.innerHeight - rect.top + GAP, maxHeight: Math.max(160, above - GAP)});
        }
    };

    useLayoutEffect(follow, []);
    useFollowAnchor(true, follow, () => panel.current);

    useEffect(() => {
        const outside = (event: PointerEvent): void => {
            const target = event.target as Node;
            if (!panel.current?.contains(target) && !anchor.current?.contains(target)) {
                onClose();
            }
        };
        const keys = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
                anchor.current?.focus();
            }
        };
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('keydown', keys, true);
        return () => {
            document.removeEventListener('pointerdown', outside, true);
            document.removeEventListener('keydown', keys, true);
        };
    }, []);

    return createPortal(
        <div ref={panel} className={`arp-floating${className ? ` ${className}` : ''}`} style={place} role="dialog" aria-label={label}>
            {children}
        </div>,
        document.body
    );
}
