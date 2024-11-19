import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'openAITimeline', icon: '/assets/icon/openai_small.svg', path: '/openai-timeline' },
  { id: 'anthropicTimeline', icon: '/assets/icon/anthropic_small.svg', path: '/anthropic-timeline' },
  { id: 'modelPrice', icon: '/assets/icon/openai_small.svg', path: '/llm-model-price' },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('blog.title')}
        description={t('blog.description')}
      />
      <main>
        <section className="tools-section">
          <div className="tools-grid">
            {tools.map(tool => (
              <Link to={tool.path} key={tool.id} className="tool-card">
                <img 
                  src={tool.icon} 
                  alt={`${t(`tools.${tool.id}.title`)} icon`} 
                  className="tool-icon" 
                  loading="lazy" 
                />
                <div className="tool-content">
                  <h3 className="tool-title">{t(`tools.${tool.id}.title`)}</h3>
                  <p className="tool-description">{t(`tools.${tool.id}.description`)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
