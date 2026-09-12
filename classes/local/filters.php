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

namespace report_autograder\local;

/**
 * What the viewer asked to narrow the table down to.
 *
 * The previous version split filters in two — the ones Moodle could answer and
 * the ones the external service had to — and reconciled the two lists in PHP.
 * With everything in one database there is one list and one query.
 *
 * @package     report_autograder
 * @copyright   2026 Acción Docente SDR <ct.accion.docente@funiber.org>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class filters {
    /** @var string Part of a student's name. */
    private string $search = '';

    /** @var int|null Show nothing whose date falls before this. */
    private ?int $datefrom = null;

    /** @var int|null Show nothing whose date falls after this. */
    private ?int $dateto = null;

    /** @var string[] Report statuses, as {@see status} names them. */
    private array $statuses = [];

    /** @var int One course, at site level. */
    private int $courseid = 0;

    /** @var int One activity, at course or site level. */
    private int $cmid = 0;

    /**
     * Reads the filter list the client sends, ignoring anything unknown.
     *
     * @param array $raw A list of `['name' => ..., 'value' => ...]`.
     * @param bool $canseefailures Whether "failed" is a status this viewer may ask for.
     * @return self
     */
    public static function from_request(array $raw, bool $canseefailures): self {
        $filters = new self();
        $allowedstatuses = status::filterable($canseefailures);

        foreach ($raw as $filter) {
            $name = clean_param((string) ($filter['name'] ?? ''), PARAM_ALPHANUMEXT);
            $value = trim((string) ($filter['value'] ?? ''));

            if ($name === '' || $value === '') {
                continue;
            }

            switch ($name) {
                case 'searchname':
                    $filters->search = $value;
                    break;

                case 'grading_date_from':
                    $filters->datefrom = self::to_timestamp($value, false);
                    break;

                case 'grading_date_to':
                    $filters->dateto = self::to_timestamp($value, true);
                    break;

                case 'status':
                    foreach (explode(',', $value) as $status) {
                        $status = trim($status);

                        if (in_array($status, $allowedstatuses, true)) {
                            $filters->statuses[] = $status;
                        }
                    }
                    break;

                case 'courseid':
                    $filters->courseid = (int) $value;
                    break;

                case 'cmid':
                    $filters->cmid = (int) $value;
                    break;
            }
        }

        $filters->statuses = array_values(array_unique($filters->statuses));

        return $filters;
    }

    /**
     * A date from the client, as the instant the day starts or ends.
     *
     * The picker sends whole days, so "to 5 March" has to mean the end of the
     * 5th and not its first second, or a day's own rows fall outside the range
     * the viewer just drew around them.
     *
     * @param string $value
     * @param bool $endofday
     * @return int|null
     */
    private static function to_timestamp(string $value, bool $endofday): ?int {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            $timestamp = strtotime($value);

            return $timestamp === false ? null : $timestamp;
        }

        $timestamp = strtotime($value . ($endofday ? ' 23:59:59' : ' 00:00:00'));

        return $timestamp === false ? null : $timestamp;
    }

    /**
     * The name fragment to look for.
     *
     * @return string
     */
    public function search(): string {
        return $this->search;
    }

    /**
     * The earliest date to show.
     *
     * @return int|null
     */
    public function datefrom(): ?int {
        return $this->datefrom;
    }

    /**
     * The latest date to show.
     *
     * @return int|null
     */
    public function dateto(): ?int {
        return $this->dateto;
    }

    /**
     * The statuses to show, in the report's own words.
     *
     * @return string[]
     */
    public function statuses(): array {
        return $this->statuses;
    }

    /**
     * The one course to show.
     *
     * @return int Zero when not filtering by course.
     */
    public function courseid(): int {
        return $this->courseid;
    }

    /**
     * The one activity to show.
     *
     * @return int Zero when not filtering by activity.
     */
    public function cmid(): int {
        return $this->cmid;
    }

    /**
     * Whether anything at all was asked for.
     *
     * @return bool
     */
    public function is_empty(): bool {
        return $this->search === ''
            && $this->datefrom === null
            && $this->dateto === null
            && $this->statuses === []
            && $this->courseid === 0
            && $this->cmid === 0;
    }
}
