import i18next from '../i18n.js'; 

export function getLocalizedMessage(req, key) {
  const lng = req.headers['accept-language'] || 'en'; 
  return i18next.getFixedT(lng)(key);
}