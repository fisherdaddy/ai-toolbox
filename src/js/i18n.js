import { useState, useEffect } from 'react';
import i18n from '../data/i18n.json';

let currentLanguage = localStorage.getItem('language') || 'en';
let listeners = [];

export function setLanguage(lang) {
  if (i18n[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    listeners.forEach(listener => listener(currentLanguage));
  }
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key) {
  const keys = key.split('.');
  let value = i18n[currentLanguage];
  for (const k of keys) {
    if (value[k] === undefined) {
      return key;
    }
    value = value[k];
  }
  return value;
}

export function useTranslation() {
  const [lang, setLang] = useState(currentLanguage);

  useEffect(() => {
    const listener = (newLang) => setLang(newLang);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return { t, lang, setLanguage };
}
