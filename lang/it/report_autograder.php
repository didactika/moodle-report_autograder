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
$string['datepicker_from'] = 'Da';
$string['datepicker_to'] = 'A';
$string['details:close'] = 'Chiudi';
$string['details:grade_expected'] = 'Non è ancora nel registro dei voti: Autograder lo registrerà il {$a}.';
$string['error:apirequest'] = 'Impossibile caricare il report: {$a}';
$string['error:retry'] = 'Riprova';
$string['failure:grade_write_failed'] = 'Moodle ha rifiutato il voto che Autograder ha tentato di pubblicare.';
$string['failure:no_grader'] = 'Nessun docente di questo corso era idoneo a valutare a suo nome.';
$string['feedback:nothing_to_show'] = 'Nessun record trovato';
$string['filter_activity'] = 'Attività';
$string['filter_clear'] = 'Cancella';
$string['filter_course'] = 'Corso';
$string['filter_date_last30'] = 'Ultimi 30 giorni';
$string['filter_date_month'] = 'Questo mese';
$string['filter_date_range'] = 'Dal {$a->from} al {$a->to}';
$string['filter_date_since'] = 'Dal {$a}';
$string['filter_date_today'] = 'Oggi';
$string['filter_date_until'] = 'Fino al {$a}';
$string['filter_date_week'] = 'Ultimi 7 giorni';
$string['filter_grading_date'] = 'Data di valutazione';
$string['filter_group'] = 'Gruppo';
$string['filter_group_placeholder'] = 'Tutti i gruppi';
$string['filter_search'] = 'Cerca';
$string['filter_status'] = 'Stato';
$string['filters_reset'] = 'Cancella tutti i filtri';
$string['grade_expected'] = 'Prevista';
$string['grade_provisional_help'] = 'Il voto indicato è provvisorio e non verrà salvato fino alla data mostrata nella colonna «Data di valutazione».';
$string['gradedby_prospective'] = 'Sarà valutato come';
$string['gradedby_prospective_help'] = 'Autograder pubblicherà questo voto a nome di questo docente. Il docente viene scelto al momento della valutazione, quindi può ancora cambiare: se lascia il corso o il gruppo, verrà scelta un’altra persona.';
$string['graders:activities'] = 'Attività';
$string['graders:associationnote'] = 'Associazione al corso. Il report dell’attività verifica i permessi di valutazione e i gruppi di quella specifica attività prima di mostrare il valutatore effettivo.';
$string['graders:back'] = 'Tutti i corsi';
$string['graders:course'] = 'Corso';
$string['graders:empty'] = 'Nessun corso ha Autograder attivato.';
$string['graders:emptysearch'] = 'Nulla corrisponde alla ricerca e al filtro.';
$string['graders:filter_all'] = 'Tutti gli studenti';
$string['graders:filter_fallback'] = 'Valutati dal valutatore di riserva';
$string['graders:filter_nobody'] = 'Che nessuno valuterebbe';
$string['graders:grader'] = 'Valuterebbe come';
$string['graders:gradercount'] = 'possibili valutatori';
$string['graders:graders'] = 'Valutatori';
$string['graders:heading'] = 'Valutatori per corso';
$string['graders:more'] = '+{$a} altri';
$string['graders:nobodyfor'] = 'Nessuno: fallirebbe';
$string['graders:nograders'] = 'Nessuno in questo corso può valutare. Tutte le attività valutate da Autograder qui falliranno a meno che non sia configurato un valutatore di riserva.';
$string['graders:none'] = 'Nessuno studente valutabile in questo corso.';
$string['graders:note'] = 'Nota';
$string['graders:onlyfallback'] = 'Nessun docente di questo corso potrebbe valutare, quindi ogni voto qui verrebbe registrato a nome del valutatore di riserva del sito.';
$string['graders:openreport'] = 'Apri il report di questo corso';
$string['graders:possible'] = 'Chi potrebbe valutare qui';
$string['graders:search'] = 'Cerca corsi';
$string['graders:search_students'] = 'Cerca studenti';
$string['graders:seestudents'] = 'Chi valuta ogni studente';
$string['graders:show'] = 'Mostra';
$string['graders:state'] = 'Valutazione';
$string['graders:state_fallback'] = 'Solo il valutatore di riserva';
$string['graders:state_nobody'] = 'Nessuno può valutare';
$string['graders:state_ready'] = 'Pronto';
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
$string['info:date'] = 'Perché questa data';
$string['info:failure'] = 'Perché è fallito';
$string['info:grade'] = 'Informazioni su questo voto';
$string['info:grader'] = 'Informazioni su questo valutatore';
$string['info:problem'] = 'Perché non c’è un voto';
$string['info:row'] = 'Informazioni su questa riga';
$string['lead_activity'] = 'Ciò che Autograder ha deciso per ogni studente di questa attività';
$string['lead_course'] = 'Ciò che Autograder ha deciso per gli studenti di questo corso, attività per attività';
$string['lead_graders'] = 'A nome di chi Autograder valuterebbe in ogni corso, prima che scada qualsiasi voto';
$string['lead_site'] = 'Ciò che Autograder ha deciso nell’intero sito, ristretto per corso, attività, stato o data';
$string['loading_report'] = 'Caricamento del report…';
$string['menu:graders'] = 'Valutatori per corso';
$string['menu:report'] = 'Report di valutazione';
$string['needsfilter'] = 'Scegli un corso, un’attività o un altro filtro per eseguire questo report. Il report dell’intero sito non viene eseguito senza filtro: interrogherebbe il database su tutte le iscrizioni del sito contemporaneamente.';
$string['pagination:all'] = 'Tutti';
$string['pagination:label'] = 'Paginazione';
$string['pagination:next'] = 'Pagina successiva';
$string['pagination:previous'] = 'Pagina precedente';
$string['pagination:range'] = '{$a->from}–{$a->to} di {$a->total}';
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
$string['search:typetosearch'] = 'Digita per cercare';
$string['setting:tourrequired'] = 'Rendi obbligatorio il tour guidato';
$string['setting:tourrequired_desc'] = 'Se attivato, il tour guidato del report di un’attività e di un corso non può essere saltato: ogni persona ne percorre i passaggi la prima volta che apre il report. Se disattivato, il tour può essere saltato in qualsiasi passaggio.';
$string['settings'] = 'Impostazioni del report';
$string['sortby_date'] = 'Ordina per data di valutazione';
$string['sortby_name'] = 'Ordina per nome dello studente';
$string['status:failed'] = 'Non riuscito';
$string['status:graded'] = 'Valutato automaticamente';
$string['status:manual'] = 'Valutato da un docente';
$string['status:notautograded'] = 'Non valutato automaticamente';
$string['status:notengaged'] = 'Non consegnato';
$string['status:pending'] = 'In sospeso';
$string['table:empty'] = 'Nessuno studente corrisponde a questi filtri.';
$string['tour_report_description'] = 'Presenta ai docenti il report di un’attività e di un corso: la ricerca, i filtri, le colonne e le pagine dell’elenco.';
$string['tour_report_name'] = 'Report di Autograder';
$string['tour_report_step1_content'] = '<p>Questo report mostra, per ogni studente, la decisione di Autograder: se lo studente è in sospeso, è stato valutato automaticamente, è stato valutato da un docente oppure non è stato possibile valutarlo.</p><p>I passaggi seguenti spiegano come trovare uno studente e come leggere ogni colonna.</p>';
$string['tour_report_step1_title'] = 'Il report di Autograder';
$string['tour_report_step2_content'] = '<p>Digita parte del nome di uno studente per restringere l’elenco. L’elenco cambia mentre digiti.</p>';
$string['tour_report_step2_title'] = 'Ricerca';
$string['tour_report_step3_content'] = '<p>Scegli uno o più stati per vedere solo gli studenti che vi si trovano. Il numero accanto a ogni stato indica quanti studenti vi si trovano entro gli altri filtri.</p>';
$string['tour_report_step3_title'] = 'Stato';
$string['tour_report_step4_content'] = '<p>Limita l’elenco a un periodo: oggi, gli ultimi sette giorni, il mese in corso, gli ultimi trenta giorni o due date a tua scelta.</p>';
$string['tour_report_step4_title'] = 'Data di valutazione';
$string['tour_report_step5_content'] = '<p>Seleziona questo pulsante per rimuovere in una volta tutti i filtri e la ricerca.</p>';
$string['tour_report_step5_title'] = 'Cancella i filtri';
$string['tour_report_step6_content'] = '<p>Ogni riga mostra lo stato, la data di valutazione, il voto e il docente a nome del quale il voto viene registrato.</p><p>Un voto contrassegnato come <strong>Prevista</strong> non è ancora nel registro dei voti: è il voto che lo studente riceverà alla data indicata, e il docente accanto appare in grigio. Il pulsante alla fine di una riga apre il suo dettaglio: su cosa si basa la data, cosa deve ancora accadere e, quando qualcosa non è riuscito, perché. Il suo colore è blu quando informa soltanto, ambra quando c’è un problema e rosso quando la valutazione non è riuscita.</p>';
$string['tour_report_step6_title'] = 'Le colonne';
$string['tour_report_step7_content'] = '<p>Scegli quante righe mostra ogni pagina e spostati tra le pagine con le frecce.</p>';
$string['tour_report_step7_title'] = 'Pagine';
$string['willgrade:nobody'] = 'Questo studente non ha nessun docente in questo corso e non è configurato alcun valutatore di riserva, quindi questo voto non può essere pubblicato. Controlla i ruoli configurati come docenti e se un docente condivide uno dei gruppi dello studente nel raggruppamento predefinito del corso.';
