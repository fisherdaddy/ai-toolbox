import React, { useState, useRef } from 'react';
import { removeBackground } from "@imgly/background-removal";
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';

// Reuse container style
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
  height: calc(100vh - 6rem);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
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
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .upload-prompt {
    color: #666;
    font-size: 1.2rem;
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

// 添加提示语样式
const PrivacyNote = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border-left: 4px solid #6366F1;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 0 8px 8px 0;
  color: #4F46E5;
  font-size: 0.9rem;
  line-height: 1.5;
`;

function BackgroundRemover() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [removedBgImage, setRemovedBgImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        
        // Remove background
        const imageBlob = await removeBackground(imageUrl);
        const removedBgUrl = URL.createObjectURL(imageBlob);
        setRemovedBgImage(removedBgUrl);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDownload = () => {
    if (removedBgImage) {
      const link = document.createElement('a');
      link.href = removedBgImage;
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <SEO
        title={t('tools.imageBackgroundRemover.title')}
        description={t('tools.imageBackgroundRemover.description')}
      />
      <Container>
        <ContentWrapper>
          <ControlPanel>
            <Title>{t('tools.imageBackgroundRemover.title')}</Title>
            <ImageUploadArea onClick={() => fileInputRef.current.click()}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
              {t('tools.imageBackgroundRemover.uploadPrompt')}
            </ImageUploadArea>
            
            {/* 添加提示语 */}
            <PrivacyNote>
              {t('tools.imageBackgroundRemover.privacyNote')}
            </PrivacyNote>
          </ControlPanel>

          <PreviewArea>
            {removedBgImage && (
              <DownloadButton onClick={handleDownload}>
                {t('tools.imageBackgroundRemover.download')}
              </DownloadButton>
            )}
            <div className="preview-content">
              {isProcessing ? (
                <div className="loading-container">
                  <span>{t('tools.imageBackgroundRemover.processing')}</span>
                </div>
              ) : removedBgImage ? (
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={removedBgImage}
                    alt="Processed"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : (
                <div className="upload-prompt">
                  {t('tools.imageBackgroundRemover.noImage')}
                </div>
              )}
            </div>
          </PreviewArea>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default BackgroundRemover; 