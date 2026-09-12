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
 * Portuguese language strings.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'Ver o relatório do autograder de uma atividade';
$string['autograder:viewcourse'] = 'Ver o relatório do autograder de um curso inteiro';
$string['autograder:viewfailed'] = 'Ver que avaliações automáticas falharam, e porquê';
$string['autograder:viewsite'] = 'Ver o relatório do autograder de todo o site';
$string['datepicker_apply'] = 'Aplicar';
$string['datepicker_cancel'] = 'Limpar';
$string['datepicker_custom'] = 'Personalizado';
$string['datepicker_from'] = 'De';
$string['datepicker_to'] = 'Até';
$string['datepicker_week'] = 'Sem';
$string['error:apirequest'] = 'Não foi possível carregar o relatório: {$a}';
$string['failure:grade_write_failed'] = 'O Moodle recusou a nota que o autograder tentou lançar.';
$string['failure:no_grader'] = 'Nenhum professor do curso podia ser escolhido para avaliar em seu nome.';
$string['feedback:nothing_to_show'] = 'Não foram encontrados registos';
$string['filter_activity'] = 'Atividade';
$string['filter_activity_placeholder'] = 'Todas as atividades';
$string['filter_course'] = 'Curso';
$string['filter_course_placeholder'] = 'Todos os cursos';
$string['filter_grading_date'] = 'Data de avaliação';
$string['filter_search'] = 'Pesquisar';
$string['filter_status_graded'] = 'Autoavaliado';
$string['filter_status_manual_grading'] = 'Por um professor';
$string['filter_status_pending'] = 'Pendente';
$string['filter_status_placeholder'] = 'Estado...';
$string['grade_provisional_help'] = 'A nota indicada é provisória e só será guardada na data que a coluna \'Data de avaliação\' mostra.';
$string['gradeuser'] = 'Avaliar o estudante';
$string['header:activity'] = 'Atividade';
$string['header:completed_at'] = 'Data de avaliação';
$string['header:course'] = 'Curso';
$string['header:external_status'] = 'Estado';
$string['header:grade'] = 'Nota';
$string['header:gradedby'] = 'Avaliado como';
$string['header:student'] = 'Nome';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder em todo o site';
$string['helper'] = 'Nota provisória';
$string['pagination:all_results'] = 'Todos';
$string['pagination:next'] = 'Página seguinte';
$string['pagination:of'] = 'de';
$string['pagination:previous'] = 'Página anterior';
$string['pagination:results_per_page'] = 'Resultados por página';
$string['pluginname'] = 'Relatório do autograder';
$string['privacy:metadata'] = 'O relatório do autograder mostra o que o local_autograder registou e o que já está na pauta. Não guarda nada de seu.';
$string['provisional:advancedstale'] = 'A rubrica ou o guião de avaliação mudou depois de se indicar ao autograder o que assinalar, por isso não há nota a prometer. Abra as definições de autograder da atividade e volte a escolher os níveis.';
$string['provisional:noscale'] = 'Esta atividade já não usa uma escala.';
$string['provisional:scalemismatch'] = 'O item que o autograder atribuiria não pertence à escala que a atividade usa agora.';
$string['provisional:unknown'] = 'O autograder não pode avaliar esta atividade tal como está configurada.';
$string['provisional:unset'] = 'Não foi definida nenhuma nota para o autograder atribuir.';
$string['reason:completion'] = 'Contado desde que o estudante concluiu a atividade.';
$string['reason:duedate'] = 'Contado a partir da data de fecho da atividade.';
$string['reason:groupoverride'] = 'Contado a partir da data de fecho que uma exceção de grupo concede a este estudante.';
$string['reason:submission'] = 'Contado desde que o estudante entregou.';
$string['reason:useroverride'] = 'Contado a partir da data de fecho que uma exceção concede a este estudante.';
$string['sortby_date'] = 'Ordenar por data de avaliação';
$string['sortby_name'] = 'Ordenar por nome do estudante';
$string['status:failed'] = 'Falhou';
$string['status:graded'] = 'Autoavaliado';
$string['status:manual'] = 'Por um professor';
$string['status:notautograded'] = 'Sem autoavaliação';
$string['status:notengaged'] = 'Sem entrega';
$string['status:pending'] = 'Pendente';
$string['summary:heading'] = 'Num relance';
$string['summary:total'] = '{$a} estudante(s) nas atividades com avaliação automática mostradas.';
