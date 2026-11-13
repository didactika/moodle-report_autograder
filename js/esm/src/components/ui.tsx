/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pieces the screens of the report are made of, drawn with the classes of Bootstrap, Moodle and the Didactika design system, as
 * the plugin Delegate account draws its lists: the icon, the search, the menu with the shape of a select, the sortable header, the
 * pager, the explanation that opens on a button and what a list says when it has nothing.
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
 * The search of a list: the magnifier inside the field.
 *
 * @param props The text, what to do when it changes and the labels.
 * @returns The search.
 */
export function SearchBox({value, onChange, label, text}: {value: string; onChange: (value: string) => void; label: string; text: Text}) {
    const id = useId();
    return <div className="dd-searchbox" role="search">
        <Icon name="a/search" text={text} />
        <label className="visually-hidden" htmlFor={id}>{label}</label>
        <input
            className="form-control"
            type="search"
            id={id}
            value={value}
            placeholder={label}
            autoComplete="off"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        />
    </div>;
}

/**
 * A menu with the shape of a select: a button that says what is chosen and, under it, whatever the menu holds.
 *
 * @param props What the button says, whether something is chosen, how the menu lines up and what it holds.
 * @returns The button and, while it is open, the menu.
 */
export function Menu({button, label, active = false, small = false, place = '', children}: {
    button: ReactNode;
    label: string;
    active?: boolean;
    small?: boolean;
    place?: '' | 'end' | 'up';
    children: (close: () => void) => ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLSpanElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
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
                toggle.current?.focus();
            }
        };
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('keydown', keys, true);
        return () => {
            document.removeEventListener('pointerdown', outside, true);
            document.removeEventListener('keydown', keys, true);
        };
    }, [open]);

    return <span className={`dd-menu${place ? ` dd-menu-${place}` : ''}`} ref={root}>
        <button
            ref={toggle}
            type="button"
            className={`form-select dd-select${small ? ' form-select-sm' : ''}${active ? ' border-primary' : ''}`}
            aria-label={label}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            onClick={() => setOpen(!open)}
        >{button}</button>
        {open && <div id={id} className="dd-select-menu" role="group" aria-label={label}>
            {children(() => {
                setOpen(false);
                toggle.current?.focus();
            })}
        </div>}
    </span>;
}

/**
 * A menu that chooses one option among a few.
 *
 * @param props The options, the one chosen and what to do when another is.
 * @returns The menu.
 */
export function SelectMenu({options, value, label, small = false, place = '', active = false, onChange}: {
    options: {value: string; label: string}[];
    value: string;
    label: string;
    small?: boolean;
    place?: '' | 'end' | 'up';
    active?: boolean;
    onChange: (value: string) => void;
}) {
    const chosen = options.find((option) => option.value === value);
    return <Menu button={chosen?.label ?? label} label={label} small={small} place={place} active={active}>
        {(close) => options.map((option) => <button
            key={option.value}
            type="button"
            role="option"
            className="dropdown-item"
            aria-selected={option.value === value}
            onClick={() => {
                close();
                if (option.value !== value) {
                    onChange(option.value);
                }
            }}
        >{option.label}</button>)}
    </Menu>;
}

/**
 * The header of a column that can be sorted.
 *
 * @param props The label, the sort now and what to do when it is pressed.
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
        <button type="button" className="table-sort" title={help} onClick={onSort}>{label}</button>
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
    return <div className="table-foot">
        <div className="dd-pager">
            <div className="dd-pager-size">
                <span>{text('pagination:results_per_page')}</span>
                <SelectMenu
                    small
                    place="up"
                    label={text('pagination:results_per_page')}
                    value={String(perpage)}
                    options={sizes.map((size) => ({value: String(size), label: String(size)}))}
                    onChange={(size) => onChange({perpage: Number(size), page: 0})}
                />
            </div>
            <div className="dd-pager-end">
                <span className="dd-pager-range" role="status">{text('pagination:range', {from, to, total})}</span>
                <div className="dd-pager-arrows">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm btn-icon"
                        disabled={disabled || page === 0}
                        title={text('pagination:previous')}
                        aria-label={text('pagination:previous')}
                        onClick={() => onChange({page: page - 1})}
                    >
                        <Icon name="i/previous" text={text} />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm btn-icon"
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
 * @param props The explanation, the label of the button, its icon and its colour.
 * @returns The button and, once pressed, the explanation.
 */
export function Hint({message, label, icon, tone = 'info', text}: {message: string; label: string; icon: string; tone?: string; text: Text}) {
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
        <button
            type="button"
            className={`btn btn-link btn-icon btn-sm btn-hint text-${tone}`}
            title={label}
            aria-label={label}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
        >
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
    return <div className="dd-empty" role="status">
        <p className="dd-empty-text">{message}</p>
        {action && onAction && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onAction}>{action}</button>}
    </div>;
}
