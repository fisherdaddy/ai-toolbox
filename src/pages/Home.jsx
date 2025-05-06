import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { id: 'handwrite', icon: '/assets/icon/handwrite.png', path: '/handwriting' },
  { id: 'quoteCard', icon: '/assets/icon/quotecard.png', path: '/quote-card' },
  { id: 'markdown2image', icon: '/assets/icon/markdown2image.png', path: '/markdown-to-image' },
  { id: 'wechatFormatter', icon: '/assets/icon/editor.png', path: '/wechat-formatter' },
  { id: 'perpetualCalendar', icon: '/assets/icon/calendar.jpg', path: '/perpetual-calendar' },
  { id: 'imageAnnotator', icon: '/assets/icon/image-annotator.png', path: '/image-annotator' },
  { id: 'subtitleGenerator', icon: '/assets/icon/subtitle2image.png', path: '/subtitle-to-image' },
  { id: 'imageCompressor', icon: '/assets/icon/image-compressor.png', path: '/image-compressor' },
  { id: 'imageWatermark', icon: '/assets/icon/image-watermark.png', path: '/image-watermark' },
  { id: 'imageBackgroundRemover', icon: '/assets/icon/image-background-remover.png', path: '/background-remover' },
  { id: 'textBehindImage', icon: '/assets/icon/text-behind-image.png', path: '/text-behind-image' },
  { id: 'latex2image', icon: '/assets/icon/latex2image.png', path: '/latex-to-image' },
  { id: 'jsonFormatter', icon: '/assets/icon/json-format.png', path: '/json-formatter' },
  { id: 'urlEncodeDecode', icon: '/assets/icon/url-endecode.png', path: '/url-encode-and-decode' },
  { id: 'imageBase64Converter', icon: '/assets/icon/image-base64.png', path: '/image-base64' },
  { id: 'textDiff', icon: '/assets/icon/diff.png', path: '/text-diff' },
  { id: 'aiTimeline', icon: '/assets/icon/ai-timeline.svg', path: '/ai-timeline' },
  { id: 'openAITimeline', icon: '/assets/icon/openai_small.svg', path: '/openai-timeline' },
  { id: 'anthropicTimeline', icon: '/assets/icon/anthropic_small.svg', path: '/anthropic-timeline' },
  { id: 'deepSeekTimeline', icon: '/assets/icon/deepseek_small.jpg', path: '/deepseek-timeline' },
  { id: 'modelPrice', icon: '/assets/icon/model-price.svg', path: '/llm-model-price' },
  { id: 'drugsList', icon: '/assets/icon/drugs.svg', path: '/drugs-list' },
  { id: 'fisherai', icon: '/assets/icon/fisherai.png', path: 'https://chromewebstore.google.com/detail/fisherai-your-best-summar/ipfiijaobcenaibdpaacbbpbjefgekbj', external: true }
];

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleClearLoading = () => {
      setLoading('');
    };
    window.addEventListener('clearLoadingState', handleClearLoading);
    return () => {
      window.removeEventListener('clearLoadingState', handleClearLoading);
    };
  }, []);

  const handleNavigate = (tool) => {
    if (tool.external) {
      window.open(tool.path, '_blank', 'noopener,noreferrer');
      return;
    }
    setLoading(tool.id);
    window.scrollTo(0, 0);
    navigate(tool.path);
  };

  const renderToolLink = (tool) => {
    const content = (
      <div className={`group flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative ${loading === tool.id ? 'pointer-events-none' : ''}`}>
        {loading === tool.id && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={tool.icon} 
          alt={`${t(`tools.${tool.id}.title`)} icon`} 
          className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" 
          loading="lazy" 
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
            {t(`tools.${tool.id}.title`)}
          </h3>
          <p className="text-sm text-gray-600 overflow-hidden text-ellipsis [-webkit-line-clamp:2] [display:-webkit-box] [-webkit-box-orient:vertical]">
            {t(`tools.${tool.id}.description`)}
          </p>
        </div>
      </div>
    );

    return tool.external ? (
      <a 
        onClick={() => handleNavigate(tool)}
        className="block cursor-pointer"
      >
        {content}
      </a>
    ) : (
      <div onClick={() => handleNavigate(tool)} className="block cursor-pointer">
        {content}
      </div>
    );
  };

  return (
    <>
      <SEO
        title={t('title')}
        description={t('slogan')}
      />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/50 pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 pt-20 sm:pt-32 pb-12 sm:pb-20">
            <div className="text-center relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-indigo-900/90 mb-4 sm:mb-6 animate-fade-in">
                AI Toolbox
              </h1>
              <p className="text-lg sm:text-xl text-indigo-800/80 max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-in-delay px-4">
                {t('slogan')}
              </p>
              <div className="w-full h-0.5 max-w-xs mx-auto bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-75"></div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {tools.map(tool => (
              <React.Fragment key={tool.id}>
                {renderToolLink(tool)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-20">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a 
              href="https://github.com/fisherdaddy/ai-toolbox" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center px-6 py-3 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3 text-gray-700 group-hover:text-indigo-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span className="text-gray-700 group-hover:text-indigo-500 font-medium transition-colors">GitHub</span>
            </a>
            <Link 
              to="/about" 
              className="group flex items-center px-6 py-3 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3 text-gray-700 group-hover:text-indigo-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 group-hover:text-indigo-500 font-medium transition-colors">{t('navigation.about')}</span>
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgb(226 232 240 / 30%) 1px, transparent 0);
          background-size: 24px 24px;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Home;
