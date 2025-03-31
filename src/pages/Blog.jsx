import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'aiTimeline', icon: '/assets/icon/ai-timeline.svg', path: '/ai-timeline' },
  { id: 'openAITimeline', icon: '/assets/icon/openai_small.svg', path: '/openai-timeline' },
  { id: 'anthropicTimeline', icon: '/assets/icon/anthropic_small.svg', path: '/anthropic-timeline' },
  { id: 'deepSeekTimeline', icon: '/assets/icon/deepseek_small.jpg', path: '/deepseek-timeline' },
  { id: 'modelPrice', icon: '/assets/icon/model-price.svg', path: '/llm-model-price' },
  { id: 'drugsList', icon: '/assets/icon/drugs.svg', path: '/drugs-list' },
  
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full">
      <SEO
        title={t('blog.title')}
        description={t('blog.description')}
      />
      <main className="container mx-auto px-4 pt-16 pb-8 min-h-screen w-full">
        <section className="mt-8 w-full">
          <div className="w-full max-w-[1400px] mx-auto">
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
