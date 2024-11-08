import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

// 更新中文字体数组，包含显示名称和 CSS 字体族名称
const chineseFonts = [
    { name: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
    { name: '无衬线', value: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif' },
    { name: '衬线', value: 'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, serif' },
    { name: '等宽', value: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, "Noto Sans Mono CJK SC", monospace' },
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
  { name: '白色', value: '#FFFFFF' },
  { name: '黑色', value: '#333333' }, // 修改为深灰色
  { name: '黄色纸张', value: '#fdf6e3' },
  { name: '自定义', value: 'custom' },
];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  justify-content: center;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const TitleLabel = styled.label`
  font-size: 16px; // 增大字体大小
  color: #1677FF; // 设置字体颜色为深色
`;


const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PreviewContainer = styled.div`
  flex: 1;
  background-color: ${(props) => props.$bgColor || '#333333'}; // 使用短暂属性
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  color: ${(props) => props.$fontColor || '#b8b83b'}; // 使用短暂属性
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
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
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 16px;
  background-color: #fff;
`;

const ColorInput = styled.input`
  width: 100%;
  padding: 5px;
  border: none;
  background-color: transparent;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

const DownloadButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;

function QuoteCard() {
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
      {/* 左侧输入区域 */}
      <InputContainer>
        <TitleLabel>名言卡片生成器</TitleLabel>
        <InputText
          placeholder="请输入中文名人名言"
          value={chineseText}
          onChange={(e) => setChineseText(e.target.value)}
        />
        <InputText
          placeholder="请输入英文翻译"
          value={englishText}
          onChange={(e) => setEnglishText(e.target.value)}
        />
        <InputField
          placeholder="请输入作者姓名"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        {/* 字体选择 */}
        <Label>选择中文字体:</Label>
        <Select value={chineseFont} onChange={(e) => setChineseFont(e.target.value)}>
          {chineseFonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </Select>

        <Label>选择英文字体:</Label>
        <Select value={englishFont} onChange={(e) => setEnglishFont(e.target.value)}>
          {englishFonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </Select>

        {/* 字体颜色选择 */}
        <Label>选择字体颜色:</Label>
        <ColorInput
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />

        {/* 作者颜色选择 */}
        <Label>选择作者颜色:</Label>
        <ColorInput
          type="color"
          value={authorColor}
          onChange={(e) => setAuthorColor(e.target.value)}
        />

        {/* 背景色选择 */}
        <Label>选择背景颜色:</Label>
        <Select
          value={
            backgroundOptions.some((option) => option.value === bgColor)
              ? bgColor
              : 'custom'
          }
          onChange={handleBackgroundChange}
        >
          {backgroundOptions.map((option) => (
            <option key={option.name} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
        {bgColor === 'custom' && (
          <>
            <Label>选择自定义背景颜色:</Label>
            <ColorInput
              type="color"
              value={customBgColor}
              onChange={(e) => setBgColor(e.target.value)}
              title="选择自定义背景颜色"
            />
          </>
        )}

        {/* 下载按钮 */}
        <DownloadButton onClick={handleDownload}>
          下载图片
        </DownloadButton>
      </InputContainer>

      {/* 右侧预览区域 */}
      <PreviewContainer
        $bgColor={bgColor}
        $fontColor={fontColor}
        ref={previewRef}
      >
        <QuoteText $color={fontColor} $fontFamily={chineseFont}>
          {chineseText || '请输入中文名人名言'}
        </QuoteText>
        <QuoteText $color={fontColor} $fontFamily={englishFont}>
          {englishText || 'Enter the English translation here.'}
        </QuoteText>
        <QuoteAuthor $color={authorColor} $fontFamily={englishFont}>
          —— {author || '作者姓名'}
        </QuoteAuthor>
      </PreviewContainer>
    </Container>
  );
}

export default QuoteCard;
