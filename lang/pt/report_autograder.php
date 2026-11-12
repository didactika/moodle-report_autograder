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
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'Ver o relatório do Autograder de uma atividade';
$string['autograder:viewcourse'] = 'Ver o relatório do Autograder de um curso completo';
$string['autograder:viewfailed'] = 'Ver que classificações do Autograder falharam e porquê';
$string['autograder:viewsite'] = 'Ver o relatório do Autograder de todo o site';
$string['datepicker_apply'] = 'Aplicar';
$string['datepicker_cancel'] = 'Limpar';
$string['datepicker_custom'] = 'Personalizado';
$string['datepicker_from'] = 'De';
$string['datepicker_to'] = 'Até';
$string['datepicker_week'] = 'Sem.';
$string['error:apirequest'] = 'Não foi possível carregar o relatório: {$a}';
$string['failure:grade_write_failed'] = 'O Moodle recusou a classificação que o Autograder tentou publicar.';
$string['failure:no_grader'] = 'Nenhum docente deste curso era elegível para classificar em seu nome.';
$string['feedback:nothing_to_show'] = 'Nenhum registo encontrado';
$string['filter_activity'] = 'Atividade';
$string['filter_activity_placeholder'] = 'Todas as atividades';
$string['filter_course'] = 'Curso';
$string['filter_course_placeholder'] = 'Todos os cursos';
$string['filter_grading_date'] = 'Data de classificação';
$string['filter_group'] = 'Grupo';
$string['filter_group_placeholder'] = 'Todos os grupos';
$string['filter_search'] = 'Pesquisar';
$string['filter_status'] = 'Estado';
$string['filter_status_placeholder'] = 'Estado...';
$string['grade_provisional_help'] = 'A classificação indicada é provisória e não será guardada até à data apresentada na coluna «Data de classificação».';
$string['gradedby_prospective'] = 'Será classificado como';
$string['gradedby_prospective_help'] = 'O Autograder publicará esta classificação em nome deste docente. O docente é escolhido no momento da classificação, pelo que ainda pode mudar: se deixar o curso ou o grupo, será escolhida outra pessoa.';
$string['graders:associationnote'] = 'Associação ao curso. O relatório da atividade verifica as permissões de classificação e os grupos dessa atividade concreta antes de mostrar o classificador efetivo.';
$string['graders:courseidplaceholder'] = 'Pesquisar um curso…';
$string['graders:grader'] = 'Classificaria como';
$string['graders:gradercount'] = 'possíveis classificadores';
$string['graders:heading'] = 'Classificadores por curso';
$string['graders:intro'] = 'Escolha um curso para ver em nome de quem o Autograder publicaria as suas classificações, antes de alguma vencer.';
$string['graders:nobodyfor'] = 'Ninguém: isto falharia';
$string['graders:nograders'] = 'Ninguém neste curso pode classificar. Todas as atividades classificadas pelo Autograder aqui falharão, a menos que seja configurado um classificador de reserva.';
$string['graders:none'] = 'Não há estudantes classificáveis neste curso.';
$string['graders:openreport'] = 'Abrir o relatório deste curso';
$string['graders:pickcourse'] = 'Curso';
$string['graders:possible'] = 'Quem poderia classificar aqui';
$string['graders:seestudents'] = 'Ver que classificador teria cada estudante';
$string['graders:show'] = 'Mostrar';
$string['graders:student'] = 'Estudante';
$string['graders:studentcount'] = 'estudantes classificáveis';
$string['graders:students'] = 'Estudantes';
$string['graders:viafallback'] = 'Reserva';
$string['gradeuser'] = 'Classificar o utilizador';
$string['header:activity'] = 'Atividade';
$string['header:completed_at'] = 'Data de classificação';
$string['header:course'] = 'Curso';
$string['header:external_status'] = 'Estado';
$string['header:grade'] = 'Classificação';
$string['header:gradedby'] = 'Classificado como';
$string['header:groups'] = 'Grupos';
$string['header:student'] = 'Nome';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder em todo o site';
$string['helper'] = 'Classificação provisória';
$string['lead_activity'] = 'O que o Autograder decidiu para cada estudante desta atividade';
$string['lead_course'] = 'O que o Autograder decidiu para os estudantes deste curso, atividade a atividade';
$string['lead_graders'] = 'Em nome de quem o Autograder classificaria em cada curso, antes de alguma classificação vencer';
$string['lead_site'] = 'O que o Autograder decidiu em todo o site, restringido por curso, atividade, estado ou data';
$string['menu:graders'] = 'Classificadores por curso';
$string['menu:report'] = 'Relatório de classificação';
$string['needsfilter'] = 'Escolha um curso, uma atividade ou outro filtro para executar este relatório. O relatório de todo o site não é executado sem filtro: consultaria a base de dados sobre todas as inscrições do site de uma só vez.';
$string['pagination:all_results'] = 'Todos';
$string['pagination:label'] = 'Paginação';
$string['pagination:next'] = 'Página seguinte';
$string['pagination:of'] = 'de';
$string['pagination:previous'] = 'Página anterior';
$string['pagination:results_per_page'] = 'Resultados por página';
$string['pluginname'] = 'Relatório do Autograder';
$string['privacy:metadata'] = 'O relatório do Autograder mostra o que o local_autograder registou e o que já está no livro de classificações. Não armazena nada de seu.';
$string['provisional:advancedstale'] = 'A rubrica ou o guia de avaliação mudou depois de o Autograder ter sido informado do que assinalar, pelo que não há classificação a prometer. Abra as definições do Autograder da atividade e escolha de novo os níveis.';
$string['provisional:noscale'] = 'Esta atividade já não usa uma escala.';
$string['provisional:scalemismatch'] = 'O item que o Autograder atribuiria não pertence à escala que esta atividade usa agora.';
$string['provisional:unknown'] = 'O Autograder não consegue classificar esta atividade tal como está configurada.';
$string['provisional:unset'] = 'Não foi definida nenhuma classificação para o Autograder atribuir.';
$string['reason:completion'] = 'Contado desde que o estudante concluiu a atividade.';
$string['reason:duedate'] = 'Contado desde a data de fecho da atividade.';
$string['reason:groupoverride'] = 'Contado desde a data de fecho que uma exceção de grupo concede a este estudante.';
$string['reason:submission'] = 'Contado desde que o estudante fez a entrega.';
$string['reason:useroverride'] = 'Contado desde a data de fecho que uma exceção concede a este estudante.';
$string['search:loading'] = 'A pesquisar…';
$string['search:nomatches'] = 'Sem correspondências';
$string['sortby_date'] = 'Ordenar por data de classificação';
$string['sortby_name'] = 'Ordenar por nome do estudante';
$string['status:failed'] = 'Falhado';
$string['status:graded'] = 'Classificado automaticamente';
$string['status:manual'] = 'Classificado por um docente';
$string['status:notautograded'] = 'Não classificado automaticamente';
$string['status:notengaged'] = 'Não entregue';
$string['status:pending'] = 'Pendente';
$string['status_all'] = 'Todos';
$string['willgrade:nobody'] = 'Este estudante não tem nenhum docente neste curso e não está configurado nenhum classificador de reserva, pelo que esta classificação não pode ser publicada. Verifique os papéis configurados como docentes e se algum docente partilha um dos grupos do estudante no agrupamento predefinido do curso.';
