import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';

// 复用 MarkdownToImage 的基础容器样式
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

const Title = styled.h2`
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
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
`;

const ImagePreview = styled.div`
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
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
  margin-top: 1rem;

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

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.div`
  border: 2px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(99, 102, 241, 0.05);
  }
`;

// 添加隐私提示样式
const PrivacyNote = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border-left: 4px solid #6366F1;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 0 8px 8px 0;
  color: #4F46E5;
  font-size: 0.9rem;
  line-height: 1.5;
`;

function ImageWatermark() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [watermarkSettings, setWatermarkSettings] = useState({
    fontSize: 100,
    opacity: 0.5,
    rotation: 45,
    position: 'center', // center, topLeft, topRight, bottomLeft, bottomRight
    color: '#FF0000',
    spacing: 100, // 水印之间的间距
  });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const watermarkFileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleWatermarkImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setWatermarkImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const applyWatermark = useCallback(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 设置画布尺寸为图片尺寸
      canvas.width = img.width;
      canvas.height = img.height;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制原始图片
      ctx.drawImage(img, 0, 0);

      if (watermarkType === 'text' && watermarkText) {
        // 设置水印文字样式
        ctx.font = `${watermarkSettings.fontSize}px Arial`;
        ctx.fillStyle = watermarkSettings.color + Math.round(watermarkSettings.opacity * 255).toString(16).padStart(2, '0');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 计算水印位置
        let x, y;
        switch (watermarkSettings.position) {
          case 'topLeft':
            x = watermarkSettings.fontSize * 2;
            y = watermarkSettings.fontSize * 2;
            break;
          case 'topRight':
            x = canvas.width - watermarkSettings.fontSize * 2;
            y = watermarkSettings.fontSize * 2;
            break;
          case 'bottomLeft':
            x = watermarkSettings.fontSize * 2;
            y = canvas.height - watermarkSettings.fontSize * 2;
            break;
          case 'bottomRight':
            x = canvas.width - watermarkSettings.fontSize * 2;
            y = canvas.height - watermarkSettings.fontSize * 2;
            break;
          default: // center
            x = canvas.width / 2;
            y = canvas.height / 2;
        }

        // 保存当前状态
        ctx.save();
        
        // 移动到水印位置并旋转
        ctx.translate(x, y);
        ctx.rotate((watermarkSettings.rotation * Math.PI) / 180);
        
        // 绘制水印文字
        ctx.fillText(watermarkText, 0, 0);
        
        // 恢复状态
        ctx.restore();

      } else if (watermarkType === 'image' && watermarkImage) {
        const watermark = new Image();
        watermark.onload = () => {
          // 计算水印大小
          const watermarkSize = Math.min(canvas.width, canvas.height) * 0.2;
          const ratio = watermarkSize / Math.max(watermark.width, watermark.height);
          const watermarkWidth = watermark.width * ratio;
          const watermarkHeight = watermark.height * ratio;

          // 设置透明度
          ctx.globalAlpha = watermarkSettings.opacity;

          // 计算水印位置
          let x, y;
          switch (watermarkSettings.position) {
            case 'topLeft':
              x = watermarkWidth / 2;
              y = watermarkHeight / 2;
              break;
            case 'topRight':
              x = canvas.width - watermarkWidth / 2;
              y = watermarkHeight / 2;
              break;
            case 'bottomLeft':
              x = watermarkWidth / 2;
              y = canvas.height - watermarkHeight / 2;
              break;
            case 'bottomRight':
              x = canvas.width - watermarkWidth / 2;
              y = canvas.height - watermarkHeight / 2;
              break;
            default: // center
              x = canvas.width / 2;
              y = canvas.height / 2;
          }

          // 绘制水印图片
          ctx.drawImage(
            watermark,
            x - watermarkWidth / 2,
            y - watermarkHeight / 2,
            watermarkWidth,
            watermarkHeight
          );

          // 更新预览图片
          setPreviewImage(canvas.toDataURL('image/png'));
        };
        watermark.src = watermarkImage;
      }

      // 如果是文字水印，立即更新预览图片
      if (watermarkType === 'text') {
        setPreviewImage(canvas.toDataURL('image/png'));
      }
    };

    img.src = image;
  }, [image, watermarkType, watermarkText, watermarkImage, watermarkSettings]);

  // 当相关状态改变时，自动应用水印
  useEffect(() => {
    if (image) {
      applyWatermark();
    }
  }, [image, watermarkType, watermarkText, watermarkImage, watermarkSettings, applyWatermark]);

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.download = 'watermarked-image.png';
      link.href = previewImage;
      link.click();
    }
  };

  return (
    <>
      <SEO
        title={t('tools.imageWatermark.title')}
        description={t('tools.imageWatermark.description')}
      />
      <Container>
        <ContentWrapper>
          <ControlPanel>
            <Title>{t('tools.imageWatermark.title')}</Title>
            
            <Section>
              <Label>{t('tools.imageWatermark.uploadImage')}</Label>
              <UploadButton onClick={() => fileInputRef.current.click()}>
                <FileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {t('tools.imageWatermark.dropOrClick')}
              </UploadButton>
              
              {/* 添加隐私提示 */}
              <PrivacyNote>
                {t('tools.imageWatermark.privacyNote')}
              </PrivacyNote>
            </Section>

            <Section>
              <Label>{t('tools.imageWatermark.watermarkType')}</Label>
              <Select
                value={watermarkType}
                onChange={(e) => setWatermarkType(e.target.value)}
              >
                <option value="text">{t('tools.imageWatermark.textWatermark')}</option>
                <option value="image">{t('tools.imageWatermark.imageWatermark')}</option>
              </Select>
            </Section>

            {watermarkType === 'text' ? (
              <Section>
                <Label>{t('tools.imageWatermark.watermarkText')}</Label>
                <Input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder={t('tools.imageWatermark.watermarkTextPlaceholder')}
                />
              </Section>
            ) : (
              <Section>
                <Label>{t('tools.imageWatermark.watermarkImage')}</Label>
                <UploadButton onClick={() => watermarkFileInputRef.current.click()}>
                  <FileInput
                    ref={watermarkFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleWatermarkImageUpload}
                  />
                  {t('tools.imageWatermark.uploadWatermark')}
                </UploadButton>
              </Section>
            )}

            <Section>
              <Label>{t('tools.imageWatermark.opacity')}</Label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={watermarkSettings.opacity}
                onChange={(e) => setWatermarkSettings({
                  ...watermarkSettings,
                  opacity: parseFloat(e.target.value)
                })}
              />
            </Section>

            {watermarkType === 'text' && (
              <>
                <Section>
                  <Label>{t('tools.imageWatermark.fontSize')}</Label>
                  <Input
                    type="number"
                    value={watermarkSettings.fontSize}
                    onChange={(e) => setWatermarkSettings({
                      ...watermarkSettings,
                      fontSize: parseInt(e.target.value)
                    })}
                  />
                </Section>

                <Section>
                  <Label>{t('tools.imageWatermark.rotation')}</Label>
                  <Input
                    type="range"
                    min="0"
                    max="360"
                    value={watermarkSettings.rotation}
                    onChange={(e) => setWatermarkSettings({
                      ...watermarkSettings,
                      rotation: parseInt(e.target.value)
                    })}
                  />
                </Section>

                <Section>
                  <Label>{t('tools.imageWatermark.color')}</Label>
                  <Input
                    type="color"
                    value={watermarkSettings.color}
                    onChange={(e) => setWatermarkSettings({
                      ...watermarkSettings,
                      color: e.target.value
                    })}
                  />
                </Section>
              </>
            )}

            <Section>
              <Label>{t('tools.imageWatermark.position')}</Label>
              <Select
                value={watermarkSettings.position}
                onChange={(e) => setWatermarkSettings({
                  ...watermarkSettings,
                  position: e.target.value
                })}
              >
                <option value="center">{t('tools.imageWatermark.positions.center')}</option>
                <option value="topLeft">{t('tools.imageWatermark.positions.topLeft')}</option>
                <option value="topRight">{t('tools.imageWatermark.positions.topRight')}</option>
                <option value="bottomLeft">{t('tools.imageWatermark.positions.bottomLeft')}</option>
                <option value="bottomRight">{t('tools.imageWatermark.positions.bottomRight')}</option>
              </Select>
            </Section>

            <DownloadButton
              onClick={handleDownload}
              disabled={!image || (watermarkType === 'text' && !watermarkText) || (watermarkType === 'image' && !watermarkImage)}
            >
              {t('tools.imageWatermark.download')}
            </DownloadButton>
          </ControlPanel>

          <ImagePreview>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {previewImage ? (
              <img src={previewImage} alt="Preview" />
            ) : image ? (
              <img src={image} alt="Original" />
            ) : (
              <div>{t('tools.imageWatermark.noImage')}</div>
            )}
          </ImagePreview>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default ImageWatermark; 