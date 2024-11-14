import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'handwrite', icon: '/assets/icon/handwrite.png', path: '/handwriting' },
  { id: 'quoteCard', icon: '/assets/icon/quotecard.png', path: '/quote-card' },
  { id: 'markdown2image', icon: '/assets/icon/markdown2image.png', path: '/markdown-to-image' },
  { id: 'latex2image', icon: '/assets/icon/latex2image.png', path: '/latex-to-image' },
  { id: 'subtitleGenerator', icon: '/assets/icon/subtitle2image.png', path: '/subtitle-to-image' },
  { id: 'imageCompressor', icon: '/assets/icon/image-compressor.png', path: '/image-compressor' },
  { id: 'imageWatermark', icon: '/assets/icon/image-watermark.png', path: '/image-watermark' },
  { id: 'imageBackgroundRemover', icon: '/assets/icon/image-background-remover.png', path: 'https://huggingface.co/spaces/briaai/BRIA-RMBG-2.0', external: true },
 ];

 const ImageTools = () => {
  const { t } = useTranslation();

  const renderToolLink = (tool) => {
    const content = (
      <>
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
      </>
    );

    return tool.external ? (
      <a 
        href={tool.path}
        className="tool-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      <Link to={tool.path} className="tool-card">
        {content}
      </Link>
    );
  };

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
              <React.Fragment key={tool.id}>
                {renderToolLink(tool)}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default ImageTools;
