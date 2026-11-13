/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of the report, with the header of its sortable columns, its rows and what it says when it has none.
 *
 * @module     report_autograder/components/ReportTable
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {ReactNode} from 'react';
import ReportRow from './ReportRow';
import {Empty, SortHeader, TableBox} from './ui';
import type {ReportState} from '../hooks/useReport';
import type {ForumGrade, ReportProps, Sort, SortColumn, Text} from '../types';

interface ReportTableProps {
    state: ReportState;
    columns: ReportProps['columns'];
    forumgrade: ForumGrade | null;
    sort: Sort;
    narrowed: boolean;
    text: Text;
    onSort: (column: SortColumn) => void;
    onRetry: () => void;
    onClear: () => void;
}

/**
 * The table.
 *
 * @param props The page that is shown, the columns, the sort and what to do about it.
 * @returns The table.
 */
export default function ReportTable({state, columns, forumgrade, sort, narrowed, text, onSort, onRetry, onClear}: ReportTableProps) {
    const sorted = (column: SortColumn) => ({active: sort.column === column, direction: sort.direction, onSort: () => onSort(column)});
    const count = 5 + Number(columns.course) + Number(columns.activity) + Number(columns.group) + 1;
    const failed = state.failed !== '';
    const empty = !failed && !state.needsfilter && !state.loading && state.rows.length === 0;

    let blank: ReactNode = null;
    if (failed) {
        blank = <Empty icon="i/warning" message={text('error:apirequest', state.failed)} action={text('error:retry')} onAction={onRetry}
            text={text} />;
    } else if (state.needsfilter) {
        blank = <Empty icon="i/filter" message={text('needsfilter')} text={text} />;
    } else if (empty) {
        blank = <Empty
            icon={narrowed ? 'a/search' : 'i/grades'}
            message={narrowed ? text('table:empty') : text('feedback:nothing_to_show')}
            action={narrowed ? text('filters_reset') : undefined}
            onAction={narrowed ? onClear : undefined}
            text={text}
        />;
    }

    return <TableBox busy={state.loading} empty={blank}>
        <table className="table">
            <caption className="visually-hidden sr-only">{text('pluginname')}</caption>
            <thead>
                <tr>
                    <SortHeader label={text('header:student')} help={text('sortby_name')} {...sorted('user_name')} />
                    {columns.course && <th scope="col">{text('header:course')}</th>}
                    {columns.activity && <th scope="col">{text('header:activity')}</th>}
                    {columns.group && <th scope="col">{text('header:groups')}</th>}
                    <th scope="col">{text('header:external_status')}</th>
                    <SortHeader label={text('header:completed_at')} help={text('sortby_date')} {...sorted('completed_at_sort')} />
                    <th scope="col">{text('header:grade')}</th>
                    <th scope="col">{text('header:gradedby')}</th>
                    <th scope="col" className="table-actions"><span className="visually-hidden">{text('gradeuser')}</span></th>
                </tr>
            </thead>
            <tbody>
                {state.rows.map((row) => <ReportRow key={row.rowkey} row={row} columns={columns} forumgrade={forumgrade} text={text} />)}
                {state.loading && state.rows.length === 0 && Array.from({length: 6}, (_, index) => <tr key={`sk${index}`} aria-hidden="true">
                    {Array.from({length: count}, (__, cell) => <td key={cell}><span className="dd-skeleton" /></td>)}
                </tr>)}
            </tbody>
        </table>
    </TableBox>;
}
