/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the grade, the
 * teacher it is graded as and the button that opens the grading screen of the activity.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {Hint, Icon} from './ui';
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
 * The grade of a row: the one it has, or the one it will get with the reason that explains it.
 *
 * @param props The row and the texts.
 * @returns The grade.
 */
const Grade = ({row, text}: {row: Row; text: Text}) => {
    if (row.grade) {
        return <strong>{row.grade}</strong>;
    }
    return <>
        {row.provisional_grade && <span className="fst-italic text-muted">
            {row.provisional_grade} <Hint message={text('grade_provisional_help')} label={text('info:grade')} icon="i/info" text={text} />
        </span>}
        {row.grade_problem && <Hint message={row.grade_problem} label={text('info:problem')} icon="i/warning" tone="warning" text={text} />}
    </>;
};

/**
 * The teacher a row is graded as, or would be.
 *
 * @param props The row and the texts.
 * @returns The teacher.
 */
const Grader = ({row, text}: {row: Row; text: Text}) => {
    if (row.graded_by) {
        return <>{row.graded_by}</>;
    }
    return <>
        {row.will_grade && <span className="text-muted">
            {row.will_grade} <Hint message={text('gradedby_prospective_help')} label={text('gradedby_prospective')} icon="i/info" text={text} />
        </span>}
        {row.will_grade_problem && <Hint message={row.will_grade_problem} label={text('info:problem')} icon="i/warning" tone="warning" text={text} />}
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
        {columns.group && <td>{row.groups}</td>}
        <td>
            <span className={`badge badge-soft badge-dot rounded-pill text-bg-${tone}`}>{row.status}</span>
            {row.failure_reason && <> <Hint message={row.failure_reason} label={text('info:failure')} icon="i/warning" tone="danger" text={text} /></>}
        </td>
        <td data-sort-value={row.completed_at_sort}>
            {row.completed_at}
            {row.date_reason && <> <Hint message={row.date_reason} label={text('info:date')} icon="i/info" text={text} /></>}
        </td>
        <td><Grade row={row} text={text} /></td>
        <td><Grader row={row} text={text} /></td>
        <td className="table-actions">
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
