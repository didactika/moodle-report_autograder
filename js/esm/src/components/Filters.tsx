/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The filters of the report. Each one is a menu with the shape of a select, in one row beside the search: the status, with the number
 * of students in each; the course and the activity, which are searched as the reader types; the group; and the grading date. A menu
 * that narrows the report is tinted and says what it is narrowed to, so there is no second row of applied filters to read.
 *
 * Every filter answers at once, as the design system asks: the report behind the menu changes as each one is chosen.
 *
 * @module     report_autograder/components/Filters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {Icon, Menu} from './ui';
import {useDebounced} from '../hooks/useDebounced';
import {datePresets} from '../lib/filters';
import {searchOptions, type PickerType, type Scope} from '../services/api';
import type {Option, StatusCount, StatusOption, Text} from '../types';

/**
 * The statuses, with the students of each: several can be chosen.
 *
 * @param props The statuses, their counts, the ones chosen and what to do when they change.
 * @returns The menu.
 */
export function StatusMenu({statuses, counts, chosen, text, onChange}: {
    statuses: StatusOption[];
    counts: StatusCount[];
    chosen: string[];
    text: Text;
    onChange: (chosen: string[]) => void;
}) {
    const id = useId();
    const label = text('filter_status');
    const options = counts.length > 0 ? counts : statuses.map((status) => ({...status, count: -1}));
    let button = label;
    if (chosen.length === 1) {
        button = statuses.find((status) => status.key === chosen[0])?.label ?? chosen[0];
    } else if (chosen.length > 1) {
        button = `${label}: ${chosen.length}`;
    }

    return <Menu button={button} label={label} name="status" active={chosen.length > 0} text={text} onClear={() => onChange([])}>
        {() => options.map((option) => <label key={option.key} className="dropdown-item" htmlFor={`${id}-${option.key}`}>
            <input
                type="checkbox"
                className="form-check-input"
                id={`${id}-${option.key}`}
                checked={chosen.includes(option.key)}
                onChange={() => onChange(chosen.includes(option.key)
                    ? chosen.filter((key) => key !== option.key)
                    : [...chosen, option.key])}
            />
            <span>{option.label}</span>
            {option.count >= 0 && <span className="dd-chip-count">{option.count}</span>}
        </label>)}
    </Menu>;
}

interface Found {
    options: Option[];
    loading: boolean;
}

/**
 * The courses or the activities, searched in the server as the reader types.
 *
 * @param props What is searched, what is chosen and how the report is scoped.
 * @returns The menu.
 */
export function PickerMenu({type, label, chosen, scope, courseid, text, onPick}: {
    type: PickerType;
    label: string;
    chosen: Option | null;
    scope: Scope;
    courseid: number;
    text: Text;
    onPick: (option: Option | null) => void;
}) {
    return <Menu
        button={chosen ? chosen.name : label}
        label={label}
        name={type}
        active={chosen !== null}
        text={text}
        onClear={() => onPick(null)}
    >
        {(close) => <PickerList
            type={type}
            label={label}
            chosen={chosen}
            scope={scope}
            courseid={courseid}
            text={text}
            onPick={(option) => {
                close();
                onPick(option);
            }}
        />}
    </Menu>;
}

/**
 * What the menu of a picker holds: the field and the options it finds.
 *
 * @param props What is searched, what is chosen and what to do when an option is.
 * @returns The field and the options.
 */
const PickerList = ({type, label, chosen, scope, courseid, text, onPick}: {
    type: PickerType;
    label: string;
    chosen: Option | null;
    scope: Scope;
    courseid: number;
    text: Text;
    onPick: (option: Option | null) => void;
}) => {
    const field = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const typed = useDebounced(query.trim(), 250);
    const [found, setFound] = useState<Found>({options: [], loading: true});

    useEffect(() => {
        field.current?.focus();
    }, []);

    useEffect(() => {
        let current = true;
        setFound((before) => ({...before, loading: true}));
        searchOptions(type, typed, scope, courseid).then((response) => {
            if (current) {
                setFound({options: response.options, loading: false});
            }
        }).catch(() => {
            if (current) {
                setFound({options: [], loading: false});
            }
        });
        return () => {
            current = false;
        };
    }, [type, typed, courseid, scope.cmid, scope.courseid]);

    return <>
        <div className="dd-menu-form">
            <input
                ref={field}
                type="search"
                className="form-control form-control-sm"
                value={query}
                placeholder={text('search:typetosearch')}
                aria-label={label}
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
            />
        </div>
        {found.options.map((option) => <button
            key={option.id}
            type="button"
            role="option"
            className="dropdown-item"
            aria-selected={chosen?.id === option.id}
            onClick={() => onPick(option)}
        >{option.name}</button>)}
        {found.options.length === 0 && <span className="dropdown-item disabled" role="status">
            {found.loading ? text('search:loading') : text('search:nomatches')}
        </span>}
    </>;
};

/**
 * The grading date: a period among the usual ones, or the two days that bound it.
 *
 * @param props The period chosen and what to do when it changes.
 * @returns The menu.
 */
export function DateMenu({from, to, text, onChange}: {from: string; to: string; text: Text; onChange: (from: string, to: string) => void}) {
    const fromId = useId();
    const toId = useId();
    const label = text('filter_grading_date');
    const presets = datePresets(new Date());
    const preset = presets.find((item) => item.from === from && item.to === to);
    let button = label;
    if (preset) {
        button = text(`filter_date_${preset.key}`);
    } else if (from !== '' && to !== '') {
        button = text('filter_date_range', {from, to});
    } else if (from !== '') {
        button = text('filter_date_since', from);
    } else if (to !== '') {
        button = text('filter_date_until', to);
    }

    return <Menu button={button} label={label} name="date" active={from !== '' || to !== ''} text={text} onClear={() => onChange('', '')}>
        {(close) => <>
            {presets.map((item) => <button
                key={item.key}
                type="button"
                role="option"
                className="dropdown-item"
                aria-selected={preset?.key === item.key}
                onClick={() => {
                    close();
                    onChange(item.from, item.to);
                }}
            >{text(`filter_date_${item.key}`)}</button>)}
            <hr />
            <div className="dd-menu-form">
                <div className="dd-menu-dates">
                    <div>
                        <label className="form-label small mb-1" htmlFor={fromId}>{text('datepicker_from')}</label>
                        <input id={fromId} type="date" className="form-control form-control-sm" value={from} max={to || undefined}
                            onChange={(event) => onChange(event.target.value, to)} />
                    </div>
                    <div>
                        <label className="form-label small mb-1" htmlFor={toId}>{text('datepicker_to')}</label>
                        <input id={toId} type="date" className="form-control form-control-sm" value={to} min={from || undefined}
                            onChange={(event) => onChange(from, event.target.value)} />
                    </div>
                </div>
            </div>
        </>}
    </Menu>;
}

/** The width the search keeps beside the filters before they are grouped, in pixels (10rem). */
const SEARCH_ROOM = 160;

/**
 * The filters of the toolbar, in one row beside the search. When they do not fit, on a narrow screen or when the values chosen are
 * long, they are grouped in one menu, Filters, which says how many narrow the report and holds them; they come back to the row when
 * there is room again.
 *
 * @param props How many filters narrow the report, the texts and the filters.
 * @returns The filters, in the row or grouped.
 */
export function FilterGroup({count, text, children}: {count: number; text: Text; children: ReactNode}) {
    const [grouped, setGrouped] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const needed = useRef(0);

    useLayoutEffect(() => {
        const row = box.current?.parentElement;
        if (!box.current || !row) {
            return undefined;
        }
        const measure = (): void => {
            const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
            const room = row.clientWidth - SEARCH_ROOM - gap;
            if (!grouped) {
                const menus = Array.from(box.current?.children ?? []) as HTMLElement[];
                const width = menus.reduce((sum, menu) => sum + menu.offsetWidth, 0) + gap * Math.max(0, menus.length - 1);
                if (width > room) {
                    needed.current = width;
                    setGrouped(true);
                }
            } else if (room >= needed.current) {
                setGrouped(false);
            }
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(row);
        return () => observer.disconnect();
    });

    return <div ref={box} data-region="filter-menus">
        {grouped ? <Menu
            button={<><Icon name="i/filter" text={text} /> {count > 0 ? `${text('filters')} (${count})` : text('filters')}</>}
            label={text('filters')}
            name="filters"
            active={count > 0}
            place="end"
        >
            {() => <div data-region="filter-panel">{children}</div>}
        </Menu> : children}
    </div>;
}
