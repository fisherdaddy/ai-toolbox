import React, { useState, useCallback } from 'react';
import { Title, Wrapper, Container, Preview } from '../js/SharedStyles';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';

const EncoderDecoderContainer = styled(Container)`
  flex-direction: column;
  gap: 16px;
`;

const StyledInputText = styled.textarea`
  width: 100%;
  height: 120px;
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
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.1px;
`;

const ModeSwitcher = styled.div`
  margin-bottom: 8px;

  select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(99, 102, 241, 0.1);
    font-size: 14px;
    color: #374151;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      outline: none;
    }
  }
`;

const ResultContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledPreview = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  padding: 16px;
  font-size: 15px;
  color: #374151;
  min-height: 24px;
  line-height: 1.5;
  position: relative;
`;

const ActionButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
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

function UrlEncoderDecoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [resultText, setResultText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState('decode'); // 'encode' 或 'decode'

  const handleModeChange = (e) => {
    setMode(e.target.value);
    // 当模式切换时，清空输入和输出
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
      <SEO
        title={t('tools.urlEncodeDecode.title')}
        description={t('tools.urlEncodeDecode.description')}
      />
      <Wrapper>
        <Title>{t('tools.urlEncodeDecode.title')}</Title>
        <EncoderDecoderContainer>
          <ModeSwitcher>
            <Label>{t('tools.urlEncodeDecode.modeLabel')}</Label>
            <select value={mode} onChange={handleModeChange}>
              <option value="encode">{t('tools.urlEncodeDecode.encode')}</option>
              <option value="decode">{t('tools.urlEncodeDecode.decode')}</option>
            </select>
          </ModeSwitcher>
          
          <div>
            <Label>
              {mode === 'decode' ? t('tools.urlDecode.inputLabel') : t('tools.urlEncode.inputLabel')}
            </Label>
            <StyledInputText
              value={input}
              onChange={handleInputChange}
              placeholder={mode === 'decode' ? t('tools.urlDecode.inputLabel') : t('tools.urlEncode.inputLabel')}
            />
          </div>

          <div>
            <Label>
              {mode === 'decode' ? t('tools.urlDecode.resultLabel') : t('tools.urlEncode.resultLabel')}
            </Label>
            <ResultContainer>
              <StyledPreview>{resultText}</StyledPreview>
              <ActionButton 
                onClick={handleCopy} 
                className={isCopied ? 'active' : ''}
              >
                {isCopied ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                )}
                {isCopied ? t('tools.jsonFormatter.copiedMessage') : t('tools.jsonFormatter.copyButton')}
              </ActionButton>
            </ResultContainer>
          </div>
        </EncoderDecoderContainer>
      </Wrapper>
    </>
  );
}

export default UrlEncoderDecoder;
