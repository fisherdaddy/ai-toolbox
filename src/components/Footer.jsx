import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import { Helmet } from 'react-helmet';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // 基础链接配置
  const linkConfigs = {
    homeTools: {
      title: t('home.title'),
      description: t('home.description'),
      mainLinks: [
        { name: t('tools.textBehindImage.title'), path: '/text-behind-image', description: t('tools.textBehindImage.description') },
        { name: t('tools.imageBackgroundRemover.title'), path: '/background-remover', description: t('tools.imageBackgroundRemover.description') },
        { name: t('tools.handwrite.title'), path: '/handwriting', description: t('tools.handwrite.description') },
        { name: t('tools.subtitleGenerator.title'), path: '/subtitle-to-image', description: t('tools.subtitleGenerator.description') },

      ],
      relatedLinks: [
        { name: 'OpenAI', url: 'https://openai.com/', description: 'Leading AI research company' },
        { name: 'Anthropic', url: 'https://www.anthropic.com/', description: 'AI safety research organization' },
        { name: 'DeepMind', url: 'https://deepmind.google.com', description: 'DeepMind AI Research' },
        { name: 'Hugging Face', url: 'https://huggingface.co/', description: 'AI model hub and community' },
      ]
    },
    // 开发工具相关页面
    devTools: {
      title: t('dev-tools.title'),
      description: t('dev-tools.description'),
      mainLinks: [
        { name: t('tools.imageCompressor.title'), path: '/image-compressor', description: t('tools.imageCompressor.description') },
        { name: t('tools.imageBackgroundRemover.title'), path: '/background-remover', description: t('tools.imageBackgroundRemover.description') },
        { name: t('tools.latex2image.title'), path: '/latex-to-image', description: t('tools.latex2image.description') },
        { name: t('tools.textBehindImage.title'), path: '/text-behind-image', description: t('tools.textBehindImage.description') },
      ],
      relatedLinks: [
        { name: 'OpenAI Platform', url: 'https://platform.openai.com/playground', description: 'OpenAI 开发者平台' },
        { name: 'Anthropic Platform', url: 'https://console.anthropic.com/workbench', description: 'Anthropic 开发者平台' },
        { name: 'Gemini Platform', url: 'https://aistudio.google.com/prompts/new_chat', description: 'Gemini 开发者平台' },
        { name: 'Hugging Face', url: 'https://huggingface.co/', description: 'AI model hub and community' },
      ]
    },
    // 图像工具相关页面
    imageTools: {
        title: t('image-tools.title'),
        description: t('image-tools.description'),
        mainLinks: [
            { name: t('tools.jsonFormatter.title'), path: '/json-formatter', description: t('tools.jsonFormatter.description') },
            { name: t('tools.urlEncodeDecode.title'), path: '/url-encode-and-decode', description: t('tools.urlEncodeDecode.description') },
            { name: t('tools.imageBase64Converter.title'), path: '/image-base64', description: t('tools.imageBase64Converter.description') },
            { name: t('tools.textDiff.title'), path: '/text-diff', description: t('tools.textDiff.description') },
        ],
        relatedLinks: [
            { name: 'DALL-E', url: 'https://chatgpt.com/g/g-2fkFE8rbu-dall-e', description: 'AI image generation' },
            { name: 'Canva', url: 'https://www.canva.com/', description: 'Online design platform' },
            { name: 'Remove.bg', url: 'https://www.remove.bg/', description: 'Background removal service' },
            { name: 'TinyPNG', url: 'https://tinypng.com/', description: 'Smart PNG and JPEG compression' },
        ]
    },
    // AI工具相关页面
    aiTools: {
      title: t('ai-products.title'),
      description: t('ai-products.description'),
      mainLinks: [
        { name: t('tools.openAITimeline.title'), path: '/openai-timeline', description: t('openAITimeline.description') },
        { name: t('tools.anthropicTimeline.title'), path: '/anthropic-timeline', description: t('anthropicTimeline.description') },
        { name: t('tools.modelPrice.title'), path: '/llm-model-price', description: t('modelPrice.description') },
        { name: t('tools.fisherai.title'), path: '/ai-products', description: t('fisherai.description') },
      ],
      relatedLinks: [
        { name: 'OpenAI', url: 'https://openai.com/', description: 'Leading AI research company' },
        { name: 'Anthropic', url: 'https://www.anthropic.com/', description: 'AI safety research organization' },
        { name: 'DeepMind', url: 'https://deepmind.google.com', description: 'DeepMind AI Research' },
        { name: 'Hugging Face', url: 'https://huggingface.co/', description: 'AI model hub and community' },
      ]
    },
    // 博客相关页面
    blog: {
      title: t('blog.title'),
      description: t('blog.description'),
      mainLinks: [
        { name: t('tools.openAITimeline.title'), path: '/openai-timeline', description: t('openAITimeline.description') },
        { name: t('tools.anthropicTimeline.title'), path: '/anthropic-timeline', description: t('anthropicTimeline.description') },
        { name: t('tools.modelPrice.title'), path: '/llm-model-price', description: t('modelPrice.description') },
        { name: t('tools.deepSeekTimeline.title'), path: '/deepseek-timeline', description: t('deepseekTimeline.description') },
      ],
      relatedLinks: [
        { name: 'OpenAI Research', url: 'https://openai.com/research/', description: 'Leading AI research company' },
        { name: 'Anthropic news', url: 'https://www.anthropic.com/news', description: 'AI safety research organization' },
        { name: 'DeepMind Research', url: 'https://deepmind.google/research/', description: 'DeepMind AI Research' },
        { name: 'Artifical Analysis', url: 'https://artificialanalysis.ai/', description: 'Artifical Analysis' },
      ]
    }
  };

  // 根据当前路径确定要显示的链接配置
  const getActiveConfig = () => {
    const path = location.pathname;
    if (path.includes('dev-tools')) {
      return { ...linkConfigs.devTools, type: 'DeveloperTools' };
    } else if (path.includes('image-tools')) {
      return { ...linkConfigs.imageTools, type: 'ImageTools' };
    } else if (path.includes('ai-products')) {
      return { ...linkConfigs.aiTools, type: 'AIProducts' };
    } else if (path.includes('blog')) {
      return { ...linkConfigs.blog, type: 'Blog' };
    } else {
        return { ...linkConfigs.homeTools, type: 'DeveloperTools' };
    }
  };

  const activeConfig = getActiveConfig();

  // 构建结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': activeConfig.type,
    name: activeConfig.title,
    description: activeConfig.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser',
    hasPart: activeConfig.mainLinks.map(link => ({
      '@type': 'WebPage',
      name: link.name,
      description: link.description,
      url: `https://fishersama.com${link.path}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <footer className="bg-white/10 backdrop-blur-md border-t border-gray-100" role="contentinfo" aria-label="Site footer">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* 相关工具 */}
            <nav aria-label="Related tools navigation">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t('footer.recommendedTools')}
              </h3>
              <ul className="grid grid-cols-2 gap-3" role="list">
                {activeConfig.mainLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                      aria-label={link.description}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 相关资源 */}
            <nav aria-label="External resources navigation">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t('footer.resources')}
              </h3>
              <ul className="grid grid-cols-2 gap-3" role="list">
                {activeConfig.relatedLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                      aria-label={`${link.name} - ${link.description}`}
                    >
                      {link.name}
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} {t('footer.copyRight')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 