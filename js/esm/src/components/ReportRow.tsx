/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the
 * grade, the teacher it is graded as, and at its end the button that opens what the row has to explain and the one that opens
 * the grading screen of the activity.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import {Dialog, Icon} from './ui';
import type {ForumGrade, ReportProps, Row, Text} from '../types';

interface ReportRowProps {
    row: Row;
    columns: ReportProps['columns'];
    forumgrade: ForumGrade | null;
    text: Text;
}

/** The colour of Bootstrap that each status takes. */
const TONES: Record<string, string> = {
    graded: 'success',
    pending: 'primary',
    manual: 'info',
    failed: 'danger',
    notautograded: 'warning',
    notengaged: 'secondary',
};

/**
 * How serious the most serious thing a row has to explain is: a failure, a problem, or only information.
 *
 * @param row The row.
 * @returns The colour of Bootstrap of that seriousness.
 */
const toneOf = (row: Row): 'danger' | 'warning' | 'info' => {
    if (row.failure_reason) {
        return 'danger';
    }
    if ((!row.grade && row.grade_problem) || (!row.graded_by && row.will_grade_problem)) {
        return 'warning';
    }
    return 'info';
};

/**
 * Whether a row has anything to explain.
 *
 * @param row The row.
 * @returns True when it does.
 */
const explains = (row: Row): boolean => Boolean(row.failure_reason || row.grade_problem || row.will_grade_problem
    || row.date_reason || (!row.grade && row.provisional_grade) || (!row.graded_by && row.will_grade));

/**
 * A grade that is not in the gradebook yet: the grade, in grey, and the label that says it is expected.
 *
 * @param props The grade and the texts.
 * @returns The grade.
 */
const Expected = ({grade, text}: {grade: string; text: Text}) => <>
    <span className="text-muted">{grade}</span>
    {' '}<span className="badge badge-soft rounded-pill text-bg-secondary">{text('grade_expected')}</span>
</>;

/**
 * The details of a row, as a record: what went wrong first, then each value with what explains it.
 *
 * @param props The row and the texts.
 * @returns The details.
 */
const Details = ({row, text}: {row: Row; text: Text}) => <>
    {row.failure_reason && <div className="alert alert-danger" role="alert">
        <strong className="d-block">{text('info:failure')}</strong>{row.failure_reason}
    </div>}
    {!row.grade && row.grade_problem && <div className="alert alert-warning" role="alert">
        <strong className="d-block">{text('info:problem')}</strong>{row.grade_problem}
    </div>}
    {!row.graded_by && row.will_grade_problem && <div className="alert alert-warning" role="alert">
        <strong className="d-block">{text('info:grader')}</strong>{row.will_grade_problem}
    </div>}
    <dl className="row mb-0">
        {row.activity_name && <>
            <dt className="col-sm-4">{text('header:activity')}</dt>
            <dd className="col-sm-8">{row.activity_name}</dd>
        </>}
        <dt className="col-sm-4">{text('header:external_status')}</dt>
        <dd className="col-sm-8">
            <span className={`badge badge-soft badge-dot rounded-pill text-bg-${TONES[row.status_key] ?? 'secondary'}`}>
                {row.status}
            </span>
        </dd>
        <dt className="col-sm-4">{text('header:completed_at')}</dt>
        <dd className="col-sm-8">
            {row.completed_at}
            {row.date_reason && <div className="small text-muted">{row.date_reason}</div>}
        </dd>
        <dt className="col-sm-4">{text('header:grade')}</dt>
        <dd className="col-sm-8">
            {row.grade && <strong>{row.grade}</strong>}
            {!row.grade && row.provisional_grade && <>
                <Expected grade={row.provisional_grade} text={text} />
                <div className="small text-muted">{text('details:grade_expected', row.completed_at)}</div>
            </>}
            {!row.grade && !row.provisional_grade && <span className="text-muted">—</span>}
        </dd>
        <dt className="col-sm-4">{text('header:gradedby')}</dt>
        <dd className="col-sm-8 mb-0">
            {row.graded_by}
            {!row.graded_by && row.will_grade && <>
                <span className="text-muted">{row.will_grade}</span>
                <div className="small text-muted">{text('gradedby_prospective_help')}</div>
            </>}
            {!row.graded_by && !row.will_grade && <span className="text-muted">—</span>}
        </dd>
    </dl>
</>;

/**
 * The button at the end of a row that opens its details, in the colour of the most serious thing it explains.
 *
 * @param props The row and the texts.
 * @returns The button and, once pressed, the dialog.
 */
const RowDetails = ({row, text}: {row: Row; text: Text}) => {
    const [open, setOpen] = useState(false);
    if (!explains(row)) {
        return null;
    }
    const tone = toneOf(row);
    return <>
        <button
            type="button"
            className={`btn btn-link btn-icon btn-sm btn-hint text-${tone}`}
            title={text('info:row')}
            aria-label={text('info:row')}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
        ><Icon name={tone === 'info' ? 'i/info' : 'i/warning'} text={text} /></button>
        {open && <Dialog title={row.user_name} onClose={() => setOpen(false)} text={text}>
            <Details row={row} text={text} />
        </Dialog>}
    </>;
};

/**
 * The row.
 *
 * @param props The data of the row, the columns that are shown and the texts.
 * @returns The row.
 */
export default function ReportRow({row, columns, forumgrade, text}: ReportRowProps) {
    const tone = TONES[row.status_key] ?? 'secondary';
    return <tr data-record-id={row.rowkey}>
        <td>
            <span className="d-flex align-items-center">
                <img className="userpicture" src={row.user_picture_url} alt="" width={35} height={35} loading="lazy" />
                <a href={row.user_profile_url}>{row.user_name}</a>
            </span>
        </td>
        {columns.course && <td>{row.course_name && <a href={row.course_url}>{row.course_name}</a>}</td>}
        {columns.activity && <td>{row.activity_name && <a href={row.activity_url}>{row.activity_name}</a>}</td>}
        {columns.group && <td className="text-nowrap">{row.groups}</td>}
        <td><span className={`badge badge-soft badge-dot rounded-pill text-bg-${tone}`}>{row.status}</span></td>
        <td className="text-nowrap" data-sort-value={row.completed_at_sort}>{row.completed_at}</td>
        <td className="text-nowrap">
            {row.grade && <strong>{row.grade}</strong>}
            {!row.grade && row.provisional_grade && <Expected grade={row.provisional_grade} text={text} />}
            {!row.grade && !row.provisional_grade && <span className="text-muted">—</span>}
        </td>
        <td>
            {row.graded_by}
            {!row.graded_by && row.will_grade && <span className="text-muted">{row.will_grade}</span>}
            {!row.graded_by && !row.will_grade && <span className="text-muted">—</span>}
        </td>
        <td className="table-actions">
            <RowDetails row={row} text={text} />
            {row.grade_user_url && <a
                className="btn btn-link btn-icon btn-sm text-primary"
                href={row.grade_user_url}
                title={text('gradeuser')}
                aria-label={text('gradeuser')}
            ><Icon name="i/grades" text={text} /></a>}
            {!row.grade_user_url && row.show_forum_grader && forumgrade && <button
                type="button"
                className="btn btn-link btn-icon btn-sm text-primary"
                title={text('gradeuser')}
                aria-label={text('gradeuser')}
                data-grade-action="launch"
                data-grading-component={forumgrade.gradingcomponent}
                data-grading-component-subtype={forumgrade.gradingcomponentsubtype}
                data-experimental-display-mode={forumgrade.experimentaldisplaymode}
                data-initialuserid={row.moodle_userid}
            ><Icon name="i/grades" text={text} /></button>}
        </td>
    </tr>;
}
