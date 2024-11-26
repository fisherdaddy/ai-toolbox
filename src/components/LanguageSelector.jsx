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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languages[lang]}</span>
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors duration-150 ${
                  code === lang
                    ? 'text-indigo-600 bg-indigo-50 font-medium'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;