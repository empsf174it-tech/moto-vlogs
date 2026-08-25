/**
 * Regenerates assets/i18n/i18n-data.js from the individual language JSON files.
 *
 * The site loads translations from that generated bundle rather than fetching
 * the JSON directly, because fetch() is blocked on file:// origins - opening
 * index.html straight from disk would otherwise leave the page stuck in English.
 *
 * Run after editing any assets/i18n/*.json file:
 *     node tools/build-i18n.js
 *
 * To add a language: create assets/i18n/<code>.json, add the code to LANGS
 * below, add an <option> to both selects in index.html, add the code to the
 * supported list in initLanguage() in assets/js/main.js, then run this script.
 */

const fs = require('fs');
const path = require('path');

const LANGS = ['en', 'es', 'fr'];

const i18nDir = path.join(__dirname, '..', 'assets', 'i18n');
const outFile = path.join(i18nDir, 'i18n-data.js');

// English is the reference set: every other language must cover the same keys.
const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' ? flatten(value, full) : [full];
  });

const dictionaries = {};
let failed = false;

for (const lang of LANGS) {
  const file = path.join(i18nDir, `${lang}.json`);

  try {
    dictionaries[lang] = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`✗ ${lang}.json could not be parsed: ${err.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);

const referenceKeys = flatten(dictionaries.en);

for (const lang of LANGS.filter((l) => l !== 'en')) {
  const keys = new Set(flatten(dictionaries[lang]));
  const missing = referenceKeys.filter((key) => !keys.has(key));

  if (missing.length) {
    console.warn(`! ${lang}.json is missing ${missing.length} key(s):`);
    missing.forEach((key) => console.warn(`    ${key}`));
  }
}

const body = LANGS.map(
  (lang) => `  ${lang}: ${fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8').trim()}`
).join(',\n');

const banner = `/* Auto-generated from assets/i18n/*.json by tools/build-i18n.js.
   Do not edit by hand - edit the JSON files and re-run the script.
   Inlined so translations also work when the page is opened directly
   from disk (file://), where fetch() is blocked by the browser. */`;

fs.writeFileSync(outFile, `${banner}\nwindow.I18N_DATA = {\n${body}\n};\n`);

console.log(`✓ i18n-data.js rebuilt with: ${LANGS.join(', ')}`);
