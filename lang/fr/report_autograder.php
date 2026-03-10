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

$string['pluginname'] = "Rapport de l'Auto Évaluateur";
$string['header:student'] = 'Nom';
$string['header:delivery_date'] = 'Date de remise';
$string['header:modification_date'] = 'Dernière modification (notation)';
$string['header:grade_date'] = 'Date à noter';
$string['header:grade'] = 'Note';
$string['header:status'] = 'Statut';
$string['header:external_status'] = 'Statut';
$string['header:completed_at'] = 'Date de notation programmée';
$string['status:pending'] = 'En attente';
$string['status:awaiting_confirmation_of_rating'] = 'En attente du traitement de votre note';
$string['status:ready_to_grade'] = 'Prêt à noter';
$string['status:retry'] = 'Nouvelle tentative';
$string['status:graded'] = 'Noté';
$string['status:failed'] = 'Échoué';
$string['status:failed_notified'] = 'Échec notifié à l\'administrateur';
$string['status:skipped'] = 'Omis';
$string['status:manual_grading'] = 'Notation manuelle';
$string['feedback:nothing_to_show'] = 'Aucun enregistrement trouvé';
$string['placeholder:automatic_grade'] = 'Note automatique';
$string['navigation:go_back'] = 'Retour';
$string['navigation:location'] = 'Rapport de notes automatiques';
$string['error:grade_required'] = 'La note est obligatoire';
$string['action:grade'] = 'Noter';
$string['setting:site_external_id'] = 'ID externe du site';
$string['setting:site_externalid_desc'] = "L'identifiant externe de ce site Moodle utilisé par le service de notation automatique";
$string['setting:url_field_name'] = 'URL du service externe';
$string['setting:url_field_desc'] = "URL du service externe à partir duquel les données de notes seront demandées";
$string['error:missing_config'] = 'La configuration pour {$a} est manquante. Veuillez contacter l’administrateur.';
$string['error:building_report_data'] = 'Erreur lors de la génération du rapport. Veuillez contacter l’administrateur.';
$string['feedback:no_status'] = 'Aucun statut';
$string['setting:pagination_limit_name'] = 'Limite de pagination';
$string['setting:pagination_limit_desc'] = 'Nombre d’éléments à afficher par page dans le rapport de l’Auto Évaluateur.';
$string['autograder:view'] = "Voir le rapport de l'Auto Évaluateur";
$string['error:apirequest'] = 'Erreur lors de la communication avec le service externe : {$a}';
$string['filter_all'] = 'Tous';
$string['manual_grading'] = 'Notation manuelle';
$string['manual_grading_send'] = 'Envoyer la note';
$string['success:gradeupdated'] = 'Note mise à jour avec succès !';
$string['error:updatefailed'] = 'Échec de la mise à jour de la note :';
$string['error:invalidgrade'] = 'Veuillez saisir une note numérique valide.';
$string['error:gradetoolarge'] = 'La note ne peut pas être supérieure à {$a->maxgrade}.';
$string['error:negativegrade'] = 'La note ne peut pas être négative.';
$string['filter_button'] = 'Filtrer';
$string['filter_searchname'] = 'Rechercher par nom';
$string['filter_search_placeholder'] = 'Entrez un nom à rechercher';
$string['filter_datefrom'] = 'Date de remise à partir de';
$string['filter_dateto'] = 'Date notée à partir de';
$string['filter_grade'] = 'Note à partir de';
$string['filter_grade_placeholder'] = 'Entrez la note';
$string['filter_status'] = 'Statut';
$string['filter_clear'] = 'Effacer les filtres';
$string['filter_search'] = 'Rechercher';
$string['filter_active'] = 'Filtres actifs :';
$string['filter_active_searchname'] = 'Nom : {$a}';
$string['filter_active_datefrom'] = 'Depuis : {$a}';
$string['filter_active_dateto'] = 'Depuis : {$a}';
$string['filter_active_grade'] = 'Note : {$a}';
$string['filter_active_status'] = 'Statut : {$a}';
