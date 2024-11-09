import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'handwrite', icon: '/assets/icon/handwrite.png', path: '/handwriting' },
  { id: 'quoteCard', icon: '/assets/icon/quotecard.png', path: '/quote-card' },
  { id: 'text2image', icon: '/assets/icon/text2image.png', path: '/text2image' },
  { id: 'jsonFormatter', icon: '/assets/icon/json-format.png', path: '/json-formatter' },
  { id: 'urlEncodeDecode', icon: '/assets/icon/url-endecode.png', path: '/url-encode-and-decode' },
  { id: 'imageBase64Converter', icon: '/assets/icon/image-base64.png', path: '/image-base64' },
  { id: 'openAITimeline', icon: '/assets/icon/openai_small.svg', path: '/openai-timeline' },
  { id: 'modelPrice', icon: '/assets/icon/openai_small.svg', path: '/llm-model-price' },
  { id: 'fisherai', icon: '/assets/icon/fisherai.png', path: 'https://chromewebstore.google.com/detail/fisherai-your-best-summar/ipfiijaobcenaibdpaacbbpbjefgekbj', external: true } // 新增外部链接
];

const Home = () => {
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

export default Home;
