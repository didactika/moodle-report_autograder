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
 * French language strings.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['autograder:view'] = 'Voir le rapport d\'autograder d\'une activité';
$string['autograder:viewcourse'] = 'Voir le rapport d\'autograder de tout un cours';
$string['autograder:viewfailed'] = 'Voir quelles notations automatiques ont échoué, et pourquoi';
$string['autograder:viewsite'] = 'Voir le rapport d\'autograder de tout le site';
$string['datepicker_apply'] = 'Appliquer';
$string['datepicker_cancel'] = 'Effacer';
$string['datepicker_custom'] = 'Personnalisé';
$string['datepicker_from'] = 'Du';
$string['datepicker_to'] = 'Au';
$string['datepicker_week'] = 'Sem';
$string['error:apirequest'] = 'Le rapport n\'a pas pu être chargé : {$a}';
$string['failure:grade_write_failed'] = 'Moodle a refusé la note qu\'autograder a tenté de déposer.';
$string['failure:no_grader'] = 'Aucun enseignant du cours ne pouvait être choisi pour noter en son nom.';
$string['feedback:nothing_to_show'] = 'Aucun enregistrement trouvé';
$string['filter_activity'] = 'Activité';
$string['filter_activity_placeholder'] = 'Toutes les activités';
$string['filter_course'] = 'Cours';
$string['filter_course_placeholder'] = 'Tous les cours';
$string['filter_grading_date'] = 'Date de notation';
$string['filter_group'] = 'Groupe';
$string['filter_group_placeholder'] = 'Tous les groupes';
$string['filter_search'] = 'Rechercher';
$string['filter_status_placeholder'] = 'État...';
$string['grade_provisional_help'] = 'La note indiquée est provisoire et ne sera enregistrée qu\'à la date figurant dans la colonne « Date de notation ».';
$string['gradedby_prospective'] = 'Sera noté au nom de';
$string['gradedby_prospective_help'] = 'Autograder attribuera cette note au nom de cet enseignant. L\'enseignant est choisi au moment de la notation, cela peut donc encore changer : s\'il quitte le cours ou le groupe, un autre sera choisi.';
$string['graders:courseidplaceholder'] = 'Rechercher un cours…';
$string['graders:grader'] = 'Noterait au nom de';
$string['graders:gradercount'] = '{$a} correcteur(s) possible(s)';
$string['graders:heading'] = 'Correcteurs par cours';
$string['graders:intro'] = 'Choisissez un cours pour voir au nom de qui autograder publierait ses notes, avant qu\'aucune ne soit due.';
$string['graders:nobodyfor'] = 'Personne — cela échouerait';
$string['graders:nograders'] = 'Personne ne peut noter dans ce cours. Toute activité notée automatiquement y échouera à moins qu\'un correcteur de secours ne soit configuré.';
$string['graders:none'] = 'Aucun étudiant notable dans ce cours.';
$string['graders:openreport'] = 'Ouvrir le rapport de ce cours';
$string['graders:pickcourse'] = 'Cours';
$string['graders:possible'] = 'Qui peut noter ici';
$string['graders:seestudents'] = 'Voir quel correcteur chaque étudiant obtiendrait';
$string['graders:show'] = 'Afficher';
$string['graders:student'] = 'Étudiant';
$string['graders:studentcount'] = '{$a} étudiant(s) notable(s)';
$string['graders:students'] = 'Étudiants';
$string['graders:viafallback'] = 'Secours';
$string['gradeuser'] = 'Noter l\'étudiant';
$string['header:activity'] = 'Activité';
$string['header:completed_at'] = 'Date de notation';
$string['header:course'] = 'Cours';
$string['header:external_status'] = 'État';
$string['header:grade'] = 'Note';
$string['header:gradedby'] = 'Noté en tant que';
$string['header:groups'] = 'Groupes';
$string['header:student'] = 'Nom';
$string['heading:activity'] = 'Autograder : {$a}';
$string['heading:course'] = 'Autograder : {$a}';
$string['heading:site'] = 'Autograder sur l\'ensemble du site';
$string['helper'] = 'Note provisoire';
$string['menu:graders'] = 'Graders by course';
$string['menu:report'] = 'Grading report';
$string['needsfilter'] = 'Choose a course, an activity or another filter to run this report. The site-wide report is not run unfiltered: it would ask the database about every enrolment on the campus at once.';
$string['pagination:all_results'] = 'Tous';
$string['pagination:next'] = 'Page suivante';
$string['pagination:of'] = 'sur';
$string['pagination:previous'] = 'Page précédente';
$string['pagination:results_per_page'] = 'Résultats par page';
$string['pluginname'] = 'Rapport d\'autograder';
$string['privacy:metadata'] = 'Le rapport d\'autograder montre ce que local_autograder a enregistré et ce qui figure déjà dans le carnet de notes. Il ne stocke rien qui lui soit propre.';
$string['provisional:advancedstale'] = 'La grille d\'évaluation a changé après qu\'on a indiqué à autograder ce qu\'il devait cocher : il n\'y a donc pas de note à annoncer. Ouvrez les réglages autograder de l\'activité et choisissez à nouveau les niveaux.';
$string['provisional:noscale'] = 'Cette activité n\'utilise plus de barème.';
$string['provisional:scalemismatch'] = 'L\'élément qu\'autograder attribuerait n\'appartient pas au barème que l\'activité utilise maintenant.';
$string['provisional:unknown'] = 'Autograder ne peut pas noter cette activité telle qu\'elle est configurée.';
$string['provisional:unset'] = 'Aucune note n\'a été fixée pour qu\'autograder l\'attribue.';
$string['reason:completion'] = 'Compté à partir du moment où l\'étudiant a achevé l\'activité.';
$string['reason:duedate'] = 'Compté à partir de la date de fermeture de l\'activité.';
$string['reason:groupoverride'] = 'Compté à partir de la date de fermeture qu\'une dérogation de groupe accorde à cet étudiant.';
$string['reason:submission'] = 'Compté à partir du moment où l\'étudiant a remis son travail.';
$string['reason:useroverride'] = 'Compté à partir de la date de fermeture qu\'une dérogation accorde à cet étudiant.';
$string['search:loading'] = 'Recherche…';
$string['search:nomatches'] = 'Aucun résultat';
$string['sortby_date'] = 'Trier par date de notation';
$string['sortby_name'] = 'Trier par nom de l\'étudiant';
$string['status:failed'] = 'En échec';
$string['status:graded'] = 'Noté auto.';
$string['status:manual'] = 'Noté par un enseignant';
$string['status:notautograded'] = 'Non auto-noté';
$string['status:notengaged'] = 'Non remis';
$string['status:pending'] = 'En attente';
$string['willgrade:nobody'] = 'Aucun enseignant de cette activité ne peut être noté en son nom, cette note ne pourra donc pas être attribuée. Vérifiez qui possède la capacité d\'être noté en son nom et s\'il partage un groupe avec l\'étudiant.';
