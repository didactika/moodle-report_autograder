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


$string['pluginname'] = 'Rapporto dell’Auto Valutatore';
$string['header:student'] = 'Nome';
$string['header:delivery_date'] = 'Data di consegna';
$string['header:modification_date'] = 'Ultima modifica (valutazione)';
$string['header:grade_date'] = 'Data da valutare';
$string['header:grade'] = 'Voto';
$string['header:status'] = 'Stato';
$string['header:external_status'] = 'Stato';
$string['header:completed_at'] = 'Data di valutazione';
$string['status:pending'] = 'In sospeso';
$string['status:awaiting_confirmation_of_rating'] = 'In attesa che la valutazione venga elaborata';
$string['status:ready_to_grade'] = 'Pronto per la valutazione';
$string['status:retry'] = 'Riprova in corso';
$string['status:graded'] = 'Valutato';
$string['status:failed'] = 'Fallito';
$string['status:failed_notified'] = 'Fallimento notificato all\'amministratore';
$string['status:skipped'] = 'Saltato';
$string['status:manual_grading'] = 'Valutazione manuale';
$string['feedback:nothing_to_show'] = 'Nessun record trovato';
$string['placeholder:automatic_grade'] = 'Voto automatico';
$string['navigation:go_back'] = 'Indietro';
$string['navigation:location'] = 'Rapporto dei voti automatici';
$string['error:grade_required'] = 'Il voto è obbligatorio';
$string['action:grade'] = 'Valuta';
$string['setting:site_external_id'] = 'ID esterno del sito';
$string['setting:site_externalid_desc'] = "L'identificatore esterno per questo sito Moodle utilizzato dal servizio di valutazione automatica";
$string['setting:url_field_name'] = 'URL del servizio esterno';
$string['setting:url_field_desc'] = "URL del servizio esterno da cui verranno richiesti i dati dei voti";
$string['error:apirequest'] = 'Errore nella comunicazione con il servizio esterno: {$a}';
$string['error:missing_config'] = 'La configurazione per {$a} è mancante. Contattare l’amministratore.';
$string['error:building_report_data'] = 'Errore nella generazione del rapporto. Contattare l’amministratore.';
$string['feedback:no_status'] = 'Nessuno stato';
$string['setting:pagination_limit_name'] = 'Limite di paginazione';
$string['setting:pagination_limit_desc'] = 'Numero di elementi da visualizzare per pagina nel rapporto dell’Auto Valutatore.';
$string['autograder:view'] = 'Visualizza rapporto dell’Auto Valutatore';
$string['filter_all'] = 'Tutti';
$string['manual_grading'] = 'Valutazione manuale';
$string['manual_grading_send'] = 'Invia voto';
$string['success:gradeupdated'] = 'Voto aggiornato con successo!';
$string['error:updatefailed'] = 'Impossibile aggiornare il voto:';
$string['error:invalidgrade'] = 'Inserisci un voto numerico valido.';
$string['error:gradetoolarge'] = 'Il voto non può essere superiore a {$a->maxgrade}.';
$string['error:negativegrade'] = 'Il voto non può essere negativo.';
$string['filter_button'] = 'Filtra';
$string['filter_submission_date'] = 'Data di consegna';
$string['filter_grading_date'] = 'Data di valutazione';
$string['filter_datefrom'] = 'Data di consegna da';
$string['filter_dateto'] = 'Data valutata da';
$string['filter_grade'] = 'Voto da';
$string['filter_grade_placeholder'] = 'Inserisci il voto';
$string['filter_status'] = 'Stato';
$string['filter_status_placeholder'] = 'Stato...';
$string['filter_status_pending'] = 'In attesa';
$string['filter_status_manual_grading'] = 'Valutazione manuale';
$string['filter_status_graded'] = 'Valutato';
$string['pagination:results_per_page'] = 'Risultati per pagina';
$string['pagination:all_results'] = 'Tutti';
$string['pagination:of'] = 'di';
$string['pagination:previous'] = 'Pagina precedente';
$string['pagination:next'] = 'Pagina successiva';
$string['filter_clear'] = 'Cancella filtri';
$string['filter_search'] = 'Cerca';
$string['datepicker_apply'] = 'Applica';
$string['datepicker_cancel'] = 'Pulisci';
$string['datepicker_from'] = 'Da';
$string['datepicker_to'] = 'A';
$string['datepicker_custom'] = 'Personalizzato';
$string['datepicker_week'] = 'Sett';
$string['filter_active'] = 'Filtri attivi:';
$string['filter_active_searchname'] = 'Nome: {$a}';
$string['filter_active_datefrom'] = 'Da: {$a}';
$string['filter_active_dateto'] = 'Da: {$a}';
$string['filter_active_grade'] = 'Voto: {$a}';
$string['filter_active_status'] = 'Stato: {$a}';
