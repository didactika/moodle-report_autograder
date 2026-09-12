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
 * @copyright  2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @author     Hector Arrechea <hector.arrechea@uneatlantico.es>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


$string['pluginname'] = 'Calificación automática'; //TODO: preguntar cómo debia se
$string['header:student'] = 'Nombre / Apellido(s)';
$string['header:delivery_date'] = 'Fecha de entrega';
$string['header:modification_date'] = 'Última modificación (calificación)';
$string['header:grade_date'] = 'Fecha a calificar';
$string['header:grade'] = 'Calificación';
$string['header:status'] = 'Estado';
$string['header:external_status'] = 'Estado';
$string['header:completed_at'] = 'Fecha de calificación';
$string['status:pending'] = 'Pendiente de calificar';
$string['status:awaiting_confirmation_of_rating'] = 'Pendiente de calificar';
$string['status:ready_to_grade'] = 'Pendiente de calificar';
$string['status:retry'] = 'Pendiente de calificar';
$string['status:graded'] = 'Calificado automaticamente';
$string['status:failed'] = 'Pendiente de calificar';
$string['status:failed_notified'] = 'Fallo notificado al administrador';
$string['status:skipped'] = 'Pendiente de calificar';
$string['status:manual_grading'] = 'Calificado manualmente';
$string['status:pending_delivery'] = 'Pendiente de entrega';
$string['feedback:nothing_to_show'] = 'No se encontraron registros';
$string['placeholder:automatic_grade'] = 'Calificación automática';
$string['navigation:go_back'] = 'Volver';
$string['navigation:location'] = 'Informe de Calificaciones Automáticas';
$string['error:apirequest'] = 'Error al comunicarse con el servicio externo: {$a}';
$string['error:grade_required'] = 'La calificación es obligatoria';
$string['action:grade'] = 'Calificar';
$string['setting:site_external_id'] = 'ID externo del sitio';
$string['setting:site_externalid_desc'] = 'El identificador externo para este sitio Moodle utilizado por el servicio de calificación automática';
$string['setting:url_field_name'] = 'URL del servicio externo';
$string['setting:url_field_desc'] = 'URL del servicio externo al que se pedirán los datos de calificación';
$string['error:missing_config'] = 'Falta la configuración de {$a}. Por favor, contacte al administrador.';
$string['error:building_report_data'] = 'Error al generar los datos del informe. Por favor, contacte al administrador.';
$string['feedback:no_status'] = 'Sin estado';
$string['setting:pagination_limit_name'] = 'Límite de paginación';
$string['setting:pagination_limit_desc'] = 'Número de elementos a mostrar por página en el informe del Auto Calificador.';
$string['autograder:view'] = 'Ver informe del Auto Calificador';
$string['filter_all'] = 'Todos';
$string['manual_grading'] = 'Calificación manual'; // TODO: ESTO YA NO EXISTIRA
$string['manual_grading_send'] = 'Enviar calificación';
$string['success:gradeupdated'] = '¡Calificación actualizada correctamente!';
$string['error:updatefailed'] = 'Error al actualizar la calificación:';
$string['error:invalidgrade'] = 'Ingrese una calificación numérica válida.';
$string['error:gradetoolarge'] = 'La calificación no puede ser mayor que {$a->maxgrade}.';
$string['error:negativegrade'] = 'La calificación no puede ser negativa.';
$string['filter_button'] = 'Filtrar';
$string['filter_submission_date'] = 'Fecha de entrega';
$string['filter_grading_date'] = 'Fecha de calificación';
$string['filter_datefrom'] = 'Fecha de entrega desde';
$string['filter_dateto'] = 'Fecha calificada desde';
$string['filter_grade'] = 'Calificación desde';
$string['filter_grade_placeholder'] = 'Ingrese la calificación';
$string['filter_status'] = 'Estado';
$string['filter_status_placeholder'] = 'Estado...';
$string['filter_status_pending'] = 'Pendiente';
$string['filter_status_manual_grading'] = 'Calificación manual';
$string['filter_status_graded'] = 'Calificado';
$string['pagination:results_per_page'] = 'Resultados por página';
$string['pagination:all_results'] = 'Todos';
$string['pagination:of'] = 'de';
$string['pagination:previous'] = 'Página anterior';
$string['pagination:next'] = 'Página siguiente';
$string['filter_clear'] = 'Limpiar filtros';
$string['filter_search'] = 'Buscar';
$string['datepicker_apply'] = 'Aplicar';
$string['datepicker_cancel'] = 'Limpiar';
$string['datepicker_from'] = 'Desde';
$string['datepicker_to'] = 'Hasta';
$string['datepicker_custom'] = 'Personalizado';
$string['datepicker_week'] = 'Sm';
$string['filter_active'] = 'Filtros activos:';
$string['filter_active_searchname'] = 'Nombre: {$a}';
$string['filter_active_datefrom'] = 'Desde: {$a}';
$string['filter_active_dateto'] = 'Desde: {$a}';
$string['filter_active_grade'] = 'Calificación: {$a}';
$string['filter_active_status'] = 'Estado: {$a}';
$string['gradeuser'] = 'Calificar usuario';
$string['sortby_name'] = 'Ordenar por nombre del estudiante';
$string['sortby_date'] = 'Ordenar por fecha de calificación';
$string['grade_provisional_help'] = 'La calificación indicada es provisional y no se guardará hasta la fecha indicada en la columna \'Fecha de calificación\'.';
$string['helper'] = 'Nota provisional';
