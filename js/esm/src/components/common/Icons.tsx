/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The small icons of the report: the icons of Moodle, which Font Awesome draws, so they take the colour of the text around them and
 * a site can restyle them. None is drawn by hand.
 *
 * @module     report_autograder/components/common/Icons
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface GlyphProps {
    /** Name of the icon in Font Awesome, without the fa- prefix. */
    name: string;
    className?: string;
}

const Glyph = ({name, className}: GlyphProps) => <i
    className={`arp-glyph fa-solid fa-${name}${className ? ` ${className}` : ''}`}
    aria-hidden="true"
/>;

export const IconArrowDown = () => <Glyph name="arrow-down" />;
export const IconArrowUp = () => <Glyph name="arrow-up" />;
export const IconCalendar = () => <Glyph name="calendar-days" />;
export const IconCheck = () => <Glyph name="check" />;
export const IconChevron = () => <Glyph name="chevron-down" />;
export const IconChevronLeft = () => <Glyph name="chevron-left" />;
export const IconChevronRight = () => <Glyph name="chevron-right" />;
export const IconClose = () => <Glyph name="xmark" />;
export const IconCourse = () => <Glyph name="graduation-cap" />;
export const IconFailed = () => <Glyph name="circle-exclamation" className="arp-icon-danger" />;
export const IconFilter = () => <Glyph name="filter" />;
export const IconGroup = () => <Glyph name="users" />;
export const IconInfo = () => <Glyph name="circle-info" />;
export const IconActivity = () => <Glyph name="puzzle-piece" />;
export const IconReset = () => <Glyph name="rotate-right" />;
export const IconSearch = () => <Glyph name="magnifying-glass" />;
export const IconSort = () => <Glyph name="sort" />;
export const IconWarning = () => <Glyph name="triangle-exclamation" className="arp-icon-warning" />;
