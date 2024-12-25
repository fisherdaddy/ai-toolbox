// ImageBase64Converter.jsx
import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import styled from 'styled-components';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

// 复用相同的样式组件
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 6rem 2rem 2rem;
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
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
`;

const FileInputWrapper = styled.label`
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(99, 102, 241, 0.05);
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  span {
    color: #6366F1;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }
`;

const ResultArea = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  position: relative;
  
  textarea {
    width: 100%;
    min-height: 180px;
    border: none;
    background: transparent;
    resize: vertical;
    outline: none;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 1.5px;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  ${props => props.variant === 'success' && `
    background-color: #DEF7EC;
    color: #03543F;
  `}

  ${props => !props.variant && `
    background-color: rgba(255, 255, 255, 0.5);
    color: #4B5563;
    &:hover {
      background-color: #EEF2FF;
      color: #4F46E5;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ImageDetails = styled.div`
  font-size: 0.875rem;
  color: #6B7280;
  margin-top: 0.5rem;
`;

function ImageBase64Converter() {
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [base64String, setBase64String] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // 清除所有状态
  const clearStates = () => {
    setBase64String('');
    setPreviewUrl('');
    setImageFile(null);
    setError('');
  };

  // 处理图片转 Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setBase64String(base64);
        setPreviewUrl(base64);
        setError('');
      };
      reader.onerror = () => {
        setError(t('tools.imageBase64Converter.readError'));
      };
      reader.readAsDataURL(file);
    }
    // 重置 input 的 value，这样同一个文件也能触发 change 事件
    event.target.value = '';
  };

  // 处理 Base64 转图片
  const handleBase64Input = (event) => {
    const input = event.target.value;
    setBase64String(input);
    setError('');

    if (!input) {
      setPreviewUrl('');
      setImageFile(null);
      return;
    }

    try {
      // 尝试验证和修复 base64 字符串
      let validBase64 = input.trim();
      
      // 如果不是以 data:image 开头，尝试添加
      if (!validBase64.startsWith('data:image')) {
        // 检查是否只包含 base64 字符
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (base64Regex.test(validBase64)) {
          validBase64 = `data:image/png;base64,${validBase64}`;
        }
      }

      // 创建一个新的图片对象来验证 base64 字符串
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(validBase64);
        setError('');
      };
      img.onerror = () => {
        setPreviewUrl('');
        setError(t('tools.imageBase64Converter.invalidBase64'));
      };
      img.src = validBase64;
    } catch (err) {
      setPreviewUrl('');
      setError(t('tools.imageBase64Converter.invalidBase64'));
    }
  };

  // 下载图片
  const handleDownload = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = imageFile ? imageFile.name : 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(base64String).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [base64String]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.imageBase64Converter.title')}
        description={t('tools.imageBase64Converter.description')}
      />
      <Container>
        <ContentWrapper>
          <Title>{t('tools.imageBase64Converter.title')}</Title>
          
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="block text-sm font-medium text-gray-700">
                {t('tools.imageBase64Converter.imageToBase64')}
              </div>
              <FileInputWrapper>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  {t('tools.imageBase64Converter.dragOrClick')}
                </span>
              </FileInputWrapper>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('tools.imageBase64Converter.base64ToImage')}
              </label>
              <ResultArea>
                <textarea
                  value={base64String}
                  onChange={handleBase64Input}
                  placeholder={t('tools.imageBase64Converter.base64InputPlaceholder')}
                />
              </ResultArea>
              <div className="flex justify-end gap-2">
                {error && (
                  <div className="text-red-500 text-sm flex-1 pt-2">
                    {error}
                  </div>
                )}
                <ActionButton
                  onClick={handleCopy}
                  disabled={!base64String}
                  variant={isCopied ? 'success' : undefined}
                >
                  {isCopied ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      {t('copy')}
                    </>
                  )}
                </ActionButton>
              </div>
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('tools.imageBase64Converter.preview')}
                  </label>
                  <ActionButton
                    onClick={handleDownload}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    {t('tools.imageBase64Converter.download')}
                  </ActionButton>
                </div>
                <PreviewImage src={previewUrl} alt="Preview" />
                {imageFile && (
                  <ImageDetails>
                    {t('tools.imageBase64Converter.fileName')}: {imageFile.name}<br />
                    {t('tools.imageBase64Converter.fileSize')}: {(imageFile.size / 1024).toFixed(2)} KB
                  </ImageDetails>
                )}
              </div>
            )}
          </div>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default ImageBase64Converter;
