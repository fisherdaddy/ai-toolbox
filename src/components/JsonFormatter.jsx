import React, { useState, useEffect } from 'react';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 4rem 2rem 2rem;
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

function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  useEffect(() => {
    try {
      if (input.trim()) {
        const parsed = JSON.parse(input);
        setParsedJson(parsed);
      } else {
        setParsedJson(null);
      }
    } catch (error) {
      setParsedJson(null);
    }
  }, [input]);

  const handleCopy = () => {
    if (parsedJson) {
      const formattedJson = isCompressed 
        ? JSON.stringify(parsedJson)
        : JSON.stringify(parsedJson, null, 2);
      navigator.clipboard.writeText(formattedJson).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const toggleCompression = () => {
    setIsCompressed(!isCompressed);
  };

  return (
    <>
      <SEO
        title={t('tools.jsonFormatter.title')}
        description={t('tools.jsonFormatter.description')}
      />
      <Container>
        <ContentWrapper>
          <Title>{t('tools.jsonFormatter.title')}</Title>
          
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-220px)]">
            <textarea
              className="w-full lg:w-5/12 p-4 text-sm font-mono border border-indigo-100 rounded-xl bg-white/80 backdrop-blur-sm focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition duration-300"
              placeholder={t('tools.jsonFormatter.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="w-full lg:w-7/12 relative border border-indigo-100 rounded-xl bg-white/80 backdrop-blur-sm p-4">
              {parsedJson ? (
                <>
                  <div className="font-mono text-sm leading-relaxed overflow-auto">
                    {isCompressed ? (
                      <pre className="m-0 whitespace-nowrap">
                        {JSON.stringify(parsedJson)}
                      </pre>
                    ) : (
                      <JsonView data={parsedJson} />
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={toggleCompression}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 
                        ${isCompressed
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-white/50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                        }
                      `}
                    >
                      {isCompressed ? (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 9h16v2H4V9zm0 4h16v2H4v-2z"/>
                          </svg>
                          {t('tools.jsonFormatter.expand')}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13H5v-2h14v2z"/>
                          </svg>
                          {t('tools.jsonFormatter.compress')}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 
                        ${isCopied
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white/50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                        }
                      `}
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
                </>
              ) : (
                <div className="p-4 text-gray-500">
                  {input.trim() ? t('tools.jsonFormatter.invalidJson') : t('tools.jsonFormatter.emptyInput')}
                </div>
              )}
            </div>
          </div>
        </ContentWrapper>
      </Container>
    </>
  );
}

function JsonView({ data }) {
  if (data === null || data === undefined) return null;

  const [collapsedKeys, setCollapsedKeys] = useState(new Set());

  const toggleCollapse = (key) => {
    const newCollapsedKeys = new Set(collapsedKeys);
    if (newCollapsedKeys.has(key)) {
      newCollapsedKeys.delete(key);
    } else {
      newCollapsedKeys.add(key);
    }
    setCollapsedKeys(newCollapsedKeys);
  };

  const renderCollapsibleValue = (value, path = '') => {
    if (value === null) return <span className="text-indigo-400">null</span>;
    if (typeof value === 'boolean') return <span className="text-indigo-400">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="text-emerald-500">{value}</span>;
    if (typeof value === 'string') return <span className="text-amber-500">"{value}"</span>;

    const isCollapsed = collapsedKeys.has(path);
    const hasChildren = Array.isArray(value) || (typeof value === 'object' && value !== null);

    if (Array.isArray(value)) {
      if (isCollapsed) {
        return (
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => toggleCollapse(path)}
              className="w-4 h-4 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-gray-500">[...]</span>
            <span className="text-gray-400 text-sm ml-1">({value.length} items)</span>
          </div>
        );
      }
      return (
        <div className="ml-5">
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => toggleCollapse(path)}
              className="w-4 h-4 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            [
          </div>
          {value.map((item, index) => (
            <div key={index} className="ml-5">
              {renderCollapsibleValue(item, `${path}[${index}]`)}
              {index < value.length - 1 ? ',' : ''}
            </div>
          ))}
          <div>]</div>
        </div>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (isCollapsed) {
        return (
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => toggleCollapse(path)}
              className="w-4 h-4 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-gray-500">{'{...}'}</span>
            <span className="text-gray-400 text-sm ml-1">({entries.length} properties)</span>
          </div>
        );
      }
      return (
        <div className="ml-5">
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => toggleCollapse(path)}
              className="w-4 h-4 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {'{'}
          </div>
          {entries.map(([key, val], index) => (
            <div key={key} className="ml-5">
              <span className="text-pink-500">"{key}"</span>: {renderCollapsibleValue(val, `${path}.${key}`)}
              {index < entries.length - 1 ? ',' : ''}
            </div>
          ))}
          <div>{'}'}</div>
        </div>
      );
    }
    return value;
  };

  return renderCollapsibleValue(data, 'root');
}

export default JsonFormatter;
