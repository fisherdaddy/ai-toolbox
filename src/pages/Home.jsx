import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'text2image', icon: 'fa-image', path: '/text2image' },
  { id: 'jsonFormatter', icon: 'fa-jsonformat', path: '/json-formatter' },
  { id: 'urlDecode', icon: 'fa-decode', path: '/url-decode' },
  { id: 'urlEncode', icon: 'fa-encode', path: '/url-encode' },
  { id: 'handwrite', icon: 'fa-handwrite', path: '/handwriting' },
  { id: 'openAITimeline', icon: 'fa-openai-timeline', path: '/openai-timeline' },
  { id: 'modelPrice', icon: 'fa-model-price', path: '/llm-model-price' },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('title')}
        description={t('slogan')}
      />
      <main>
        <section className="hero">
          <h1>{t('title')}</h1>
          <p className="slogan">{t('slogan')}</p>
        </section>
        <section className="tools-section">
          <div className="tools-grid">
            {tools.map(tool => (
              <Link to={tool.path} key={tool.id} className="tool-card">
                <i className={`fas ${tool.icon} tool-icon`}></i>
                <h3 className="tool-title">{t(`tools.${tool.id}.title`)}</h3>
                <p className="tool-description">{t(`tools.${tool.id}.description`)}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
