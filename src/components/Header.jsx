import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../js/i18n';
import '../styles/Header.css'; // 确保创建并导入这个CSS文件

function Header() {
  const { t } = useTranslation();

  return (
    <header>
      <nav>
        <Link to="/" className="logo no-underline">
          {t('title')}
        </Link>
        <LanguageSelector />
      </nav>
    </header>
  );
}

export default Header;