/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The bar above the table: the search box, the filters and the button that clears them all.
 *
 * @module     report_autograder/components/Toolbar
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useState} from 'react';
import DateFilter from './DateFilter';
import GroupFilter from './GroupFilter';
import PickerFilter from './PickerFilter';
import StatusFilter from './StatusFilter';
import {IconActivity, IconCourse, IconReset, IconSearch} from './common/Icons';
import {useDebounced} from '../hooks/useDebounced';
import {isNarrowed} from '../lib/filters';
import type {Filters, Option, ReportProps, Text} from '../types';

interface ToolbarProps {
    props: ReportProps;
    filters: Filters;
    course: Option | null;
    activity: Option | null;
    text: Text;
    onFilters: (changes: Partial<Filters>) => void;
    onCourse: (course: Option | null) => void;
    onActivity: (activity: Option | null) => void;
    onReset: () => void;
}

/**
 * The bar.
 *
 * @param props What the report offers, what it is narrowed to and what to do when that changes.
 * @returns The bar.
 */
export default function Toolbar({props, filters, course, activity, text, onFilters, onCourse, onActivity, onReset}: ToolbarProps) {
    const [typed, setTyped] = useState(filters.searchname);
    const settled = useDebounced(typed, 300);

    useEffect(() => {
        if (settled !== filters.searchname) {
            onFilters({searchname: settled});
        }
    }, [settled]);

    // A reset from outside the box, and a link that opens already narrowed, put the text in it.
    useEffect(() => {
        setTyped(filters.searchname);
    }, [filters.searchname]);

    return <div className="arp-toolbar" role="search">
        <div className={`arp-search${typed !== '' ? ' arp-search-on' : ''}`}>
            <span className="arp-search-icon"><IconSearch /></span>
            <input
                type="search"
                className="arp-search-field"
                value={typed}
                placeholder={`${text('filter_search')}…`}
                aria-label={text('filter_search')}
                onChange={(event) => setTyped(event.target.value)}
            />
        </div>
        <div className="arp-filters">
            {props.showscoursefilter && <PickerFilter
                type="course"
                icon={<IconCourse />}
                label={text('filter_course')}
                chosen={course}
                scope={props.scope}
                courseid={0}
                text={text}
                onChange={onCourse}
            />}
            {props.showsactivityfilter && <PickerFilter
                type="activity"
                icon={<IconActivity />}
                label={text('filter_activity')}
                chosen={activity}
                scope={props.scope}
                courseid={filters.courseid}
                text={text}
                onChange={onActivity}
            />}
            {props.showsgroupfilter && <GroupFilter
                groups={props.groups}
                offersAll={props.offersallgroups}
                chosen={filters.groupid}
                text={text}
                onChange={(groupid) => onFilters({groupid})}
            />}
            <StatusFilter
                options={props.statuses}
                chosen={filters.status}
                text={text}
                onChange={(status) => onFilters({status})}
            />
            <DateFilter
                from={filters.datefrom}
                to={filters.dateto}
                text={text}
                onChange={(datefrom, dateto) => onFilters({datefrom, dateto})}
            />
            {isNarrowed(filters) && <button type="button" className="arp-reset" onClick={onReset} aria-label={text('filters_reset')}>
                <IconReset />
                <span className="arp-reset-text">{text('filters_reset')}</span>
            </button>}
        </div>
    </div>;
}
