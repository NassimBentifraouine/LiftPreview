const COUNTRY_NAMES_BY_CODE: Record<string, string> = {
  FR: 'France',
  BE: 'Belgique',
  ES: 'Espagne',
  DE: 'Allemagne',
  IT: 'Italie',
  GB: 'Royaume-Uni',
  US: 'Etats-Unis',
  CN: 'Chine',
  NL: 'Pays-Bas',
  PT: 'Portugal',
  PL: 'Pologne',
  CH: 'Suisse',
  LU: 'Luxembourg',
  AT: 'Autriche',
  DK: 'Danemark',
  SE: 'Suede',
  NO: 'Norvege',
  FI: 'Finlande',
  IE: 'Irlande',
  GR: 'Grece',
};

const COUNTRY_CODE_BY_NAME: Record<string, string> = {
  france: 'FR',
  belgique: 'BE',
  belgium: 'BE',
  espagne: 'ES',
  spain: 'ES',
  allemagne: 'DE',
  germany: 'DE',
  italie: 'IT',
  italy: 'IT',
  'royaume-uni': 'GB',
  'royaume uni': 'GB',
  uk: 'GB',
  'united kingdom': 'GB',
  'etats-unis': 'US',
  'etats unis': 'US',
  usa: 'US',
  chine: 'CN',
  china: 'CN',
  'pays-bas': 'NL',
  'pays bas': 'NL',
  netherlands: 'NL',
  portugal: 'PT',
  pologne: 'PL',
  poland: 'PL',
  suisse: 'CH',
  switzerland: 'CH',
  luxembourg: 'LU',
  autriche: 'AT',
  austria: 'AT',
  danemark: 'DK',
  denmark: 'DK',
  suede: 'SE',
  sweden: 'SE',
  norvege: 'NO',
  norway: 'NO',
  finlande: 'FI',
  finland: 'FI',
  irlande: 'IE',
  ireland: 'IE',
  grece: 'GR',
  greece: 'GR',
};

const FLAG_BASE_CODEPOINT = 127397;
export const COUNTRY_FLAG_FONT_FAMILY =
  '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","Twemoji Mozilla",sans-serif';

const normalizeCountryName = (name: string) =>
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const getCountryNameFromCode = (code?: string) => {
  if (!code) return '';
  return COUNTRY_NAMES_BY_CODE[code.toUpperCase()] || '';
};

export const getCountryCodeFromName = (name?: string) => {
  if (!name) return undefined;
  return COUNTRY_CODE_BY_NAME[normalizeCountryName(name)];
};

export const getCountryFlagFromCode = (code?: string) => {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  const first = upper.charCodeAt(0);
  const second = upper.charCodeAt(1);
  const isValid = first >= 65 && first <= 90 && second >= 65 && second <= 90;
  if (!isValid) return '';
  return String.fromCodePoint(first + FLAG_BASE_CODEPOINT, second + FLAG_BASE_CODEPOINT);
};

export const getCountryDisplayPartsFromCode = (code?: string) => {
  const safeCode = code?.toUpperCase();
  const name = safeCode ? getCountryNameFromCode(safeCode) || safeCode : '';
  const flag = getCountryFlagFromCode(safeCode);
  return { code: safeCode, name, flag };
};

export const getCountryDisplayPartsFromName = (name?: string) => {
  const safeName = name || '-';
  const code = getCountryCodeFromName(name);
  const flag = getCountryFlagFromCode(code);
  return { code, name: safeName, flag };
};

export const buildCountryLabel = (code: string, fallbackName?: string) => {
  const name = fallbackName || getCountryNameFromCode(code) || code.toUpperCase();
  const flag = getCountryFlagFromCode(code);
  return flag ? `${flag} ${name}` : name;
};

export const getCountryDisplayFromName = (name?: string) => {
  if (!name) return '-';
  const code = getCountryCodeFromName(name);
  return code ? buildCountryLabel(code, name) : name;
};
