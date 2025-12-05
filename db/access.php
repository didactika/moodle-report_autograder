<?php

defined('MOODLE_INTERNAL') || die();

$capabilities = [
    'report/autograder:view' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'clonepermissionsfrom' => 'moodle/grade:viewall',
    ],
];
