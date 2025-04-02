import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import styled from 'styled-components';
import SEO from './SEO';
import { useTranslation } from '../js/i18n';

// 配置 marked 使用 highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
});

// 容器样式
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

const CopyButton = styled.button`
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

const FormatSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }

  input {
    accent-color: #6366F1;
  }
`;

const WechatFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('markdown'); // 'markdown' 或 'html'
  const tempDivRef = useRef(null);
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setInput(e.target.value);
    convertToWechat(e.target.value, format);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
    convertToWechat(input, e.target.value);
  };

  const convertToWechat = (text, format) => {
    let html = '';
    if (format === 'markdown') {
      html = marked(text);
    } else {
      html = text;
    }

    // 处理标题，使用微信公众号兼容的样式
    html = html.replace(/<h1>(.*?)<\/h1>/g, '<section style="margin-top: 2em; margin-bottom: 1em;"><strong style="font-size: 28px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');
    html = html.replace(/<h2>(.*?)<\/h2>/g, '<section style="margin-top: 1.8em; margin-bottom: 0.8em;"><strong style="font-size: 22px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');
    html = html.replace(/<h3>(.*?)<\/h3>/g, '<section style="margin-top: 1.6em; margin-bottom: 0.6em;"><strong style="font-size: 19px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');
    html = html.replace(/<h4>(.*?)<\/h4>/g, '<section style="margin-top: 1.4em; margin-bottom: 0.5em;"><strong style="font-size: 17px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');
    html = html.replace(/<h5>(.*?)<\/h5>/g, '<section style="margin-top: 1.2em; margin-bottom: 0.5em;"><strong style="font-size: 15px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');
    html = html.replace(/<h6>(.*?)<\/h6>/g, '<section style="margin-top: 1em; margin-bottom: 0.5em;"><strong style="font-size: 14px; font-weight: bold; color: #000; display: block; line-height: 1.4;">\$1</strong></section>');

    // 处理列表中的粗体文本后跟冒号的情况
    html = html.replace(/<li><strong>(.*?)<\/strong>：(.*?)<\/li>/g, 
      '<li><span style="display: inline; white-space: nowrap;"><strong>\$1</strong>：</span>\$2</li>');
    
    // 确保列表项中的内容保持在一行
    html = html.replace(/<li>(.*?)<\/li>/g, 
      '<li style="margin-bottom: 0.5em; line-height: 1.6;">\$1</li>');

    // 添加微信公众号特定的样式
    const wechatHtml = `
      <div class="wechat-content prose max-w-none">
        ${html}
      </div>
    `;
    setOutput(wechatHtml);
  };

  const copyToClipboard = () => {
    // 创建一个临时的 div 元素来存放内容
    if (!tempDivRef.current) {
      tempDivRef.current = document.createElement('div');
      document.body.appendChild(tempDivRef.current);
    }

    // 将 HTML 内容添加到临时 div
    tempDivRef.current.innerHTML = output;
    tempDivRef.current.style.position = 'absolute';
    tempDivRef.current.style.left = '-9999px';

    // 创建一个范围来选择内容
    const range = document.createRange();
    range.selectNode(tempDivRef.current);

    // 清除当前选择
    window.getSelection().removeAllRanges();
    
    // 选择内容
    window.getSelection().addRange(range);

    try {
      // 执行复制命令
      document.execCommand('copy');
      alert('已复制到剪贴板！现在可以直接粘贴到微信公众号编辑器中。');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制。');
    }

    // 清理
    window.getSelection().removeAllRanges();
  };

  return (
    <>
      <SEO
        title="微信公众号排版工具"
        description="将 Markdown 或 HTML 转换为微信公众号优质排版"
      />
      <Container>
        <ContentWrapper>
          <EditorContainer>
            <TitleLabel>公众号排版编辑器</TitleLabel>
            <FormatSelector>
              <RadioLabel>
                <input
                  type="radio"
                  value="markdown"
                  checked={format === 'markdown'}
                  onChange={handleFormatChange}
                />
                Markdown
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  value="html"
                  checked={format === 'html'}
                  onChange={handleFormatChange}
                />
                HTML
              </RadioLabel>
            </FormatSelector>
            <Editor
              value={input}
              onChange={handleInputChange}
              placeholder={`请输入${format === 'markdown' ? 'Markdown' : 'HTML'}内容...`}
            />
          </EditorContainer>
          <PreviewContainer>
            <TitleLabel>预览效果</TitleLabel>
            <CopyButton 
              onClick={copyToClipboard}
              visible={output.length > 0}
            >
              复制内容
            </CopyButton>
            <Preview 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: output }} 
            />
          </PreviewContainer>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default WechatFormatter; 