/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What is under a table: which rows are shown, the pages, and how many rows a page has.
 *
 * @module     report_autograder/components/Pagination
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {IconChevronLeft, IconChevronRight} from './common/Icons';
import {pageList} from '../lib/filters';
import type {Text} from '../types';

interface PaginationProps {
    /** The page now, counting from zero. */
    page: number;
    /** Rows on a page. */
    limit: number;
    /** Rows there are in all. */
    total: number;
    sizes: number[];
    /** The text that says which rows are shown. */
    showing: string;
    disabled: boolean;
    text: Text;
    onPage: (page: number) => void;
    onSize: (size: number) => void;
}

/**
 * The pagination.
 *
 * @param props Where the table is, how big its pages are and what to do when either changes.
 * @returns The pagination, or nothing when there are no rows.
 */
export default function Pagination({page, limit, total, sizes, showing, disabled, text, onPage, onSize}: PaginationProps) {
    if (total <= 0) {
        return null;
    }
    const pages = Math.max(1, Math.ceil(total / limit));
    const from = page * limit + 1;
    const to = Math.min(total, (page + 1) * limit);
    return <nav className="arp-pagination" aria-label={text('pagination:label')}>
        <p className="arp-pagination-showing">{showing || text('pagination:showing', {from, to, total})}</p>
        <label className="arp-pagination-size">
            <span>{text('pagination:results_per_page')}</span>
            <select value={limit} disabled={disabled} onChange={(event) => onSize(Number(event.target.value))}>
                {(sizes.includes(limit) ? sizes : [...sizes, limit].sort((a, b) => a - b)).map((size) => <option key={size} value={size}>
                    {size}
                </option>)}
            </select>
        </label>
        {pages > 1 && <ul className="arp-pages">
            <li>
                <button
                    type="button"
                    className="arp-page"
                    aria-label={text('pagination:previous')}
                    disabled={disabled || page === 0}
                    onClick={() => onPage(page - 1)}
                >
                    <IconChevronLeft />
                </button>
            </li>
            {pageList(page, pages).map((number, index) => <li key={`${number}-${index}`}>
                {number < 0 ? <span className="arp-page-gap" aria-hidden="true">…</span> : <button
                    type="button"
                    className={`arp-page${number === page ? ' arp-page-on' : ''}`}
                    aria-current={number === page ? 'page' : undefined}
                    aria-label={text('pagination:page', {page: number + 1, pages})}
                    disabled={disabled}
                    onClick={() => onPage(number)}
                >
                    {number + 1}
                </button>}
            </li>)}
            <li>
                <button
                    type="button"
                    className="arp-page"
                    aria-label={text('pagination:next')}
                    disabled={disabled || page + 1 >= pages}
                    onClick={() => onPage(page + 1)}
                >
                    <IconChevronRight />
                </button>
            </li>
        </ul>}
    </nav>;
}
