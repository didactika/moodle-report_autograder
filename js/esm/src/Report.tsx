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
import {useEffect, useMemo, useState} from 'react';
import AppliedFilters from './components/AppliedFilters';
import FiltersPanel from './components/FiltersPanel';
import ReportTable from './components/ReportTable';
import {FiltersMenu, Pager, SearchBox} from './components/ui';
import {useDebounced} from './hooks/useDebounced';
import {createText} from './engine/text';
import {useReport} from './hooks/useReport';
import {NO_FILTERS, countApplied, nextSort} from './lib/filters';
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
    const [searchText, setSearchText] = useState(props.opening.searchname);
    const settled = useDebounced(searchText, 300);

    useEffect(() => {
        if (settled !== filters.searchname) {
            setFilters((before) => ({...before, searchname: settled}));
            setSort({column: '', direction: 'asc'});
        }
    }, [settled]);

    // A reset puts the search box right too.
    useEffect(() => {
        setSearchText(filters.searchname);
    }, [filters.searchname]);

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

    const applied = countApplied(filters, {course: props.showscoursefilter, activity: props.showsactivityfilter, group: props.showsgroupfilter});
    const narrowed = applied > 0 || filters.searchname.trim() !== '';
    const reset = (): void => {
        setCourse(null);
        setActivity(null);
        setFilters({...NO_FILTERS, groupid: props.offersallgroups ? 0 : filters.groupid});
        setSort({column: '', direction: 'asc'});
    };
    const onCourse = (option: Option | null): void => {
        setCourse(option);
        // The activity that was chosen may not belong to the new course.
        setActivity(null);
        change({courseid: option?.id ?? 0, cmid: 0});
    };
    const onActivity = (option: Option | null): void => {
        setActivity(option);
        change({cmid: option?.id ?? 0});
    };

    return <div
        id="autograder-report-container"
        className="arp"
        onClickCapture={remember}
        {...forumAttributes(props)}
    >
        <p className="text-muted mb-3">{text(`lead_${props.level}`)}</p>
        <div className="card">
            <div className="table-toolbar">
                <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
                    <SearchBox value={searchText} onChange={setSearchText} label={text('filter_search')} text={text} />
                    <FiltersMenu label={text('filters')} applied={applied} text={text}>
                        <FiltersPanel
                            props={props}
                            filters={filters}
                            counts={state.counts}
                            course={course}
                            activity={activity}
                            text={text}
                            onFilters={change}
                            onCourse={onCourse}
                            onActivity={onActivity}
                            onReset={reset}
                            canReset={narrowed}
                        />
                    </FiltersMenu>
                </div>
            </div>
            <AppliedFilters
                props={props}
                filters={filters}
                course={course}
                activity={activity}
                total={state.total}
                loading={state.loading}
                text={text}
                onFilters={change}
                onCourse={onCourse}
                onActivity={onActivity}
            />
            <ReportTable
                state={state}
                columns={props.columns}
                forumgrade={props.forumgrade}
                sort={sort}
                narrowed={narrowed}
                text={text}
                onSort={(column: SortColumn) => setSort(nextSort(sort, column))}
                onRetry={() => goto(state.page)}
                onClear={reset}
            />
            <Pager
                page={state.page}
                perpage={state.limit || limit}
                total={state.total}
                sizes={props.pagesizes}
                disabled={state.loading}
                text={text}
                onChange={({page, perpage}) => {
                    if (perpage !== undefined) {
                        setLimit(perpage);
                    } else if (page !== undefined) {
                        goto(page);
                    }
                }}
            />
        </div>
    </div>;
}
