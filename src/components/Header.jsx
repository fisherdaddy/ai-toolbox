// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../js/i18n';
import logo from '/assets/logo.png';

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // 添加键盘导航支持
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // 添加焦点管理
  useEffect(() => {
    const handleFocusTrap = (e) => {
      if (!mobileMenuOpen) return;
      
      const mobileMenu = document.querySelector('[role="dialog"]');
      const focusableElements = mobileMenu.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [mobileMenuOpen]);

  // 处理滚动锁定
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-lg border-b border-gray-100"></div>
      
      <nav 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label={t('navigation.main')}
      >
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-8">
              <NavLink 
                to="/" 
                className="flex items-center space-x-3 group"
                aria-label={t('navigation.home')}
              >
                <img 
                  src={logo} 
                  alt={t('logo.alt')} 
                  className="w-10 h-10 object-contain transition transform group-hover:scale-105"
                  width="40"
                  height="40"
                  loading="eager"
                />
                <span className="text-xl font-semibold bg-gradient-to-r from-indigo-500/90 to-indigo-600/80 bg-clip-text text-transparent">
                  {t('title')}
                </span>
              </NavLink>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <NavLink 
                to="/dev-tools"
                className={({isActive}) => 
                  `px-3 py-2 text-base font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-indigo-500 border-indigo-500' 
                      : 'text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-500'
                  }`
                }
              >
                {t('dev-tools.title')}
              </NavLink>
              <NavLink 
                to="/image-tools" 
                className={({isActive}) => 
                  `px-3 py-2 text-base font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-indigo-500 border-indigo-500' 
                      : 'text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-500'
                  }`
                }
                onClick={handleNavClick}
              >
                {t('image-tools.title')}
              </NavLink>
              <NavLink 
                to="/translator" 
                className={({isActive}) => 
                  `px-3 py-2 text-base font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-indigo-500 border-indigo-500' 
                      : 'text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-500'
                  }`
                }
                onClick={handleNavClick}
              >
                {t('translator.title')}
              </NavLink>
              <NavLink 
                to="/ai-products" 
                className={({isActive}) => 
                  `px-3 py-2 text-base font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-indigo-500 border-indigo-500' 
                      : 'text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-500'
                  }`
                }
                onClick={handleNavClick}
              >
                {t('ai-products.title')}
              </NavLink>
              <NavLink 
                to="/blog" 
                className={({isActive}) => 
                  `px-3 py-2 text-base font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-indigo-500 border-indigo-500' 
                      : 'text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-500'
                  }`
                }
                onClick={handleNavClick}
              >
                {t('blog.title')}
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <img
                    src={user.picture}
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-offset-2 ring-indigo-500 transition transform hover:scale-105"
                  />
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {t('login')}
              </NavLink>
            )}
          </div>

          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? t('navigation.close') : t('navigation.menu')}
          >
            <span className="sr-only">
              {mobileMenuOpen ? t('navigation.close') : t('navigation.menu')}
            </span>
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div
            id="mobile-menu"
            role="dialog"
            aria-label={t('navigation.mobile_menu')}
            aria-modal="true"
            className={`md:hidden fixed inset-0 z-40 transform ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
          >
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav 
              className="relative flex flex-col h-full w-full max-w-sm ml-auto bg-white shadow-xl"
              role="navigation"
              aria-label={t('navigation.mobile')}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-800">{t('navigation.menu')}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={t('navigation.close')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <NavLink 
                    to="/dev-tools"
                    className={({isActive}) => 
                      `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('dev-tools.title')}
                  </NavLink>
                  <NavLink 
                    to="/image-tools" 
                    className={({isActive}) => 
                      `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('image-tools.title')}
                  </NavLink>
                  <NavLink 
                    to="/translator" 
                    className={({isActive}) => 
                      `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    翻译工具
                  </NavLink>
                  <NavLink 
                    to="/ai-products" 
                    className={({isActive}) => 
                      `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('ai-products.title')}
                  </NavLink>
                  <NavLink 
                    to="/blog" 
                    className={({isActive}) => 
                      `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('blog.title')}
                  </NavLink>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                {!user && (
                  <NavLink
                    to="/login"
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
