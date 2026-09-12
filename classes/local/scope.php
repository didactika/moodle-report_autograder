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
 * How much of the site one report is about.
 *
 * There are three reports — one activity, one course, the whole site — but
 * they are the same table with a different reach. Everything that differs
 * between them lives here: which context to check, which capability, how far
 * the query reaches, and which columns earn their place. Splitting them into
 * three pages would have meant three copies of the same query drifting apart.
 *
 * @package     report_autograder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class scope {
    /** @var string One activity. */
    public const LEVEL_ACTIVITY = 'activity';

    /** @var string Every autograded activity in one course. */
    public const LEVEL_COURSE = 'course';

    /** @var string Every autograded activity on the site. */
    public const LEVEL_SITE = 'site';

    /** @var string Which of the three this is. */
    private string $level;

    /** @var \stdClass|null The course, for the activity and course levels. */
    private ?\stdClass $course;

    /** @var \cm_info|null The activity, for the activity level. */
    private ?\cm_info $cm;

    /** @var \context The context to check capabilities against. */
    private \context $context;

    /**
     * Built by from_params(), which is the only thing that knows the request.
     *
     * @param string $level
     * @param \context $context
     * @param \stdClass|null $course
     * @param \cm_info|null $cm
     */
    private function __construct(string $level, \context $context, ?\stdClass $course, ?\cm_info $cm) {
        $this->level = $level;
        $this->context = $context;
        $this->course = $course;
        $this->cm = $cm;
    }

    /**
     * Works out which report is being asked for from the request.
     *
     * @param int $cmid Zero for anything but the activity level.
     * @param int $courseid Zero for anything but the course level.
     * @return self
     */
    public static function from_params(int $cmid, int $courseid): self {
        if ($cmid > 0) {
            [$course, $cm] = get_course_and_cm_from_cmid($cmid);

            return new self(
                self::LEVEL_ACTIVITY,
                \context_module::instance($cm->id),
                $course,
                $cm
            );
        }

        if ($courseid > 0) {
            $course = get_course($courseid);

            return new self(
                self::LEVEL_COURSE,
                \context_course::instance($course->id),
                $course,
                null
            );
        }

        return new self(self::LEVEL_SITE, \context_system::instance(), null, null);
    }

    /**
     * Which of the three reports this is.
     *
     * @return string One of the LEVEL_* constants.
     */
    public function level(): string {
        return $this->level;
    }

    /**
     * The context its capability is checked against.
     *
     * @return \context
     */
    public function context(): \context {
        return $this->context;
    }

    /**
     * The course this is about, where there is one.
     *
     * @return \stdClass|null Null at site level.
     */
    public function course(): ?\stdClass {
        return $this->course;
    }

    /**
     * The activity this is about, where there is one.
     *
     * @return \cm_info|null Null anywhere but the activity level.
     */
    public function cm(): ?\cm_info {
        return $this->cm;
    }

    /**
     * The capability this level needs.
     *
     * @return string
     */
    public function capability(): string {
        switch ($this->level) {
            case self::LEVEL_ACTIVITY:
                return 'report/autograder:view';

            case self::LEVEL_COURSE:
                return 'report/autograder:viewcourse';

            default:
                return 'report/autograder:viewsite';
        }
    }

    /**
     * Refuses anybody who may not see this much.
     */
    public function require_capability(): void {
        require_capability($this->capability(), $this->context);
    }

    /**
     * Whether the viewer may be told that autograder tried and could not.
     *
     * @return bool
     */
    public function can_see_failures(): bool {
        return has_capability('report/autograder:viewfailed', $this->context);
    }

    /**
     * Whether the activity has to be named in each row — it does not when
     * every row is about the same one.
     *
     * @return bool
     */
    public function shows_activity_column(): bool {
        return $this->level !== self::LEVEL_ACTIVITY;
    }

    /**
     * Whether the course has to be named in each row.
     *
     * @return bool
     */
    public function shows_course_column(): bool {
        return $this->level === self::LEVEL_SITE;
    }

    /**
     * This report's own address.
     *
     * @param array $extra Extra query parameters.
     * @return \moodle_url
     */
    public function url(array $extra = []): \moodle_url {
        return new \moodle_url('/report/autograder/index.php', $this->url_params() + $extra);
    }

    /**
     * What identifies this report in a URL or a web service call.
     *
     * @return array{cmid?: int, courseid?: int}
     */
    public function url_params(): array {
        switch ($this->level) {
            case self::LEVEL_ACTIVITY:
                return ['cmid' => (int) $this->cm->id];

            case self::LEVEL_COURSE:
                return ['courseid' => (int) $this->course->id];

            default:
                return [];
        }
    }

    /**
     * What the page is called, naming what it is about.
     *
     * @return string
     */
    public function heading(): string {
        switch ($this->level) {
            case self::LEVEL_ACTIVITY:
                return get_string('heading:activity', 'report_autograder', format_string($this->cm->name));

            case self::LEVEL_COURSE:
                return get_string('heading:course', 'report_autograder', format_string($this->course->fullname));

            default:
                return get_string('heading:site', 'report_autograder');
        }
    }
}
