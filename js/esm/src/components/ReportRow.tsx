/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One row of the report: the student, where it applies the course, the activity and the groups, the status, the date, the grade, the
 * teacher it is graded as, and at its end the explanations of the row and the button that opens the grading screen of the activity.
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

/** One explanation of a row: what it is about, what it says, the colour of its meaning and the icon of its kind. */
interface Note {
    title: string;
    message: string;
    tone: 'info' | 'warning' | 'danger';
    icon: string;
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
 * Everything a row has to explain, from the most serious: why it failed, why there is no grade, then why the date, what the
 * provisional grade is and whose name the grade will carry.
 *
 * @param row The row.
 * @param text The texts.
 * @returns The explanations.
 */
const notesOf = (row: Row, text: Text): Note[] => {
    const notes: Note[] = [];
    if (row.failure_reason) {
        notes.push({title: text('info:failure'), message: row.failure_reason, tone: 'danger', icon: 'i/invalid'});
    }
    if (!row.grade && row.grade_problem) {
        notes.push({title: text('info:problem'), message: row.grade_problem, tone: 'warning', icon: 'i/warning'});
    }
    if (!row.graded_by && row.will_grade_problem) {
        notes.push({title: text('info:grader'), message: row.will_grade_problem, tone: 'warning', icon: 'i/warning'});
    }
    if (row.date_reason) {
        notes.push({title: text('info:date'), message: row.date_reason, tone: 'info', icon: 'i/calendar'});
    }
    if (!row.grade && row.provisional_grade) {
        notes.push({title: text('info:grade'), message: text('grade_provisional_help'), tone: 'info', icon: 'i/duration'});
    }
    if (!row.graded_by && row.will_grade) {
        notes.push({title: text('gradedby_prospective'), message: text('gradedby_prospective_help'), tone: 'info', icon: 'i/user'});
    }
    return notes;
};

/**
 * The button at the end of a row that opens its explanations, in the colour of the most serious one.
 *
 * @param props The explanations and the texts.
 * @returns The button, or nothing when the row has nothing to explain.
 */
const Notes = ({notes, text}: {notes: Note[]; text: Text}) => {
    if (notes.length === 0) {
        return null;
    }
    const tone = notes[0].tone;
    return <Hint
        label={text('info:row')}
        icon={tone === 'info' ? 'i/info' : 'i/warning'}
        tone={tone}
        text={text}
        message={<ul className="list-unstyled d-grid gap-3 mb-0">
            {notes.map((note) => <li key={note.title} className="d-flex gap-2">
                <span className={`flex-shrink-0 text-${note.tone}`}><Icon name={note.icon} text={text} /></span>
                <span>
                    <strong className={`d-block text-${note.tone}`}>{note.title}</strong>
                    <span className="text-body">{note.message}</span>
                </span>
            </li>)}
        </ul>}
    />;
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
        <td>
            {row.grade && <strong>{row.grade}</strong>}
            {!row.grade && row.provisional_grade && <span className="text-muted text-nowrap" title={text('info:grade')}>
                <Icon name="i/duration" text={text} /> <span className="fst-italic">{row.provisional_grade}</span>
            </span>}
            {!row.grade && !row.provisional_grade && <span className="text-muted">—</span>}
        </td>
        <td className="text-nowrap">
            {row.graded_by}
            {!row.graded_by && row.will_grade && <span className="fst-italic text-muted">{row.will_grade}</span>}
            {!row.graded_by && !row.will_grade && <span className="text-muted">—</span>}
        </td>
        <td className="table-actions">
            <Notes notes={notesOf(row, text)} text={text} />
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
