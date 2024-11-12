import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';

const SubtitleMaker = () => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState(null);
  const [subtitles, setSubtitles] = useState([{ text: '' }]);
  const canvasRef = useRef(null);
  const [finalImage, setFinalImage] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    fontSize: 48,
    lineHeight: 100,
    strokeWidth: 2,
    textColor: '#FFE135',
    strokeColor: '#000000'
  });

  // 预设的字幕颜色选项 - 只保留最常用的几个
  const presetColors = [
    { name: t('tools.subtitleGenerator.presetColors.classicYellow'), value: '#FFE135' },
    { name: t('tools.subtitleGenerator.presetColors.pureWhite'), value: '#FFFFFF' },
    { name: t('tools.subtitleGenerator.presetColors.vividOrange'), value: '#FFA500' },
    { name: t('tools.subtitleGenerator.presetColors.neonGreen'), value: '#ADFF2F' },
    { name: t('tools.subtitleGenerator.presetColors.lightBlue'), value: '#00FFFF' },
    { name: t('tools.subtitleGenerator.presetColors.brightPink'), value: '#FF69B4' },
  ];

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  // 更新字幕内容
  const updateSubtitle = (index, text) => {
    const newSubtitles = [...subtitles];
    newSubtitles[index] = { text };
    setSubtitles(newSubtitles);
  };

  // 删除字幕行
  const removeSubtitleLine = (index) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  // 增加字幕行
  const addSubtitleLine = () => {
    setSubtitles([...subtitles, { text: '' }]);
  };

  // 绘制字幕到canvas
useEffect(() => {
        if (imageSrc) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = imageSrc;
            image.onload = () => {
            // 计算总高度
            const totalHeight = image.height +
                subtitles.slice(1).length * (globalSettings.lineHeight + 1);
            
            canvas.width = image.width;
            canvas.height = totalHeight;
            
            // 绘制图片
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            
            // 获取第一行字幕区域的背景图像数据
            const subtitleBackgroundData = ctx.getImageData(
                0,
                image.height - globalSettings.lineHeight,
                canvas.width,
                globalSettings.lineHeight
            );
            
            // 设置字体和对齐方式
            ctx.textAlign = 'center';
            ctx.font = `${globalSettings.fontSize}px Arial`;
            ctx.lineWidth = globalSettings.strokeWidth;
            
            // 绘制第一行字幕
            let yPosition = image.height - globalSettings.lineHeight;
            
            ctx.strokeStyle = globalSettings.strokeColor;
            ctx.fillStyle = globalSettings.textColor;
            const firstTextY = yPosition + globalSettings.lineHeight / 2 + globalSettings.fontSize / 3;
            ctx.strokeText(subtitles[0].text, canvas.width / 2, firstTextY);
            ctx.fillText(subtitles[0].text, canvas.width / 2, firstTextY);
            
            // 设置 yPosition 为图片底部，准备绘制后续字幕
            yPosition = image.height;
            
            // 绘制后续字幕行
            subtitles.slice(1).forEach((subtitle) => {
                // 绘制分隔线
                ctx.fillStyle = '#e5e7eb';
                ctx.fillRect(0, yPosition, canvas.width, 1);
                yPosition += 0;
                
                // 绘制背景（使用第一行字幕的背景）
                ctx.putImageData(subtitleBackgroundData, 0, yPosition);
                
                // 绘制字幕文字
                ctx.strokeStyle = globalSettings.strokeColor;
                ctx.fillStyle = globalSettings.textColor;
                const textY = yPosition + globalSettings.lineHeight / 2 + globalSettings.fontSize / 3;
                ctx.strokeText(subtitle.text, canvas.width / 2, textY);
                ctx.fillText(subtitle.text, canvas.width / 2, textY);
                
                yPosition += globalSettings.lineHeight;
            });
            
            setFinalImage(canvas.toDataURL('image/png'));
        };
    }
    }, [imageSrc, subtitles, globalSettings]);

  // 下载最终的图片
  const downloadImage = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.href = finalImage;
      link.download = 'subtitle-image.png';
      link.click();
    }
  }

  return (
    <Container>
      <SettingsPanel>
        <h3>{t('tools.subtitleGenerator.uploadImage')}</h3>
        <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
        
        {imageSrc && (
          <>
            <h3>{t('tools.subtitleGenerator.globalSettings')}</h3>
            <SettingGroup>
              <label>{t('tools.subtitleGenerator.fontColor')}</label>
              <ColorPickerContainer>
                <ColorInput
                  type="color"
                  value={globalSettings.textColor}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    textColor: e.target.value
                  })}
                />
                <ColorPresets>
                  {presetColors.map((color) => (
                    <ColorPresetButton
                      key={color.value}
                      $color={color.value}
                      onClick={() => setGlobalSettings({
                        ...globalSettings,
                        textColor: color.value
                      })}
                      title={color.name}
                    />
                  ))}
                </ColorPresets>
              </ColorPickerContainer>
            </SettingGroup>

            <SettingGroup>
              <label>{t('tools.subtitleGenerator.fontSize')}: {globalSettings.fontSize}px</label>
              <RangeInput
                type="range"
                value={globalSettings.fontSize}
                onChange={(e) => setGlobalSettings({
                  ...globalSettings,
                  fontSize: parseInt(e.target.value)
                })}
                min="48"
                max="120"
              />
            </SettingGroup>

            <SettingGroup>
              <label>{t('tools.subtitleGenerator.subtitleHeight')}: {globalSettings.lineHeight}px</label>
              <RangeInput
                type="range"
                value={globalSettings.lineHeight}
                onChange={(e) => setGlobalSettings({
                  ...globalSettings,
                  lineHeight: parseInt(e.target.value)
                })}
                min="60"
                max="160"
              />
            </SettingGroup>

            <h3>{t('tools.subtitleGenerator.subtitleSettings')}</h3>
            {subtitles.map((subtitle, index) => (
              <SubtitleInput key={index}>
                <input
                  type="text"
                  value={subtitle.text}
                  onChange={(e) => updateSubtitle(index, e.target.value)}
                  placeholder={`字幕 ${index + 1}`}
                />
                {index > 0 && (
                  <DeleteButton onClick={() => removeSubtitleLine(index)}>
                    删除
                  </DeleteButton>
                )}
              </SubtitleInput>
            ))}
            <Button onClick={addSubtitleLine}>{t('tools.subtitleGenerator.addSubtitleLine')}</Button>
          </>
        )}
      </SettingsPanel>

      <PreviewPanel>
        <h3>{t('tools.subtitleGenerator.preview')}</h3>
        {finalImage && (
          <>
            <PreviewImage src={finalImage} alt="Preview" />
            <Button onClick={downloadImage}>{t('tools.subtitleGenerator.downloadImage')}</Button>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </PreviewPanel>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SettingsPanel = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const PreviewPanel = styled.div`
  flex: 1;
  text-align: center;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
`;

const DeleteButton = styled(Button)`
  background: #ef4444;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
`;

const SubtitleInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;

  input[type="text"] {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9rem;
  }
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  cursor: pointer;

  &::-webkit-file-upload-button {
    background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
  }
`;

const SettingGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  margin: 10px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #6366F1;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      background: #4F46E5;
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #6366F1;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      background: #4F46E5;
    }
  }

  &::-ms-thumb {
    width: 18px;
    height: 18px;
    background: #6366F1;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      background: #4F46E5;
    }
  }
`;

const ColorPickerContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ColorInput = styled.input`
  -webkit-appearance: none;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 0;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
  }
`;

const ColorPresets = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ColorPresetButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export default SubtitleMaker;
