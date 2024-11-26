import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import DOMPurify from 'dompurify';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

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

const TemplateSection = styled(Section)`
  margin-bottom: 1rem;
`;

const EditorSection = styled(Section)`
  flex: 1;
  display: flex;
  flex-direction: column;
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

const Editor = styled.textarea`
  width: 100%;
  height: 500px;
  padding: 1rem;
  border: none;
  background: transparent;
  font-family: 'SF Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  color: #1a1a1a;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const DownloadButton = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
  font-size: 0.9rem;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};

  &:hover {
    opacity: 0.9;
  }
`;

const PreviewContainer = styled(InputContainer)`
  overflow: auto;
  position: relative;
  min-height: 400px;
  display: block;
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.3;
  }

  p {
    margin: 1em 0;
    line-height: 1.6;
  }

  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin: 0.5em 0;
    line-height: 1.6;
  }

  pre, code {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 0.2em 0.4em;
    font-family: 'SF Mono', monospace;
  }

  pre code {
    background: none;
    padding: 0;
  }

  blockquote {
    border-left: 4px solid #e2e8f0;
    margin: 1em 0;
    padding-left: 1em;
    color: #64748b;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.5em;
    text-align: left;
  }

  th {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Preview = styled.div`
  font-family: ${(props) => props.$font || '-apple-system, system-ui, sans-serif'};
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.$color || '#1a1a1a'};
  background: ${(props) => props.$background || '#ffffff'};
  padding: ${(props) => props.$padding || '40px'};
  border-radius: 8px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
`;

function MarkdownToImage() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const previewRef = useRef(null);
  const isLoading = usePageLoading();

  const formatText = (text) => {
    return marked.parse(text, {
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
      // 自定义图片渲染
      renderer: {
        image(href, title, text) {
          // 处理相对路径
          if (href.startsWith('/')) {
            href = window.location.origin + href;
          }
          return `<img src="${href}" alt="${text}" title="${title || ''}" style="max-width: 100%; height: auto;" crossorigin="anonymous" />`;
        }
      }
    });
  };

  const handleDownload = async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      // 等待图片加载
      const waitForImages = () => {
        const images = previewElement.getElementsByTagName('img');
        const promises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            // 确保图片使用完整的 URL
            if (img.src.startsWith('/')) {
              img.src = window.location.origin + img.src;
            }
            // 添加跨域属性
            img.crossOrigin = 'anonymous';
          });
        });
        return Promise.all(promises);
      };

      await waitForImages();
      // 等待渲染完成
      await new Promise(resolve => setTimeout(resolve, 500));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewElement, {
        backgroundColor: selectedTemplate.bgColor,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.markdown-content');
          if (clonedElement) {
            clonedElement.style.width = '100%';
            clonedElement.style.position = 'relative';
            clonedElement.style.transform = 'none';
            clonedElement.style.transformOrigin = '0 0';
            clonedElement.style.overflow = 'visible';
          }
        }
      });

      const link = document.createElement('a');
      link.download = 'markdown-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
    }
  };

  const renderPreview = () => {
    // 配置 marked 选项
    marked.setOptions({
      gfm: true, // 启用 GitHub 风格的 Markdown
      breaks: true, // 启用换行符转换为 <br>
      headerIds: true,
      mangle: false,
      pedantic: false,
      smartLists: true, // 优化列表输出
      smartypants: true, // 优化标点符号
    });

    // 使用 DOMPurify 清理 HTML
    const cleanHtml = DOMPurify.sanitize(marked(text), {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt'],
    });

    return (
      <div
        ref={previewRef}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
        style={{
          fontFamily: selectedTemplate.font,
          color: selectedTemplate.textColor,
          background: selectedTemplate.bgColor,
          padding: selectedTemplate.padding,
          minHeight: '100%',
        }}
      />
    );
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.markdown2image.title')}
        description={t('tools.markdown2image.description')}
      />
      <Container>
        
        <ContentWrapper>
          <InputContainer>
            <TitleLabel>{t('tools.markdown2image.title')}</TitleLabel>
            
            {/* 模板选择 */}
            <TemplateSection>
              <Label>{t('tools.markdown2image.selectTemplate')}</Label>
              <TemplateGrid>
                {templates.map(template => (
                  <TemplateItem
                    key={template.name}
                    selected={template === selectedTemplate}
                    onClick={() => setSelectedTemplate(template)}
                    background={template.bgColor}
                    color={template.textColor}
                  >
                    {t(`tools.markdown2image.templates.${template.name}`)}
                  </TemplateItem>
                ))}
              </TemplateGrid>
            </TemplateSection>

            {/* Markdown 编辑器 */}
            <EditorSection>
              <Label>{t('tools.markdown2image.inputLabel')}</Label>
              <Editor
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('tools.markdown2image.placeholder')}
              />
            </EditorSection>
          </InputContainer>

          <PreviewContainer>
            <DownloadButton 
              onClick={handleDownload}
              visible={text.length > 0}
            >
              {t('tools.markdown2image.downloadButton')}
            </DownloadButton>
            {renderPreview()}
          </PreviewContainer>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default MarkdownToImage;