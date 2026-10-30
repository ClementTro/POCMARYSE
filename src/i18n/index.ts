import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import appEn from './locales/en/app.json';
import authEn from './locales/en/auth.json';
import commonEn from './locales/en/common.json';
import vitrineEn from './locales/en/vitrine.json';
import appFr from './locales/fr/app.json';
import authFr from './locales/fr/auth.json';
import commonFr from './locales/fr/common.json';
import vitrineFr from './locales/fr/vitrine.json';

export const LANGUES = ['fr', 'en'] as const;
export type Langue = (typeof LANGUES)[number];

export const CLE_LANGUE = 'maryse-langue';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { common: commonFr, app: appFr, auth: authFr, vitrine: vitrineFr },
      en: { common: commonEn, app: appEn, auth: authEn, vitrine: vitrineEn },
    },
    fallbackLng: 'fr',
    supportedLngs: [...LANGUES],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    defaultNS: 'common',
    ns: ['common', 'app', 'auth', 'vitrine'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: CLE_LANGUE,
      caches: ['localStorage'],
    },
  });

function appliquerLangueDocument(langue: string) {
  document.documentElement.lang = langue.startsWith('en') ? 'en' : 'fr';
}

appliquerLangueDocument(i18n.resolvedLanguage ?? 'fr');
i18n.on('languageChanged', appliquerLangueDocument);

type Traductions = Record<string, unknown>;

/** Enregistre les traductions d'un namespace (vitrine, module…) pour les deux langues. */
export function enregistrerTraductions(namespace: string, fr: Traductions, en: Traductions) {
  i18n.addResourceBundle('fr', namespace, fr, true, true);
  i18n.addResourceBundle('en', namespace, en, true, true);
}

export default i18n;
