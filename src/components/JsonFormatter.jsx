import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Wrapper, Container, Preview } from '../js/SharedStyles';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const InputText = styled.textarea`
  width: 100%;
  height: 200px;
  font-size: 15px;
  padding: 16px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  outline: none;
  resize: none;
  transition: all 0.3s ease;
  line-height: 1.5;

  &:focus {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  @media (min-width: 768px) {
    width: 40%;
    height: 100%;
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  padding: 16px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 58%;
    height: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  top: 12px;
  right: 12px;
`;

const ActionButton = styled.button`
  background: rgba(99, 102, 241, 0.1);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6366F1;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }

  &.active {
    background: #6366F1;
    color: white;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RelativePreviewContainer = styled(PreviewContainer)`
  position: relative;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6366F1;
  font-size: 13px;
  padding: 2px 6px;
  margin-right: 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const JsonList = styled.ul`
  list-style-type: none;
  padding-left: 24px;
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
`;

const Key = styled.span`
  color: #6366F1;
  font-weight: 500;
  font-size: 15px;
`;

const Value = styled.span`
  color: #374151;
  font-size: 15px;
  
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      setParsedJson(parsed);
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
      <Wrapper>
        <Title>{t('tools.jsonFormatter.title')}</Title>
        <Container>
          <InputText
            placeholder={t('tools.jsonFormatter.inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <RelativePreviewContainer>
            {parsedJson ? (
              <>
                <Preview>
                  {isCompressed ? (
                    <pre style={{ margin: 0, whiteSpace: 'nowrap', overflowX: 'auto' }}>
                      {JSON.stringify(parsedJson)}
                    </pre>
                  ) : (
                    <JsonView data={parsedJson} />
                  )}
                </Preview>
                <ButtonGroup>
                  <ActionButton 
                    onClick={toggleCompression}
                    className={isCompressed ? 'active' : ''}
                  >
                    {isCompressed ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 9h16v2H4V9zm0 4h16v2H4v-2z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H5v-2h14v2z"/>
                      </svg>
                    )}
                    {isCompressed ? '展开' : '压缩'}
                  </ActionButton>
                  <ActionButton onClick={handleCopy} className={isCopied ? 'active' : ''}>
                    {isCopied ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    )}
                    {isCopied ? '已复制' : '复制'}
                  </ActionButton>
                </ButtonGroup>
              </>
            ) : (
              <Preview>{t('tools.jsonFormatter.invalidJson')}</Preview>
            )}
          </RelativePreviewContainer>
        </Container>
      </Wrapper>
    </>
  );
}

function JsonView({ data }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (Array.isArray(data)) {
    return (
      <div>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          )}
        </ToggleButton>
        {!isExpanded ? (
          <span style={{ color: '#6B7280', fontSize: '15px' }}>Array [{data.length}]</span>
        ) : (
          <JsonList>
            [
            {data.map((item, index) => (
              <li key={index}>
                <JsonView data={item} />
                {index < data.length - 1 && ','}
              </li>
            ))}
            ]
          </JsonList>
        )}
      </div>
    );
  } else if (typeof data === 'object' && data !== null) {
    const entries = Object.entries(data);
    return (
      <div>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          )}
        </ToggleButton>
        {!isExpanded ? (
          <span style={{ color: '#6B7280', fontSize: '15px' }}>Object {`{${entries.length}}`}</span>
        ) : (
          <JsonList>
            {'{'}
            {entries.map(([key, value], index) => (
              <li key={key}>
                <Key>"{key}"</Key>: <JsonView data={value} />
                {index < entries.length - 1 && ','}
              </li>
            ))}
            {'}'}
          </JsonList>
        )}
      </div>
    );
  } else if (typeof data === 'string') {
    return <Value>"{data}"</Value>;
  } else {
    return <Value>{JSON.stringify(data)}</Value>;
  }
}

export default JsonFormatter;
