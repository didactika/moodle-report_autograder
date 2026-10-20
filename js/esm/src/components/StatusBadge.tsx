/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The badge of a status, and the reason of a failure next to it.
 *
 * @module     report_autograder/components/StatusBadge
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Hint from './common/Hint';
import {IconFailed} from './common/Icons';
import type {Row, Text} from '../types';

interface StatusBadgeProps {
    row: Row;
    text: Text;
}

/**
 * The badge.
 *
 * @param props The row and how to look texts up.
 * @returns The badge.
 */
export default function StatusBadge({row, text}: StatusBadgeProps) {
    return <span className="arp-status">
        <span className={`arp-badge arp-badge-${row.status_key}`}>
            <span className="arp-dot" />
            {row.status}
        </span>
        {row.failure_reason && <Hint text={row.failure_reason} label={text('info:failure')} icon={<IconFailed />} />}
    </span>;
}
