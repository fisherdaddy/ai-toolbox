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
  { id: 'imageBackgroundRemover', icon: '/assets/icon/image-background-remover.png', path: '/background-remover' },
  { id: 'textBehindImage', icon: '/assets/icon/text-behind-image.png', path: '/text-behind-image' },
 ];

 const ImageTools = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('title')}
        description={t('slogan')}
      />
      <main className="container mx-auto px-4 pt-16 pb-8">
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {tools.map(tool => (
              <Link 
                to={tool.path} 
                key={tool.id} 
                className="flex items-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-lg hover:bg-white/15"
              >
                <img 
                  src={tool.icon} 
                  alt={`${t(`tools.${tool.id}.title`)} icon`} 
                  className="w-12 h-12 object-contain mr-4" 
                  loading="lazy" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{t(`tools.${tool.id}.title`)}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{t(`tools.${tool.id}.description`)}</p>
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
