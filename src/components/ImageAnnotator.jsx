import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import DOMPurify from 'dompurify';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 4rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }
  
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
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  gap: 1rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 300px;
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333333;
`;

const UploadSection = styled(Section)`
  margin-bottom: 1rem;
`;

const CoordinatesSection = styled(Section)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const UploadInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px dashed rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  
  &:hover, &:focus {
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(255, 255, 255, 0.8);
  }
`;

const UrlInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  
  &:hover, &:focus {
    border-color: rgba(99, 102, 241, 0.6);
    outline: none;
  }
`;

const CoordinatesEditor = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  font-family: 'SF Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  color: #1a1a1a;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.6);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const PreviewContainer = styled(InputContainer)`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-bottom: 1rem;
  z-index: 20;
`;

const ImagePreview = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
  overflow: auto;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const AnnotatedImage = styled.div`
  position: relative;
  display: inline-block;
  max-height: 100%;
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 200px);
  object-fit: contain;
  
  @media (min-width: 1200px) {
    max-height: calc(100vh - 150px);
  }
  
  @media (max-width: 768px) {
    max-height: calc(60vh - 100px);
  }
`;

const BoundingBox = styled.div`
  position: absolute;
  border: ${props => `${props.lineWidth || 3}px solid ${props.color || '#FF0000'}`};
  background-color: ${props => props.color || '#FF0000'}20;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
  opacity: ${props => props.isSelected ? 1 : props.isOtherSelected ? 0.3 : 1};
  transition: opacity 0.2s ease;
`;

const BoxLabel = styled.span`
  position: absolute;
  ${props => props.position === 'bottom' ? 'top: calc(100% + 4px);' : 'top: -24px;'}
  left: 0;
  background-color: ${props => props.color || '#FF0000'};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 30;
`;

const InfoMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

const ImageInfo = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 20;
  margin-top: 8px;
`;

const DownloadButton = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
  font-size: 0.9rem;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};

  &:hover {
    opacity: 0.9;
  }
`;

const ResetButton = styled.button`
  background: white;
  color: #4F46E5;
  padding: 0.5rem 1rem;
  border: 1px solid #4F46E5;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.9rem;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};

  &:hover {
    background: #F5F7FF;
  }
`;

const SettingsSection = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LineWidthControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RangeInput = styled.input`
  width: 100%;
  max-width: 200px;
`;

// Box colors for different annotations
const COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', 
  '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#A2845E'
];

function ImageAnnotator() {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [coordinates, setCoordinates] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [useCors, setUseCors] = useState(true);
  const [lineWidth, setLineWidth] = useState(3);
  const previewRef = useRef(null);
  const imageRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [parsedBoxes, setParsedBoxes] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const isLoading = usePageLoading();

  // Handle box selection
  const handleBoxClick = (boxId) => {
    setSelectedBoxId(selectedBoxId === boxId ? null : boxId);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setUploadedImage(null);
    setImageError('');
    setUseCors(true);
  };

  // Process image URL to handle CORS
  const processImageUrl = (url) => {
    if (!url) return '';
    
    if (!useCors) {
      return url;
    }
    
    try {
      // For URLs that might have CORS issues, we can use a proxy
      // This is a simple example - in production you might want to use your own proxy
      const urlObj = new URL(url);
      if (urlObj.origin !== window.location.origin) {
        // For demo purposes we're using a public CORS proxy
        // In production, replace this with your own proxy service
        return `https://cors-anywhere.herokuapp.com/${url}`;
      }
    } catch (e) {
      // Invalid URL, just return as is
    }
    
    return url;
  };

  // Reset all states
  const handleReset = () => {
    setSelectedBoxId(null);
    setImageError('');
  };

  // Handle coordinates input
  const handleCoordinatesChange = (e) => {
    setCoordinates(e.target.value);
  };

  // Parse the coordinates when either the coordinates text or image changes
  useEffect(() => {
    if (!coordinates.trim()) {
      setParsedBoxes([]);
      setError('');
      return;
    }

    try {
      // Try to parse as JSON
      let boxesArray;
      try {
        boxesArray = JSON.parse(coordinates);
      } catch (e) {
        // If not valid JSON, try to parse as plain text with numbers
        boxesArray = coordinates
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            const nums = line.match(/\d+(\.\d+)?/g);
            if (!nums || nums.length < 4) {
              throw new Error(`Invalid format in line: ${line}`);
            }
            return nums.slice(0, 4).map(Number);
          });
      }

      // Validate the structure
      if (!Array.isArray(boxesArray)) {
        throw new Error('Input must be an array of coordinates');
      }

      // Validate each box
      boxesArray.forEach((box, index) => {
        if (!Array.isArray(box) && typeof box !== 'object') {
          throw new Error(`Box at index ${index} is not an array or object`);
        }
        
        let x1, y1, x2, y2;
        
        if (Array.isArray(box)) {
          [x1, y1, x2, y2] = box;
        } else if (typeof box === 'object') {
          // Support for different object formats
          if ('x1' in box && 'y1' in box && 'x2' in box && 'y2' in box) {
            x1 = box.x1;
            y1 = box.y1;
            x2 = box.x2;
            y2 = box.y2;
          } else if ('xmin' in box && 'ymin' in box && 'xmax' in box && 'ymax' in box) {
            x1 = box.xmin;
            y1 = box.ymin;
            x2 = box.xmax;
            y2 = box.ymax;
          } else {
            throw new Error(`Box at index ${index} has invalid object format`);
          }
        }

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
          throw new Error(`Box at index ${index} has invalid coordinates`);
        }
      });

      // Standardize to array format
      const standardBoxes = boxesArray.map((box, index) => {
        if (Array.isArray(box)) {
          return { 
            id: index,
            x1: box[0], 
            y1: box[1], 
            x2: box[2], 
            y2: box[3],
            color: COLORS[index % COLORS.length]
          };
        } else {
          return {
            id: index,
            x1: box.x1 || box.xmin,
            y1: box.y1 || box.ymin,
            x2: box.x2 || box.xmax,
            y2: box.y2 || box.ymax,
            color: COLORS[index % COLORS.length]
          };
        }
      });

      setParsedBoxes(standardBoxes);
      setError('');
    } catch (err) {
      setParsedBoxes([]);
      setError(err.message);
    }
  }, [coordinates, imageUrl, uploadedImage]);

  // Update image size when image loads
  const handleImageLoad = (e) => {
    const img = e.target;
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setImageError('');
  };

  // Handle image load error
  const handleImageError = () => {
    if (useCors && imageUrl) {
      // If loading with CORS fails, try without CORS
      setUseCors(false);
      setImageError(t('tools.imageAnnotator.tryingWithoutCors') || '正在尝试不使用跨域加载...');
    } else {
      setImageError(t('tools.imageAnnotator.imageLoadError') || '图片加载失败，可能是跨域问题或图片地址无效');
      setImageSize({ width: 0, height: 0 });
    }
  };

  // Handle image clicks (to deselect)
  const handleImageClick = (e) => {
    // Only handle clicks directly on the image, not on boxes
    if (e.target === imageRef.current) {
      setSelectedBoxId(null);
    }
  };

  // Handle download of annotated image
  const handleDownload = async () => {
    const previewElement = previewRef.current;
    
    if (!previewElement) return;

    try {
      // Hide all coordinate labels before capture
      const currentSelectedId = selectedBoxId;
      setSelectedBoxId(null);
      
      // Wait for React to update the DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Restore selected box
      setSelectedBoxId(currentSelectedId);

      const link = document.createElement('a');
      link.download = 'annotated-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  // Handle line width change
  const handleLineWidthChange = (e) => {
    setLineWidth(parseInt(e.target.value, 10));
  };

  const currentImageUrl = uploadedImage || (imageUrl.trim() && (useCors ? processImageUrl(imageUrl) : imageUrl));
  const hasImage = !!currentImageUrl;
  const hasBoxes = parsedBoxes.length > 0;

  // When component mounts or window resizes, adjust container height
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current && imageRef.current) {
        // Update any responsive layout if needed
        setImageSize(prev => ({...prev})); // Force re-render to update scaled dimensions
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.imageAnnotator.title')}
        description={t('tools.imageAnnotator.description')}
      />
      <Container>
        <ContentWrapper>
          <InputContainer>
            <TitleLabel>{t('tools.imageAnnotator.title')}</TitleLabel>
            
            {/* Image upload section */}
            <UploadSection>
              <Label>{t('tools.imageAnnotator.uploadLabel')}</Label>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </UploadSection>
            
            {/* Image URL section */}
            <UploadSection>
              <Label>{t('tools.imageAnnotator.urlLabel')}</Label>
              <UrlInput
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder={t('tools.imageAnnotator.urlPlaceholder')}
              />
            </UploadSection>

            {/* Line Width Control */}
            <SettingsSection>
              <LineWidthControl>
                <Label>{t('tools.imageAnnotator.lineWidth') || '线条粗细'}: {lineWidth}px</Label>
                <RangeInput
                  type="range"
                  min="1"
                  max="10"
                  value={lineWidth}
                  onChange={handleLineWidthChange}
                />
              </LineWidthControl>
            </SettingsSection>

            {/* Coordinates input section */}
            <CoordinatesSection>
              <Label>
                {t('tools.imageAnnotator.coordinatesLabel')}
              </Label>
              <CoordinatesEditor
                value={coordinates}
                onChange={handleCoordinatesChange}
                placeholder={t('tools.imageAnnotator.coordinatesPlaceholder')}
              />
              {error && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  {error}
                </div>
              )}
            </CoordinatesSection>
          </InputContainer>

          <PreviewContainer>
            <ButtonsContainer>
              <DownloadButton 
                onClick={handleDownload}
                visible={hasImage && hasBoxes}
              >
                {t('tools.imageAnnotator.downloadButton')}
              </DownloadButton>
              
              <ResetButton
                onClick={handleReset}
                visible={hasImage && hasBoxes}
              >
                {t('tools.imageAnnotator.resetView') || '恢复视图'}
              </ResetButton>
            </ButtonsContainer>
            
            <ImagePreview ref={previewRef}>
              {hasImage ? (
                <AnnotatedImage>
                  <Image 
                    src={currentImageUrl} 
                    alt="Uploaded image"
                    ref={imageRef}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onClick={handleImageClick}
                    crossOrigin={useCors ? "anonymous" : null}
                  />
                  {imageError && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '4px',
                      maxWidth: '80%',
                      textAlign: 'center'
                    }}>
                      {imageError}
                    </div>
                  )}
                  {imageSize.width > 0 && (
                    <ImageInfo>
                      {imageSize.width} × {imageSize.height}
                    </ImageInfo>
                  )}
                  {hasBoxes && parsedBoxes.map((box) => {
                    // Determine label position based on box position
                    const isNearTop = box.y1 < 30;
                    
                    // Calculate the scaling ratio between original image and displayed image
                    const displayedWidth = imageRef.current ? imageRef.current.width : 0;
                    const displayedHeight = imageRef.current ? imageRef.current.height : 0;
                    
                    const scaleX = imageSize.width > 0 ? displayedWidth / imageSize.width : 1;
                    const scaleY = imageSize.height > 0 ? displayedHeight / imageSize.height : 1;
                    
                    // Scale the coordinates
                    const scaledX1 = box.x1 * scaleX;
                    const scaledY1 = box.y1 * scaleY;
                    const scaledX2 = box.x2 * scaleX;
                    const scaledY2 = box.y2 * scaleY;
                    
                    return (
                      <BoundingBox
                        key={box.id}
                        color={box.color}
                        lineWidth={lineWidth}
                        isSelected={selectedBoxId === box.id}
                        isOtherSelected={selectedBoxId !== null && selectedBoxId !== box.id}
                        onClick={() => handleBoxClick(box.id)}
                        style={{
                          left: `${scaledX1}px`,
                          top: `${scaledY1}px`,
                          width: `${scaledX2 - scaledX1}px`,
                          height: `${scaledY2 - scaledY1}px`
                        }}
                      >
                        <BoxLabel
                          color={box.color}
                          visible={selectedBoxId === box.id}
                          position={isNearTop ? 'bottom' : 'top'}
                        >
                          ({box.x1},{box.y1})-({box.x2},{box.y2})
                        </BoxLabel>
                      </BoundingBox>
                    );
                  })}
                </AnnotatedImage>
              ) : (
                <InfoMessage>
                  <div>{t('tools.imageAnnotator.noImageMessage')}</div>
                </InfoMessage>
              )}
            </ImagePreview>
          </PreviewContainer>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default ImageAnnotator; 