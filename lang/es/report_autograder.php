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
 * Spanish language strings.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'Ver el informe de Autograder de una actividad';
$string['autograder:viewcourse'] = 'Ver el informe de Autograder de un curso completo';
$string['autograder:viewfailed'] = 'Ver qué calificaciones de Autograder fallaron y por qué';
$string['autograder:viewsite'] = 'Ver el informe de Autograder de todo el sitio';
$string['datepicker_from'] = 'Desde';
$string['datepicker_to'] = 'Hasta';
$string['error:apirequest'] = 'No se pudo cargar el informe: {$a}';
$string['failure:grade_write_failed'] = 'Moodle rechazó la calificación que Autograder intentó publicar.';
$string['failure:no_grader'] = 'Ningún docente de este curso podía calificar en su nombre.';
$string['feedback:nothing_to_show'] = 'No se encontraron registros';
$string['filter_activity'] = 'Actividad';
$string['filter_clear'] = 'Limpiar';
$string['filter_course'] = 'Curso';
$string['filter_date_last30'] = 'Últimos 30 días';
$string['filter_date_month'] = 'Este mes';
$string['filter_date_range'] = '{$a->from} a {$a->to}';
$string['filter_date_since'] = 'Desde {$a}';
$string['filter_date_today'] = 'Hoy';
$string['filter_date_until'] = 'Hasta {$a}';
$string['filter_date_week'] = 'Últimos 7 días';
$string['filter_grading_date'] = 'Fecha de calificación';
$string['filter_group'] = 'Grupo';
$string['filter_group_placeholder'] = 'Todos los grupos';
$string['filter_remove'] = 'Quitar el filtro {$a}';
$string['filter_search'] = 'Buscar';
$string['filter_status'] = 'Estado';
$string['filters'] = 'Filtros';
$string['filters_reset'] = 'Limpiar todos los filtros';
$string['grade_provisional_help'] = 'La calificación indicada es provisional y no se guardará hasta la fecha que muestra la columna «Fecha de calificación».';
$string['gradedby_prospective'] = 'Se calificará como';
$string['gradedby_prospective_help'] = 'Autograder publicará esta calificación a nombre de este docente. El docente se elige en el momento de calificar, de modo que aún puede cambiar: si deja el curso o el grupo, se elegirá a otra persona.';
$string['graders:activities'] = 'Actividades';
$string['graders:associationnote'] = 'Asociación con el curso. El informe de la actividad comprueba los permisos de calificación y los grupos de esa actividad concreta antes de mostrar al calificador efectivo.';
$string['graders:back'] = 'Todos los cursos';
$string['graders:course'] = 'Curso';
$string['graders:empty'] = 'Ningún curso tiene Autograder activado.';
$string['graders:emptysearch'] = 'Nada coincide con la búsqueda y el filtro.';
$string['graders:filter_all'] = 'Todos los estudiantes';
$string['graders:filter_fallback'] = 'Calificados por el calificador de reserva';
$string['graders:filter_nobody'] = 'Que nadie calificaría';
$string['graders:grader'] = 'Calificaría como';
$string['graders:gradercount'] = 'posibles calificadores';
$string['graders:graders'] = 'Calificadores';
$string['graders:heading'] = 'Calificadores por curso';
$string['graders:more'] = '+{$a} más';
$string['graders:nobodyfor'] = 'Nadie: esto fallaría';
$string['graders:nograders'] = 'Nadie en este curso puede calificar. Todas las actividades con Autograder de aquí fallarán a menos que se configure un calificador de reserva.';
$string['graders:none'] = 'No hay estudiantes calificables en este curso.';
$string['graders:note'] = 'Nota';
$string['graders:onlyfallback'] = 'Ningún docente de este curso podría calificar, de modo que cada calificación de aquí se registraría a nombre del calificador de reserva del sitio.';
$string['graders:openreport'] = 'Abrir el informe de este curso';
$string['graders:possible'] = 'Quién podría calificar aquí';
$string['graders:search'] = 'Buscar cursos';
$string['graders:search_students'] = 'Buscar estudiantes';
$string['graders:seestudents'] = 'Quién califica a cada estudiante';
$string['graders:show'] = 'Mostrar';
$string['graders:state'] = 'Calificación';
$string['graders:state_fallback'] = 'Solo el calificador de reserva';
$string['graders:state_nobody'] = 'Nadie puede calificar';
$string['graders:state_ready'] = 'Lista';
$string['graders:student'] = 'Estudiante';
$string['graders:studentcount'] = 'estudiantes calificables';
$string['graders:students'] = 'Estudiantes';
$string['graders:viafallback'] = 'Reserva';
$string['gradeuser'] = 'Calificar al usuario';
$string['header:activity'] = 'Actividad';
$string['header:completed_at'] = 'Fecha de calificación';
$string['header:course'] = 'Curso';
$string['header:external_status'] = 'Estado';
$string['header:grade'] = 'Calificación';
$string['header:gradedby'] = 'Calificado como';
$string['header:groups'] = 'Grupos';
$string['header:student'] = 'Nombre';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder en todo el sitio';
$string['helper'] = 'Calificación provisional';
$string['lead_activity'] = 'Lo que Autograder decidió para cada estudiante de esta actividad';
$string['lead_course'] = 'Lo que Autograder decidió para los estudiantes de este curso, actividad por actividad';
$string['lead_graders'] = 'A nombre de quién calificaría Autograder en cada curso, antes de que venza ninguna calificación';
$string['lead_site'] = 'Lo que Autograder decidió en todo el sitio, acotado por curso, actividad, estado o fecha';
$string['menu:graders'] = 'Calificadores por curso';
$string['menu:report'] = 'Informe de calificación';
$string['needsfilter'] = 'Elija un curso, una actividad u otro filtro para ejecutar este informe. El informe de todo el sitio no se ejecuta sin filtro: consultaría a la base de datos todas las matriculaciones del sitio a la vez.';
$string['pagination:all_results'] = 'Todos';
$string['pagination:label'] = 'Paginación';
$string['pagination:next'] = 'Página siguiente';
$string['pagination:of'] = 'de';
$string['pagination:previous'] = 'Página anterior';
$string['pagination:results_per_page'] = 'Resultados por página';
$string['pluginname'] = 'Informe de Autograder';
$string['privacy:metadata'] = 'El informe de Autograder muestra lo que local_autograder registró y lo que ya está en el libro de calificaciones. No almacena nada propio.';
$string['provisional:advancedstale'] = 'La rúbrica o la pauta de calificación cambió después de indicar a Autograder qué marcar, de modo que no hay una calificación que prometer. Abra los ajustes de Autograder de la actividad y elija de nuevo los niveles.';
$string['provisional:noscale'] = 'Esta actividad ya no usa una escala.';
$string['provisional:scalemismatch'] = 'El elemento que Autograder otorgaría no pertenece a la escala que usa ahora esta actividad.';
$string['provisional:unknown'] = 'Autograder no puede calificar esta actividad tal como está configurada.';
$string['provisional:unset'] = 'No se ha establecido ninguna calificación que Autograder otorgue.';
$string['reason:completion'] = 'Contado desde que el estudiante completó la actividad.';
$string['reason:duedate'] = 'Contado desde la fecha de cierre de la actividad.';
$string['reason:groupoverride'] = 'Contado desde la fecha de cierre que una excepción de grupo concede a este estudiante.';
$string['reason:submission'] = 'Contado desde que el estudiante realizó la entrega.';
$string['reason:useroverride'] = 'Contado desde la fecha de cierre que una excepción concede a este estudiante.';
$string['results_count'] = '{$a} resultados';
$string['search:loading'] = 'Buscando…';
$string['search:nomatches'] = 'Sin coincidencias';
$string['search:typetosearch'] = 'Escriba para buscar';
$string['sortby_date'] = 'Ordenar por fecha de calificación';
$string['sortby_name'] = 'Ordenar por nombre del estudiante';
$string['status:failed'] = 'Con error';
$string['status:graded'] = 'Autocalificado';
$string['status:manual'] = 'Calificado por un docente';
$string['status:notautograded'] = 'No autocalificado';
$string['status:notengaged'] = 'Sin entregar';
$string['status:pending'] = 'Pendiente';
$string['willgrade:nobody'] = 'Este estudiante no tiene ningún docente en este curso y no hay un calificador de reserva configurado, de modo que esta calificación no puede publicarse. Compruebe los roles configurados como docentes y si algún docente comparte uno de los grupos del estudiante en el agrupamiento predeterminado del curso.';
