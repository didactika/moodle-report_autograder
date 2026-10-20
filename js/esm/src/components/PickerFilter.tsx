/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A filter whose options are searched from the server as the reader types, for the courses and the activities: the list is never
 * sent whole, because a site can have a hundred thousand courses.
 *
 * @module     report_autograder/components/PickerFilter
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useRef, useState, type ReactNode} from 'react';
import Chip from './common/Chip';
import {IconCheck} from './common/Icons';
import {useDebounced} from '../hooks/useDebounced';
import {searchOptions, type PickerType, type Scope} from '../services/api';
import type {Option, Text} from '../types';

interface PickerFilterProps {
    type: PickerType;
    icon: ReactNode;
    label: string;
    /** The option that is chosen, or null. */
    chosen: Option | null;
    scope: Scope;
    /** The course that an activity search is narrowed to, or 0. */
    courseid: number;
    text: Text;
    onChange: (option: Option | null) => void;
}

interface Found {
    options: Option[];
    hasmore: boolean;
    loading: boolean;
    failed: boolean;
}

/**
 * The searchable filter.
 *
 * @param props What it picks, how it is shown, what is chosen and what to do when that changes.
 * @returns The filter.
 */
export default function PickerFilter({type, icon, label, chosen, scope, courseid, text, onChange}: PickerFilterProps) {
    return <Chip
        icon={icon}
        label={label}
        value={chosen?.name ?? ''}
        clearLabel={text('filter_clear')}
        onClear={() => onChange(null)}
        minWidth={280}
    >
        {(close) => <Search
            type={type}
            label={label}
            chosen={chosen}
            scope={scope}
            courseid={courseid}
            text={text}
            onPick={(option) => {
                onChange(option);
                close();
            }}
        />}
    </Chip>;
}

interface SearchProps extends Omit<PickerFilterProps, 'icon' | 'onChange'> {
    onPick: (option: Option) => void;
}

const Search = ({type, label, chosen, scope, courseid, text, onPick}: SearchProps) => {
    const field = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const typed = useDebounced(query.trim(), 250);
    const [found, setFound] = useState<Found>({options: [], hasmore: false, loading: true, failed: false});

    useEffect(() => {
        field.current?.focus();
    }, []);

    useEffect(() => {
        let current = true;
        setFound((before) => ({...before, loading: true, failed: false}));
        searchOptions(type, typed, scope, courseid).then((response) => {
            if (current) {
                setFound({options: response.options, hasmore: response.hasmore, loading: false, failed: false});
            }
        }).catch(() => {
            if (current) {
                setFound({options: [], hasmore: false, loading: false, failed: true});
            }
        });
        return () => {
            current = false;
        };
    }, [type, typed, courseid, scope.cmid, scope.courseid]);

    let status = '';
    if (found.loading) {
        status = text('search:loading');
    } else if (found.failed) {
        status = text('error:retry');
    } else if (found.options.length === 0) {
        status = text('search:nomatches');
    }
    return <div className="arp-picker">
        <input
            ref={field}
            type="search"
            className="arp-picker-field"
            value={query}
            placeholder={text('search:typetosearch')}
            aria-label={label}
            onChange={(event) => setQuery(event.target.value)}
        />
        <ul className="arp-options" role="listbox" aria-label={label} aria-busy={found.loading}>
            {found.options.map((option) => {
                const on = chosen?.id === option.id;
                return <li key={option.id} role="option" aria-selected={on}>
                    <button type="button" className={`arp-option${on ? ' arp-option-on' : ''}`} onClick={() => onPick(option)}>
                        <span className="arp-option-label">{option.name}</span>
                        {on && <span className="arp-option-check"><IconCheck /></span>}
                    </button>
                </li>;
            })}
        </ul>
        {status !== '' && <p className="arp-picker-status" role="status">{status}</p>}
    </div>;
};
