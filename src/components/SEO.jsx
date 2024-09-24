// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../js/i18n';

function SEO({ title, description, lang = 'en', meta = [] }) {
  const { t } = useTranslation();

  const defaultTitle = t('title');
  const defaultDescription = t('description'); // 确保在i18n配置中添加'description'

  const languages = ['en', 'zh', 'ja', 'ko'];
  const hostname = 'https://fishersama.com'; // 替换为您的网站域名

  const links = languages.map((language) => ({
    rel: 'alternate',
    hrefLang: language,
    href: `${hostname}/${language === 'en' ? '' : language}`,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": defaultTitle,
    "url": "https://fishersama.com/", // 请替换为您的网站URL
    "description": defaultDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fishersama.com/search?q={search_term}",
      "query-input": "required name=search_term"
    }
  };

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title || defaultTitle}
      titleTemplate={`%s | ${defaultTitle}`}
      meta={[
        {
          name: 'description',
          content: description || defaultDescription,
        },
        {
          property: 'og:title',
          content: title || defaultTitle,
        },
        {
          property: 'og:description',
          content: description || defaultDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: title || defaultTitle,
        },
        {
          name: 'twitter:description',
          content: description || defaultDescription,
        },
        // 可以根据需要添加更多元数据
      ].concat(meta)}
      link={links}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default SEO;