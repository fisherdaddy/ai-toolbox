// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';

const NotFound = () => {
  const { t } = useTranslation(); // 使用 useTranslation 钩子

  return (
    <>
      <SEO
        title={t('notFound.title')}
        description={t('notFound.description')}
      />
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-9xl font-bold text-gray-200 select-none">404</div>
        <h1 className="mt-8 text-3xl font-bold text-gray-800">{t('notFound.title')}</h1>
        <p className="mt-4 text-lg text-gray-600">{t('notFound.description')}</p>
        
        <div className="mt-16 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('recommendedTools')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/json-formatter" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.jsonFormatter.title')}
            </Link>
            <Link 
              to="/url-encode-and-decode" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.urlEncodeDecode.title')}
            </Link>
            <Link 
              to="/background-remover" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.imageBackgroundRemover.title')}
            </Link>
            <Link 
              to="/text-behind-image" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.textBehindImage.title')}
            </Link>
            <Link 
              to="/openai-timeline" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.openAITimeline.title')}
            </Link>
            <Link 
              to="/llm-model-price" 
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:border-indigo-100"
            >
              {t('tools.modelPrice.title')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;