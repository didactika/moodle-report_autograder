/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * One student of one activity: who, where, in which state, when, with which grade, graded as whom, and the way to grade.
 *
 * @module     report_autograder/components/ReportRow
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Hint from './common/Hint';
import {IconInfo, IconWarning} from './common/Icons';
import StatusBadge from './StatusBadge';
import type {ForumGrade, ReportProps, Row, Text} from '../types';

interface ReportRowProps {
    row: Row;
    columns: ReportProps['columns'];
    forumgrade: ForumGrade | null;
    text: Text;
}

/**
 * The grade of the row: the one the student has, or the one that is going to be given, or why there is none.
 *
 * @param props The row and how to look texts up.
 * @returns The content of the cell.
 */
const Grade = ({row, text}: {row: Row; text: Text}) => {
    if (row.grade) {
        return <span className="arp-grade">{row.grade}</span>;
    }
    return <>
        {row.provisional_grade && <span className="arp-grade arp-grade-provisional">
            {row.provisional_grade}
            <Hint text={text('grade_provisional_help')} label={text('info:grade')} icon={<IconInfo />} />
        </span>}
        {row.grade_problem && <Hint text={row.grade_problem} label={text('info:problem')} icon={<IconWarning />} />}
    </>;
};

/**
 * Who the grade is or will be posted as.
 *
 * @param props The row and how to look texts up.
 * @returns The content of the cell.
 */
const Grader = ({row, text}: {row: Row; text: Text}) => {
    if (row.graded_by) {
        return <>{row.graded_by}</>;
    }
    return <>
        {row.will_grade && <span className="arp-prospective">
            {row.will_grade}
            <Hint text={text('gradedby_prospective_help')} label={text('gradedby_prospective')} icon={<IconInfo />} />
        </span>}
        {row.will_grade_problem && <Hint text={row.will_grade_problem} label={text('info:problem')} icon={<IconWarning />} />}
    </>;
};

/**
 * The row.
 *
 * @param props The row, the columns that the table has, the forum grader if there is one and how to look texts up.
 * @returns The row.
 */
export default function ReportRow({row, columns, forumgrade, text}: ReportRowProps) {
    return <tr data-record-id={row.rowkey}>
        <td className="arp-cell-student" data-label={text('header:student')}>
            <a className="arp-student" href={row.user_profile_url}>
                <img className="arp-avatar" src={row.user_picture_url} alt="" width={36} height={36} loading="lazy" />
                <span className="arp-student-name">{row.user_name}</span>
            </a>
        </td>
        {columns.course && <td data-label={text('header:course')}>
            {row.course_name && <a href={row.course_url}>{row.course_name}</a>}
        </td>}
        {columns.activity && <td data-label={text('header:activity')}>
            {row.activity_name && <a href={row.activity_url}>{row.activity_name}</a>}
        </td>}
        {columns.group && <td data-label={text('header:groups')}>{row.groups}</td>}
        <td data-label={text('header:external_status')}><StatusBadge row={row} text={text} /></td>
        <td data-label={text('header:completed_at')} data-sort-value={row.completed_at_sort}>
            {row.completed_at}
            {row.date_reason && <Hint text={row.date_reason} label={text('info:date')} icon={<IconInfo />} />}
        </td>
        <td className="arp-cell-grade" data-label={text('header:grade')}><Grade row={row} text={text} /></td>
        <td data-label={text('header:gradedby')}><Grader row={row} text={text} /></td>
        <td className="arp-cell-action">
            {row.grade_user_url && <a className="arp-action" href={row.grade_user_url}>{text('gradeuser')}</a>}
            {!row.grade_user_url && row.show_forum_grader && forumgrade && <button
                type="button"
                className="arp-action"
                data-grade-action="launch"
                data-grading-component={forumgrade.gradingcomponent}
                data-grading-component-subtype={forumgrade.gradingcomponentsubtype}
                data-experimental-display-mode={forumgrade.experimentaldisplaymode}
                data-initialuserid={row.moodle_userid}
            >
                {text('gradeuser')}
            </button>}
        </td>
    </tr>;
}
