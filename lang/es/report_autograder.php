<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Lang strings
 *
 * @package    report
 * @subpackage autograder
 * @copyright  2022
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'Reporte de calificaciones automáticas';
$string['header:student'] = 'Nombre';
$string['header:delivery_date'] = 'Fecha entregada';
$string['header:modification_date'] = 'Última modificación (calificación)';
$string['header:grade_date'] = 'Fecha a ser calificado';
$string['header:grade'] = 'Calificación';
$string['header:status'] = 'Estado';
$string['header:external_status'] = 'Estado';
$string['header:completed_at'] = 'Fecha de calificación';
$string['status:pending'] = 'Pendiente';
$string['status:waiting_for_due_date'] = 'Esperando fecha de entrega';
$string['status:waiting_for_grading'] = 'Esperando calificación';
$string['status:ready_to_grade'] = 'Listo para calificar';
$string['status:grading'] = 'Calificando';
$string['status:graded'] = 'Calificado';
$string['status:failed'] = 'Fallido';
$string['status:skipped'] = 'Omitido';
$string['status:manual_grading'] = 'Calificación manual';
$string['feedback:nothing_to_show'] = 'No se han encontrado registros';
$string['placeholder:automatic_grade'] = 'Nota automática';
$string['navigation:go_back'] = 'Regresar';
$string['navigation:location'] = 'Reporte de Calificaciones Automáticas';
$string['error:grade_required'] = 'La calificación es requerida';
$string['action:grade'] = 'Calificar';
$string['setting:url_field_name'] = 'URL del servicio externo';
$string['setting:url_field_desc'] = 'URL del servicio externo para obtener los datos de calificación';
$string['error:missing_config'] = 'Falta la configuración para {$a}. Por favor, contacte al administrador.';
$string['error:building_report_data'] = 'Error al construir los datos del reporte. Por favor, contacte al administrador.';
$string['feedback:no_status'] = 'Sin estado';
$string['setting:pagination_limit_name'] = 'Límite de paginación';
$string['setting:pagination_limit_desc'] = 'Número de elementos a mostrar por página en el informe del Autograder.';
$string['report/autograder:view'] = 'Ver informe de autocalificador';
$string['manual_grading'] = 'Calificación Manual';
$string['manual_grading_send'] = 'Enviar Calificación';
$string['success:gradeupdated'] = '¡Calificación actualizada con éxito!';
$string['error:updatefailed'] = 'Fallo al actualizar la calificación:';
$string['error:invalidgrade'] = 'Por favor, ingrese una calificación numérica válida.';
$string['error:gradetoolarge'] = 'La calificación no puede ser mayor a {$a->maxgrade}.';
$string['error:negativegrade'] = 'La calificación no puede ser un valor negativo.';
