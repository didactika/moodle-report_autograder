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

$string["pluginname"] = "Relatório automático de notas";
$string["header:student"] = "Aluno";
$string["header:delivery_date"] = "Data de entrega";
$string["header:modification_date"] = "Última modificação (avaliação)";
$string["header:grade_date"] = "Data a ser avaliada";
$string["header:grade"] = "Nota";
$string["header:status"] = "Status";
$string["header:external_status"] = "Status";
$string["header:completed_at"] = "Data de avaliação";
$string["status:pending"] = "Pendente";
$string["status:waiting_for_due_date"] = "Aguardando a data de vencimento";
$string["status:waiting_for_grading"] = "Aguardando classificação";
$string["status:ready_to_grade"] = "Pronto para classificar";
$string["status:grading"] = "Classificando";
$string["status:graded"] = "Classificado";
$string["status:failed"] = "Falhou";
$string["status:skipped"] = "Ignorado";
$string['status:manual_grading'] = 'Avaliação manual';
$string["feedback:nothing_to_show"] = "Nenhum registro foi encontrado";
$string['placeholder:automatic_grade'] = 'Nota automática';
$string["navigation:go_back"] = "Voltar";
$string["navigation:location"] = "Relatório automático de notas";
$string['error:grade_required'] = 'A nota é necessária';
$string['action:grade'] = 'Classificar';
$string['setting:url_field_name'] = 'URL do serviço externo';
$string['setting:url_field_desc'] = 'URL do serviço externo para obter os dados de qualificação';
$string['error:missing_config'] = 'A configuração para {$a} está faltando. Entre em contato com o administrador.';
$string['error:building_report_data'] = 'Erro ao construir os dados do relatório. Entre em contato com o administrador.';
$string['feedback:no_status'] = 'Sem status';
$string['setting:pagination_limit_name'] = 'Limite de paginação';
$string['setting:pagination_limit_desc'] = 'Número de itens a serem exibidos por página no relatório do Autograder.';
$string['report/autograder:view'] = 'Visualizar relatório do autograduador';
$string['manual_grading'] = 'Classificação Manual';
$string['manual_grading_send'] = 'Enviar Nota';
$string['success:gradeupdated'] = 'Nota atualizada com sucesso!';
$string['error:updatefailed'] = 'Falha ao atualizar a nota:';
$string['error:invalidgrade'] = 'Por favor, insira uma nota numérica válida.';
$string['error:gradetoolarge'] = 'A nota não pode ser maior que {$a->maxgrade}.';
$string['error:negativegrade'] = 'A nota não pode ser um valor negativo.';