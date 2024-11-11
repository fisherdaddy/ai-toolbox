import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'handwrite', icon: '/assets/icon/handwrite.png', path: '/handwriting' },
  { id: 'quoteCard', icon: '/assets/icon/quotecard.png', path: '/quote-card' },
  { id: 'text2image', icon: '/assets/icon/text2image.png', path: '/text2image' },
 ];

const ImageTools = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('image-tools.title')}
        description={t('image-tools.description')}
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

export default ImageTools;
