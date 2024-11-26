import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import imageCompression from 'browser-image-compression';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

// 复用 MarkdownToImage 的容器样式
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

const Panel = styled.div`
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

const DropZone = styled.div`
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

  input {
    display: none;
  }
`;

const SettingsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #4B5563;
  font-weight: 500;
`;

const Slider = styled.input`
  width: 200px;
  height: 4px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #6366F1;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ImageInfo = styled.div`
  font-size: 0.9rem;
  color: #4B5563;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  color: #6366F1;
  font-size: 12px;
  cursor: pointer;
  margin-left: 4px;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #4B5563;
  width: max-content;
  max-width: 250px;
  z-index: 10;
  border: 1px solid rgba(99, 102, 241, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    right: 10px;
    width: 8px;
    height: 8px;
    background: white;
    transform: rotate(45deg);
    border-left: 1px solid rgba(99, 102, 241, 0.1);
    border-top: 1px solid rgba(99, 102, 241, 0.1);
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 260px;
`;

const SliderValue = styled.span`
  min-width: 60px;
  text-align: right;
`;

const formatFileSize = (bytes) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }
  return `${Math.round(bytes / 1024)}KB`;
};

// 新增样式组件
const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .remove-button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #EF4444;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    
    &:hover {
      background: #DC2626;
    }
  }
`;

const ComparisonView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImageSection = styled.div`
  position: relative;
  
  .label {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
`;

const StatsInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  background: #F3F4F6;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;

  .stat-item {
    display: flex;
    flex-direction: column;
    
    .label {
      color: #6B7280;
      font-size: 0.75rem;
    }
    
    .value {
      color: #111827;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      cursor: pointer;
      
      .tooltip {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #1F2937;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 10;
        margin-bottom: 4px;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        
        &::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: #1F2937 transparent transparent transparent;
        }
      }

      &:hover .tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
    
    &.highlight {
      .value {
        color: #059669;
      }
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;

  .progress {
    height: 100%;
    background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
    transition: width 0.3s ease;
  }
`;

const BatchActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const MAX_IMAGES = 10;

// 添加文件名处理的工具函数
const truncateFilename = (filename, maxLength = 10) => {
  if (filename.length <= maxLength) return filename;
  const extension = filename.split('.').pop();
  const name = filename.substring(0, filename.lastIndexOf('.'));
  const truncated = name.substring(0, maxLength - extension.length - 3) + '...';
  return `${truncated}.${extension}`;
};

function ImageCompressor() {
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [images, setImages] = useState([]); // 修改为数组存储多张图片
  const [compressedImages, setCompressedImages] = useState([]);
  const [settings, setSettings] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    preserveExif: true
  });
  const [processing, setProcessing] = useState({}); // 记录每张图片的处理状态
  const [tooltips, setTooltips] = useState({
    quality: false,
    maxSize: false
  });
  const [error, setError] = useState(''); // 添加错误信息状态

  const tooltipRefs = {
    quality: useRef(null),
    maxSize: useRef(null)
  };

  // 修改点击外部关闭处理
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRefs.quality.current && !tooltipRefs.quality.current.contains(event.target)) {
        setTooltips(prev => ({ ...prev, quality: false }));
      }
      if (tooltipRefs.maxSize.current && !tooltipRefs.maxSize.current.contains(event.target)) {
        setTooltips(prev => ({ ...prev, maxSize: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // 检查当前总数是否超过限制
    if (images.length + files.length > MAX_IMAGES) {
      setError(t('tools.imageCompressor.maxImagesError', { max: MAX_IMAGES }));
      return;
    }
    
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      size: file.size,
      name: file.name
    }));
    
    setImages(prev => [...prev, ...newImages]);
    setError(''); // 清除错误信息
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setCompressedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleCompress = async () => {
    if (images.length === 0) return;
    
    // 清除之前的压缩结果，允许重新压缩
    setCompressedImages([]);
    
    for (const image of images) {
      setProcessing(prev => ({ ...prev, [image.id]: 0 }));
      
      try {
        const compressedFile = await imageCompression(image.file, {
          ...settings,
          useWebWorker: true,
          onProgress: (progress) => {
            setProcessing(prev => ({ ...prev, [image.id]: progress }));
          }
        });
        
        const compressedImage = {
          id: image.id,
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          size: compressedFile.size,
          name: compressedFile.name,
          originalSize: image.size,
          compressionSettings: { ...settings } // 保存压缩时使用的设置
        };
        
        setCompressedImages(prev => [...prev, compressedImage]);
      } catch (error) {
        console.error('Compression failed:', error);
      } finally {
        setProcessing(prev => {
          const newProcessing = { ...prev };
          delete newProcessing[image.id];
          return newProcessing;
        });
      }
    }
  };

  const handleDownloadAll = () => {
    compressedImages.forEach(image => {
      const link = document.createElement('a');
      link.href = image.preview;
      link.download = `compressed_${image.name}`;
      link.click();
    });
  };

  const clearAll = () => {
    setImages([]);
    setCompressedImages([]);
    setProcessing({});
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.imageCompressor.title')}
        description={t('tools.imageCompressor.description')}
      />
      <Container>
        <ContentWrapper>
          <Panel>
            <Title>{t('tools.imageCompressor.title')}</Title>
            
            <DropZone 
              onClick={() => document.getElementById('imageInput').click()}
              style={{ borderColor: error ? '#EF4444' : undefined }}
            >
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              {error ? (
                <div style={{ color: '#EF4444' }}>{error}</div>
              ) : (
                <>
                  {t('tools.imageCompressor.dropzoneText')}
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6B7280', 
                    marginTop: '0.5rem' 
                  }}>
                    {t('tools.imageCompressor.maxImagesHint', { max: MAX_IMAGES })}
                  </div>
                </>
              )}
            </DropZone>

            {images.length > 0 && (
              <>
                <SettingsGroup>
                  <Setting>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Label>{t('tools.imageCompressor.quality')}</Label>
                      <div ref={tooltipRefs.quality}>
                        <InfoIcon onClick={(e) => {
                          e.stopPropagation();
                          setTooltips(prev => ({
                            quality: !prev.quality,
                            maxSize: false
                          }));
                        }}>?</InfoIcon>
                        {tooltips.quality && (
                          <Tooltip>
                            {t('tools.imageCompressor.qualityTooltip')}
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <SliderContainer>
                      <Slider
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={settings.quality}
                        onChange={(e) => setSettings({
                          ...settings,
                          quality: parseFloat(e.target.value)
                        })}
                      />
                      <SliderValue>{Math.round(settings.quality * 100)}%</SliderValue>
                    </SliderContainer>
                  </Setting>
                  
                  <Setting>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Label>{t('tools.imageCompressor.maxSize')}</Label>
                      <div ref={tooltipRefs.maxSize}>
                        <InfoIcon onClick={(e) => {
                          e.stopPropagation();
                          setTooltips(prev => ({
                            quality: false,
                            maxSize: !prev.maxSize
                          }));
                        }}>?</InfoIcon>
                        {tooltips.maxSize && (
                          <Tooltip>
                            {t('tools.imageCompressor.maxSizeTooltip')}
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <SliderContainer>
                      <Slider
                        type="range"
                        min="0"
                        max="1024"
                        step="1"
                        value={settings.maxSizeMB * 1024}
                        onChange={(e) => setSettings({
                          ...settings,
                          maxSizeMB: parseFloat(e.target.value) / 1024
                        })}
                      />
                      <SliderValue>
                        {`${Math.round(settings.maxSizeMB * 1024)}KB`}
                      </SliderValue>
                    </SliderContainer>
                  </Setting>
                </SettingsGroup>

                <BatchActions>
                  <Button 
                    onClick={handleCompress}
                    disabled={Object.keys(processing).length > 0}
                  >
                    {Object.keys(processing).length > 0 ? 
                      t('tools.imageCompressor.compressing') : 
                      compressedImages.length > 0 ?
                        t('tools.imageCompressor.recompress') :
                        t('tools.imageCompressor.compress')
                    }
                  </Button>
                  
                  {compressedImages.length > 0 && (
                    <>
                      <Button onClick={handleDownloadAll}>
                        {t('tools.imageCompressor.downloadAll')}
                      </Button>
                      <Button onClick={clearAll}>
                        {t('tools.imageCompressor.clearAll')}
                      </Button>
                    </>
                  )}
                </BatchActions>

                <ImageList>
                  {images.map(image => {
                    const compressedImage = compressedImages.find(img => img.id === image.id);
                    const progress = processing[image.id] || 0;
                    
                    return (
                      <ImageCard key={image.id}>
                        <button 
                          className="remove-button"
                          onClick={() => removeImage(image.id)}
                        >
                          ×
                        </button>
                        
                        <ComparisonView>
                          <ImageSection>
                            <span className="label">{t('tools.imageCompressor.original')}</span>
                            <ImagePreview>
                              <img src={image.preview} alt={image.name} />
                            </ImagePreview>
                          </ImageSection>

                          {compressedImage && (
                            <ImageSection>
                              <span className="label">{t('tools.imageCompressor.compressed')}</span>
                              <ImagePreview>
                                <img src={compressedImage.preview} alt={compressedImage.name} />
                              </ImagePreview>
                            </ImageSection>
                          )}
                        </ComparisonView>

                        <StatsInfo>
                          <div className="stat-item">
                            <span className="label">{t('tools.imageCompressor.originalSize')}</span>
                            <span className="value">{formatFileSize(image.size)}</span>
                          </div>
                          {compressedImage && (
                            <>
                              <div className="stat-item">
                                <span className="label">{t('tools.imageCompressor.compressedSize')}</span>
                                <span className="value">{formatFileSize(compressedImage.size)}</span>
                              </div>
                              <div className="stat-item">
                                <span className="label">{t('tools.imageCompressor.filename')}</span>
                                <span className="value">
                                  {truncateFilename(image.name)}
                                  <span className="tooltip">{image.name}</span>
                                </span>
                              </div>
                              <div className="stat-item highlight">
                                <span className="label">{t('tools.imageCompressor.savedSpace')}</span>
                                <span className="value">
                                  {((1 - compressedImage.size / image.size) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </>
                          )}
                        </StatsInfo>

                        {processing[image.id] !== undefined && (
                          <ProgressBar>
                            <div 
                              className="progress" 
                              style={{ width: `${progress * 100}%` }} 
                            />
                          </ProgressBar>
                        )}
                      </ImageCard>
                    );
                  })}
                </ImageList>
              </>
            )}
          </Panel>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default ImageCompressor; 