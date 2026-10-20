var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Reads the pages of the report from the server as the filters, the sort and the page change, and keeps only the answer to the
 * last question that was asked.
 *
 * @module     report_autograder/hooks/useReport
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { describeError, getReport } from "../services/api";
const FIRST = { rows: [], total: 0, page: 0, limit: 0, loading: true, needsfilter: false, failed: "" };
const useReport = /* @__PURE__ */ __name((query) => {
  const [state, setState] = useState({ ...FIRST, limit: query.limit });
  const asked = useRef(0);
  const known = useRef(0);
  const latest = useRef(query);
  latest.current = query;
  const load = useCallback((page) => {
    const ticket = ++asked.current;
    const current = latest.current;
    setState((before) => ({ ...before, loading: true, failed: "" }));
    getReport({
      scope: current.scope,
      page,
      limit: current.limit,
      filters: current.filters,
      sort: current.sort,
      // Only the first page counts the rows: turning a page cannot change the count.
      withtotal: page === 0
    }).then((response) => {
      if (ticket !== asked.current) {
        return;
      }
      if (response.totalrecords >= 0) {
        known.current = response.totalrecords;
      }
      setState({
        rows: response.needsfilter ? [] : response.data,
        total: response.needsfilter ? 0 : known.current,
        page: response.page,
        limit: response.limit || current.limit,
        loading: false,
        needsfilter: Boolean(response.needsfilter),
        failed: ""
      });
    }).catch((error) => {
      if (ticket !== asked.current) {
        return;
      }
      setState((before) => ({
        ...before,
        rows: [],
        loading: false,
        failed: describeError(error)
      }));
    });
  }, []);
  const key = JSON.stringify([query.scope, query.filters, query.sort, query.limit]);
  useEffect(() => {
    load(0);
  }, [key, load]);
  return [state, load];
}, "useReport");
export {
  useReport
};
//# sourceMappingURL=useReport.dev.js.map
