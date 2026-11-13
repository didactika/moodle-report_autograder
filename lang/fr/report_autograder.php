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

$string['autograder:view'] = 'Voir le rapport d’Autograder d’une activité';
$string['autograder:viewcourse'] = 'Voir le rapport d’Autograder d’un cours entier';
$string['autograder:viewfailed'] = 'Voir quelles notations d’Autograder ont échoué, et pourquoi';
$string['autograder:viewsite'] = 'Voir le rapport d’Autograder de l’ensemble du site';
$string['datepicker_apply'] = 'Appliquer';
$string['datepicker_from'] = 'Du';
$string['datepicker_to'] = 'Au';
$string['error:apirequest'] = 'Le rapport n’a pas pu être chargé : {$a}';
$string['error:retry'] = 'Réessayer';
$string['failure:grade_write_failed'] = 'Moodle a refusé la note qu’Autograder a tenté de publier.';
$string['failure:no_grader'] = 'Aucun enseignant de ce cours n’était éligible pour noter en son nom.';
$string['feedback:nothing_to_show'] = 'Aucun enregistrement trouvé';
$string['filter_activity'] = 'Activité';
$string['filter_activity_placeholder'] = 'Toutes les activités';
$string['filter_clear'] = 'Effacer';
$string['filter_course'] = 'Cours';
$string['filter_course_placeholder'] = 'Tous les cours';
$string['filter_date_last30'] = '30 derniers jours';
$string['filter_date_month'] = 'Ce mois-ci';
$string['filter_date_range'] = 'Du {$a->from} au {$a->to}';
$string['filter_date_since'] = 'À partir du {$a}';
$string['filter_date_today'] = 'Aujourd’hui';
$string['filter_date_until'] = 'Jusqu’au {$a}';
$string['filter_date_week'] = '7 derniers jours';
$string['filter_grading_date'] = 'Date de notation';
$string['filter_group'] = 'Groupe';
$string['filter_group_placeholder'] = 'Tous les groupes';
$string['filter_remove'] = 'Retirer le filtre {$a}';
$string['filter_search'] = 'Rechercher';
$string['filter_status'] = 'Statut';
$string['filters'] = 'Filtres';
$string['filters_reset'] = 'Effacer tous les filtres';
$string['grade_provisional_help'] = 'La note indiquée est provisoire et ne sera enregistrée qu’à la date affichée dans la colonne « Date de notation ».';
$string['gradedby_prospective'] = 'Sera noté en tant que';
$string['gradedby_prospective_help'] = 'Autograder publiera cette note au nom de cet enseignant. L’enseignant est choisi au moment de la notation ; cela peut donc encore changer : s’il quitte le cours ou le groupe, une autre personne sera choisie.';
$string['graders:activities'] = 'Activités';
$string['graders:associationnote'] = 'Association au cours. Le rapport de l’activité vérifie les droits de notation et les groupes de cette activité précise avant d’afficher le correcteur effectif.';
$string['graders:back'] = 'Tous les cours';
$string['graders:course'] = 'Cours';
$string['graders:empty'] = 'Aucun cours n’a Autograder activé.';
$string['graders:emptysearch'] = 'Rien ne correspond à la recherche et au filtre.';
$string['graders:filter_all'] = 'Tous les étudiants';
$string['graders:filter_fallback'] = 'Notés par le correcteur de secours';
$string['graders:filter_nobody'] = 'Que personne ne noterait';
$string['graders:grader'] = 'Noterait en tant que';
$string['graders:gradercount'] = 'correcteurs possibles';
$string['graders:graders'] = 'Correcteurs';
$string['graders:heading'] = 'Correcteurs par cours';
$string['graders:more'] = '+{$a} de plus';
$string['graders:nobodyfor'] = 'Personne : cela échouerait';
$string['graders:nograders'] = 'Personne dans ce cours ne peut noter. Toutes les activités notées par Autograder ici échoueront, sauf si un correcteur de secours est configuré.';
$string['graders:none'] = 'Aucun étudiant notable dans ce cours.';
$string['graders:note'] = 'Remarque';
$string['graders:onlyfallback'] = 'Aucun enseignant de ce cours ne pourrait noter ; chaque note serait donc enregistrée au nom du correcteur de secours du site.';
$string['graders:openreport'] = 'Ouvrir le rapport de ce cours';
$string['graders:possible'] = 'Qui pourrait noter ici';
$string['graders:search'] = 'Rechercher des cours';
$string['graders:search_students'] = 'Rechercher des étudiants';
$string['graders:seestudents'] = 'Qui note chaque étudiant';
$string['graders:show'] = 'Afficher';
$string['graders:state'] = 'Notation';
$string['graders:state_fallback'] = 'Correcteur de secours uniquement';
$string['graders:state_nobody'] = 'Personne ne peut noter';
$string['graders:state_ready'] = 'Prêt';
$string['graders:student'] = 'Étudiant';
$string['graders:studentcount'] = 'étudiants notables';
$string['graders:students'] = 'Étudiants';
$string['graders:viafallback'] = 'Secours';
$string['gradeuser'] = 'Noter l’utilisateur';
$string['header:activity'] = 'Activité';
$string['header:completed_at'] = 'Date de notation';
$string['header:course'] = 'Cours';
$string['header:external_status'] = 'Statut';
$string['header:grade'] = 'Note';
$string['header:gradedby'] = 'Noté en tant que';
$string['header:groups'] = 'Groupes';
$string['header:student'] = 'Nom';
$string['heading:activity'] = 'Autograder : {$a}';
$string['heading:course'] = 'Autograder : {$a}';
$string['heading:site'] = 'Autograder sur l’ensemble du site';
$string['info:date'] = 'Pourquoi cette date';
$string['info:failure'] = 'Pourquoi cela a échoué';
$string['info:grade'] = 'À propos de cette note';
$string['info:grader'] = 'À propos de ce correcteur';
$string['info:problem'] = 'Pourquoi il n’y a pas de note';
$string['lead_activity'] = 'Ce qu’Autograder a décidé pour chaque étudiant de cette activité';
$string['lead_course'] = 'Ce qu’Autograder a décidé pour les étudiants de ce cours, activité par activité';
$string['lead_graders'] = 'Au nom de qui Autograder noterait dans chaque cours, avant qu’aucune note ne soit due';
$string['lead_site'] = 'Ce qu’Autograder a décidé sur l’ensemble du site, restreint par cours, activité, statut ou date';
$string['loading_report'] = 'Chargement du rapport…';
$string['menu:graders'] = 'Correcteurs par cours';
$string['menu:report'] = 'Rapport de notation';
$string['needsfilter'] = 'Choisissez un cours, une activité ou un autre filtre pour exécuter ce rapport. Le rapport de l’ensemble du site ne s’exécute pas sans filtre : il interrogerait la base de données sur toutes les inscriptions du site à la fois.';
$string['pagination:label'] = 'Pagination';
$string['pagination:next'] = 'Page suivante';
$string['pagination:previous'] = 'Page précédente';
$string['pagination:results_per_page'] = 'Résultats par page';
$string['pagination:showing'] = 'Affichage de {$a->from} à {$a->to} sur {$a->total}';
$string['pluginname'] = 'Rapport d’Autograder';
$string['privacy:metadata'] = 'Le rapport d’Autograder affiche ce que local_autograder a enregistré et ce qui figure déjà dans le carnet de notes. Il ne stocke rien en propre.';
$string['provisional:advancedstale'] = 'La grille critériée ou le guide d’évaluation a changé après qu’Autograder a été informé de ce qu’il doit cocher ; il n’y a donc pas de note à promettre. Ouvrez les paramètres d’Autograder de l’activité et choisissez de nouveau les niveaux.';
$string['provisional:noscale'] = 'Cette activité n’utilise plus d’échelle.';
$string['provisional:scalemismatch'] = 'L’élément qu’Autograder attribuerait n’appartient pas à l’échelle que cette activité utilise désormais.';
$string['provisional:unknown'] = 'Autograder ne peut pas noter cette activité telle qu’elle est configurée.';
$string['provisional:unset'] = 'Aucune note n’a été définie pour qu’Autograder l’attribue.';
$string['reason:completion'] = 'Compté à partir du moment où l’étudiant a terminé l’activité.';
$string['reason:duedate'] = 'Compté à partir de la date de fermeture de l’activité.';
$string['reason:groupoverride'] = 'Compté à partir de la date de fermeture qu’une exception de groupe accorde à cet étudiant.';
$string['reason:submission'] = 'Compté à partir du moment où l’étudiant a remis son travail.';
$string['reason:useroverride'] = 'Compté à partir de la date de fermeture qu’une exception accorde à cet étudiant.';
$string['results_count'] = '{$a} résultats';
$string['search:loading'] = 'Recherche en cours…';
$string['search:nomatches'] = 'Aucun résultat';
$string['search:typetosearch'] = 'Saisissez pour rechercher';
$string['sortby_date'] = 'Trier par date de notation';
$string['sortby_name'] = 'Trier par nom d’étudiant';
$string['status:failed'] = 'Échec';
$string['status:graded'] = 'Noté automatiquement';
$string['status:manual'] = 'Noté par un enseignant';
$string['status:notautograded'] = 'Non noté automatiquement';
$string['status:notengaged'] = 'Non remis';
$string['status:pending'] = 'En attente';
$string['status_all'] = 'Tous';
$string['table:empty'] = 'Aucun étudiant ne correspond à ces filtres.';
$string['willgrade:nobody'] = 'Cet étudiant n’a aucun enseignant dans ce cours et aucun correcteur de secours n’est configuré ; cette note ne peut donc pas être publiée. Vérifiez les rôles configurés comme enseignants et si un enseignant partage l’un des groupes de l’étudiant dans le groupement par défaut du cours.';
