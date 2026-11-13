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
import ReportRow from './ReportRow';
import {Empty, SortHeader} from './ui';
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

    return <div className="table-responsive" aria-busy={state.loading}>
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
                    <th scope="col"><span className="visually-hidden sr-only">{text('gradeuser')}</span></th>
                </tr>
            </thead>
            <tbody>
                {state.rows.map((row) => <ReportRow key={row.rowkey} row={row} columns={columns} forumgrade={forumgrade} text={text} />)}
                {state.loading && state.rows.length === 0 && Array.from({length: 6}, (_, index) => <tr key={`sk${index}`} aria-hidden="true">
                    {Array.from({length: count}, (__, cell) => <td key={cell}><span className="placeholder-glow"><span className="placeholder col-8" /></span></td>)}
                </tr>)}
            </tbody>
        </table>
        {failed && <Empty message={text('error:apirequest', state.failed)} action={text('error:retry')} onAction={onRetry} />}
        {state.needsfilter && <Empty message={text('needsfilter')} />}
        {empty && <Empty
            message={narrowed ? text('table:empty') : text('feedback:nothing_to_show')}
            action={narrowed ? text('filters_reset') : undefined}
            onAction={narrowed ? onClear : undefined}
        />}
    </div>;
}
