import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';
import SEO from './SEO';
import { useTranslation } from '../js/i18n';
import html2canvas from 'html2canvas';

// 容器样式
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

const EditorContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const PreviewContainer = styled(EditorContainer)`
  overflow: auto;
  position: relative;
`;

const Editor = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: none;
  background: transparent;
  font-family: 'SF Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  color: #1a1a1a;

  &:focus {
    outline: none;
  }
`;

const Preview = styled.div`
  font-family: -apple-system, system-ui, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  p {
    margin: 1em 0;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid rgba(99, 102, 241, 0.2);
    padding: 0.5em;
  }

  .katex {
    font-size: 1.1em;
  }
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

function HtmlPreview() {
  const [html, setHtml] = useState('');
  const { t } = useTranslation();

  // 处理 LaTeX 公式
  const processLatex = (content) => {
    return content.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$(.*?)\$/g, (match, p1, p2, p3, p4) => {
      const formula = p1 || p2 || p3 || p4;
      const displayMode = match.startsWith('$$') || match.startsWith('\\[');
      try {
        return katex.renderToString(formula.trim(), {
          displayMode,
          throwOnError: false
        });
      } catch (e) {
        console.error('LaTeX解析错误:', e);
        return match;
      }
    });
  };

  // 使用 useMemo 缓存处理后的 HTML
  const renderedContent = useMemo(() => {
    if (!html) return '';

    try {
      // 处理 LaTeX 公式
      let processedHtml = processLatex(html);

      // 清理 HTML，防止 XSS 攻击
      const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
        ADD_TAGS: ['math', 'annotation', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'mfrac'],
        ADD_ATTR: ['display', 'mode', 'class']
      });

      return sanitizedHtml;
    } catch (e) {
      console.error('渲染错误:', e);
      return `渲染错误: ${e.message}`;
    }
  }, [html]);

  const handleDownload = async () => {
    const previewElement = document.querySelector('.preview-content');
    if (!previewElement) return;

    try {
      // 等待图片加载
      const waitForImages = () => {
        const images = previewElement.getElementsByTagName('img');
        const promises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
        return Promise.all(promises);
      };

      await waitForImages();
      // 等待 LaTeX 渲染
      await new Promise(resolve => setTimeout(resolve, 500));

      // 计算实际内容高度（包括所有子元素）
      const computeActualHeight = (element) => {
        const style = window.getComputedStyle(element);
        const marginTop = parseInt(style.marginTop);
        const marginBottom = parseInt(style.marginBottom);
        
        let height = element.offsetHeight + marginTop + marginBottom;
        
        // 获取所有子元素的位置信息
        const children = element.children;
        if (children.length > 0) {
          const lastChild = children[children.length - 1];
          const lastChildRect = lastChild.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          height = Math.max(height, lastChildRect.bottom - elementRect.top + marginBottom + 50);
        }
        
        return height;
      };

      const actualHeight = computeActualHeight(previewElement);
      const actualWidth = previewElement.offsetWidth;

      const canvas = await html2canvas(previewElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.preview-content');
          if (clonedElement) {
            // 设置固定尺寸
            clonedElement.style.width = `${actualWidth}px`;
            clonedElement.style.height = `${actualHeight}px`;
            clonedElement.style.position = 'relative';
            clonedElement.style.transform = 'none';
            clonedElement.style.transformOrigin = '0 0';
            
            // 确保内容不会溢出
            clonedElement.style.overflow = 'visible';
            clonedElement.style.padding = '20px';
            clonedElement.style.boxSizing = 'border-box';
            
            // 强制重新计算布局
            clonedElement.style.display = 'block';
          }
        }
      });

      const link = document.createElement('a');
      link.download = 'latex-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
    }
  };

  return (
    <>
      <SEO
        title={t('tools.latex2image.title')}
        description={t('tools.latex2image.description')}
      />
      <Container>
        <ContentWrapper>
          <EditorContainer>
            <TitleLabel>{t('tools.latex2image.title')}</TitleLabel>
            <Editor
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder={t('tools.latex2image.placeholder')}
            />
          </EditorContainer>
          <PreviewContainer>
            <TitleLabel>{t('tools.latex2image.preview')}</TitleLabel>
            <DownloadButton 
              onClick={handleDownload}
              visible={renderedContent.length > 0}
            >
              {t('tools.latex2image.download')}
            </DownloadButton>
            <Preview 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }} 
            />
          </PreviewContainer>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default HtmlPreview;
