<?php
    /**
     * Services declare here.
     *
     * @package     report_autograder
     * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
     * @author      Eduardo Cubias <eduardo.cubias@ct.uneatlantico.es>
     * @author      Hector Arrechea <hector.arrechea@uneatlantico.es>
     * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
     */
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
    ]
];
