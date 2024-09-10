import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 80vh;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 20px auto;
`;

const InputText = styled.textarea`
  width: 50%;
  height: 100%;
  font-size: 16px;
  padding: 20px;
  border: none;
  border-right: 1px solid #e0e0e0;
  box-sizing: border-box;
  outline: none;
  resize: none;
`;

const PreviewContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
`;

const Preview = styled.div`
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  text-align: left;
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 10px;

  h1, h2, h3 {
    color: #2c3e50;
    margin-top: 0;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DownloadButton = styled.button`
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  align-self: flex-end;

  &:hover {
    background-color: #2980b9;
  }
`;

function TextToImage() {
  const [text, setText] = useState('');
  const previewRef = useRef(null);

  const formatText = (text) => {
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
    <Container>
      <InputText
        placeholder="输入文本（可包含标题，如# 标题1）"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <PreviewContainer>
        <Preview
          ref={previewRef}
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
        />
        <DownloadButton onClick={handleDownload}>导出为图片</DownloadButton>
      </PreviewContainer>
    </Container>
  );
}

export default TextToImage;