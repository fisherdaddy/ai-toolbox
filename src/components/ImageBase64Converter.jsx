// ImageBase64Converter.jsx

import React, { useState, useCallback } from 'react';
import { Title, Wrapper, Container, InputText, Preview } from '../js/SharedStyles';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const ConverterContainer = styled(Container)`
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
  padding: 12px 40px 12px 12px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 14px;
  color: #202124;
  min-height: 24px;
  word-break: break-all;
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
    color: #34a853;
  }
`;

const StyledInputFile = styled.input`
  margin-bottom: 20px;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  border: 1px solid #dadce0;
  border-radius: 8px;
  display: block;
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #fff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 12px;
  color: #202124;
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

const ErrorText = styled.div`
  color: red;
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
          {/* 图片转 Base64 部分 */}
          <Label>{t('tools.imageBase64Converter.imageToBase64')}</Label>
          <StyledInputFile
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {base64String && (
            <>
              <Label>{t('tools.imageBase64Converter.base64Result')}</Label>
              <ResultContainer>
                <StyledPreview>{base64String}</StyledPreview>
                <CopyButton onClick={handleCopy} className={isCopied ? 'copied' : ''}>
                  {isCopied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1 .9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1 -.9-2 -2-2zm0 16H8V7h11v14z" />
                    </svg>
                  )}
                </CopyButton>
              </ResultContainer>
            </>
          )}

          {/* Base64 转图片部分 */}
          <Label>{t('tools.imageBase64Converter.base64ToImage')}</Label>
          <StyledInputText
            value={inputBase64}
            onChange={handleBase64InputChange}
            placeholder={t('tools.imageBase64Converter.base64InputPlaceholder')}
          />
          {error && <ErrorText>{error}</ErrorText>}
          {imageSrc && (
            <div>
              <Label>{t('tools.imageBase64Converter.imageResult')}</Label>
              <ImagePreviewContainer>
                <ImagePreview src={imageSrc} alt="Base64 to Image" onError={handleImageError} />
                <DownloadButton onClick={handleDownload}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v9m0 0l-3-3m3 3l3-3" />
                  </svg>
                  {t('tools.imageBase64Converter.download')}
                </DownloadButton>
              </ImagePreviewContainer>
            </div>
          )}
        </ConverterContainer>
      </Wrapper>
    </>
  );
}

export default ImageBase64Converter;
