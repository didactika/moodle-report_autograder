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

$string["pluginname"] = "Rapporto di valutazione automatico";
$string["header:student"] = "Alunno";
$string["header:delivery_date"] = "Scadenza";
$string["header:modification_date"] = "Ultima modifica (valutazione)";
$string["header:grade_date"] = "Data da valutare";
$string["header:grade"] = "Voto";
$string["header:status"] = "Stato";
$string["header:external_status"] = "Stato";
$string["header:completed_at"] = "Data di valutazione";
$string["status:pending"] = "In attesa";
$string["status:waiting_for_due_date"] = "In attesa della data di scadenza";
$string["status:waiting_for_grading"] = "In attesa di valutazione";
$string["status:ready_to_grade"] = "Pronto per la valutazione";
$string["status:grading"] = "Valutazione in corso";
$string["status:graded"] = "Valutato";
$string["status:failed"] = "Fallito";
$string["status:skipped"] = "Saltato";
$string['status:manual_grading'] = 'Valutazione manuale';
$string['status:manual_grading'] = 'Classificato manualmente';
$string["feedback:nothing_to_show"] = "Nessun record trovato";
$string['placeholder:automatic_grade'] = "Voto automatico";
$string["navigation:go_back"] = "Tornare";
$string["navigation:location"] = "Rapporto di valutazione automatico";
$string['error:grade_required'] = 'Il voto è richiesto';
$string['action:grade'] = 'Voto';
$string['setting:url_field_name'] = 'URL del servizio esterno';
$string['setting:url_field_desc'] = 'URL del servizio esterno per ottenere i dati di valutazione';
$string['error:missing_config'] = 'La configurazione per {$a} è mancante. Si prega di contattare l\'amministratore.';
$string['error:building_report_data'] = 'Errore durante la costruzione dei dati del rapporto. Si prega di contattare l\'amministratore.';
$string['feedback:no_status'] = 'Nessuno stato';
$string['setting:pagination_limit_name'] = 'Limite di paginazione';
$string['setting:pagination_limit_desc'] = 'Numero di elementi da visualizzare per pagina nel report Autograder.';
$string['report/autograder:view'] = 'Visualizza rapporto autovalutatore';
$string['manual_grading'] = 'Valutazione Manuale';
$string['manual_grading_send'] = 'Invia Voto';
$string['success:gradeupdated'] = 'Voto aggiornato con successo!';
$string['error:updatefailed'] = 'Impossibile aggiornare il voto:';
$string['error:invalidgrade'] = 'Inserire un voto numerico valido.';
$string['error:gradetoolarge'] = 'Il voto non può essere superiore a {$a->maxgrade}.';
$string['error:negativegrade'] = 'Il voto non può essere un valore negativo.';
