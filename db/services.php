<?php
$functions = [
    'report_autograder_get_grades' => [
        'classname' => 'report_autograder\external_get_grades',
        'methodname' => 'get_grades',
        'description' => 'Returns student grades',
        'type' => 'read',
        'loginrequired' => false,
        'ajax' => true,
    ],
];