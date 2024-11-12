import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'jsonFormatter', icon: '/assets/icon/json-format.png', path: '/json-formatter' },
  { id: 'urlEncodeDecode', icon: '/assets/icon/url-endecode.png', path: '/url-encode-and-decode' },
  { id: 'imageBase64Converter', icon: '/assets/icon/image-base64.png', path: '/image-base64' },
  { id: 'textDiff', icon: '/assets/icon/diff.png', path: '/text-diff' },

];

const DevTools = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('dev-tools.title')}
        description={t('dev-tools.description')}
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

export default DevTools;
