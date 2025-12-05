<?php

defined('MOODLE_INTERNAL') || die();

$functions = [
    'report_autograder_get_report_data' => [
        'classname'   => 'report_autograder\\webservice\\external_get_grade_report',
        'methodname'  => 'get_report_data',
        'classpath'   => 'report_autograder/webservice/external_get_grade_report',
        'description' => 'Get autograder report data for a specific course module.',
        'type'        => 'read',
        'requirelogin' => true,
        'ajax'        => true,
    ],
    'report_autograder_update_user_grade' => [
        'classname'   => 'report_autograder\\webservice\\external_update_user_grade',
        'methodname'  => 'update_user_grade',
        'classpath'   => 'report_autograder/webservice/external_update_user_grade',
        'description' => 'Update a user grade for autograder via POST.',
        'type'        => 'write',
        'requirelogin' => true,
        'ajax'        => true,
    ],
];
