'use strict';

/* ---------- Configuration des catégories ---------- */
const CATEGORIES = [
  { id: 'salutations', group: 'phrases', name: 'Salutations & politesse', icon: '👋', count: 10 },
  { id: 'presentation', group: 'phrases', name: 'Se présenter', icon: '🙂', count: 8 },
  { id: 'transports', group: 'phrases', name: 'Transports', icon: '🚕', count: 16 },
  { id: 'hebergement', group: 'phrases', name: 'Hébergement', icon: '🏨', count: 14 },
  { id: 'restaurant', group: 'phrases', name: 'Au restaurant', icon: '🍽️', count: 18 },
  { id: 'bar', group: 'phrases', name: 'Bar / café', icon: '☕', count: 10 },
  { id: 'marche', group: 'phrases', name: 'Marché / épicerie', icon: '🛒', count: 10 },
  { id: 'allergies', group: 'phrases', name: 'Allergies / régimes', icon: '⚠️', count: 8 },
  { id: 'shopping', group: 'phrases', name: 'Shopping', icon: '🛍️', count: 14 },
  { id: 'direction', group: 'phrases', name: 'Se repérer', icon: '🧭', count: 14 },
  { id: 'urgences', group: 'phrases', name: 'Urgences / santé', icon: '🚑', count: 12 },
  { id: 'nombres', group: 'phrases', name: 'Nombres, heure, argent', icon: '🔢', count: 14 },
  { id: 'expressions', group: 'phrases', name: 'Expressions utiles', icon: '💬', count: 10 },
  { id: 'plage', group: 'phrases', name: 'Plage & bord de mer', icon: '🏖️', count: 18 },
  { id: 'voiture', group: 'phrases', name: 'Voiture, route & stationnement', icon: '🚗', count: 26 },
  { id: 'panne', group: 'phrases', name: 'Panne, garage & carburant', icon: '🔧', count: 18 },
  { id: 'bateau', group: 'phrases', name: 'Bateau, port & excursions', icon: '⛵', count: 16 },
  { id: 'laverie', group: 'phrases', name: 'Blanchisserie / laverie', icon: '🧺', count: 10 },
  { id: 'papiers', group: 'phrases', name: 'Papiers, douane & passeport', icon: '🛂', count: 14 },
  { id: 'billets', group: 'phrases', name: 'Billets & réservations', icon: '🎫', count: 16 },
  { id: 'banque', group: 'phrases', name: 'Banque, argent & distributeur', icon: '🏧', count: 12 },
  { id: 'hopital', group: 'phrases', name: 'Hôpital, pharmacie & médicaments', icon: '🏥', count: 18 },
  { id: 'meteo', group: 'phrases', name: 'Météo', icon: '⛅', count: 10 },
  { id: 'telephone', group: 'phrases', name: 'Téléphone & connexion', icon: '📶', count: 10 },
  { id: 'lex-viandes', group: 'lexique', name: 'Viandes & volailles', icon: '🍖', count: 12 },
  { id: 'lex-poissons', group: 'lexique', name: 'Poissons & fruits de mer', icon: '🐟', count: 14 },
  { id: 'lex-legumes', group: 'lexique', name: 'Légumes', icon: '🥕', count: 12 },
  { id: 'lex-fruits', group: 'lexique', name: 'Fruits', icon: '🍎', count: 10 },
  { id: 'lex-laitiers', group: 'lexique', name: 'Produits laitiers & fromages', icon: '🧀', count: 8 },
  { id: 'lex-cereales', group: 'lexique', name: 'Céréales / féculents / pain', icon: '🍞', count: 8 },
  { id: 'lex-boissons', group: 'lexique', name: 'Boissons', icon: '🍷', count: 10 },
  { id: 'lex-cuisson', group: 'lexique', name: 'Modes de cuisson', icon: '🔥', count: 10 },
  { id: 'lex-voiture', group: 'vocab', name: 'Pièces & vocabulaire voiture', icon: '🚘', count: 12 },
  { id: 'lex-vetements', group: 'vocab', name: 'Vêtements & accessoires', icon: '👕', count: 12 },
  { id: 'lex-couleurs', group: 'vocab', name: 'Couleurs', icon: '🎨', count: 10 },
  { id: 'lex-temps', group: 'vocab', name: 'Jours, mois & saisons', icon: '📅', count: 23 },
  { id: 'lex-panneaux', group: 'vocab', name: 'Panneaux & signalétique', icon: '🚧', count: 16 },
];
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

/* ---------- État ---------- */
const state = {
  phrases: [],
  direction: localStorage.getItem('direction') || 'fr-it', // 'fr-it' ou 'it-fr'
  favorites: new Set(JSON.parse(localStorage.getItem('favorites') || '[]')),
  currentCategory: null,
};

/* ---------- Éléments DOM ---------- */
const el = {
  viewCategories: document.getElementById('view-categories'),
  viewPhrases: document.getElementById('view-phrases'),
  viewSearch: document.getElementById('view-search'),
  categoriesGrid: document.getElementById('categories-grid'),
  categoryTitle: document.getElementById('category-title'),
  phrasesList: document.getElementById('phrases-list'),
  searchResultsList: document.getElementById('search-results-list'),
  searchEmpty: document.getElementById('search-empty'),
  searchInput: document.getElementById('search-input'),
  backBtn: document.getElementById('back-btn'),
  directionSwitch: document.getElementById('direction-switch'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  bigMode: document.getElementById('big-mode'),
  bigModeText: document.getElementById('big-mode-text'),
  bigModeClose: document.getElementById('big-mode-close'),
  bigModeSpeak: document.getElementById('big-mode-speak'),
  offlineBanner: document.getElementById('offline-banner'),
  voiceSettingsBtn: document.getElementById('voice-settings-btn'),
  voicePanel: document.getElementById('voice-panel'),
  voicePanelClose: document.getElementById('voice-panel-close'),
  voiceList: document.getElementById('voice-list'),
  voicePanelEmpty: document.getElementById('voice-panel-empty'),
};

/* ---------- Thème clair / sombre ---------- */
function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const isDark = theme === 'dark' ||
    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  el.themeIcon.textContent = isDark ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null (auto)
  applyTheme(saved);
  el.themeToggle.addEventListener('click', () => {
    const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = currentlyDark ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* ---------- Sens de traduction ---------- */
function langs() {
  // Retourne { source, target, sourceCode, targetCode, sourceFlag, targetFlag }
  if (state.direction === 'fr-it') {
    return { source: 'fr', target: 'it', sourceCode: 'fr-FR', targetCode: 'it-IT', sourceFlag: '🇫🇷', targetFlag: '🇮🇹', sourceName: 'Français', targetName: 'Italien' };
  }
  return { source: 'it', target: 'fr', sourceCode: 'it-IT', targetCode: 'fr-FR', sourceFlag: '🇮🇹', targetFlag: '🇫🇷', sourceName: 'Italien', targetName: 'Français' };
}

function updateDirectionUI() {
  const l = langs();
  const sourceEl = el.directionSwitch.querySelector('.dir-source');
  const targetEl = el.directionSwitch.querySelector('.dir-target');
  sourceEl.querySelector('.dir-flag').textContent = l.sourceFlag;
  sourceEl.querySelector('.dir-name').textContent = l.sourceName;
  targetEl.querySelector('.dir-flag').textContent = l.targetFlag;
  targetEl.querySelector('.dir-name').textContent = l.targetName;
}

function initDirection() {
  updateDirectionUI();
  el.directionSwitch.addEventListener('click', () => {
    state.direction = state.direction === 'fr-it' ? 'it-fr' : 'fr-it';
    localStorage.setItem('direction', state.direction);
    updateDirectionUI();
    renderCurrentView();
  });
}

/* ---------- Grosse déco "pour le fun" : pluie de confettis italiens sur un favori ---------- */
const CONFETTI_EMOJI = ['🍕', '🛵', '🇮🇹', '🍋', '🍝', '🤌', '🎉'];
function spawnConfetti(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)];
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1; // large éventail vers le haut
    const dist = 60 + Math.random() * 70;
    piece.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    piece.style.setProperty('--rot', `${Math.random() * 360 - 180}deg`);
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

/* ---------- Fond décoratif : mêmes emojis que les confettis, dispersés partout ---------- */
function initBackgroundDecor() {
  const container = document.getElementById('decor-bg-global');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cols = 4;
  const rows = 5;
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const span = document.createElement('span');
      span.className = 'decor-emoji';
      span.textContent = CONFETTI_EMOJI[i % CONFETTI_EMOJI.length];

      const cellW = 100 / cols;
      const cellH = 100 / rows;
      const jitterX = (Math.random() - 0.5) * cellW * 0.8;
      const jitterY = (Math.random() - 0.5) * cellH * 0.8;
      span.style.left = `${c * cellW + cellW / 2 + jitterX}%`;
      span.style.top = `${r * cellH + cellH / 2 + jitterY}%`;

      span.style.setProperty('--size', `${2 + Math.random() * 2.4}rem`);
      span.style.setProperty('--op', `${0.09 + Math.random() * 0.1}`);
      span.style.setProperty('--dur', `${5 + Math.random() * 4}s`);
      span.style.setProperty('--delay', `${Math.random() * 5}s`);

      container.appendChild(span);
      i++;
    }
  }
}

/* ---------- Favoris ---------- */
function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  localStorage.setItem('favorites', JSON.stringify([...state.favorites]));
}

/* ---------- Text-to-Speech ---------- */
let voicesCache = [];
function loadVoices() {
  voicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (el.voicePanel && !el.voicePanel.classList.contains('hidden')) renderVoiceList();
}
if (window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function getItalianVoices() {
  return voicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith('it'));
}

// Préférence de voix : stockée par nom, propre à chaque appareil (donc à chaque
// personne), puisque les voix installées diffèrent entre Android et iPhone.
function pickVoice(langCode) {
  if (!voicesCache.length) return null;
  const preferredName = localStorage.getItem('preferredVoiceName');
  if (preferredName) {
    const preferred = voicesCache.find(v => v.name === preferredName);
    if (preferred) return preferred;
  }
  const exact = voicesCache.find(v => v.lang === langCode);
  if (exact) return exact;
  const prefix = langCode.split('-')[0];
  return voicesCache.find(v => v.lang && v.lang.startsWith(prefix)) || null;
}

function speak(text, langCode) {
  if (!window.speechSynthesis) {
    alert("La synthèse vocale n'est pas disponible sur cet appareil.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  const voice = pickVoice(langCode);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function speakWithVoice(text, voice) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang;
  utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

/* ---------- Choix de la voix italienne ---------- */
function renderVoiceList() {
  const voices = getItalianVoices();
  const preferredName = localStorage.getItem('preferredVoiceName');
  el.voiceList.innerHTML = '';
  el.voicePanelEmpty.classList.toggle('hidden', voices.length > 0);

  voices.forEach(v => {
    const li = document.createElement('li');
    const isSelected = v.name === preferredName || (!preferredName && v === pickVoice('it-IT'));
    li.className = 'voice-item' + (isSelected ? ' selected' : '');
    li.innerHTML = `
      <span class="voice-item-name">${v.name}${v.lang !== 'it-IT' ? ' (' + v.lang + ')' : ''}</span>
      <button type="button" class="voice-play-btn" aria-label="Écouter un exemple avec cette voix" title="Écouter">▶</button>
    `;
    li.addEventListener('click', (e) => {
      if (e.target.closest('.voice-play-btn')) return;
      localStorage.setItem('preferredVoiceName', v.name);
      renderVoiceList();
    });
    li.querySelector('.voice-play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      speakWithVoice('Buongiorno! Come sta?', v);
    });
    el.voiceList.appendChild(li);
  });
}

function initVoiceSettings() {
  el.voiceSettingsBtn.addEventListener('click', () => {
    renderVoiceList();
    el.voicePanel.classList.remove('hidden');
  });
  el.voicePanelClose.addEventListener('click', () => el.voicePanel.classList.add('hidden'));
  el.voicePanel.addEventListener('click', (e) => {
    if (e.target === el.voicePanel) el.voicePanel.classList.add('hidden');
  });
}

/* ---------- Normalisation pour la recherche (insensible aux accents) ---------- */
// Plage Unicode des signes diacritiques combinants (U+0300 à U+036F),
// construite via String.fromCharCode pour éviter tout souci d'encodage de fichier.
const COMBINING_MARKS_REGEX = new RegExp(
  '[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']', 'g'
);
function normalize(str) {
  return str.normalize('NFD').replace(COMBINING_MARKS_REGEX, '').toLowerCase();
}

/* ---------- Rendu : grille de catégories ---------- */
function renderCategories() {
  el.categoriesGrid.innerHTML = '';

  if (state.favorites.size > 0) {
    appendGroupTitle('⭐ Favoris');
    const favCard = makeCategoryCard({ id: '__favorites__', name: 'Mes favoris', icon: '⭐', group: 'favorites' }, state.favorites.size);
    el.categoriesGrid.appendChild(favCard);
  }

  appendGroupTitle('Phrases');
  CATEGORIES.filter(c => c.group === 'phrases').forEach(c => {
    el.categoriesGrid.appendChild(makeCategoryCard(c, countInCategory(c.id)));
  });

  appendGroupTitle('Lexique alimentaire');
  CATEGORIES.filter(c => c.group === 'lexique').forEach(c => {
    el.categoriesGrid.appendChild(makeCategoryCard(c, countInCategory(c.id)));
  });

  appendGroupTitle('Vocabulaire pratique');
  CATEGORIES.filter(c => c.group === 'vocab').forEach(c => {
    el.categoriesGrid.appendChild(makeCategoryCard(c, countInCategory(c.id)));
  });
}

function appendGroupTitle(text) {
  const h = document.createElement('div');
  h.className = 'category-group-title';
  h.textContent = text;
  el.categoriesGrid.appendChild(h);
}

function countInCategory(id) {
  return state.phrases.filter(p => p.categorie === id).length;
}

function makeCategoryCard(cat, count) {
  const btn = document.createElement('button');
  btn.className = 'category-card';
  btn.type = 'button';
  btn.innerHTML = `
    <span class="cat-icon">${cat.icon}</span>
    <span class="cat-name">${cat.name}</span>
    <span class="cat-count">${count} entrée${count > 1 ? 's' : ''}</span>
  `;
  btn.addEventListener('click', () => openCategory(cat.id));
  return btn;
}

/* ---------- Rendu : liste de phrases d'une catégorie ---------- */
function openCategory(categoryId) {
  state.currentCategory = categoryId;
  showView('phrases');

  if (categoryId === '__favorites__') {
    el.categoryTitle.textContent = '⭐ Mes favoris';
    const items = state.phrases.filter(p => state.favorites.has(p.id));
    renderPhraseList(el.phrasesList, items);
  } else {
    const cat = CATEGORY_BY_ID[categoryId];
    el.categoryTitle.textContent = `${cat.icon} ${cat.name}`;
    const items = state.phrases.filter(p => p.categorie === categoryId);
    renderPhraseList(el.phrasesList, items);
  }
}

function renderPhraseList(container, items) {
  container.innerHTML = '';
  const l = langs();
  items.forEach(p => {
    container.appendChild(makePhraseCard(p, l));
  });
}

function makePhraseCard(phrase, l) {
  const li = document.createElement('li');
  li.className = 'phrase-card';

  const sourceText = phrase[l.source];
  const targetText = phrase[l.target];
  const isFav = state.favorites.has(phrase.id);

  li.innerHTML = `
    <div class="phrase-main">
      <div class="phrase-text" data-role="expand">
        <div class="phrase-source"><span class="line-flag">${l.sourceFlag}</span>${sourceText}</div>
        <div class="phrase-target"><span class="line-flag">${l.targetFlag}</span>${targetText}</div>
      </div>
      <div class="phrase-actions">
        <button type="button" class="fav-btn ${isFav ? 'active' : ''}" aria-label="Ajouter aux favoris" title="Favori">${isFav ? '★' : '☆'}</button>
        <button type="button" class="speak-btn" aria-label="Écouter la prononciation italienne" title="Écouter en italien">🔊</button>
        <button type="button" class="expand-btn" aria-label="Afficher en plein écran" title="Plein écran">⤢</button>
      </div>
    </div>
  `;

  li.querySelector('.fav-btn').addEventListener('click', (e) => {
    const wasFav = state.favorites.has(phrase.id);
    toggleFavorite(phrase.id);
    if (!wasFav) {
      const rect = e.currentTarget.getBoundingClientRect();
      spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    renderCurrentView();
  });
  // L'audio est toujours en italien, quel que soit le sens de traduction affiché
  // (Phil et Ludi n'ont pas besoin de voix française).
  li.querySelector('.speak-btn').addEventListener('click', () => {
    speak(phrase.it, 'it-IT');
  });
  const openBig = () => openBigMode(sourceText, phrase);
  li.querySelector('.expand-btn').addEventListener('click', openBig);
  li.querySelector('[data-role="expand"]').addEventListener('click', openBig);

  return li;
}

/* ---------- Mode plein écran ("montrer l'écran") ---------- */
function openBigMode(displayText, phrase) {
  el.bigModeText.textContent = displayText;
  el.bigMode.classList.remove('hidden');
  el.bigModeSpeak.onclick = () => speak(phrase.it, 'it-IT');
}
function closeBigMode() {
  el.bigMode.classList.add('hidden');
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

/* ---------- Recherche ---------- */
function initSearch() {
  el.searchInput.addEventListener('input', () => {
    const query = el.searchInput.value.trim();
    if (!query) {
      showView(state.currentCategory ? 'phrases' : 'categories');
      return;
    }
    const normQuery = normalize(query);
    const results = state.phrases.filter(p =>
      normalize(p.fr).includes(normQuery) || normalize(p.it).includes(normQuery)
    );
    showView('search');
    renderPhraseList(el.searchResultsList, results);
    el.searchEmpty.classList.toggle('hidden', results.length > 0);
  });
}

/* ---------- Navigation entre vues ---------- */
function showView(view) {
  el.viewCategories.classList.toggle('hidden', view !== 'categories');
  el.viewPhrases.classList.toggle('hidden', view !== 'phrases');
  el.viewSearch.classList.toggle('hidden', view !== 'search');
}

function renderCurrentView() {
  renderCategories();
  if (!el.viewPhrases.classList.contains('hidden') && state.currentCategory) {
    openCategory(state.currentCategory);
  }
  if (!el.viewSearch.classList.contains('hidden') && el.searchInput.value.trim()) {
    el.searchInput.dispatchEvent(new Event('input'));
  }
}

function initNav() {
  el.backBtn.addEventListener('click', () => {
    state.currentCategory = null;
    el.searchInput.value = '';
    showView('categories');
  });
  el.bigModeClose.addEventListener('click', closeBigMode);
}

/* ---------- Statut hors-ligne ---------- */
function initOfflineBanner() {
  const update = () => {
    el.offlineBanner.classList.toggle('hidden', navigator.onLine);
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

/* ---------- Service worker ---------- */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.error('Échec de l\'enregistrement du service worker :', err);
      });
    });
  }
}

/* ---------- Démarrage ---------- */
async function init() {
  initTheme();
  initDirection();
  initSearch();
  initNav();
  initVoiceSettings();
  initOfflineBanner();
  initServiceWorker();
  initBackgroundDecor();

  try {
    const res = await fetch('phrases.json');
    state.phrases = await res.json();
  } catch (err) {
    console.error('Impossible de charger phrases.json', err);
    state.phrases = [];
  }

  renderCategories();
  showView('categories');
}

init();
