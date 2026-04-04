/** All calendar semantics for this app: America/Vancouver (PST/PDT). */

export const VANCOUVER_TZ = 'America/Vancouver';

const dtfYmd = new Intl.DateTimeFormat('en-CA', {
  timeZone: VANCOUVER_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function vancouverYmdKey(ms: number): string {
  const parts = dtfYmd.formatToParts(new Date(ms));
  const y = parts.find((p) => p.type === 'year')!.value;
  const m = parts.find((p) => p.type === 'month')!.value;
  const d = parts.find((p) => p.type === 'day')!.value;
  return `${y}-${m}-${d}`;
}

/** YYYY-MM-DD for this instant in Vancouver. */
export function utcDateToVancouverYmd(date: Date | string | number | null | undefined): string {
  if (date == null) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return vancouverYmdKey(d.getTime());
}

/** Start of that calendar day in Vancouver as a Date (UTC instant). */
export function vancouverYmdToUtcDate(ymd: string): Date | null {
  if (!ymd || typeof ymd !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  const Y = parseInt(m[1], 10);
  const M = parseInt(m[2], 10);
  const D = parseInt(m[3], 10);
  const target = `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`;

  let lo = Date.UTC(Y, M - 1, D) - 72 * 3600000;
  let hi = Date.UTC(Y, M - 1, D) + 72 * 3600000;
  for (let i = 0; i < 64; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const k = vancouverYmdKey(mid);
    if (k < target) lo = mid + 1;
    else hi = mid;
  }
  if (vancouverYmdKey(lo) !== target) return null;
  while (lo > 0 && vancouverYmdKey(lo - 1) === target) lo -= 1;
  return new Date(lo);
}

export function vancouverTodayYmd(): string {
  return vancouverYmdKey(Date.now());
}

export function addDaysToYmd(ymd: string, days: number): string {
  const base = vancouverYmdToUtcDate(ymd.trim());
  if (!base) return ymd;
  const t = new Date(base.getTime() + days * 86400000);
  return utcDateToVancouverYmd(t);
}

/** Value for <input type="date" /> from API ISO / BSON date. */
export function dateInputValueFromApi(iso: string | Date | null | undefined): string {
  if (iso == null) return '';
  return utcDateToVancouverYmd(iso);
}

/** Display datetime in Ukrainian, Vancouver timezone. */
export function formatDateTimeUkVancouver(iso: string | Date): string {
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString('uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: VANCOUVER_TZ,
    });
  } catch {
    return String(iso);
  }
}

/** Short date only for tables. */
export function formatDateUkVancouver(iso: string | Date | null | undefined): string {
  if (iso == null) return '—';
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: VANCOUVER_TZ,
    });
  } catch {
    return '—';
  }
}
