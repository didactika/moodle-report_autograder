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

$string['autograder:view'] = 'Visualizzare il report di autograder di un\'attività';
$string['autograder:viewcourse'] = 'Visualizzare il report di autograder di un intero corso';
$string['autograder:viewfailed'] = 'Vedere quali valutazioni automatiche non sono riuscite, e perché';
$string['autograder:viewsite'] = 'Visualizzare il report di autograder dell\'intero sito';
$string['datepicker_apply'] = 'Applica';
$string['datepicker_cancel'] = 'Cancella';
$string['datepicker_custom'] = 'Personalizzato';
$string['datepicker_from'] = 'Dal';
$string['datepicker_to'] = 'Al';
$string['datepicker_week'] = 'Sett';
$string['error:apirequest'] = 'Non è stato possibile caricare il report: {$a}';
$string['failure:grade_write_failed'] = 'Moodle ha rifiutato il voto che autograder ha tentato di inserire.';
$string['failure:no_grader'] = 'Nessun docente del corso poteva essere scelto per valutare a suo nome.';
$string['feedback:nothing_to_show'] = 'Nessun record trovato';
$string['filter_activity'] = 'Attività';
$string['filter_activity_placeholder'] = 'Tutte le attività';
$string['filter_course'] = 'Corso';
$string['filter_course_placeholder'] = 'Tutti i corsi';
$string['filter_grading_date'] = 'Data di valutazione';
$string['filter_group'] = 'Gruppo';
$string['filter_group_placeholder'] = 'Tutti i gruppi';
$string['filter_search'] = 'Cerca';
$string['filter_status_placeholder'] = 'Stato...';
$string['grade_provisional_help'] = 'Il voto indicato è provvisorio e non sarà salvato fino alla data riportata nella colonna \'Data di valutazione\'.';
$string['gradedby_prospective'] = 'Sarà valutato a nome di';
$string['gradedby_prospective_help'] = 'Autograder assegnerà questo voto a nome di questo docente. Il docente viene scelto al momento della valutazione, quindi questo può ancora cambiare: se lascia il corso o il gruppo, verrà scelto un altro.';
$string['gradeuser'] = 'Valuta lo studente';
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
$string['heading:site'] = 'Autograder nell\'intero sito';
$string['helper'] = 'Voto provvisorio';
$string['pagination:all_results'] = 'Tutti';
$string['pagination:next'] = 'Pagina successiva';
$string['pagination:of'] = 'di';
$string['pagination:previous'] = 'Pagina precedente';
$string['pagination:results_per_page'] = 'Risultati per pagina';
$string['pluginname'] = 'Report di autograder';
$string['privacy:metadata'] = 'Il report di autograder mostra ciò che local_autograder ha registrato e ciò che è già nel registro valutatore. Non memorizza nulla di proprio.';
$string['provisional:advancedstale'] = 'La rubric o la griglia di valutazione è cambiata dopo aver indicato ad autograder cosa contrassegnare, quindi non c\'è alcun voto da promettere. Apri le impostazioni autograder dell\'attività e scegli di nuovo i livelli.';
$string['provisional:noscale'] = 'Questa attività non usa più una scala.';
$string['provisional:scalemismatch'] = 'La voce che autograder assegnerebbe non appartiene alla scala che l\'attività usa adesso.';
$string['provisional:unknown'] = 'Autograder non può valutare questa attività così com\'è configurata.';
$string['provisional:unset'] = 'Non è stato impostato alcun voto da assegnare.';
$string['reason:completion'] = 'Conteggiato da quando lo studente ha completato l\'attività.';
$string['reason:duedate'] = 'Conteggiato dalla data di chiusura dell\'attività.';
$string['reason:groupoverride'] = 'Conteggiato dalla data di chiusura che una deroga di gruppo concede a questo studente.';
$string['reason:submission'] = 'Conteggiato da quando lo studente ha consegnato.';
$string['reason:useroverride'] = 'Conteggiato dalla data di chiusura che una deroga concede a questo studente.';
$string['sortby_date'] = 'Ordina per data di valutazione';
$string['sortby_name'] = 'Ordina per nome dello studente';
$string['status:failed'] = 'Fallito';
$string['status:graded'] = 'Auto-valutato';
$string['status:manual'] = 'Valutato da un docente';
$string['status:notautograded'] = 'Non auto-valutato';
$string['status:notengaged'] = 'Non consegnato';
$string['status:pending'] = 'In attesa';
$string['summary:heading'] = 'A colpo d\'occhio';
$string['summary:total'] = '{$a} studente/i nelle attività a valutazione automatica mostrate.';
$string['willgrade:nobody'] = 'Nessun docente di questa attività può essere il valutatore, quindi questo voto non potrà essere assegnato. Controlla chi ha la capacità di essere valutato a suo nome e se condivide un gruppo con lo studente.';
