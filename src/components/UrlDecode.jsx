import React, { useState, useCallback } from 'react';
import { Title, Wrapper, Container, InputText, Preview } from './SharedStyles';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';

const DecoderContainer = styled(Container)`
  flex-direction: column;
`;

const StyledInputText = styled(InputText)`
  height: 100px;
  margin-bottom: 20px;
  @media (min-width: 768px) {
    height: 100px;
    width: 100%;
  }
`;

const PreviewWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #5f6368;
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.1px;
`;

const StyledPreview = styled(Preview)`
  background-color: #f8f9fa;
  padding: 12px 40px 12px 12px; // 增加右侧 padding 为按钮留出空间
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 14px;
  color: #202124;
  min-height: 24px; // 确保即使内容为空，也有足够的高度容纳按钮
`;

const ResultContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
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

function UrlDecoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue);
    try {
      const decoded = decodeURIComponent(inputValue);
      setDecodedText(decoded);
    } catch (error) {
      setDecodedText('Invalid URL encoding');
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(decodedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [decodedText]);

  return (
    <Wrapper>
      <Title>{t('tools.urlDecode.title')}</Title>
      <DecoderContainer>
        <StyledInputText
          id="urlInput"
          placeholder={t('tools.urlDecode.inputLabel')}
          value={input}
          onChange={handleInputChange}
        />
        <PreviewWrapper>
          <Label>{t('tools.urlDecode.resultLabel')}</Label>
          <ResultContainer>
            <StyledPreview>{decodedText}</StyledPreview>
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
          </ResultContainer>
        </PreviewWrapper>
      </DecoderContainer>
    </Wrapper>
  );
}

export default UrlDecoder;