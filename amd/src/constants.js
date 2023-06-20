export const MAP_METHOD = {
    forum: {
        method: 'core_grades_grader_gradingpanel_point_store',
        mapped: {
            userid: {
                key: 'gradeduserid'
            },
            context_id: {
                key: 'contextid'
            },
            module: {
                key: 'itemname'
            },
            grade: {
                key: 'formdata',
                concat_value: 'grade='
            },
            component: {
                key: 'component'
            }
        },
        additional_data_default: {
            notifyuser: 1
        }
    },
    assign: {
        method: 'local_additional_web_service_save_grade',
        mapped: {
            userid: {
                key: 'userid'
            },
            modid: {
                key: 'assignmentid'
            },
            grade: {
                key: 'grade'
            }
        },
        additional_data_default: {
            attemptnumber: -1,
            addattempt: 0,
            workflowstate: 'graded',
            applytoall: 0,
        }
    }
};