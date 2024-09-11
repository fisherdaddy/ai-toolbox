import { useState, useEffect } from 'react';

const i18n = {
  zh: {
    title: 'AI 工具箱',
    slogan: '您的智能助手集合，一站式解决各种 AI 需求。',
    tools: {
      text2image: {
        title: '文字卡片',
        description: '将文字转换为图片卡'
      },
      jsonFormatter: {
        title: 'JSON 格式化',
        description: '美化和验证 JSON 数据'
      },
      // 添加更多工具...
    },
    // 添加更多翻译...
  },
  en: {
    title: 'AI Toolbox',
    slogan: 'Your collection of intelligent assistants, solving various AI needs in one place.',
    tools: {
      text2image: {
        title: 'Text to Image Card',
        description: 'Convert text to image card'
      },
      jsonFormatter: {
        title: 'JSON Formatter',
        description: 'Beautify and validate JSON data'
      },
      // 添加更多工具...
    },
    // 添加更多翻译...
  },
  // 添加更多语言...
};

let currentLanguage = localStorage.getItem('language') || 'zh'; // 从本地存储获取语言设置，默认为中文
let listeners = [];

export function setLanguage(lang) {
  if (i18n[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang); // 将语言设置保存到本地存储
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
      return key; // 如果翻译不存在，返回原始 key
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
