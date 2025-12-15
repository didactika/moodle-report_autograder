<?php
    /**
     * Capability required modified here
     *
     * @package     report_autograder
     * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */

defined('MOODLE_INTERNAL') || die();

$capabilities = [
    'report/autograder:view' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'clonepermissionsfrom' => 'moodle/grade:viewall',
    ],
];
