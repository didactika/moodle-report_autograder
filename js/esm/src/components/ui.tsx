/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pieces the screens of the report are made of, written with the classes of Bootstrap and Moodle: the icon, the search, the
 * Filters button with its panel, the sortable header, the pager and the hint. What makes them look as the design system draws them
 * is in the styles, as overrides of those classes inside the report; a theme restyles them by restyling Bootstrap.
 *
 * @module     report_autograder/components/ui
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useId, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {pageRange} from '../lib/paging';
import type {Text} from '../types';

/**
 * A Moodle icon, drawn by the server with the icon map of the theme.
 *
 * @param props The icon id and the texts of the page, where the server put the icon.
 * @returns The icon.
 */
export function Icon({name, text}: {name: string; text: Text}) {
    return <span className="d-inline-flex" aria-hidden="true" dangerouslySetInnerHTML={{__html: text(`pix:${name}`)}} />;
}

/**
 * The search box: the magnifier inside the field.
 *
 * @param props The text, what to do when it changes and the labels.
 * @returns The search.
 */
export function SearchBox({value, onChange, label, text}: {value: string; onChange: (value: string) => void; label: string; text: Text}) {
    const id = useId();
    return <div className="input-group" role="search">
        <span className="input-group-text"><Icon name="a/search" text={text} /></span>
        <label className="visually-hidden sr-only" htmlFor={id}>{label}</label>
        <input
            className="form-control"
            type="search"
            id={id}
            value={value}
            placeholder={`${label}…`}
            autoComplete="off"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        />
    </div>;
}

/**
 * The Filters button and the panel it opens, with the number of filters applied on the button.
 *
 * @param props The label, how many filters are applied and the panel.
 * @returns The button and the panel.
 */
export function FiltersMenu({label, applied, text, children}: {label: string; applied: number; text: Text; children: ReactNode}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const outside = (event: PointerEvent): void => {
            if (!root.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const keys = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('keydown', keys, true);
        return () => {
            document.removeEventListener('pointerdown', outside, true);
            document.removeEventListener('keydown', keys, true);
        };
    }, [open]);

    return <div className="dropdown" ref={root}>
        <button
            type="button"
            className={`btn btn-outline-secondary dropdown-toggle${applied > 0 ? ' active' : ''}`}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
        >
            <Icon name="i/filter" text={text} />
            <span>{label}</span>
            {applied > 0 && <span className="badge badge-primary bg-primary rounded-pill">{applied}</span>}
        </button>
        <div id={id} className={`dropdown-menu${open ? ' show' : ''}`} role="group" aria-label={label}>
            {children}
        </div>
    </div>;
}

/**
 * The header of a column that can be sorted.
 *
 * @param props The column, its label, the sort now and what to do when it is pressed.
 * @returns The header.
 */
export function SortHeader({label, help, active, direction, onSort}: {
    label: string;
    help: string;
    active: boolean;
    direction: 'asc' | 'desc';
    onSort: () => void;
}) {
    let ariaSort: 'ascending' | 'descending' | undefined;
    if (active) {
        ariaSort = direction === 'asc' ? 'ascending' : 'descending';
    }
    return <th scope="col" aria-sort={ariaSort}>
        <button type="button" className="table-sort" aria-label={help} onClick={onSort}>{label}</button>
    </th>;
}

/**
 * The foot of a list: the size of the page, the rows shown and the arrows.
 *
 * @param props The page, how many per page, the total and what to do.
 * @returns The foot.
 */
export function Pager({page, perpage, total, sizes, disabled, text, onChange}: {
    page: number;
    perpage: number;
    total: number;
    sizes: number[];
    disabled?: boolean;
    text: Text;
    onChange: (changes: {page?: number; perpage?: number}) => void;
}) {
    const {from, to} = pageRange(page, perpage, total);
    const id = useId();
    return <div className="table-foot">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 text-muted small">
            <div className="d-none d-sm-flex align-items-center gap-2">
                <label htmlFor={id}>{text('pagination:results_per_page')}</label>
                <select
                    id={id}
                    className="form-select custom-select custom-select-sm form-select-sm w-auto"
                    value={perpage}
                    onChange={(event) => onChange({perpage: Number(event.target.value), page: 0})}
                >
                    {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="text-body" role="status">
                    {text('pagination:showing', {from, to, total})}
                </span>
                <div className="btn-group" role="group" aria-label={text('pagination:label')}>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={disabled || page === 0}
                        title={text('pagination:previous')}
                        aria-label={text('pagination:previous')}
                        onClick={() => onChange({page: page - 1})}
                    >
                        <Icon name="i/previous" text={text} />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={disabled || to >= total}
                        title={text('pagination:next')}
                        aria-label={text('pagination:next')}
                        onClick={() => onChange({page: page + 1})}
                    >
                        <Icon name="i/next" text={text} />
                    </button>
                </div>
            </div>
        </div>
    </div>;
}

/**
 * A short explanation that opens on a button, as a popover of Bootstrap.
 *
 * @param props The text, the label of the button and its icon.
 * @returns The button and, once pressed, the explanation.
 */
export function Hint({message, label, icon, text}: {message: string; label: string; icon: string; text: Text}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const outside = (event: PointerEvent): void => {
            if (!root.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', outside, true);
        return () => document.removeEventListener('pointerdown', outside, true);
    }, [open]);

    return <span className="position-relative d-inline-block" ref={root}>
        <button type="button" className="btn btn-link btn-sm p-0" aria-label={label} aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={icon} text={text} />
        </button>
        {open && <div className="popover show bs-popover-bottom" role="dialog" aria-label={label}>
            <div className="popover-body">{message}</div>
        </div>}
    </span>;
}

/**
 * What a list says when it has nothing to show or could not load.
 *
 * @param props The message and, when something can be done, its button.
 * @returns The state.
 */
export function Empty({message, action, onAction}: {message: string; action?: string; onAction?: () => void}) {
    return <div className="text-center text-muted p-5" role="status">
        <p>{message}</p>
        {action && onAction && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onAction}>{action}</button>}
    </div>;
}
