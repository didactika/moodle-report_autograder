/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The panel of the Filters button: the status, the group, the course and the activity, and the grading date.
 *
 * Every filter answers at once, as the design system asks, so the panel has no button to apply them: the results behind it change as
 * each one is chosen and the numbers beside the statuses are the ones that choice leaves.
 *
 * @module     report_autograder/components/FiltersPanel
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useId, useState} from 'react';
import {useDebounced} from '../hooks/useDebounced';
import {datePresets} from '../lib/filters';
import {searchOptions, type PickerType, type Scope} from '../services/api';
import type {Filters, Option, ReportProps, StatusCount, Text} from '../types';

interface FiltersPanelProps {
    props: ReportProps;
    filters: Filters;
    counts: StatusCount[];
    course: Option | null;
    activity: Option | null;
    text: Text;
    onFilters: (changes: Partial<Filters>) => void;
    onCourse: (course: Option | null) => void;
    onActivity: (activity: Option | null) => void;
    onReset: () => void;
    canReset: boolean;
}

interface Found {
    options: Option[];
    loading: boolean;
}

/**
 * A field that searches the courses or the activities as the reader types and lists what it finds under it.
 *
 * @param props What is searched, what is chosen and how the report is scoped.
 * @returns The field and its results.
 */
const Picker = ({type, label, chosen, scope, courseid, text, onPick}: {
    type: PickerType;
    label: string;
    chosen: Option | null;
    scope: Scope;
    courseid: number;
    text: Text;
    onPick: (option: Option | null) => void;
}) => {
    const id = useId();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const typed = useDebounced(query.trim(), 250);
    const [found, setFound] = useState<Found>({options: [], loading: false});

    useEffect(() => {
        if (!open) {
            return undefined;
        }
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
    }, [open, type, typed, courseid, scope.cmid, scope.courseid]);

    return <div className="mb-3 position-relative">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input
            id={id}
            type="search"
            className="form-control"
            value={open ? query : (chosen?.name ?? '')}
            placeholder={chosen ? chosen.name : text('search:typetosearch')}
            autoComplete="off"
            onFocus={() => {
                setQuery('');
                setOpen(true);
            }}
            onChange={(event) => setQuery(event.target.value)}
        />
        {open && <div className="list-group mt-1 position-absolute w-100 shadow" role="listbox" aria-label={label} aria-busy={found.loading}>
            {chosen && <button type="button" className="list-group-item list-group-item-action text-muted" onClick={() => {
                onPick(null);
                setOpen(false);
            }}>{text('filter_clear')}</button>}
            {found.options.map((option) => <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={chosen?.id === option.id}
                className={`list-group-item list-group-item-action${chosen?.id === option.id ? ' active' : ''}`}
                onClick={() => {
                    onPick(option);
                    setOpen(false);
                }}
            >{option.name}</button>)}
            {!found.loading && found.options.length === 0 && <span className="list-group-item text-muted">{text('search:nomatches')}</span>}
            {found.loading && found.options.length === 0 && <span className="list-group-item text-muted">{text('search:loading')}</span>}
        </div>}
    </div>;
};

/**
 * The panel.
 *
 * @param props What the report offers, what it is narrowed to and what to do when that changes.
 * @returns The panel.
 */
export default function FiltersPanel({props, filters, counts, course, activity, text, onFilters, onCourse, onActivity, onReset, canReset}: FiltersPanelProps) {
    const groupId = useId();
    const fromId = useId();
    const toId = useId();
    const options = counts.length > 0 ? counts : props.statuses.map((status) => ({...status, count: 0}));
    const toggle = (key: string): void => {
        const chosen = filters.status.includes(key) ? filters.status.filter((item) => item !== key) : [...filters.status, key];
        onFilters({status: chosen});
    };

    return <div className="p-3">
        <fieldset className="mb-3">
            <legend className="h6 mb-2">{text('filter_status')}</legend>
            {options.map((option) => <div className="form-check" key={option.key}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${groupId}-${option.key}`}
                    checked={filters.status.includes(option.key)}
                    onChange={() => toggle(option.key)}
                />
                <label className="form-check-label d-flex align-items-center justify-content-between gap-3" htmlFor={`${groupId}-${option.key}`}>
                    {option.label}
                    <span className="badge badge-secondary bg-secondary rounded-pill">{option.count}</span>
                </label>
            </div>)}
        </fieldset>
        {props.showscoursefilter && <Picker
            type="course"
            label={text('filter_course')}
            chosen={course}
            scope={props.scope}
            courseid={0}
            text={text}
            onPick={onCourse}
        />}
        {props.showsactivityfilter && <Picker
            type="activity"
            label={text('filter_activity')}
            chosen={activity}
            scope={props.scope}
            courseid={filters.courseid}
            text={text}
            onPick={onActivity}
        />}
        {props.showsgroupfilter && <div className="mb-3">
            <label className="form-label" htmlFor={`${groupId}-group`}>{text('filter_group')}</label>
            <select
                id={`${groupId}-group`}
                className="form-select custom-select"
                value={filters.groupid}
                onChange={(event) => onFilters({groupid: Number(event.target.value)})}
            >
                {props.offersallgroups && <option value={0}>{text('filter_group_placeholder')}</option>}
                {props.groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
        </div>}
        <fieldset className="mb-3">
            <legend className="h6 mb-2">{text('filter_grading_date')}</legend>
            <div className="d-flex flex-wrap gap-1 mb-2">
                {datePresets(new Date()).map((preset) => <button
                    key={preset.key}
                    type="button"
                    className={`btn btn-sm btn-outline-secondary${filters.datefrom === preset.from && filters.dateto === preset.to ? ' active' : ''}`}
                    onClick={() => onFilters({datefrom: preset.from, dateto: preset.to})}
                >{text(`filter_date_${preset.key}`)}</button>)}
            </div>
            <div className="row g-2">
                <div className="col-6 col-sm-6">
                    <label className="form-label small" htmlFor={fromId}>{text('datepicker_from')}</label>
                    <input id={fromId} type="date" className="form-control" value={filters.datefrom} max={filters.dateto || undefined}
                        onChange={(event) => onFilters({datefrom: event.target.value})} />
                </div>
                <div className="col-6 col-sm-6">
                    <label className="form-label small" htmlFor={toId}>{text('datepicker_to')}</label>
                    <input id={toId} type="date" className="form-control" value={filters.dateto} min={filters.datefrom || undefined}
                        onChange={(event) => onFilters({dateto: event.target.value})} />
                </div>
            </div>
        </fieldset>
        <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-link" disabled={!canReset} onClick={onReset}>{text('filters_reset')}</button>
        </div>
    </div>;
}
