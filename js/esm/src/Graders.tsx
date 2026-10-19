/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Who Autograder would grade as in one course, before it grades anything: the people who could grade there and, on request, the
 * grader that each student would get.
 *
 * Mounted by core/react_autoinit from the data-react-component that the page writes.
 *
 * @module     report_autograder/Graders
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useMemo, useState} from 'react';
import {IconCourse} from './components/common/Icons';
import Pagination from './components/Pagination';
import PickerFilter from './components/PickerFilter';
import {createText} from './engine/text';
import {describeError, getGraders} from './services/api';
import type {GradersProps, GradersResponse, Option} from './types';

/**
 * Write the course and the list of students in the address, so the page can be shared and reloaded.
 *
 * @param courseid The course, or 0.
 * @param students Whether the list of students is open.
 */
const remember = (courseid: number, students: boolean): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('courseid');
    url.searchParams.delete('students');
    if (courseid > 0) {
        url.searchParams.set('courseid', String(courseid));
    }
    if (students) {
        url.searchParams.set('students', '1');
    }
    window.history.replaceState(null, '', url);
};

/**
 * The page of the graders.
 *
 * @param props What the server gives the page to start from: the course, the page sizes and the text.
 * @returns The page.
 */
export default function Graders(props: GradersProps) {
    const text = useMemo(() => createText(props.strings), [props.strings]);
    const [courseid, setCourseid] = useState(props.courseid);
    const [students, setStudents] = useState(props.students);
    const [page, setPage] = useState(0);
    const [perpage, setPerpage] = useState(props.perpage);
    const [data, setData] = useState<GradersResponse | null>(null);
    const [loading, setLoading] = useState(props.courseid > 0);
    const [failed, setFailed] = useState('');
    const [chosen, setChosen] = useState<Option | null>(null);

    useEffect(() => {
        if (courseid <= 0) {
            setData(null);
            setLoading(false);
            return undefined;
        }
        let current = true;
        setLoading(true);
        setFailed('');
        getGraders(courseid, students, page, perpage).then((response) => {
            if (current) {
                setData(response);
                setChosen({id: courseid, name: response.course});
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
    }, [courseid, students, page, perpage]);

    const pick = (option: Option | null): void => {
        const id = option?.id ?? 0;
        setChosen(option);
        setCourseid(id);
        setStudents(false);
        setPage(0);
        remember(id, false);
    };
    const open = (show: boolean): void => {
        setStudents(show);
        setPage(0);
        remember(courseid, show);
    };

    return <div className="arp arp-graders">
        <div className="arp-toolbar">
            <div className="arp-filters">
                <PickerFilter
                    type="anycourse"
                    icon={<IconCourse />}
                    label={text('graders:pickcourse')}
                    chosen={chosen}
                    scope={{}}
                    courseid={0}
                    text={text}
                    onChange={pick}
                />
            </div>
        </div>
        {courseid <= 0 && <p className="arp-intro">{text('graders:intro')}</p>}
        {failed !== '' && <div className="arp-empty" role="alert"><p className="arp-empty-text">{text('error:apirequest', failed)}</p></div>}
        {loading && data === null && <p className="arp-intro" role="status">{text('graders:loading')}</p>}
        {data && <section className="arp-card" aria-busy={loading}>
            <header className="arp-card-head">
                <div>
                    <h3 className="arp-card-title">{data.course}</h3>
                    <p className="arp-counts">
                        <span><strong>{data.gradercount}</strong> {text('graders:gradercount')}</span>
                        <span><strong>{data.studentcount}</strong> {text('graders:studentcount')}</span>
                    </p>
                </div>
                <a className="arp-action arp-action-quiet" href={data.reporturl}>{text('graders:openreport')}</a>
            </header>
            {!data.hasgraders && <p className="arp-alert arp-alert-danger" role="alert">{text('graders:nograders')}</p>}
            {data.hasgraders && <div className="arp-panel">
                <h4 className="arp-panel-title">{text('graders:possible')}</h4>
                <ul className="arp-graders-names">
                    {data.graders.map((grader) => <li key={grader.id}>
                        {grader.name}
                        {grader.isfallback && <span className="arp-badge arp-badge-manual">{text('graders:viafallback')}</span>}
                    </li>)}
                </ul>
                <p className="arp-note">{text('graders:associationnote')}</p>
            </div>}
            <div className="arp-students-toggle">
                <button type="button" className="arp-action" onClick={() => open(!students)}>
                    {students ? text('graders:hidestudents') : text('graders:seestudents')}
                </button>
            </div>
            {students && data.hasstudents && <>
                {data.studentlist.students.length === 0 && <p className="arp-intro">{text('graders:none')}</p>}
                {data.studentlist.students.length > 0 && <div className="arp-table-scroll" tabIndex={0} role="region" aria-label={text('graders:students')}>
                    <table className="arp-table">
                        <thead>
                            <tr>
                                <th scope="col">{text('graders:student')}</th>
                                <th scope="col">{text('graders:grader')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.studentlist.students.map((student, index) => <tr key={`${student.name}-${index}`}>
                                <td data-label={text('graders:student')}>{student.name}</td>
                                <td data-label={text('graders:grader')}>
                                    {student.hasgrader ? student.grader : <span className="arp-badge arp-badge-failed">
                                        <span className="arp-dot" />
                                        {text('graders:nobodyfor')}
                                    </span>}
                                    {student.viafallback && <span className="arp-badge arp-badge-manual">{text('graders:viafallback')}</span>}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>}
                <Pagination
                    page={data.studentlist.page}
                    limit={data.studentlist.perpage}
                    total={data.studentlist.total}
                    sizes={props.pagesizes}
                    showing={text('graders:showing', {
                        from: data.studentlist.from, to: data.studentlist.to, total: data.studentlist.total,
                    })}
                    disabled={loading}
                    text={text}
                    onPage={setPage}
                    onSize={(size) => {
                        setPerpage(size);
                        setPage(0);
                    }}
                />
            </>}
        </section>}
    </div>;
}
