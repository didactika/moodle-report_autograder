/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Who Autograder would grade as. Without a course it is the list of the courses where Autograder is switched on, each with the
 * people who could grade there and a state that says whether grading would work; with a course it is that course, its graders and
 * its students with the teacher each would get, which can be searched and narrowed to the ones that would be graded by the fallback
 * grader or by nobody.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes.
 *
 * @module     report_autograder/Graders
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import {Empty, Icon, Pager, SearchBox, SelectMenu, TableBox} from './components/ui';
import {createText} from './engine/text';
import {DEFAULT_PAGE_SIZE} from './lib/paging';
import {useDebounced} from './hooks/useDebounced';
import {describeError, getGraders, getGradersOverview} from './services/api';
import type {GradersOverview, GradersProps, GradersResponse, GradingState, StudentFilter, Text} from './types';

/** The colour of Bootstrap that each state of grading takes. */
const TONES: Record<GradingState, string> = {ready: 'success', fallback: 'warning', nobody: 'danger'};

/**
 * The state of grading in a course as a badge.
 *
 * @param props The state and the texts.
 * @returns The badge.
 */
const State = ({state, text}: {state: GradingState; text: Text}) => <span className={`badge badge-soft badge-dot rounded-pill text-bg-${TONES[state]}`}>
    {text(`graders:state_${state}`)}
</span>;

/**
 * Rows of a table while it loads.
 *
 * @param props How many columns.
 * @returns The rows.
 */
const Skeleton = ({columns}: {columns: number}) => <>
    {Array.from({length: 6}, (_, row) => <tr key={row} aria-hidden="true">
        {Array.from({length: columns}, (__, cell) => <td key={cell}><span className="dd-skeleton" /></td>)}
    </tr>)}
</>;

/**
 * The courses where Autograder is switched on.
 *
 * @param props The page sizes and the texts.
 * @returns The list.
 */
const Overview = ({props, text}: {props: GradersProps; text: Text}) => {
    const [typed, setTyped] = useState('');
    const search = useDebounced(typed.trim(), 300);
    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(DEFAULT_PAGE_SIZE);
    const [data, setData] = useState<GradersOverview | null>(null);
    const [failed, setFailed] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage(0);
    }, [search, perpage]);

    useEffect(() => {
        let current = true;
        setLoading(true);
        setFailed('');
        getGradersOverview(search, page, perpage).then((response) => {
            if (current) {
                setData(response);
                setLoading(false);
            }
        }).catch((error: unknown) => {
            if (current) {
                setFailed(describeError(error));
                setLoading(false);
            }
        });
        return () => {
            current = false;
        };
    }, [search, page, perpage]);

    const courses = data?.courses ?? [];
    let overviewEmpty: ReactNode = null;
    if (failed !== '') {
        overviewEmpty = <Empty icon="i/warning" message={text('error:apirequest', failed)} action={text('error:retry')}
            onAction={() => setPage(page)} text={text} />;
    } else if (!loading && courses.length === 0) {
        overviewEmpty = <Empty icon={search === '' ? 'i/report' : 'a/search'}
            message={search === '' ? text('graders:empty') : text('graders:emptysearch')} text={text} />;
    }

    return <div className="card">
        <div className="table-toolbar">
            <div className="table-toolbar-start">
                <SearchBox value={typed} onChange={setTyped} label={text('graders:search')} text={text} />
            </div>
        </div>
        <TableBox busy={loading} empty={overviewEmpty}>
            <table className="table">
                <caption className="visually-hidden sr-only">{text('graders:heading')}</caption>
                <thead>
                    <tr>
                        <th scope="col">{text('graders:course')}</th>
                        <th scope="col">{text('graders:activities')}</th>
                        <th scope="col">{text('graders:graders')}</th>
                        <th scope="col">{text('graders:students')}</th>
                        <th scope="col">{text('graders:state')}</th>
                        <th scope="col" className="table-actions"><span className="visually-hidden">{text('graders:openreport')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {loading && data === null && <Skeleton columns={6} />}
                    {courses.map((course) => <tr key={course.id}>
                        <td>
                            <a className="fw-bold" href={course.studentsurl}>{course.name}</a>
                            <div className="small text-muted text-truncate">{course.fullname}</div>
                        </td>
                        <td>{course.activities}</td>
                        <td>
                            {course.graders.length === 0 && <span className="text-muted">—</span>}
                            {course.graders.join(', ')}
                            {course.moregraders > 0 && <span className="text-muted">{' '}{text('graders:more', course.moregraders)}</span>}
                        </td>
                        <td>{course.studentcount}</td>
                        <td><State state={course.state} text={text} /></td>
                        <td className="table-actions">
                            <a
                                className="btn btn-link btn-icon btn-sm text-primary"
                                href={course.studentsurl}
                                title={text('graders:seestudents')}
                                aria-label={text('graders:seestudents')}
                            ><Icon name="i/users" text={text} /></a>
                            <a
                                className="btn btn-link btn-icon btn-sm text-info"
                                href={course.reporturl}
                                title={text('graders:openreport')}
                                aria-label={text('graders:openreport')}
                            ><Icon name="i/report" text={text} /></a>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </TableBox>
        <Pager
            page={data?.page ?? 0}
            perpage={perpage}
            total={data?.total ?? 0}
            disabled={loading}
            text={text}
            onChange={({page: next, perpage: size}) => {
                if (size !== undefined) {
                    setPerpage(size);
                } else if (next !== undefined) {
                    setPage(next);
                }
            }}
        />
    </div>;
};

/**
 * One course: who could grade there and who would grade each student.
 *
 * @param props The course, the page sizes and the texts.
 * @returns The page of the course.
 */
const Course = ({props, text}: {props: GradersProps; text: Text}) => {
    const [typed, setTyped] = useState('');
    const search = useDebounced(typed.trim(), 300);
    const [filter, setFilter] = useState<StudentFilter>('all');
    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(DEFAULT_PAGE_SIZE);
    const [data, setData] = useState<GradersResponse | null>(null);
    const [failed, setFailed] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage(0);
    }, [search, filter, perpage]);

    useEffect(() => {
        let current = true;
        setLoading(true);
        setFailed('');
        getGraders(props.courseid, true, page, perpage, search, filter).then((response) => {
            if (current) {
                setData(response);
                setLoading(false);
            }
        }).catch((error: unknown) => {
            if (current) {
                setFailed(describeError(error));
                setLoading(false);
            }
        });
        return () => {
            current = false;
        };
    }, [props.courseid, search, filter, page, perpage]);

    const students = data?.studentlist.students ?? [];
    let studentsEmpty: ReactNode = null;
    if (failed !== '') {
        studentsEmpty = <Empty icon="i/warning" message={text('error:apirequest', failed)} action={text('error:retry')}
            onAction={() => setPage(page)} text={text} />;
    } else if (!loading && students.length === 0) {
        studentsEmpty = <Empty icon={search !== '' || filter !== 'all' ? 'a/search' : 'i/users'}
            message={search !== '' || filter !== 'all' ? text('graders:emptysearch') : text('graders:none')} text={text} />;
    }
    const teachers = data?.graders.filter((grader) => !grader.isfallback) ?? [];
    let alert = '';
    if (data && !data.hasgraders) {
        alert = text('graders:nograders');
    } else if (data && teachers.length === 0) {
        alert = text('graders:onlyfallback');
    }

    return <>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <a className="btn btn-link px-0" href={props.overviewurl}>
                <Icon name="i/previous" text={text} /> {text('graders:back')}
            </a>
            {data && <a
                className="btn btn-link btn-icon text-info"
                href={data.reporturl}
                title={text('graders:openreport')}
                aria-label={text('graders:openreport')}
            ><Icon name="i/report" text={text} /></a>}
        </div>
        {data && <div className="d-flex flex-wrap align-items-baseline gap-3">
            <h3 className="h4 mb-0">{data.course}</h3>
            <span className="text-muted">
                <strong className="text-body">{data.gradercount}</strong> {text('graders:gradercount')}
                {' · '}
                <strong className="text-body">{data.studentcount}</strong> {text('graders:studentcount')}
            </span>
        </div>}
        {alert !== '' && <div className={`alert ${data && !data.hasgraders ? 'alert-danger' : 'alert-warning'} mb-0`} role="alert">{alert}</div>}
        {data && data.hasgraders && <div className="card">
            <div className="card-body">
                <h4 className="h6 mb-2">{text('graders:possible')}</h4>
                <ul className="list-unstyled d-flex flex-wrap gap-2 mb-2">
                    {data.graders.map((grader) => <li key={grader.id}>
                        <span className={`badge badge-soft rounded-pill ${grader.isfallback ? 'text-bg-secondary' : 'text-bg-primary'}`}>
                            {grader.name}{grader.isfallback && <> · {text('graders:viafallback')}</>}
                        </span>
                    </li>)}
                </ul>
                <p className="small text-muted mb-0">{text('graders:associationnote')}</p>
            </div>
        </div>}
        <div className="card">
            <div className="table-toolbar">
                <div className="table-toolbar-start">
                    <SearchBox value={typed} onChange={setTyped} label={text('graders:search_students')} text={text} />
                    <SelectMenu
                        label={text('graders:show')}
                        value={filter}
                        base="all"
                        text={text}
                        options={(['all', 'fallback', 'nobody'] as StudentFilter[]).map((option) => ({
                            value: option,
                            label: text(`graders:filter_${option}`),
                        }))}
                        onChange={(option) => setFilter(option as StudentFilter)}
                    />
                </div>
            </div>
            <TableBox busy={loading} empty={studentsEmpty}>
                <table className="table">
                    <caption className="visually-hidden sr-only">{text('graders:students')}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{text('graders:student')}</th>
                            <th scope="col">{text('graders:grader')}</th>
                            <th scope="col">{text('graders:note')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && data === null && <Skeleton columns={3} />}
                        {students.map((student, index) => <tr key={`${student.name}-${index}`}>
                            <td className="fw-bold">{student.name}</td>
                            <td>{student.hasgrader ? student.grader : <span className="text-muted">—</span>}</td>
                            <td>
                                {!student.hasgrader && <span className="badge badge-soft badge-dot rounded-pill text-bg-danger">{text('graders:nobodyfor')}</span>}
                                {student.viafallback && student.hasgrader && <span className="badge badge-soft rounded-pill text-bg-secondary">{text('graders:viafallback')}</span>}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </TableBox>
            <Pager
                page={data?.studentlist.page ?? 0}
                perpage={perpage}
                total={data?.studentlist.total ?? 0}
                disabled={loading}
                text={text}
                onChange={({page: next, perpage: size}) => {
                    if (size !== undefined) {
                        setPerpage(size);
                    } else if (next !== undefined) {
                        setPage(next);
                    }
                }}
            />
        </div>
    </>;
};

/**
 * The page.
 *
 * @param props What the server gives the page to start from.
 * @returns The courses, or one course when it was asked for.
 */
export default function Graders(props: GradersProps) {
    const text = useMemo(() => createText(props.strings), [props.strings]);

    return <div id="autograder-report-container" className="arp arp-graders">
        <p className="text-muted mb-0">{text('lead_graders')}</p>
        {props.courseid > 0 ? <Course props={props} text={text} /> : <Overview props={props} text={text} />}
    </div>;
}
