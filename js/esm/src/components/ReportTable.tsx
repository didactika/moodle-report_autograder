/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of the report: its sortable headers, the rows, grey blocks while it loads and a message when there is nothing to show.
 * On a narrow screen every row becomes a card that names each value.
 *
 * @module     report_autograder/components/ReportTable
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {IconArrowDown, IconArrowUp, IconSort} from './common/Icons';
import ReportRow from './ReportRow';
import type {ReportState} from '../hooks/useReport';
import type {ForumGrade, ReportProps, Sort, SortColumn, Text} from '../types';

interface ReportTableProps {
    state: ReportState;
    columns: ReportProps['columns'];
    forumgrade: ForumGrade | null;
    sort: Sort;
    text: Text;
    onSort: (column: SortColumn) => void;
    onRetry: () => void;
}

interface SortHeaderProps {
    column: SortColumn;
    label: string;
    help: string;
    sort: Sort;
    onSort: (column: SortColumn) => void;
}

const SortHeader = ({column, label, help, sort, onSort}: SortHeaderProps) => {
    const active = sort.column === column;
    let icon = <IconSort />;
    if (active) {
        icon = sort.direction === 'asc' ? <IconArrowUp /> : <IconArrowDown />;
    }
    let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
    if (active) {
        ariaSort = sort.direction === 'asc' ? 'ascending' : 'descending';
    }
    return <th scope="col" aria-sort={ariaSort}>
        <button type="button" className={`arp-sort${active ? ' arp-sort-on' : ''}`} aria-label={help} onClick={() => onSort(column)}>
            <span>{label}</span>
            {icon}
        </button>
    </th>;
};

/**
 * The table.
 *
 * @param props What it shows, how it is sorted and what to do when a header is pressed.
 * @returns The table, or the message that stands in its place.
 */
export default function ReportTable({state, columns, forumgrade, sort, text, onSort, onRetry}: ReportTableProps) {
    const count = 5 + Number(columns.course) + Number(columns.activity) + Number(columns.group) + 1;
    let message = '';
    if (state.failed !== '') {
        message = text('error:apirequest', state.failed);
    } else if (state.needsfilter) {
        message = text('needsfilter');
    } else if (!state.loading && state.rows.length === 0) {
        message = text('feedback:nothing_to_show');
    }

    return <div className="arp-table-wrap" aria-busy={state.loading}>
        <div className="arp-table-scroll" tabIndex={0} role="region" aria-label={text('pluginname')}>
            <table className={`arp-table${state.loading ? ' arp-table-loading' : ''}`}>
                <caption className="sr-only visually-hidden">{text('pluginname')}</caption>
                <thead>
                    <tr>
                        <SortHeader column="user_name" label={text('header:student')} help={text('sortby_name')} sort={sort} onSort={onSort} />
                        {columns.course && <th scope="col">{text('header:course')}</th>}
                        {columns.activity && <th scope="col">{text('header:activity')}</th>}
                        {columns.group && <th scope="col">{text('header:groups')}</th>}
                        <th scope="col">{text('header:external_status')}</th>
                        <SortHeader
                            column="completed_at_sort"
                            label={text('header:completed_at')}
                            help={text('sortby_date')}
                            sort={sort}
                            onSort={onSort}
                        />
                        <th scope="col">{text('header:grade')}</th>
                        <th scope="col">{text('header:gradedby')}</th>
                        <th scope="col"><span className="sr-only visually-hidden">{text('gradeuser')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {state.rows.map((row) => <ReportRow key={row.rowkey} row={row} columns={columns} forumgrade={forumgrade} text={text} />)}
                    {state.loading && state.rows.length === 0 && Array.from({length: 6}, (_, index) => <tr key={`sk${index}`} className="arp-skeleton-row" aria-hidden="true">
                        {Array.from({length: count}, (__, cell) => <td key={cell}><span className="arp-sk arp-sk-line" /></td>)}
                    </tr>)}
                </tbody>
            </table>
        </div>
        {message !== '' && <div className="arp-empty" role="status">
            <p className="arp-empty-text">{message}</p>
            {state.failed !== '' && <button type="button" className="arp-action" onClick={onRetry}>{text('error:retry')}</button>}
        </div>}
    </div>;
}
