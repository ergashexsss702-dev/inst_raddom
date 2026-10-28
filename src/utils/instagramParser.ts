// Instagram account parsing, normalization, and sample generator

export interface Participant {
  id: string;
  username: string; // e.g. "samandar_dev"
  displayName?: string;
  source?: 'input' | 'file' | 'demo';
}

export const DEMO_PARTICIPANTS: string[] = [
  'dilshod_official',
  'madina_karimova',
  'islombek_uz',
  'sarvinoz_art',
  'javohir_aliev',
  'shahnoza_travels',
  'bobur_tech',
  'nodira_fashion',
  'farrux_photo',
  'umida_vlogs',
  'anvar_tashkent',
  'gulnoza_cake',
  'mirzohid_fitness',
  'rayhona_books',
  'azamat_marketing',
  'nilufar_design',
  'bekzod_auto',
  'kamola_music',
  'shoxrux_crypto',
  'dildora_beauty',
  'rustam_finance',
  'sevara_lifestyle',
  'jamshid_developer',
  'zarina_kitchen',
  'otabek_runner',
  'muazzam_handmade',
  'elyor_samarkand',
  'lobar_style',
  'sherzod_mobile',
  'yulduz_teacher',
  'akbar_invest',
  'mohira_flowers',
  'davron_gamer',
  'munisa_craft',
  'azizbek_bukhara',
  'feruza_ceramics',
  'jasur_arch',
  'nozima_jewelry',
  'abbos_football',
  'gulbahor_eco',
  'sardor_traveler',
  'shaxzoda_nature',
  'temur_coffee',
  'hilola_english',
  'baxtiyor_uz',
  'marjona_poetry',
  'oybek_cinematic',
  'shohista_med',
  'ravshan_startups',
  'fotima_bakes'
];

/**
 * Validates and normalizes an Instagram username according to platform rules
 * 1-30 chars, letters, numbers, periods, and underscores. No double consecutive periods.
 */
export function normalizeUsername(input: string): string {
  let clean = input.trim().replace(/^@+/, '');
  clean = clean.replace(/^[https?://]*(www\.)?instagram\.com\//i, '');
  clean = clean.split(/[/?#]/)[0].trim().toLowerCase();
  return clean;
}

export function isValidInstagramUsername(username: string): boolean {
  if (!username || username.length < 1 || username.length > 30) return false;
  // Alphanumeric + periods and underscores
  return /^[a-zA-Z0-9._]+$/.test(username) && !username.includes('..');
}

/**
 * Parses raw text input into clean unique participants
 */
export function parseRawTextParticipants(text: string, removeDuplicates = true): string[] {
  if (!text) return [];

  // Split by newlines, commas, semicolons, tabs, spaces
  const tokens = text.split(/[\r\n,;\t]+/);
  const result: string[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    
    // Check if line contains space separated words, might be multiple usernames or full lines
    const subParts = trimmed.split(/\s+/);
    for (const part of subParts) {
      const clean = normalizeUsername(part);
      if (clean && isValidInstagramUsername(clean)) {
        if (removeDuplicates) {
          if (!seen.has(clean)) {
            seen.add(clean);
            result.push(clean);
          }
        } else {
          result.push(clean);
        }
      }
    }
  }

  return result;
}

/**
 * Parses CSV or TXT file contents
 */
export function parseFileContent(content: string, removeDuplicates = true): string[] {
  const lines = content.split(/\r?\n/);
  const candidates: string[] = [];

  // Check if first line is a header like "username", "account", "handle", etc.
  let startIdx = 0;
  if (lines.length > 0) {
    const firstLineLower = lines[0].toLowerCase();
    if (
      firstLineLower.includes('username') ||
      firstLineLower.includes('account') ||
      firstLineLower.includes('obunachi') ||
      firstLineLower.includes('user') ||
      firstLineLower.includes('handle') ||
      firstLineLower.includes('follower')
    ) {
      startIdx = 1;
    }
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV comma separation (taking first valid column or columns)
    const columns = line.split(/[,\t;]/);
    for (const col of columns) {
      const cleaned = normalizeUsername(col.replace(/^["']|["']$/g, ''));
      if (isValidInstagramUsername(cleaned)) {
        candidates.push(cleaned);
        break; // take primary valid username from this line
      }
    }
  }

  if (candidates.length === 0) {
    // Fallback: parse entire string
    return parseRawTextParticipants(content, removeDuplicates);
  }

  if (removeDuplicates) {
    return Array.from(new Set(candidates));
  }
  return candidates;
}

/**
 * Generates and triggers download of a sample CSV template file
 */
export function downloadSampleCsvTemplate() {
  const header = 'username,ism_familiya\n';
  const rows = DEMO_PARTICIPANTS.slice(0, 15)
    .map((uname) => `@${uname},Ishtirokchi`)
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'insta_obunachilar_shablon.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
