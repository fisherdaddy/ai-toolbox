import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from "@imgly/background-removal";
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import '../styles/fonts.css';

// 复用现有的基础容器样式
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
  height: calc(100vh - 6rem);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
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
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(99, 102, 241, 0.5);
    }
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
  flex: 1;
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #4B5563;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #9CA3AF;
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

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

const Canvas = styled.canvas`
  max-width: 100%;
  height: auto;
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;

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

const SettingsGroup = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  border: 1px solid rgba(99, 102, 241, 0.1);

  &:last-child {
    margin-bottom: 0;
  }
`;

const GroupTitle = styled.h3`
  font-size: 1.1rem;
  color: #4F46E5;
  margin-bottom: 1rem;
  font-weight: 600;
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

function TextBehindImage() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState(null);
  const [textSets, setTextSets] = useState([{
    id: 1,
    text: 'EDIT',
    fontSize: 200,
    fontWeight: 800,
    rotation: 0,
    color: '#FFFFFF',
    opacity: 1,
    position: { x: 50, y: 50 }
  }]);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // 处理图片上传
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageLoading(true);
        const imageUrl = URL.createObjectURL(file);
        
        // 获取图片尺寸
        await getImageDimensions(imageUrl);
        
        setSelectedImage(imageUrl);
        await setupImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setImageLoading(false);
      }
    }
  };

  // 获取图片尺寸
  const getImageDimensions = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height
        });
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  // 处理图片背景移除
  const setupImage = async (imageUrl) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  // 更新文本属性
  const updateTextSet = (id, attribute, value) => {
    setTextSets(prev => prev.map(set => 
      set.id === id ? { ...set, [attribute]: value } : set
    ));
  };

  // 处理画布点击，更新文本位置
  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // 更新第一个文本集的位置（可以扩展为更新当前选中的文本集）
    updateTextSet(textSets[0].id, 'position', { x, y });
  };

  // 计算图片显示尺寸以适应预览区域，减少空白
  const calculateImageDimensions = () => {
    if (!imageDimensions.width || !imageDimensions.height) return {};

    const previewArea = document.querySelector('.preview-area');
    if (!previewArea) return {};

    const containerWidth = previewArea.clientWidth - 40; // 减少左右边距
    const containerHeight = previewArea.clientHeight - 40; // 减少上下边距
    
    const imageRatio = imageDimensions.width / imageDimensions.height;
    const containerRatio = containerWidth / containerHeight;
    
    let width, height;
    
    if (imageRatio > containerRatio) {
      width = containerWidth * 0.9; // 稍微缩小以避免完全贴边
      height = containerWidth * 0.9 / imageRatio;
    } else {
      height = containerHeight * 0.9;
      width = containerHeight * 0.9 * imageRatio;
    }

    return {
      width: `${width}px`,
      height: `${height}px`
    };
  };

  // 添加下载分辨率选择
  const handleDownload = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // 设置画布尺寸为原始图片尺寸
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // 获取预览图元素和尺寸
      const previewImg = document.querySelector('img[alt="Background"]');
      if (!previewImg) return;

      // 计算预览图和原始图片的比例
      const scaleRatio = bgImg.height / previewImg.offsetHeight;
      
      // 绘制背景图
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // 绘制文本
      textSets.forEach(textSet => {
        ctx.save();
        
        // 计算位置
        const x = (textSet.position.x / 100) * canvas.width;
        const y = (textSet.position.y / 100) * canvas.height;

        // 根据比例计算字体大小
        const scaledFontSize = textSet.fontSize * scaleRatio;
        
        // 设置文本样式
        ctx.font = `${textSet.fontWeight} ${scaledFontSize}px Inter`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 移动到指定位置并旋转
        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        // 绘制文本
        ctx.fillText(textSet.text, 0, 0);

        ctx.restore();
      });

      // 绘制移除背景后的图片
      if (removedBgImageUrl) {
        const fgImg = new Image();
        fgImg.crossOrigin = "anonymous";
        fgImg.onload = () => {
          ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
          
          // 创建下载链接
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = 'text-behind-image.png';
          link.href = dataUrl;
          link.click();
        };
        fgImg.src = removedBgImageUrl;
      }
    };
    bgImg.src = selectedImage;
  };

  // 添加一个检测文本宽度的函数
  const measureText = (text, fontSize, fontWeight) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontWeight} ${fontSize}px Inter`;
    return context.measureText(text).width;
  };

  useEffect(() => {
    // 预加载 Inter 字体
    const font = new FontFace('Inter', 'url(/path/to/your/Inter-font.woff2)');
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  return (
    <Container>
      <ContentWrapper>
        <ControlPanel>
          <Title>{t('tools.textBehindImage.title')}</Title>

          <SettingsGroup>
            <GroupTitle>{t('tools.textBehindImage.imageUpload')}</GroupTitle>
            <ImageUploadArea onClick={() => fileInputRef.current.click()}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
              {t('tools.textBehindImage.uploadPrompt')}
            </ImageUploadArea>
            
            {/* 添加隐私提示 */}
            <PrivacyNote>
              {t('tools.textBehindImage.privacyNote')}
            </PrivacyNote>
          </SettingsGroup>

          {textSets.map(textSet => (
            <SettingsGroup key={textSet.id}>
              <GroupTitle>{t('tools.textBehindImage.textSettings')}</GroupTitle>
              
              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.text')}
                  <span>{textSet.text.length} {t('tools.textBehindImage.characters')}</span>
                </Label>
                <Input
                  type="text"
                  value={textSet.text}
                  onChange={(e) => updateTextSet(textSet.id, 'text', e.target.value)}
                  placeholder={t('tools.textBehindImage.textPlaceholder')}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.fontSize')}
                  <span>{textSet.fontSize}px</span>
                </Label>
                <Input
                  type="number"
                  value={textSet.fontSize}
                  onChange={(e) => updateTextSet(textSet.id, 'fontSize', Number(e.target.value))}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.fontWeight')}
                  <span>{textSet.fontWeight}</span>
                </Label>
                <Input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={textSet.fontWeight}
                  onChange={(e) => updateTextSet(textSet.id, 'fontWeight', Number(e.target.value))}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.rotation')}
                  <span>{textSet.rotation}°</span>
                </Label>
                <Input
                  type="range"
                  min="-180"
                  max="180"
                  value={textSet.rotation}
                  onChange={(e) => updateTextSet(textSet.id, 'rotation', Number(e.target.value))}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>{t('tools.textBehindImage.color')}</Label>
                <Input
                  type="color"
                  value={textSet.color}
                  onChange={(e) => updateTextSet(textSet.id, 'color', e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.opacity')}
                  <span>{textSet.opacity}</span>
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={textSet.opacity}
                  onChange={(e) => updateTextSet(textSet.id, 'opacity', Number(e.target.value))}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.positionX')}
                  <span>{textSet.position.x}%</span>
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={textSet.position.x}
                  onChange={(e) => updateTextSet(textSet.id, 'position', { 
                    ...textSet.position, 
                    x: Number(e.target.value) 
                  })}
                />
              </InputWrapper>

              <InputWrapper>
                <Label>
                  {t('tools.textBehindImage.positionY')}
                  <span>{textSet.position.y}%</span>
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={textSet.position.y}
                  onChange={(e) => updateTextSet(textSet.id, 'position', { 
                    ...textSet.position, 
                    y: Number(e.target.value) 
                  })}
                />
              </InputWrapper>
            </SettingsGroup>
          ))}

        </ControlPanel>

        <PreviewArea className="preview-area">
          <div className="preview-content">
            {imageLoading ? (
              <div className="loading-container">
                <span> {t('tools.textBehindImage.processing')}</span>
              </div>
            ) : selectedImage ? (
              <div style={{ 
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <DownloadButton onClick={() => handleDownload('original')}>
                  {t('tools.textBehindImage.download')}
                </DownloadButton>
                <img 
                  src={selectedImage} 
                  alt="Background" 
                  style={{
                    ...calculateImageDimensions(),
                    objectFit: 'contain',
                    position: 'relative'
                  }} 
                />
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}>
                  {textSets.map(textSet => {
                    const imageElement = document.querySelector('img[alt="Background"]');
                    const imageRect = imageElement?.getBoundingClientRect();
                    const imageWidth = imageRect?.width || 0;
                    
                    // 计算文本的中心字符位置
                    const text = textSet.text;
                    const centerIndex = Math.floor(text.length / 2);
                    const leftPart = text.substring(0, centerIndex);
                    const centerChar = text.charAt(centerIndex);
                    const rightPart = text.substring(centerIndex + 1);

                    return (
                      <div
                        key={textSet.id}
                        style={{
                          position: 'absolute',
                          left: `${textSet.position.x}%`,
                          top: `${textSet.position.y}%`,
                          transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                          color: textSet.color,
                          fontSize: `${textSet.fontSize}px`,
                          fontFamily: 'Inter',
                          fontWeight: textSet.fontWeight,
                          opacity: textSet.opacity,
                          zIndex: 1,
                          whiteSpace: 'pre',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transformOrigin: 'center',
                        }}
                      >
                        <span>{leftPart}</span>
                        <span style={{ 
                          display: 'inline-block',
                          position: 'relative'
                        }}>{centerChar}</span>
                        <span>{rightPart}</span>
                      </div>
                    );
                  })}
                </div>
                
                {removedBgImageUrl && (
                  <img
                    src={removedBgImageUrl}
                    alt="Foreground"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      ...calculateImageDimensions(),
                      objectFit: 'contain',
                      zIndex: 2
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="upload-prompt">
                {t('tools.textBehindImage.noImage')}
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </PreviewArea>
      </ContentWrapper>
    </Container>
  );
}

export default TextBehindImage;