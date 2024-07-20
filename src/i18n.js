import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'uk', 'it', 'fr', 'de', 'es'],
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    debug: true,
    detection: {
      order: ['querystring', 'cookie', 'header', 'session', 'path', 'navigator'],
      caches: ['cookie'],
    }
  });

export default i18next;