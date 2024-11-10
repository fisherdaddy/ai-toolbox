// ImageBase64Converter.jsx

import React, { useState, useCallback } from 'react';
import { Title, Wrapper, Container } from '../js/SharedStyles';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const ConverterContainer = styled(Container)`
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 12px;
`;

const Section = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
  display: block;
  letter-spacing: 0.1px;
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

const FileInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border: 2px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

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
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ResultContainer = styled.div`
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  padding: 16px;
  min-height: 120px;
`;

const ActionButton = styled.button`
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

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.1);
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageDetails = styled.div`
  font-size: 13px;
  color: #6B7280;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  color: #EF4444;
  font-size: 14px;
  margin-top: 8px;
`;

function ImageBase64Converter() {
  const { t } = useTranslation();

  // 图片转 Base64 的状态
  const [imageFile, setImageFile] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Base64 转图片的状态
  const [inputBase64, setInputBase64] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState('');

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64String(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 复制 Base64 字符串
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(base64String).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [base64String]);

  // 处理 Base64 输入变化
  const handleBase64InputChange = (e) => {
    const input = e.target.value.trim();
    setInputBase64(input);
    if (input) {
      let src = input;
      if (!input.startsWith('data:image/')) {
        // 尝试自动推断图片类型
        const match = input.match(/^data:(image\/[a-zA-Z]+);base64,/);
        let mimeType = 'image/png'; // 默认类型
        if (match && match[1]) {
          mimeType = match[1];
        }
        src = `data:${mimeType};base64,${input}`;
      }
      setImageSrc(src);
      setError('');
    } else {
      setImageSrc('');
      setError('');
    }
  };

  // 图片加载错误处理
  const handleImageError = () => {
    setError(t('tools.imageBase64Converter.invalidBase64'));
    setImageSrc('');
  };

  // 下载图片
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    // 尝试从 Base64 字符串中提取文件类型和扩展名
    let fileName = 'downloaded_image';
    const match = imageSrc.match(/^data:(image\/[a-zA-Z]+);base64,/);
    if (match && match[1]) {
      const mime = match[1];
      const extension = mime.split('/')[1];
      fileName += `.${extension}`;
    } else {
      fileName += `.png`;
    }
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO
        title={t('tools.imageBase64Converter.title')}
        description={t('tools.imageBase64Converter.description')}
      />
      <Wrapper>
        <Title>{t('tools.imageBase64Converter.title')}</Title>
        <ConverterContainer>
          <Section>
            <Label>{t('tools.imageBase64Converter.imageToBase64')}</Label>
            <FileInputWrapper>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <span>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
                </svg>
                {t('tools.imageBase64Converter.dragOrClick')}
              </span>
            </FileInputWrapper>
            {base64String && (
              <ResultContainer>
                <pre>{base64String}</pre>
                <ActionButton onClick={handleCopy} className={isCopied ? 'active' : ''}>
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
                <ThumbnailContainer>
                  <Thumbnail src={base64String} alt="Preview" />
                </ThumbnailContainer>
                {imageFile && (
                  <ImageDetails>
                    {t('tools.imageBase64Converter.fileName')}: {imageFile.name}<br />
                    {t('tools.imageBase64Converter.fileSize')}: {(imageFile.size / 1024).toFixed(2)} KB
                  </ImageDetails>
                )}
              </ResultContainer>
            )}
          </Section>

          <Section>
            <Label>{t('tools.imageBase64Converter.base64ToImage')}</Label>
            <StyledInputText
              value={inputBase64}
              onChange={handleBase64InputChange}
              placeholder={t('tools.imageBase64Converter.base64InputPlaceholder')}
            />
            {error && <ErrorText>{error}</ErrorText>}
            {imageSrc && (
              <ImagePreviewContainer>
                <ThumbnailContainer>
                  <Thumbnail src={imageSrc} alt="Thumbnail" onError={handleImageError} />
                </ThumbnailContainer>
                <PreviewActions>
                  <ActionButton onClick={handleDownload}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v9m0 0l-3-3m3 3l3-3"/>
                    </svg>
                    {t('tools.imageBase64Converter.download')}
                  </ActionButton>
                </PreviewActions>
              </ImagePreviewContainer>
            )}
          </Section>
        </ConverterContainer>
      </Wrapper>
    </>
  );
}

export default ImageBase64Converter;
