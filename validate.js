#!/usr/bin/env node
'use strict';
/*
 * Script de validation automatique, a executer avant chaque livraison :
 *   node validate.js
 *
 * Verifie :
 *  - phrases.json est un JSON valide, chaque entree a id/categorie/fr/it non vides
 *  - aucun id en double
 *  - le nombre d'entrees par categorie correspond au prompt (a ~2 pres)
 *  - manifest.json contient tous les champs obligatoires
 *  - sw.js precache bien tous les fichiers reels utilises par l'appli
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let errors = [];
let warnings = [];

// Attendu (issu du prompt) : id de categorie -> nombre de phrases
const EXPECTED_COUNTS = {
  salutations: 10,
  presentation: 8,
  transports: 16,
  hebergement: 14,
  restaurant: 18,
  bar: 10,
  marche: 10,
  allergies: 8,
  shopping: 14,
  direction: 14,
  urgences: 12,
  nombres: 14,
  expressions: 10,
  plage: 18,
  voiture: 26,
  panne: 18,
  bateau: 16,
  laverie: 10,
  papiers: 14,
  billets: 16,
  banque: 12,
  hopital: 18,
  meteo: 10,
  telephone: 10,
  quotidien: 50,
  famille: 12,
  travail: 12,
  maison: 14,
  rendezvous: 12,
  loisirs: 14,
  poste: 12,
  enfants: 12,
  opinions: 12,
  'lex-viandes': 12,
  'lex-poissons': 14,
  'lex-legumes': 12,
  'lex-fruits': 10,
  'lex-laitiers': 8,
  'lex-cereales': 8,
  'lex-boissons': 10,
  'lex-cuisson': 10,
  'lex-voiture': 12,
  'lex-vetements': 12,
  'lex-couleurs': 10,
  'lex-temps': 23,
  'lex-panneaux': 16,
  'lex-personnes': 20,
  'lex-corps': 25,
  'lex-sante': 20,
  'lex-maison': 30,
  'lex-cuisine': 20,
  'lex-ville': 25,
  'lex-nature': 25,
  'lex-animaux': 25,
  'lex-metiers': 20,
  'lex-ecole': 20,
  'lex-numerique': 20,
  'lex-verbes': 30,
  'lex-adjectifs': 30,
};
const TOLERANCE = 2;

/* ---------- 1. phrases.json ---------- */
let phrases;
try {
  const raw = fs.readFileSync(path.join(ROOT, 'phrases.json'), 'utf8');
  phrases = JSON.parse(raw);
} catch (err) {
  errors.push(`phrases.json : JSON invalide ou introuvable (${err.message})`);
}

if (Array.isArray(phrases)) {
  const seenIds = new Set();
  const countByCategory = {};

  phrases.forEach((p, i) => {
    ['id', 'categorie', 'fr', 'it'].forEach((field) => {
      if (!p[field] || typeof p[field] !== 'string' || !p[field].trim()) {
        errors.push(`phrases.json[${i}] : champ "${field}" manquant ou vide (id=${p.id || '?'})`);
      }
    });
    if (p.id) {
      if (seenIds.has(p.id)) {
        errors.push(`phrases.json : id en double détecté -> "${p.id}"`);
      }
      seenIds.add(p.id);
    }
    if (p.categorie) {
      countByCategory[p.categorie] = (countByCategory[p.categorie] || 0) + 1;
    }
  });

  console.log(`✓ phrases.json : ${phrases.length} entrées lues`);

  // Comptage par catégorie vs attendu
  Object.entries(EXPECTED_COUNTS).forEach(([cat, expected]) => {
    const actual = countByCategory[cat] || 0;
    if (Math.abs(actual - expected) > TOLERANCE) {
      errors.push(`Catégorie "${cat}" : ${actual} entrée(s) trouvée(s), attendu ~${expected} (tolérance ±${TOLERANCE})`);
    }
  });
  Object.keys(countByCategory).forEach((cat) => {
    if (!(cat in EXPECTED_COUNTS)) {
      warnings.push(`Catégorie "${cat}" présente dans phrases.json mais absente du prompt de référence`);
    }
  });
} else if (!errors.length) {
  errors.push('phrases.json : le contenu doit être un tableau JSON');
}

/* ---------- 2. manifest.json ---------- */
const REQUIRED_MANIFEST_FIELDS = ['name', 'icons', 'start_url', 'display', 'theme_color', 'background_color'];
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  REQUIRED_MANIFEST_FIELDS.forEach((field) => {
    if (!(field in manifest) || manifest[field] === '' || (Array.isArray(manifest[field]) && manifest[field].length === 0)) {
      errors.push(`manifest.json : champ obligatoire manquant ou vide -> "${field}"`);
    }
  });
  if (Array.isArray(manifest.icons)) {
    manifest.icons.forEach((icon) => {
      const iconPath = path.join(ROOT, icon.src);
      if (!fs.existsSync(iconPath)) {
        errors.push(`manifest.json : icône référencée introuvable -> "${icon.src}"`);
      }
    });
  }
  if (!errors.some((e) => e.startsWith('manifest.json'))) {
    console.log('✓ manifest.json : tous les champs obligatoires sont présents');
  }
} catch (err) {
  errors.push(`manifest.json : JSON invalide ou introuvable (${err.message})`);
}

/* ---------- 3. sw.js precache tous les fichiers reels ---------- */
try {
  const swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const match = swContent.match(/PRECACHE_URLS\s*=\s*\[([\s\S]*?)\]/);
  if (!match) {
    errors.push('sw.js : impossible de repérer la liste PRECACHE_URLS');
  } else {
    const cachedFiles = [...match[1].matchAll(/['"]\.\/(.*?)['"]/g)]
      .map((m) => m[1])
      .filter((f) => f !== ''); // ignore './'

    // Fichiers reellement presents et utilises par l'appli (racine + icones)
    const realFiles = ['index.html', 'style.css', 'app.js', 'phrases.json', 'manifest.json']
      .concat(fs.readdirSync(path.join(ROOT, 'icons')).map((f) => `icons/${f}`));

    realFiles.forEach((f) => {
      if (!cachedFiles.includes(f)) {
        errors.push(`sw.js : fichier utilisé par l'appli mais absent de PRECACHE_URLS -> "${f}"`);
      }
    });
    cachedFiles.forEach((f) => {
      if (!realFiles.includes(f) && !fs.existsSync(path.join(ROOT, f))) {
        errors.push(`sw.js : fichier référencé dans PRECACHE_URLS mais introuvable sur le disque -> "${f}"`);
      }
    });
    if (!errors.some((e) => e.startsWith('sw.js'))) {
      console.log(`✓ sw.js : ${cachedFiles.length} fichiers précachés, cohérents avec le disque`);
    }
  }
} catch (err) {
  errors.push(`sw.js : introuvable ou illisible (${err.message})`);
}

/* ---------- Résultat ---------- */
if (warnings.length) {
  console.log('\nAvertissements :');
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (errors.length) {
  console.log('\n✗ Validation ÉCHOUÉE :');
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n✓ Toutes les vérifications automatiques sont passées avec succès.');
  process.exit(0);
}
