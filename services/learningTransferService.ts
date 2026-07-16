// Keep the version 1 package shape so links created by older releases remain valid.
// The additional prefixes cover the original sentence-building course, whose keys
// do not start with a grade name.
const PREFIXES = [
  'eiken4',
  'grade1',
  'grade2',
  'grade3',
  'setAttemptCount',
  'setStats',
  'sentenceMistakeCount',
];
const EXACT_KEYS = new Set(['dailyLog', 'sentenceLearningProfileV1']);
export const isTransferableLearningKey = (key: string) => EXACT_KEYS.has(key) || PREFIXES.some(prefix => key.startsWith(prefix));
export type TransferPackage = { version: 1; createdAt: string; values: Record<string, string> };

const encode = (value: string) => btoa(unescape(encodeURIComponent(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const decode = (value: string) => decodeURIComponent(escape(atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='))));
const hash = (value: string) => { let result = 2166136261; for (const char of value) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619); } return result >>> 0; };

export const createTransfer = () => {
  const values: Record<string, string> = {};
  if (typeof localStorage !== 'undefined') for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index); if (key && isTransferableLearningKey(key)) values[key] = localStorage.getItem(key) || '';
  }
  const payload = encode(JSON.stringify({ version: 1, createdAt: new Date().toISOString(), values } satisfies TransferPackage));
  const code = String(hash(payload) % 10000).padStart(4, '0');
  const base = typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}`;
  return { code, link: `${base}#/transfer?data=${payload}&code=${code}`, itemCount: Object.keys(values).length };
};

export const readTransfer = (payload: string): TransferPackage | null => { try { const data = JSON.parse(decode(payload)) as TransferPackage; return data.version === 1 && data.values ? data : null; } catch { return null; } };
const merge = (current: unknown, incoming: unknown): unknown => {
  if (Array.isArray(current) && Array.isArray(incoming)) return Array.from(new Map([...current, ...incoming].map(item => [JSON.stringify(item), item])).values());
  if (current && incoming && typeof current === 'object' && typeof incoming === 'object') {
    const left = current as Record<string, unknown>, right = incoming as Record<string, unknown>;
    if ('date' in left && 'date' in right) { const leftSize = Array.isArray(left.answers) ? left.answers.length : 0; const rightSize = Array.isArray(right.answers) ? right.answers.length : 0; return String(right.date) > String(left.date) || (right.date === left.date && rightSize >= leftSize) ? right : left; }
    const result = { ...left }; for (const [key, value] of Object.entries(right)) result[key] = key in result ? merge(result[key], value) : value; return result;
  }
  if (typeof current === 'number' && typeof incoming === 'number') return Math.max(current, incoming);
  if (typeof current === 'boolean' && typeof incoming === 'boolean') return current || incoming;
  return incoming ?? current;
};
export const importTransfer = (data: TransferPackage) => {
  if (typeof localStorage === 'undefined') return 0; let count = 0;
  for (const [key, raw] of Object.entries(data.values)) { if (!isTransferableLearningKey(key)) continue; try { const existing = localStorage.getItem(key); localStorage.setItem(key, existing ? JSON.stringify(merge(JSON.parse(existing), JSON.parse(raw))) : raw); } catch { localStorage.setItem(key, raw); } count += 1; }
  return count;
};
