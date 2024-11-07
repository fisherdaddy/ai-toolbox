import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Wrapper, Container, InputText, PreviewContainer, Preview } from '../js/SharedStyles';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const DownloadButton = styled.button`
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  align-self: flex-end;
  margin-top: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

function TextToImage() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const previewRef = useRef(null);

  const formatText = (text) => {
    return text
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n{2,}/g, '<br/><br/>') 
      .replace(/\n/g, '<br/>');
  };

  const handleDownload = async () => {
    const previewClone = previewRef.current.cloneNode(true);
    document.body.appendChild(previewClone);
    previewClone.style.position = 'absolute';
    previewClone.style.left = '-9999px';
    previewClone.style.width = 'auto';
    previewClone.style.maxWidth = '800px';
    previewClone.style.height = 'auto';
    previewClone.style.whiteSpace = 'pre-wrap';
    previewClone.style.backgroundColor = 'white';
    previewClone.style.padding = '40px';
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewClone, {
        backgroundColor: 'white',
        scale: 2,
        width: previewClone.offsetWidth,
        height: previewClone.offsetHeight
      });

      const link = document.createElement('a');
      link.download = 'text_image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to load html2canvas:', error);
    } finally {
      document.body.removeChild(previewClone);
    }
  };

  return (
    <>
      <SEO
        title={t('tools.text2image.title')}
        description={t('tools.text2image.description')}
      />
      <Wrapper>
        <Title>{t('tools.text2image.title')}</Title>
        <Container>
          <InputText
            placeholder={t('tools.text2image.inputPlaceholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <PreviewContainer>
            <Preview
              ref={previewRef}
              dangerouslySetInnerHTML={{ __html: formatText(text) }}
            />
            <DownloadButton onClick={handleDownload}>
              {t('tools.text2image.downloadButton')}
            </DownloadButton>
          </PreviewContainer>
        </Container>
      </Wrapper>
    </>
  );
}

export default TextToImage;