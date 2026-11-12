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
 * Italian language strings.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'Visualizzare il report di Autograder di un’attività';
$string['autograder:viewcourse'] = 'Visualizzare il report di Autograder di un intero corso';
$string['autograder:viewfailed'] = 'Vedere quali valutazioni di Autograder non sono riuscite, e perché';
$string['autograder:viewsite'] = 'Visualizzare il report di Autograder dell’intero sito';
$string['datepicker_apply'] = 'Applica';
$string['datepicker_cancel'] = 'Cancella';
$string['datepicker_custom'] = 'Personalizzato';
$string['datepicker_from'] = 'Da';
$string['datepicker_to'] = 'A';
$string['datepicker_week'] = 'Sett.';
$string['error:apirequest'] = 'Impossibile caricare il report: {$a}';
$string['failure:grade_write_failed'] = 'Moodle ha rifiutato il voto che Autograder ha tentato di pubblicare.';
$string['failure:no_grader'] = 'Nessun docente di questo corso era idoneo a valutare a suo nome.';
$string['feedback:nothing_to_show'] = 'Nessun record trovato';
$string['filter_activity'] = 'Attività';
$string['filter_activity_placeholder'] = 'Tutte le attività';
$string['filter_course'] = 'Corso';
$string['filter_course_placeholder'] = 'Tutti i corsi';
$string['filter_grading_date'] = 'Data di valutazione';
$string['filter_group'] = 'Gruppo';
$string['filter_group_placeholder'] = 'Tutti i gruppi';
$string['filter_search'] = 'Cerca';
$string['filter_status'] = 'Stato';
$string['filter_status_placeholder'] = 'Stato...';
$string['grade_provisional_help'] = 'Il voto indicato è provvisorio e non verrà salvato fino alla data mostrata nella colonna «Data di valutazione».';
$string['gradedby_prospective'] = 'Sarà valutato come';
$string['gradedby_prospective_help'] = 'Autograder pubblicherà questo voto a nome di questo docente. Il docente viene scelto al momento della valutazione, quindi può ancora cambiare: se lascia il corso o il gruppo, verrà scelta un’altra persona.';
$string['graders:associationnote'] = 'Associazione al corso. Il report dell’attività verifica i permessi di valutazione e i gruppi di quella specifica attività prima di mostrare il valutatore effettivo.';
$string['graders:courseidplaceholder'] = 'Cerca un corso…';
$string['graders:grader'] = 'Valuterebbe come';
$string['graders:gradercount'] = 'possibili valutatori';
$string['graders:heading'] = 'Valutatori per corso';
$string['graders:intro'] = 'Scegli un corso per vedere a nome di chi Autograder pubblicherebbe i suoi voti, prima che ne scada qualcuno.';
$string['graders:nobodyfor'] = 'Nessuno: fallirebbe';
$string['graders:nograders'] = 'Nessuno in questo corso può valutare. Tutte le attività valutate da Autograder qui falliranno a meno che non sia configurato un valutatore di riserva.';
$string['graders:none'] = 'Nessuno studente valutabile in questo corso.';
$string['graders:openreport'] = 'Apri il report di questo corso';
$string['graders:pickcourse'] = 'Corso';
$string['graders:possible'] = 'Chi potrebbe valutare qui';
$string['graders:seestudents'] = 'Vedi quale valutatore avrebbe ogni studente';
$string['graders:show'] = 'Mostra';
$string['graders:student'] = 'Studente';
$string['graders:studentcount'] = 'studenti valutabili';
$string['graders:students'] = 'Studenti';
$string['graders:viafallback'] = 'Riserva';
$string['gradeuser'] = 'Valuta l’utente';
$string['header:activity'] = 'Attività';
$string['header:completed_at'] = 'Data di valutazione';
$string['header:course'] = 'Corso';
$string['header:external_status'] = 'Stato';
$string['header:grade'] = 'Voto';
$string['header:gradedby'] = 'Valutato come';
$string['header:groups'] = 'Gruppi';
$string['header:student'] = 'Nome';
$string['heading:activity'] = 'Autograder: {$a}';
$string['heading:course'] = 'Autograder: {$a}';
$string['heading:site'] = 'Autograder nell’intero sito';
$string['helper'] = 'Voto provvisorio';
$string['lead_activity'] = 'Ciò che Autograder ha deciso per ogni studente di questa attività';
$string['lead_course'] = 'Ciò che Autograder ha deciso per gli studenti di questo corso, attività per attività';
$string['lead_graders'] = 'A nome di chi Autograder valuterebbe in ogni corso, prima che scada qualsiasi voto';
$string['lead_site'] = 'Ciò che Autograder ha deciso nell’intero sito, ristretto per corso, attività, stato o data';
$string['menu:graders'] = 'Valutatori per corso';
$string['menu:report'] = 'Report di valutazione';
$string['needsfilter'] = 'Scegli un corso, un’attività o un altro filtro per eseguire questo report. Il report dell’intero sito non viene eseguito senza filtro: interrogherebbe il database su tutte le iscrizioni del sito contemporaneamente.';
$string['pagination:all_results'] = 'Tutti';
$string['pagination:label'] = 'Paginazione';
$string['pagination:next'] = 'Pagina successiva';
$string['pagination:of'] = 'di';
$string['pagination:previous'] = 'Pagina precedente';
$string['pagination:results_per_page'] = 'Risultati per pagina';
$string['pluginname'] = 'Report di Autograder';
$string['privacy:metadata'] = 'Il report di Autograder mostra ciò che local_autograder ha registrato e ciò che è già nel registro dei voti. Non memorizza nulla di proprio.';
$string['provisional:advancedstale'] = 'La rubrica o la guida di valutazione è cambiata dopo che ad Autograder è stato indicato cosa selezionare, quindi non c’è un voto da promettere. Apri le impostazioni di Autograder dell’attività e scegli di nuovo i livelli.';
$string['provisional:noscale'] = 'Questa attività non usa più una scala.';
$string['provisional:scalemismatch'] = 'L’elemento che Autograder assegnerebbe non appartiene alla scala che questa attività usa ora.';
$string['provisional:unknown'] = 'Autograder non può valutare questa attività così come è configurata.';
$string['provisional:unset'] = 'Non è stato impostato alcun voto che Autograder possa assegnare.';
$string['reason:completion'] = 'Conteggiato da quando lo studente ha completato l’attività.';
$string['reason:duedate'] = 'Conteggiato dalla data di chiusura dell’attività.';
$string['reason:groupoverride'] = 'Conteggiato dalla data di chiusura che un’eccezione di gruppo concede a questo studente.';
$string['reason:submission'] = 'Conteggiato da quando lo studente ha consegnato.';
$string['reason:useroverride'] = 'Conteggiato dalla data di chiusura che un’eccezione concede a questo studente.';
$string['search:loading'] = 'Ricerca in corso…';
$string['search:nomatches'] = 'Nessuna corrispondenza';
$string['sortby_date'] = 'Ordina per data di valutazione';
$string['sortby_name'] = 'Ordina per nome dello studente';
$string['status:failed'] = 'Non riuscito';
$string['status:graded'] = 'Valutato automaticamente';
$string['status:manual'] = 'Valutato da un docente';
$string['status:notautograded'] = 'Non valutato automaticamente';
$string['status:notengaged'] = 'Non consegnato';
$string['status:pending'] = 'In sospeso';
$string['status_all'] = 'Tutti';
$string['willgrade:nobody'] = 'Questo studente non ha nessun docente in questo corso e non è configurato alcun valutatore di riserva, quindi questo voto non può essere pubblicato. Controlla i ruoli configurati come docenti e se un docente condivide uno dei gruppi dello studente nel raggruppamento predefinito del corso.';
