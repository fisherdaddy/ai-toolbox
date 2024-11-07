import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Wrapper, Container, Preview } from '../js/SharedStyles';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const InputText = styled.textarea`
  width: 100%;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  outline: none;
  resize: none;

  @media (min-width: 768px) {
    width: 35%;
    height: 100%;
    border-bottom: none;
    border-right: 1px solid #e0e0e0;
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 65%;
    height: 100%;
  }
`;

const ToggleButton = styled.span`
  cursor: pointer;
  color: #666;
  font-weight: bold;
  margin-right: 5px;
`;

const Key = styled.span`
  color: #881391;
`;

const Value = styled.span`
  color: #1a1aa6;
`;

const JsonList = styled.ul`
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.3s, color 0.3s;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  &.copied {
    color: #34a853; // Google green color for success feedback
  }
`;

const RelativePreviewContainer = styled(PreviewContainer)`
  position: relative;
`;

function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

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
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      navigator.clipboard.writeText(formattedJson).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
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
                  <JsonView data={parsedJson} />
                </Preview>
                <CopyButton onClick={handleCopy} className={isCopied ? 'copied' : ''}>
                  {isCopied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  )}
                </CopyButton>
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
          {isExpanded ? '[-]' : '[+]'}
        </ToggleButton>
        {!isExpanded && <span>Array</span>}
        {isExpanded && (
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
    return (
      <div>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '{-}' : '{+}'}
        </ToggleButton>
        {!isExpanded && <span>Object</span>}
        {isExpanded && (
          <JsonList>
            {'{'}
            {Object.entries(data).map(([key, value], index, array) => (
              <li key={key}>
                <Key>"{key}"</Key>: <JsonView data={value} />
                {index < array.length - 1 && ','}
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
