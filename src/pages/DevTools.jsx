import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'jsonFormatter', icon: '/assets/icon/json-format.png', path: '/json-formatter' },
  { id: 'urlEncodeDecode', icon: '/assets/icon/url-endecode.png', path: '/url-encode-and-decode' },
  { id: 'imageBase64Converter', icon: '/assets/icon/image-base64.png', path: '/image-base64' },
  { id: 'textDiff', icon: '/assets/icon/diff.png', path: '/text-diff' },
  { id: 'wechatFormatter', icon: '/assets/icon/editor.png', path: '/wechat-formatter' },
];

const DevTools = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('dev-tools.title')}
        description={t('dev-tools.description')}
      />
      <main className="container mx-auto px-4 pt-16 pb-8 min-h-screen">
        <section className="mt-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full">
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

export default DevTools;
