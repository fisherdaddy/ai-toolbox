import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import { useTranslation } from '../js/i18n';
import { useScrollToTop } from '../hooks/useScrollToTop';

// 更新中文字体数组，包含显示名称和 CSS 字体族名称
const chineseFonts = [
    { name: 'system', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
    { name: 'sans', value: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif' },
    { name: 'serif', value: 'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, serif' },
    { name: 'mono', value: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, "Noto Sans Mono CJK SC", monospace' },
  ];

// 定义可选的英文字体
const englishFonts = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Courier New', value: 'Courier New' },
];

// 定义可选的背景颜色
const backgroundOptions = [
  { name: 'white', value: '#FFFFFF' },
  { name: 'dark', value: '#333333' }, // 修改为深灰色
  { name: 'paper', value: '#fdf6e3' },
];

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

const InputContainer = styled.div`
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

const TitleLabel = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const PreviewContainer = styled.div`
  flex: 1;
  background: ${(props) => props.$bgColor || '#333333'};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  height: fit-content;
  align-self: flex-start;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    width: 100%;
  }
`;

const QuoteText = styled.div`
  font-size: clamp(16px, 2.5vw, 24px);
  margin-bottom: 16px;
  color: ${(props) => props.$color || '#b8b83b'}; // 使用短暂属性
  text-align: center;
  line-height: 1.5;
  font-family: ${(props) => props.$fontFamily}, serif; // 使用短暂属性
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const QuoteAuthor = styled.div`
  font-size: clamp(14px, 2vw, 18px);
  color: ${(props) => props.$color || '#888'}; // 使用短暂属性
  text-align: center;
  font-family: ${(props) => props.$fontFamily}, sans-serif; // 使用短暂属性
  margin-top: 20px;
`;

const InputText = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 16px;
  font-family: Arial, sans-serif;
  resize: vertical;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover, &:focus {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

const ColorInput = styled.input`
  width: 100%;
  padding: 5px;
  border: none;
  background-color: transparent;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  display: block;
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
`;

function QuoteCard() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const [chineseText, setChineseText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [author, setAuthor] = useState('');

  const [chineseFont, setChineseFont] = useState('SimSun');
  const [englishFont, setEnglishFont] = useState('Arial');
  const [fontColor, setFontColor] = useState('#b8b83b');
  const [authorColor, setAuthorColor] = useState('#b8b83b');
  const [bgColor, setBgColor] = useState('#333333');
  const [customBgColor, setCustomBgColor] = useState('#FFFFFF');

  const previewRef = useRef(null);

  const handleBackgroundChange = (e) => {
    const value = e.target.value;
    if (value !== 'custom') {
      setBgColor(value);
    }
  };

  const handleDownload = () => {
    if (previewRef.current) {
      html2canvas(previewRef.current, {
        backgroundColor: null,
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'quote_card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch((err) => {
        console.error('图片下载失败:', err);
      });
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <InputContainer>
          <TitleLabel>{t('tools.quoteCard.title')}</TitleLabel>
          <InputText
            placeholder={t('tools.quoteCard.chinesePlaceholder')}
            value={chineseText}
            onChange={(e) => setChineseText(e.target.value)}
          />
          <InputText
            placeholder={t('tools.quoteCard.englishPlaceholder')}
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
          />
          <InputField
            placeholder={t('tools.quoteCard.authorPlaceholder')}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <Label>{t('tools.quoteCard.selectChineseFont')}:</Label>
          <Select value={chineseFont} onChange={(e) => setChineseFont(e.target.value)}>
            {chineseFonts.map((font) => (
              <option key={font.value} value={font.value}>
                {t(`tools.quoteCard.fonts.${font.name}`)}
              </option>
            ))}
          </Select>

          <Label>{t('tools.quoteCard.selectEnglishFont')}:</Label>
          <Select value={englishFont} onChange={(e) => setEnglishFont(e.target.value)}>
            {englishFonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </Select>

          <Label>{t('tools.quoteCard.selectFontColor')}:</Label>
          <ColorInput
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />

          <Label>{t('tools.quoteCard.selectAuthorColor')}:</Label>
          <ColorInput
            type="color"
            value={authorColor}
            onChange={(e) => setAuthorColor(e.target.value)}
          />

          <Label>{t('tools.quoteCard.selectBackground')}:</Label>
          <Select
            value={backgroundOptions.some((option) => option.value === bgColor) ? bgColor : 'custom'}
            onChange={handleBackgroundChange}
          >
            {backgroundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`tools.quoteCard.backgrounds.${option.name}`)}
              </option>
            ))}
          </Select>
          {bgColor === 'custom' && (
            <>
              <Label>{t('tools.quoteCard.customBackground')}:</Label>
              <ColorInput
                type="color"
                value={customBgColor}
                onChange={(e) => setBgColor(e.target.value)}
                title={t('tools.quoteCard.customBackground')}
              />
            </>
          )}

          <DownloadButton onClick={handleDownload}>
            {t('tools.quoteCard.downloadButton')}
          </DownloadButton>
        </InputContainer>

        <PreviewContainer $bgColor={bgColor} $fontColor={fontColor} ref={previewRef}>
          <QuoteText $color={fontColor} $fontFamily={chineseFont}>
            {chineseText || t('tools.quoteCard.defaultQuote')}
          </QuoteText>
          <QuoteText $color={fontColor} $fontFamily={englishFont}>
            {englishText || t('tools.quoteCard.defaultTranslation')}
          </QuoteText>
          <QuoteAuthor $color={authorColor} $fontFamily={englishFont}>
            —— {author || t('tools.quoteCard.defaultAuthor')}
          </QuoteAuthor>
        </PreviewContainer>
      </ContentWrapper>
    </Container>
  );
}

export default QuoteCard;
