// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../js/i18n';
import '../styles/Header.css';
import logo from '/assets/logo.png';

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <div className="logo-title-container">
          <Link to="/" className="title no-underline">
            <img src={logo} alt="Logo" className="logo" />
            {t('title')}
          </Link>
        </div>
        <div className="right-container">
          <LanguageSelector />
          <div className="auth-container">
            {user ? (
              <div className="user-info">
                <span>
                  {t('welcome')}, {user.name || user.given_name}
                </span>
                <button onClick={handleLogout}>{t('logout')}</button>
              </div>
            ) : (
              <Link to="/login">{t('login')}</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
