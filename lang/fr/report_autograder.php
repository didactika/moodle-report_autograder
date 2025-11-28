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

$string["pluginname"] = "Rapport de note automatique";
$string["header:student"] = "Étudiant";
$string["header:delivery_date"] = "Date de livraison";
$string["header:modification_date"] = "Dernière modification (évaluation)";
$string["header:grade_date"] = "Date à évaluer";
$string["header:grade"] = "Note";
$string["header:status"] = "Statut";
$string["header:external_status"] = "Statut";
$string["header:completed_at"] = "Date de notation";
$string["status:pending"] = "En attente";
$string["status:waiting_for_due_date"] = "En attente de la date d'échéance";
$string["status:waiting_for_grading"] = "En attente de notation";
$string["status:ready_to_grade"] = "Prêt à noter";
$string["status:grading"] = "Notation en cours";
$string["status:graded"] = "Noté";
$string["status:failed"] = "Échoué";
$string["status:skipped"] = "Sauté";
$string["feedback:nothing_to_show"] = "Aucun enregistrement trouvé";
$string['placeholder:automatic_grade'] = "Note automatique";
$string["navigation:go_back"] = "Retourner";
$string["navigation:location"] = "Rapport de note automatique";
$string['error:grade_required'] = 'La note est requise';
$string['action:grade'] = 'Noter';
$string['setting:url_field_name'] = 'URL du service externe';
$string['setting:url_field_desc'] = 'URL du service externe pour obtenir les données de notation';
$string['error:missing_config'] = 'La configuration pour {$a} est manquante. Veuillez contacter l\'administrateur.';
$string['error:building_report_data'] = 'Erreur lors de la construction des données du rapport. Veuillez contacter l\'administrateur.';
$string['feedback:no_status'] = 'Pas de statut';
