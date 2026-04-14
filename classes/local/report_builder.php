<?php

namespace report_autograder\local;

/**
 * Builds autograder report payloads: external API merge, Moodle filter allowlist, enrichment.
 *
 * @package     report_autograder
 * @copyright   2025 ADSDR <eduardo.cubias@ct.uneatlantico.es>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->libdir . '/gradelib.php');

use cm_info;
use report_autograder\external_service\user_grades;
use stdClass;

/**
 * Orchestrates report data for the grade report webservice / UI.
 */
class report_builder
{
    /** Default rows per page when the client does not override (matches AMD). */
    private const DEFAULT_PAGE_LIMIT = 12;

    /**
     * Returns merged external rows, enriched for display. Pagination is done in AMD on the full list.
     *
     * @param int $cmid Course-module id.
     * @param int $page Unused; kept for the webservice contract.
     * @param array $filters Raw filter list from the client.
     * @param int $limit_override Client page size (0 = default).
     * @return array{totalrecords: int, limit: int, maxgrade: ?float, data: array}
     */
    public static function get_report_data(int $cmid, int $page, array $filters, int $limit_override = 0): array {
        [$course, $cm] = self::require_course_module($cmid);
        self::require_report_capability($cm);

        $limit = self::normalize_page_limit($limit_override);
        $moodleids = filter_handler::get_filtered_completion_ids($cmid, $filters);
        $apifilters = filter_handler::get_api_filters($filters);

        if ($moodleids === null) {
            return self::build_response(0, $limit, $course, $cm, []);
        }

        $campusuuid = self::require_campus_uuid();
        $merged = self::load_filtered_merged_rows($cm, $campusuuid, $apifilters, $moodleids);
        $total = count($merged);
        $enriched = data_enricher::enrich_data($merged, (int) $course->id, (int) $cm->id);

        return self::build_response($total, $limit, $course, $cm, $enriched);
    }

    /**
     * @param int $cmid
     * @return array{0: stdClass, 1: cm_info}
     */
    private static function require_course_module(int $cmid): array {
        [$course, $cm] = get_course_and_cm_from_cmid($cmid);
        if (!$course || !$cm) {
            throw new \moodle_exception('invalidcoursemodule');
        }
        return [$course, $cm];
    }

    private static function require_report_capability(cm_info $cm): void {
        $context = \context_module::instance($cm->id);
        \external_api::validate_context($context);
        require_capability('report/autograder:view', $context);
    }

    private static function normalize_page_limit(int $limit_override): int {
        return ($limit_override > 0) ? $limit_override : self::DEFAULT_PAGE_LIMIT;
    }

    private static function require_campus_uuid(): string {
        $uuid = get_config('report_autograder', 'siteexternalid');
        if (empty($uuid)) {
            throw new \moodle_exception('error:missing_config', 'report_autograder', null, 'siteexternalid');
        }
        return (string) $uuid;
    }

    /**
     * Full merged moduleGrades, optionally narrowed to Moodle idnumbers (name/grade filters).
     *
     * @param cm_info $cm
     * @param string $campusuuid
     * @param array $apifilters Status / date filters for the external API.
     * @param array $moodleids Allowed idnumbers; empty = no Moodle-side row filter.
     * @return array<int, array> Raw API-shaped rows.
     */
    private static function load_filtered_merged_rows(
        cm_info $cm,
        string $campusuuid,
        array $apifilters,
        array $moodleids
    ): array {
        $response = user_grades::get_user_grades((int) $cm->id, $campusuuid, $apifilters);
        $rows = $response['data'] ?? [];
        if (!is_array($rows)) {
            $rows = [];
        }

        if ($moodleids !== []) {
            $rows = self::apply_idnumber_allowlist($rows, $moodleids);
        }

        return $rows;
    }

    /**
     * @param int $totalrecords
     * @param int $limit
     * @param stdClass $course
     * @param cm_info $cm
     * @param array $data Enriched table rows.
     * @return array{totalrecords: int, limit: int, maxgrade: ?float, data: array}
     */
    private static function build_response(
        int $totalrecords,
        int $limit,
        stdClass $course,
        cm_info $cm,
        array $data
    ): array {
        return [
            'totalrecords' => $totalrecords,
            'limit' => $limit,
            'maxgrade' => self::activity_grademax($course, $cm),
            'data' => $data,
        ];
    }

    /**
     * Maximum grade for the activity grade item (itemnumber 1), if configured.
     *
     * @param stdClass $course
     * @param cm_info $cm
     * @return float|null
     */
    private static function activity_grademax(stdClass $course, cm_info $cm): ?float {
        $item = \grade_item::fetch([
            'itemtype' => 'mod',
            'itemmodule' => $cm->modname,
            'iteminstance' => $cm->instance,
            'courseid' => $course->id,
            'itemnumber' => 1,
        ]);

        return $item ? (float) $item->grademax : null;
    }

    /**
     * Keeps API rows whose `userUuid` is in the Moodle idnumber allowlist (trimmed, exact match).
     *
     * Idnumbers and API UUIDs are expected to be canonical UUID v4 strings; duplicate rows are skipped after the first.
     *
     * @param array $rows Raw moduleGrades rows (each with `userUuid`).
     * @param array $idnumbers Moodle idnumbers from the filter query.
     * @return array<int, array>
     */
    private static function apply_idnumber_allowlist(array $rows, array $idnumbers): array {
        $alloweduuids = [];
        foreach ($idnumbers as $id) {
            $t = trim((string) $id);
            if ($t !== '') {
                $alloweduuids[$t] = true;
            }
        }
        if ($alloweduuids === []) {
            return [];
        }

        $out = [];
        $seenuuids = [];
        foreach ($rows as $item) {
            if (!is_array($item)) {
                continue;
            }
            $uuid = trim((string) ($item['userUuid'] ?? ''));
            if ($uuid === '' || !isset($alloweduuids[$uuid])) {
                continue;
            }
            if (isset($seenuuids[$uuid])) {
                continue;
            }
            $seenuuids[$uuid] = true;

            $item['userUuid'] = $uuid;
            $out[] = $item;
        }

        return $out;
    }
}
