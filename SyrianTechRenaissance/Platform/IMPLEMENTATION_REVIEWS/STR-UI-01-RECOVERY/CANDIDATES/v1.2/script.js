'use strict';

/* STR UI-01 — Home Dashboard Standalone Visual Reference v1.1
 *
 * R6: complete static localization. The toggle is data-attribute-driven;
 * the dictionary below is only used for strings whose source is JS-derived
 * (titles, AI placeholder text). The bulk of the localization happens by
 * swapping [data-ar]/[data-en] attributes in index.html.
 *
 * R8: theme button removed — dark theme is the reference, no toggle.
 */

const dictionary = {
  ar: {
    title: 'Syrian Tech Renaissance — مرجع بصري',
    ai: 'ابدأ بمساعدة الذكاء الاصطناعي',
    projects: 'ابحث عن مشروع يناسبك',
    learn: 'طوّر مهاراتك',
    langLabel: 'AR',
  },
  en: {
    title: 'Syrian Tech Renaissance — Visual Reference',
    ai: 'Start with AI assistance',
    projects: 'Find a project for you',
    learn: 'Develop your skills',
    langLabel: 'EN',
  },
};

function applyLocale(loc) {
  const html = document.documentElement;
  html.lang = loc;
  html.dir = loc === 'ar' ? 'rtl' : 'ltr';
  document.title = dictionary[loc].title;

  // Swap every [data-ar][data-en] element's innerHTML to the chosen locale.
  // We use innerHTML because some strings contain <br> for line breaks.
  document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
    el.innerHTML = el.dataset[loc];
  });

  // Update language toggle button labels
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = '◎ ' + dictionary[loc].langLabel;

  // Update feature panel h2s that use IDs only (no data-ar/data-en)
  // These were handled above if they have data-attributes; otherwise fallback:
  const aiH2 = document.querySelector('.ai-panel h2');
  if (aiH2 && !aiH2.hasAttribute('data-ar')) aiH2.textContent = dictionary[loc].ai;
  const exH2 = document.querySelector('.explore-panel h2');
  if (exH2 && !exH2.hasAttribute('data-ar')) exH2.textContent = dictionary[loc].projects;
  const leH2 = document.querySelector('.learning-panel h2');
  if (leH2 && !leH2.hasAttribute('data-ar')) leH2.textContent = dictionary[loc].learn;
}

function toggleLanguage() {
  const current = document.documentElement.lang;
  const next = current === 'ar' ? 'en' : 'ar';
  applyLocale(next);
}

// Wire up on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleLang');
  const langBtn = document.getElementById('langBtn');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleLanguage);
  if (langBtn) langBtn.addEventListener('click', toggleLanguage);

  // Initialize to Arabic (default)
  applyLocale('ar');
});
