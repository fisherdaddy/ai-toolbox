// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  // 点击菜单外部时关闭菜单
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
                {/* 头像容器 */}
                <div className="avatar-container" ref={menuRef}>
                  <img
                    src={user.picture}
                    alt="User Avatar"
                    className="avatar"
                    onClick={toggleMenu}
                  />
                  {/* 下拉菜单 */}
                  {menuOpen && (
                    <div className="dropdown-menu">
                      <button onClick={handleLogout}>{t('logout')}</button>
                    </div>
                  )}
                </div>
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
