import { useState, useEffect } from 'react';

let currentLanguage = localStorage.getItem('language') || 'zh';
let listeners = [];
let translations = {};

// 动态加载翻译文件
async function loadTranslations(lang) {
  try {
    const [common, tools, aiproducts] = await Promise.all([
      import(`../locales/${lang}/common.json`),
      import(`../locales/${lang}/tools.json`),
      import(`../locales/${lang}/aiproducts.json`)
    ]);
    
    translations[lang] = {
      ...common.default,
      tools: tools.default,
      aiproducts: aiproducts.default
    };
    
    return true;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return false;
  }
}

// 初始加载默认语言的翻译
const initPromise = loadTranslations(currentLanguage);

export async function setLanguage(lang) {
  if (!translations[lang]) {
    const loaded = await loadTranslations(lang);
    if (!loaded) return;
  }
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  listeners.forEach(listener => listener(currentLanguage));
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key) {
  if (!translations[currentLanguage]) {
    return key;
  }

  const keys = key.split('.');
  let value = translations[currentLanguage];
  
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 等待初始翻译加载完成
    initPromise.then(() => {
      setIsLoading(false);
    });

    const listener = (newLang) => setLang(newLang);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return { t, lang, setLanguage, isLoading };
}
