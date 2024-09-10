import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../js/i18n';
import '../styles/Header.css'; // 确保创建并导入这个CSS文件
// 导入 logo 图片
import logo from '../assets/logo.png'; // 请确保路径正确

function Header() {
  const { t } = useTranslation();

  return (
    <header>
      <nav>
        <div className="logo-title-container">
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/" className="title no-underline">
            {t('title')}
          </Link>
        </div>
        <LanguageSelector />
      </nav>
    </header>
  );
}

export default Header;