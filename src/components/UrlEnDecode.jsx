import React, { useState, useCallback } from 'react';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import styled from 'styled-components';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

// 复用相同的样式组件
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 6rem 2rem 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
      linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
`;

function UrlEncoderDecoder() {
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [input, setInput] = useState('');
  const [resultText, setResultText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState('decode');

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setInput('');
    setResultText('');
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue);
    try {
      let result;
      if (mode === 'decode') {
        result = decodeURIComponent(inputValue);
      } else {
        result = encodeURIComponent(inputValue);
      }
      setResultText(result);
    } catch (error) {
      setResultText('Invalid input');
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(resultText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [resultText]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.urlEncodeDecode.title')}
        description={t('tools.urlEncodeDecode.description')}
      />
      <Container>
        <ContentWrapper>
          <Title>{t('tools.urlEncodeDecode.title')}</Title>
          
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('tools.urlEncodeDecode.modeLabel')}
              </label>
              <select
                value={mode}
                onChange={handleModeChange}
                className="w-full sm:w-48 px-3 py-2 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl
                  focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none
                  text-sm text-gray-700 transition duration-300"
              >
                <option value="encode">{t('tools.urlEncodeDecode.encode')}</option>
                <option value="decode">{t('tools.urlEncodeDecode.decode')}</option>
              </select>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="w-full lg:w-1/2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {mode === 'decode' ? t('tools.urlDecode.inputLabel') : t('tools.urlEncode.inputLabel')}
                </label>
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={mode === 'decode' ? t('tools.urlDecode.inputLabel') : t('tools.urlEncode.inputLabel')}
                  className="w-full h-[calc(100vh-400px)] px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl
                    focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none
                    text-sm font-mono text-gray-700 transition duration-300 resize-none"
                />
              </div>

              <div className="w-full lg:w-1/2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {mode === 'decode' ? t('tools.urlDecode.resultLabel') : t('tools.urlEncode.resultLabel')}
                </label>
                <div className="relative h-[calc(100vh-400px)]">
                  <div className="h-full w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 
                    rounded-xl text-sm font-mono text-gray-700 whitespace-pre-wrap break-all overflow-auto">
                    {resultText}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${isCopied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white/50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                      }`}
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        {t('tools.jsonFormatter.copied')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        {t('tools.jsonFormatter.copy')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default UrlEncoderDecoder;
