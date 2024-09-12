import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../js/i18n';

function LanguageSelector() {
  const { lang, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어'
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-selector">
      <button onClick={() => setIsOpen(!isOpen)} className="language-button">
        {languages[lang]}
      </button>
      {isOpen && (
        <ul className="language-dropdown" ref={dropdownRef}>
          {Object.entries(languages).map(([code, name]) => (
            <li key={code} onClick={() => handleLanguageChange(code)}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;