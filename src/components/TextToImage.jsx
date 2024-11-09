import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';
import Marked from 'marked-react';

// 更新预设模板
const templates = [
  { 
    name: 'simple',
    bgColor: '#ffffff',
    textColor: '#333333',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px'
  },
  {
    name: 'ai-style',
    bgColor: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    textColor: '#ffffff',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px'
  },
  {
    name: 'dark',
    bgColor: '#2d3748',
    textColor: '#ffffff',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px'
  },
  {
    name: 'paper',
    bgColor: '#fdf6e3',
    textColor: '#333333',
    font: 'Georgia, "Nimbus Roman No9 L", "Songti SC", serif',
    padding: '40px'
  },
  {
    name: 'minimal',
    bgColor: '#f8f9fa',
    textColor: '#1a1a1a',
    font: '-apple-system, "SF Pro Text", sans-serif',
    padding: '40px'
  },
  {
    name: 'tech',
    bgColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    textColor: '#e2e8f0',
    font: '"SF Mono", SFMono-Regular, Consolas, monospace',
    padding: '40px'
  }
];

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 2rem;
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
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleLabel = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333333;
`;

const TemplateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TemplateItem = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.selected ? 
    'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 
    'rgba(255, 255, 255, 0.8)'
  };
  color: ${props => props.selected ? '#ffffff' : '#333333'};
  border: 2px solid ${props => props.selected ? '#4F46E5' : 'rgba(99, 102, 241, 0.1)'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }

  ${props => props.selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 12px;
      color: #ffffff;
    }
  `}
`;

const MarkdownEditor = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 16px;
  color: #333333;
  resize: vertical;
`;

const DownloadButton = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  background: ${(props) => props.bgColor || '#ffffff'};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  height: fit-content;
  align-self: flex-start;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  }
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    width: 100%;
  }
`;

const Preview = styled.div`
  font-size: clamp(16px, 2.5vw, 24px);
  margin-bottom: 16px;
  color: ${(props) => props.$color || '#333333'};
  text-align: center;
  line-height: 1.5;
  font-family: ${(props) => props.$fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 100%;
`;


function TextToImage() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const previewRef = useRef(null);

  const formatText = (text) => {
    return marked.parse(text, {
      breaks: true,
      gfm: true
    });
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
      <Container>
        
        <ContentWrapper>
          <InputContainer>
            <TitleLabel>{t('tools.text2image.title')}</TitleLabel>
            
            {/* 模板选择 */}
            <Section>
              <Label>{t('tools.text2image.selectTemplate')}</Label>
              <TemplateGrid>
                {templates.map(template => (
                  <TemplateItem
                    key={template.name}
                    selected={template === selectedTemplate}
                    onClick={() => setSelectedTemplate(template)}
                    background={template.bgColor}
                    color={template.textColor}
                  >
                    {t(`tools.text2image.templates.${template.name}`)}
                  </TemplateItem>
                ))}
              </TemplateGrid>
            </Section>

            {/* Markdown 编辑器 */}
            <Section>
              <Label>{t('tools.text2image.inputLabel')}</Label>
              <MarkdownEditor
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('tools.text2image.placeholder')}
              />
            </Section>

            <DownloadButton onClick={handleDownload}>
              {t('tools.text2image.downloadButton')}
            </DownloadButton>
          </InputContainer>

          <PreviewContainer 
            ref={previewRef}
            bgColor={selectedTemplate.bgColor}
          >
            <div
              style={{
                padding: selectedTemplate.padding,
                color: selectedTemplate.textColor,
                fontFamily: selectedTemplate.font,
                width: '100%'
              }}
            >
              <Marked>
                {text || t('tools.text2image.previewDefault')}
              </Marked>
            </div>
          </PreviewContainer>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default TextToImage;