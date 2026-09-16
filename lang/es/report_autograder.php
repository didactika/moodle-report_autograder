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

$string['autograder:view'] = 'Ver el informe de autograder de una actividad';
$string['autograder:viewcourse'] = 'Ver el informe de autograder de un curso entero';
$string['autograder:viewfailed'] = 'Ver qué autocalificaciones fallaron, y por qué';
$string['autograder:viewsite'] = 'Ver el informe de autograder de todo el sitio';
$string['datepicker_apply'] = 'Aplicar';
$string['datepicker_cancel'] = 'Limpiar';
$string['datepicker_custom'] = 'Personalizado';
$string['datepicker_from'] = 'Desde';
$string['datepicker_to'] = 'Hasta';
$string['datepicker_week'] = 'Sem';
$string['error:apirequest'] = 'No se ha podido cargar el informe: {$a}';
$string['failure:grade_write_failed'] = 'Moodle rechazó la nota que autograder intentó poner.';
$string['failure:no_grader'] = 'Ningún profesor del curso podía ser elegido para calificar en su nombre.';
$string['feedback:nothing_to_show'] = 'No se han encontrado registros';
$string['filter_activity'] = 'Actividad';
$string['filter_activity_placeholder'] = 'Todas las actividades';
$string['filter_course'] = 'Curso';
$string['filter_course_placeholder'] = 'Todos los cursos';
$string['filter_grading_date'] = 'Fecha de calificación';
$string['filter_group'] = 'Grupo';
$string['filter_group_placeholder'] = 'Todos los grupos';
$string['filter_search'] = 'Buscar';
$string['filter_status_placeholder'] = 'Estado...';
$string['grade_provisional_help'] = 'La nota indicada es provisional y no se guardará hasta la fecha que muestra la columna \'Fecha de calificación\'.';
$string['gradedby_prospective'] = 'Se calificará en nombre de';
$string['gradedby_prospective_help'] = 'Autograder pondrá esta nota en nombre de este profesor. El profesor se elige en el momento de calificar, así que esto aún puede cambiar: si deja el curso o el grupo, se elegirá a otro.';
$string['graders:courseidplaceholder'] = 'Busca un curso…';
$string['graders:grader'] = 'Calificaría como';
$string['graders:heading'] = 'Calificadores por curso';
$string['graders:intro'] = 'Elige un curso para ver a nombre de quién publicaría autograder sus calificaciones, antes de que venza ninguna.';
$string['graders:nobody'] = '{$a} estudiante(s) no tienen docente ni calificador de respaldo. Autograder registrará un fallo para cada uno en lugar de calificarlos.';
$string['graders:none'] = 'No hay estudiantes calificables en este curso.';
$string['graders:openreport'] = 'Abrir el informe de este curso';
$string['graders:pickcourse'] = 'Curso';
$string['graders:show'] = 'Mostrar';
$string['graders:students'] = 'Estudiantes';
$string['graders:studentswalked'] = '{$a} estudiante(s) calificables.';
$string['graders:truncated'] = 'Solo se han comprobado los primeros {$a} estudiantes. El resto no se muestra.';
$string['graders:viafallback'] = 'Respaldo';
$string['gradeuser'] = 'Calificar al estudiante';
$string['header:activity'] = 'Actividad';
$string['header:completed_at'] = 'Fecha de calificación';
$string['header:course'] = 'Curso';
$string['header:external_status'] = 'Estado';
$string['header:grade'] = 'Nota';
$string['header:gradedby'] = 'Calificado como';
$string['header:groups'] = 'Grupos';
$string['header:student'] = 'Nombre';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder en todo el sitio';
$string['helper'] = 'Nota provisional';
$string['menu:graders'] = 'Calificadores por curso';
$string['menu:report'] = 'Informe de calificaciones';
$string['needsfilter'] = 'Elige un curso, una actividad u otro filtro para ejecutar este informe. El informe de sitio no se ejecuta sin filtrar: preguntaría a la base de datos por todas las matrículas del campus a la vez.';
$string['pagination:all_results'] = 'Todos';
$string['pagination:next'] = 'Página siguiente';
$string['pagination:of'] = 'de';
$string['pagination:previous'] = 'Página anterior';
$string['pagination:results_per_page'] = 'Resultados por página';
$string['pluginname'] = 'Informe de autograder';
$string['privacy:metadata'] = 'El informe de autograder muestra lo que registró local_autograder y lo que ya está en el libro de calificaciones. No guarda nada propio.';
$string['provisional:advancedstale'] = 'La rúbrica o guía de evaluación cambió después de indicarle a autograder qué marcar, así que no hay nota que prometer. Abre las opciones de autograder de la actividad y vuelve a elegir los niveles.';
$string['provisional:noscale'] = 'Esta actividad ya no usa una escala.';
$string['provisional:scalemismatch'] = 'El elemento que pondría autograder no pertenece a la escala que usa ahora la actividad.';
$string['provisional:unknown'] = 'Autograder no puede calificar esta actividad tal y como está configurada.';
$string['provisional:unset'] = 'No se ha fijado ninguna nota para que autograder la ponga.';
$string['reason:completion'] = 'Se cuenta desde que el estudiante finalizó la actividad.';
$string['reason:duedate'] = 'Se cuenta desde la fecha de cierre de la actividad.';
$string['reason:groupoverride'] = 'Se cuenta desde la fecha de cierre que le concede a este estudiante una excepción de grupo.';
$string['reason:submission'] = 'Se cuenta desde que el estudiante entregó.';
$string['reason:useroverride'] = 'Se cuenta desde la fecha de cierre que le concede a este estudiante una excepción.';
$string['search:loading'] = 'Buscando…';
$string['search:nomatches'] = 'Sin coincidencias';
$string['sortby_date'] = 'Ordenar por fecha de calificación';
$string['sortby_name'] = 'Ordenar por nombre del estudiante';
$string['status:failed'] = 'Fallido';
$string['status:graded'] = 'Autocalificado';
$string['status:manual'] = 'Calificado por un profesor';
$string['status:notautograded'] = 'Sin autocalificar';
$string['status:notengaged'] = 'Sin entregar';
$string['status:pending'] = 'Pendiente';
$string['willgrade:nobody'] = 'Ningún profesor de esta actividad puede ser el calificador, así que esta nota no se podrá poner. Revisa quién tiene el permiso para que se califique en su nombre y si comparte grupo con el estudiante.';
