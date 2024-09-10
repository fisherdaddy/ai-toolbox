import React from 'react';
import { useTranslation } from '../js/i18n';

function LanguageSelector() {
  const { lang, setLanguage } = useTranslation();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div id="language-selector">
      <select id="lang-select" value={lang} onChange={handleLanguageChange}>
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

export default LanguageSelector;