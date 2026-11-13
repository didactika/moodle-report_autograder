/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The filters that are applied, each as a badge with a button that removes it, and the number of results at the end of the row.
 *
 * @module     report_autograder/components/AppliedFilters
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {Icon} from './ui';
import type {Filters, Option, ReportProps, Text} from '../types';

interface AppliedFiltersProps {
    props: ReportProps;
    filters: Filters;
    course: Option | null;
    activity: Option | null;
    total: number;
    loading: boolean;
    text: Text;
    onFilters: (changes: Partial<Filters>) => void;
    onCourse: (course: Option | null) => void;
    onActivity: (activity: Option | null) => void;
}

/**
 * The applied filters.
 *
 * @param props What the report is narrowed to and how to lift each filter.
 * @returns The row, or nothing when no filter is applied.
 */
export default function AppliedFilters({props, filters, course, activity, total, loading, text, onFilters, onCourse, onActivity}: AppliedFiltersProps) {
    const applied: {key: string; label: string; remove: () => void}[] = [];

    for (const key of filters.status) {
        const status = props.statuses.find((item) => item.key === key);
        applied.push({
            key: `status-${key}`,
            label: `${text('filter_status')}: ${status?.label ?? key}`,
            remove: () => onFilters({status: filters.status.filter((item) => item !== key)}),
        });
    }
    if (course && props.showscoursefilter) {
        applied.push({key: 'course', label: `${text('filter_course')}: ${course.name}`, remove: () => onCourse(null)});
    }
    if (activity && props.showsactivityfilter) {
        applied.push({key: 'activity', label: `${text('filter_activity')}: ${activity.name}`, remove: () => onActivity(null)});
    }
    if (filters.groupid > 0) {
        const group = props.groups.find((item) => item.id === filters.groupid);
        applied.push({key: 'group', label: `${text('filter_group')}: ${group?.name ?? filters.groupid}`, remove: () => onFilters({groupid: 0})});
    }
    if (filters.datefrom !== '' || filters.dateto !== '') {
        let range = text('filter_date_range', {from: filters.datefrom, to: filters.dateto});
        if (filters.dateto === '') {
            range = text('filter_date_since', filters.datefrom);
        } else if (filters.datefrom === '') {
            range = text('filter_date_until', filters.dateto);
        }
        applied.push({key: 'date', label: `${text('filter_grading_date')}: ${range}`, remove: () => onFilters({datefrom: '', dateto: ''})});
    }

    if (applied.length === 0) {
        return null;
    }

    return <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2 border-bottom">
        <ul className="list-unstyled d-flex flex-wrap align-items-center gap-2 mb-0">
            {applied.map((item) => <li key={item.key}>
                <span className="badge badge-secondary bg-secondary rounded-pill d-inline-flex align-items-center gap-1">
                    {item.label}
                    <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        aria-label={text('filter_remove', item.label)}
                        title={text('filter_remove', item.label)}
                        onClick={item.remove}
                    >
                        <Icon name="e/cancel" text={text} />
                    </button>
                </span>
            </li>)}
        </ul>
        <span className="text-muted small" role="status" aria-busy={loading}>{text('results_count', total)}</span>
    </div>;
}
