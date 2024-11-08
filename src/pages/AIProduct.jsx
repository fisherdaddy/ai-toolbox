import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { 
    id: 'fisherai', 
    icon: '/assets/icon/fisherai.png', 
    path: 'https://chromewebstore.google.com/detail/fisherai-your-best-summar/ipfiijaobcenaibdpaacbbpbjefgekbj', 
    external: true 
  },
  // 其他工具...
];

const AIProduct = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('title')}
        description={t('slogan')}
      />
      <main>
        <section className="tools-section">
          <div className="tools-grid">
            {tools.map(tool => (
              tool.external ? (
                <a 
                  href={tool.path} 
                  key={tool.id} 
                  className="tool-card"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
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
                </a>
              ) : (
                <Link 
                  to={tool.path} 
                  key={tool.id} 
                  className="tool-card"
                >
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
              )
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default AIProduct;
