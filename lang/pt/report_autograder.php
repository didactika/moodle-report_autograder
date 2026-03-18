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
 * @copyright  2025
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'Relatório do Avaliador Automático';
$string['header:student'] = 'Nome';
$string['header:delivery_date'] = 'Data de entrega';
$string['header:modification_date'] = 'Última modificação (avaliação)';
$string['header:grade_date'] = 'Data a ser avaliada';
$string['header:grade'] = 'Nota';
$string['header:status'] = 'Status';
$string['header:external_status'] = 'Status';
$string['header:completed_at'] = 'Data programada para avaliação';
$string['status:pending'] = 'Pendente';
$string['status:awaiting_confirmation_of_rating'] = 'Aguardando que sua nota seja processada';
$string['status:ready_to_grade'] = 'Pronto para avaliar';
$string['status:retry'] = 'Tentando novamente';
$string['status:graded'] = 'Avaliado';
$string['status:failed'] = 'Falhou';
$string['status:failed_notified'] = 'Falha notificada ao administrador';
$string['status:skipped'] = 'Ignorado';
$string['status:manual_grading'] = 'Avaliação manual';
$string['feedback:nothing_to_show'] = 'Nenhum registro encontrado';
$string['placeholder:automatic_grade'] = 'Nota automática';
$string['navigation:go_back'] = 'Voltar';
$string['navigation:location'] = 'Relatório de Notas Automáticas';
$string['error:grade_required'] = 'A nota é obrigatória';
$string['action:grade'] = 'Avaliar';
$string['setting:site_external_id'] = 'ID externo do site';
$string['setting:site_externalid_desc'] = 'O identificador externo para este site Moodle usado pelo serviço de avaliação automática';
$string['setting:url_field_name'] = 'URL do serviço externo';
$string['setting:url_field_desc'] = 'URL do serviço externo do qual os dados de notas serão solicitados';
$string['error:apirequest'] = 'Erro ao comunicar-se com o serviço externo: {$a}';
$string['error:missing_config'] = 'A configuração de {$a} está ausente. Entre em contato com o administrador.';
$string['error:building_report_data'] = 'Erro ao gerar dados do relatório. Entre em contato com o administrador.';
$string['feedback:no_status'] = 'Sem status';
$string['setting:pagination_limit_name'] = 'Limite de paginação';
$string['setting:pagination_limit_desc'] = 'Número de itens a exibir por página no relatório do Avaliador Automático.';
$string['autograder:view'] = 'Ver relatório do Avaliador Automático';
$string['filter_all'] = 'Todos';
$string['manual_grading'] = 'Avaliação manual';
$string['manual_grading_send'] = 'Enviar nota';
$string['success:gradeupdated'] = 'Nota atualizada com sucesso!';
$string['error:updatefailed'] = 'Falha ao atualizar a nota:';
$string['error:invalidgrade'] = 'Por favor, insira uma nota numérica válida.';
$string['error:gradetoolarge'] = 'A nota não pode ser maior que {$a->maxgrade}.';
$string['error:negativegrade'] = 'A nota não pode ser negativa.';
$string['filter_button'] = 'Filtrar';
$string['filter_submission_date'] = 'Data de entrega';
$string['filter_grading_date'] = 'Data de avaliação';
$string['filter_datefrom'] = 'Data de entrega a partir de';
$string['filter_dateto'] = 'Data avaliada a partir de';
$string['filter_grade'] = 'Nota a partir de';
$string['filter_grade_placeholder'] = 'Digite a nota';
$string['filter_status'] = 'Status';
$string['filter_clear'] = 'Limpar filtros';
$string['filter_search'] = 'Pesquisar';
$string['filter_active'] = 'Filtros ativos:';
$string['filter_active_searchname'] = 'Nome: {$a}';
$string['filter_active_datefrom'] = 'De: {$a}';
$string['filter_active_dateto'] = 'De: {$a}';
$string['filter_active_grade'] = 'Nota: {$a}';
$string['filter_active_status'] = 'Status: {$a}';
