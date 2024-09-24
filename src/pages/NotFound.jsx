// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';

const NotFound = () => {
  const { t } = useTranslation(); // 使用 useTranslation 钩子

  return (
    <>
      <SEO
        title={t('notFound.title')}
        description={t('notFound.description')}
      />
      <main>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.description')}</p>
        <Link to="/">{t('notFound.back_home')}</Link>
      </main>
    </>
  );
};

export default NotFound;