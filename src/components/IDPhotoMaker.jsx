import React, { useState, useRef, useCallback } from 'react';
import { removeBackground } from "@imgly/background-removal";
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

// 证件照标准尺寸 (宽 x 高，单位：像素，按300DPI计算)
const ID_PHOTO_SIZES = {
  'small1inch': { width: 260, height: 378, ratio: 260/378 },  // 小一寸 2.2cm × 3.2cm
  '1inch': { width: 295, height: 413, ratio: 295/413 },  // 一寸 2.5cm × 3.5cm
  'large1inch': { width: 390, height: 567, ratio: 390/567 },  // 大一寸 3.3cm × 4.8cm
  'small2inch': { width: 413, height: 532, ratio: 413/532 },  // 小二寸 3.5cm × 4.5cm
  '2inch': { width: 413, height: 579, ratio: 413/579 },  // 二寸 3.5cm × 4.9cm
  'large2inch': { width: 413, height: 626, ratio: 413/626 },  // 大二寸 3.5cm × 5.3cm
  '3inch': { width: 649, height: 991, ratio: 649/991 },  // 三寸 5.5cm × 8.4cm
  '4inch': { width: 898, height: 1205, ratio: 898/1205 }, // 四寸 7.6cm × 10.2cm
  '5inch': { width: 1051, height: 1500, ratio: 1051/1500 } // 五寸 8.9cm × 12.7cm
};

// 复用容器样式
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
  height: calc(100vh - 10rem);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 12rem);
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const PreviewArea = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  overflow: hidden;
  position: relative;

  .preview-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .upload-prompt {
    color: #666;
    font-size: 1.2rem;
    text-align: center;
  }
`;

const ControlPanel = styled.div`
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
  height: 100%;
  overflow-y: auto;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #6366F1;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.05);
  }
`;

const SizeSelector = styled.div`
  .size-label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .size-select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover, &:focus {
      border-color: #6366F1;
      outline: none;
    }
  }
`;

const ProcessButton = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PrivacyNote = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border-left: 4px solid #6366F1;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0 8px 8px 0;
  color: #4F46E5;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const Instructions = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0 8px 8px 0;
  color: #15803d;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-line;
`;

const StatusMessage = styled.div`
  text-align: center;
  color: #6366F1;
  font-weight: 500;
  margin: 1rem 0;
`;

function IDPhotoMaker() {
  useScrollToTop();
  const { t } = useTranslation();
  const isPageLoading = usePageLoading();
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('1inch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setProcessedImage(null); // 清除之前的处理结果
    }
  };

  const processImage = useCallback(async () => {
    if (!selectedImage) return;

    try {
      setIsProcessing(true);
      setProcessingStatus(t('tools.idPhotoMaker.backgroundRemoval'));
      
      // 步骤1: 去除背景
      const imageBlob = await removeBackground(selectedImage);
      
      setProcessingStatus(t('tools.idPhotoMaker.addingBackground'));
      
      // 步骤2: 创建画布，添加白色背景并调整尺寸
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(imageBlob);
      });

      setProcessingStatus(t('tools.idPhotoMaker.resizing'));

      // 获取目标尺寸
      const targetSize = ID_PHOTO_SIZES[selectedSize];
      canvas.width = targetSize.width;
      canvas.height = targetSize.height;

      // 填充白色背景
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 计算图片缩放和位置
      const imgRatio = img.width / img.height;
      const targetRatio = targetSize.ratio;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgRatio > targetRatio) {
        // 图片更宽，以高度为准
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // 图片更高，以宽度为准
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }

      // 绘制图片
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // 转换为blob
      canvas.toBlob((blob) => {
        const processedUrl = URL.createObjectURL(blob);
        setProcessedImage(processedUrl);
        setProcessingStatus('');
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, selectedSize, t]);

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `id-photo-${selectedSize}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <SEO
        title={t('tools.idPhotoMaker.title')}
        description={t('tools.idPhotoMaker.description')}
      />
      {(isPageLoading || isProcessing) && <LoadingOverlay />}
      <Container>
        <ContentWrapper>
          <ControlPanel>
            <Title>{t('tools.idPhotoMaker.title')}</Title>
            
            <ImageUploadArea onClick={() => fileInputRef.current.click()}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
              {t('tools.idPhotoMaker.uploadPrompt')}
            </ImageUploadArea>

            <SizeSelector>
              <div className="size-label">{t('tools.idPhotoMaker.selectSize')}</div>
              <select 
                className="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {Object.entries(ID_PHOTO_SIZES).map(([key, size]) => (
                  <option key={key} value={key}>
                    {t(`tools.idPhotoMaker.sizes.${key}`)}
                  </option>
                ))}
              </select>
            </SizeSelector>

            <ProcessButton
              onClick={processImage}
              disabled={!selectedImage || isProcessing}
            >
              {isProcessing ? t('tools.idPhotoMaker.processing') : t('tools.idPhotoMaker.preview')}
            </ProcessButton>

            <Instructions>
              {t('tools.idPhotoMaker.instructions')}
            </Instructions>
            
            <PrivacyNote>
              {t('tools.idPhotoMaker.privacyNote')}
            </PrivacyNote>
          </ControlPanel>

          <PreviewArea>
            {processedImage && (
              <DownloadButton onClick={handleDownload}>
                {t('tools.idPhotoMaker.download')}
              </DownloadButton>
            )}
            
            <div className="preview-content">
              {processingStatus && (
                <StatusMessage>{processingStatus}</StatusMessage>
              )}
              
              {processedImage ? (
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={processedImage}
                    alt="ID Photo"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ) : selectedImage && !isProcessing ? (
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={selectedImage}
                    alt="Original"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      opacity: 0.7,
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ) : (
                <div className="upload-prompt">
                  {t('tools.idPhotoMaker.noImage')}
                </div>
              )}
            </div>
          </PreviewArea>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default IDPhotoMaker; 