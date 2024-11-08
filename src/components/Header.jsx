// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../js/i18n';
import '../styles/Header.css';
import logo from '/assets/logo.png';

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
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
  }, []);

  return (
    <header>
      <nav>
        <div className="logo-title-container">
          <NavLink to="/" className="title no-underline">
            <img src={logo} alt="Logo" className="logo" />
            {t('title')}
          </NavLink>
        </div>
        <div className="menu-items">
          <NavLink to="/dev-tools" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('dev-tools')}
          </NavLink>
          <NavLink to="/image-tools" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('image-tools')}
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('blog')}
          </NavLink>
          <NavLink to="/ai-products" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('ai-products')}
          </NavLink>
        </div>
        <div className="right-container">
          <LanguageSelector />
          <div className="auth-container">
            {user ? (
              <div className="user-info">
                <div className="avatar-container" ref={menuRef}>
                  <img
                    src={user.picture}
                    alt="User Avatar"
                    className="avatar"
                    onClick={toggleMenu}
                  />
                  {menuOpen && (
                    <div className="dropdown-menu">
                      <button onClick={handleLogout}>{t('logout')}</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NavLink to="/login">{t('login')}</NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
