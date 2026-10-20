/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The autograder report: a bar of filters, one table and its pages, for an activity, a course or the whole site.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes. Filtering, sorting and paging are done by the
 * server, because the report of a site can have more rows than a browser should ever be sent.
 *
 * @module     report_autograder/Report
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useMemo, useState} from 'react';
import Pagination from './components/Pagination';
import ReportTable from './components/ReportTable';
import Toolbar from './components/Toolbar';
import {createText} from './engine/text';
import {useReport} from './hooks/useReport';
import {NO_FILTERS, nextSort} from './lib/filters';
import type {Filters, Option, ReportProps, Sort, SortColumn} from './types';

/**
 * The attributes that the forum grader of Moodle reads from the element that holds the report.
 *
 * @param props What the page gave the report.
 * @returns The attributes, or none when the activity is not a forum that the viewer may grade.
 */
const forumAttributes = (props: ReportProps): Record<string, string | number> => {
    const forum = props.forumgrade;
    if (!forum) {
        return {};
    }
    return {
        'data-contextid': forum.contextid,
        'data-cmid': forum.cmid,
        'data-name': forum.name,
        'data-course-id': forum.courseid,
        'data-course-name': forum.coursename,
        'data-experimental-display-mode': forum.experimentaldisplaymode,
        'data-group': forum.groupid ?? '',
        'data-grading-component': forum.gradingcomponent,
        'data-grading-component-subtype': forum.gradingcomponentsubtype,
        'data-gradable-itemtype': 'forum',
        'data-grade-only-active-users': forum.gradeonlyactiveusers,
        ...(forum.sendstudentnotifications ? {'data-send-student-notifications': 1} : {}),
    };
};

/**
 * The report.
 *
 * @param props What the server gives the report to start from: what it shows and the text.
 * @returns The report.
 */
export default function Report(props: ReportProps) {
    const text = useMemo(() => createText(props.strings), [props.strings]);
    const [filters, setFilters] = useState<Filters>(props.opening);
    const [course, setCourse] = useState<Option | null>(props.selectedcourse);
    const [activity, setActivity] = useState<Option | null>(props.selectedactivity);
    const [sort, setSort] = useState<Sort>({column: '', direction: 'asc'});
    const [limit, setLimit] = useState(props.pagesizes[0] ?? 12);
    const [state, goto] = useReport({scope: props.scope, filters, sort, limit});

    // The forum grader opens on the student whose button was pressed, which it learns from the element that holds the report.
    const remember = (event: React.MouseEvent<HTMLDivElement>): void => {
        const button = (event.target as HTMLElement).closest<HTMLElement>('[data-grade-action="launch"][data-initialuserid]');
        if (button && props.forumgrade) {
            event.currentTarget.dataset.initialuserid = button.dataset.initialuserid;
        }
    };

    const change = (changes: Partial<Filters>): void => {
        setFilters((before) => ({...before, ...changes}));
        setSort({column: '', direction: 'asc'});
    };

    return <div
        id="autograder-report-container"
        className="arp"
        onClickCapture={remember}
        {...forumAttributes(props)}
    >
        <Toolbar
            props={props}
            filters={filters}
            course={course}
            activity={activity}
            text={text}
            onFilters={change}
            onCourse={(option) => {
                setCourse(option);
                // The activity that was chosen may not belong to the new course.
                setActivity(null);
                change({courseid: option?.id ?? 0, cmid: 0});
            }}
            onActivity={(option) => {
                setActivity(option);
                change({cmid: option?.id ?? 0});
            }}
            onReset={() => {
                setCourse(null);
                setActivity(null);
                setFilters({...NO_FILTERS, groupid: props.offersallgroups ? 0 : filters.groupid});
                setSort({column: '', direction: 'asc'});
            }}
        />
        <ReportTable
            state={state}
            columns={props.columns}
            forumgrade={props.forumgrade}
            sort={sort}
            text={text}
            onSort={(column: SortColumn) => setSort(nextSort(sort, column))}
            onRetry={() => goto(state.page)}
        />
        <Pagination
            page={state.page}
            limit={state.limit || limit}
            total={state.total}
            sizes={props.pagesizes}
            showing=""
            disabled={state.loading}
            text={text}
            onPage={goto}
            onSize={setLimit}
        />
    </div>;
}
