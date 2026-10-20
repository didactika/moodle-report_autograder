/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The types that the parts of the report share.
 *
 * @module     report_autograder/types
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** Looks a text of the page up, putting the value in the place that the text marks. */
export type Text = (name: string, value?: string | number | Record<string, string | number>) => string;

export type Level = 'site' | 'course' | 'activity';

/** A course, an activity or a group that a picker offers. */
export interface Option {
    id: number;
    name: string;
}

export interface StatusOption {
    key: string;
    label: string;
}

/** What the report is narrowed to. */
export interface Filters {
    searchname: string;
    status: string[];
    datefrom: string;
    dateto: string;
    courseid: number;
    cmid: number;
    groupid: number;
}

/** What the forum grader needs to open on the students that the report shows. */
export interface ForumGrade {
    contextid: number;
    cmid: number;
    name: string;
    courseid: number;
    coursename: string;
    experimentaldisplaymode: number;
    groupid: number | null;
    gradingcomponent: string;
    gradingcomponentsubtype: string;
    gradeonlyactiveusers: number;
    sendstudentnotifications: boolean;
}

export interface ReportProps {
    level: Level;
    scope: {cmid?: number; courseid?: number};
    canseefailures: boolean;
    statuses: StatusOption[];
    opening: Filters;
    selectedcourse: Option | null;
    selectedactivity: Option | null;
    showscoursefilter: boolean;
    showsactivityfilter: boolean;
    showsgroupfilter: boolean;
    groups: (Option & {selected: boolean})[];
    offersallgroups: boolean;
    columns: {activity: boolean; course: boolean; group: boolean};
    forumgrade: ForumGrade | null;
    pagesizes: number[];
    gradersurl: string;
    strings: Record<string, string>;
}

/** One student of one activity, as the server describes the row. */
export interface Row {
    rowkey: string;
    user_col: string;
    user_name: string;
    user_profile_url: string;
    user_picture_url: string;
    moodle_userid: number;
    courseid: number;
    instanceid: number;
    modname: string;
    status: string;
    status_key: string;
    status_class: string;
    completed_at: string;
    completed_at_sort: number;
    date_reason?: string;
    grade?: string;
    provisional_grade?: string;
    grade_problem?: string;
    graded_by?: string;
    will_grade?: string;
    will_grade_problem?: string;
    shows_groups?: boolean;
    groups?: string;
    failure_reason?: string;
    activity_name?: string;
    activity_url?: string;
    course_name?: string;
    course_url?: string;
    grade_user_url?: string;
    show_forum_grader?: boolean;
}

export interface ReportResponse {
    totalrecords: number;
    limit: number;
    page: number;
    needsfilter?: boolean;
    data: Row[];
}

export type SortColumn = 'user_name' | 'completed_at_sort';

export interface Sort {
    column: SortColumn | '';
    direction: 'asc' | 'desc';
}

export interface OptionsResponse {
    options: Option[];
    hasmore: boolean;
}

export interface Grader {
    id: number;
    name: string;
    isfallback: boolean;
}

export interface StudentGrader {
    name: string;
    grader?: string;
    hasgrader: boolean;
    viafallback: boolean;
}

export interface GradersResponse {
    course: string;
    reporturl: string;
    graders: Grader[];
    hasgraders: boolean;
    gradercount: number;
    studentcount: number;
    hasfallback: boolean;
    hasstudents: boolean;
    studentlist: {
        students: StudentGrader[];
        total: number;
        page: number;
        perpage: number;
        from: number;
        to: number;
        pages: number;
    };
}

export interface GradersProps {
    courseid: number;
    students: boolean;
    pagesizes: number[];
    perpage: number;
    strings: Record<string, string>;
}
