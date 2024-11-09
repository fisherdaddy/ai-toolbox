// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../js/i18n';

function SEO({ title, description, lang = 'en', meta = [] }) {
  const { t } = useTranslation();

  const defaultTitle = t('title');
  const defaultDescription = t('description');
  const defaultKeywords = t('keywords');

  const languages = ['en', 'zh', 'ja', 'ko'];
  const hostname = 'https://fishersama.com'; // 替换为您的网站域名

  const links = languages.map((language) => ({
    rel: 'alternate',
    hrefLang: language,
    href: `${hostname}/${language === 'en' ? '' : language}`,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": defaultTitle,
    "url": "https://fishersama.com/",
    "description": defaultDescription,
    "applicationCategory": "AI Tools",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Fisher"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0]
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
          name: 'keywords',
          content: defaultKeywords,
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
          property: 'og:image',
          content: 'https://fishersama.com/og-image.jpg',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: '@fun000001',
        },
        {
          name: 'twitter:title',
          content: title || defaultTitle,
        },
        {
          name: 'twitter:description',
          content: description || defaultDescription,
        },
        {
          name: 'twitter:image',
          content: 'https://fishersama.com/twitter-card.jpg',
        },
        {
          name: 'application-name',
          content: defaultTitle,
        },
        {
          name: 'apple-mobile-web-app-title',
          content: defaultTitle,
        },
        {
          name: 'format-detection',
          content: 'telephone=no',
        },
        {
          name: 'theme-color',
          content: '#6366F1',
        }
      ].concat(meta)}
      link={[
        ...links,
        { rel: 'canonical', href: `https://fishersama.com${window.location.pathname}` }
      ]}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default SEO;