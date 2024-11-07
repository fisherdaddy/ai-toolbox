import React, { useState } from 'react';
import '../styles/HandwriteGen.css';
import html2canvas from 'html2canvas';
import {
    Layout, Menu, Input, Select, Checkbox, Button, Slider, Typography, Row, Col
} from 'antd';

// 引入本地纸张背景图片
import Style1Img from '../data/handwrite/style1.png';
import Style2Img from '../data/handwrite/style2.png';
import Style3Img from '../data/handwrite/style3.png';

const { Header, Content, Sider } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

function HandwritingGenerator() {
    const [text, setText] = useState('');
    const [font, setFont] = useState("'XINYE'");
    const [paperType, setPaperType] = useState('Lined Paper'); // 默认值为横线纸
    const [paperBackground, setPaperBackground] = useState('None'); // 新增状态
    const [borderEnabled, setBorderEnabled] = useState(false);
    const [topMargin, setTopMargin] = useState(50);
    const [leftMargin, setLeftMargin] = useState(30);
    const [rightMargin, setRightMargin] = useState(30);
    const [fontSize, setFontSize] = useState(20);
    const [fontColor, setFontColor] = useState('#000080');
    const [textAlign, setTextAlign] = useState('left');
    const [lineSpacing, setLineSpacing] = useState(1.25);
    const [charSpacing, setCharSpacing] = useState(0);

    const handleGenerate = () => {
        const previewElement = document.querySelector('.preview-area');
        html2canvas(previewElement, {
            useCORS: true,
            backgroundColor: null,
            scale: 2, // 提高图片清晰度
            onclone: (clonedDoc) => {
                // 重新设置背景，确保CSS渐变被正确捕获
                const clonedPreview = clonedDoc.querySelector('.preview-area');
                clonedPreview.style.backgroundImage = getPaperBackground();
                clonedPreview.style.backgroundSize = getBackgroundSize();
                clonedPreview.style.backgroundRepeat = getBackgroundRepeat();
            },
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'handwriting.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    const getPaperBackground = () => {
        let backgrounds = [];

        // 根据纸张类型设置CSS渐变背景
        switch(paperType) {
            case 'Lined Paper':
                backgrounds.push(`linear-gradient(to bottom, transparent ${lineSpacing * fontSize - 1}px, #c0c0c0 1px)`);
                break;
            case 'Grid Paper':
                backgrounds.push(
                    `linear-gradient(to bottom, transparent ${lineSpacing * fontSize - 1}px, #c0c0c0 1px)`,
                    `linear-gradient(to right, transparent ${fontSize}px, #c0c0c0 1px)`
                );
                break;
            default:
                break;
        }

        // 如果用户选择了纸张背景，添加背景图片
        if (paperBackground !== 'None') {
            let backgroundImage;
            switch(paperBackground) {
                case 'Style1':
                    backgroundImage = `url(${Style1Img})`;
                    break;
                case 'Style2':
                    backgroundImage = `url(${Style2Img})`;
                    break;
                case 'Style3':
                    backgroundImage = `url(${Style3Img})`;
                    break;
                default:
                    break;
            }
            if (backgroundImage) {
                backgrounds.push(backgroundImage);
            }
        }

        if (backgrounds.length === 0) {
            return 'none';
        } else {
            return backgrounds.join(', ');
        }
    };

    const getBackgroundSize = () => {
        let sizes = [];
    
        switch(paperType) {
            case 'Lined Paper':
                sizes.push(`100% ${lineSpacing * fontSize}px`);
                break;
            case 'Grid Paper':
                sizes.push(`100% ${lineSpacing * fontSize}px`, `${lineSpacing * fontSize}px 100%`);
                break;
            default:
                break;
        }
    
        if (paperBackground !== 'None') {
            sizes.push('cover');
        }
    
        return sizes.join(', ');
    };
    

    const getBackgroundRepeat = () => {
        let repeats = [];

        // 对于纸张类型的CSS渐变背景，需要重复
        switch(paperType) {
            case 'Lined Paper':
                repeats.push('repeat-y');
                break;
            case 'Grid Paper':
                repeats.push('repeat-y', 'repeat-x');
                break;
            default:
                break;
        }

        // 对于纸张背景图片，设置为不重复或根据需要重复
        if (paperBackground !== 'None') {
            repeats.push('no-repeat');
        }

        return repeats.join(', ');
    };

    const backgroundOffset = -(lineSpacing * fontSize - fontSize);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={300} className="site-layout-background">
                <Menu mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">手写字体生成器</Menu.Item>
                </Menu>
                <div className="settings-section">
                    <div className="form-group">
                        <label>手写字体</label>
                        <Select value={font} onChange={setFont} style={{ width: '100%' }}>
                            <Option value="'XINYE'">新叶念体</Option>
                            <Option value="'cicada'">CC 字体</Option>
                            <Option value="'xiongdi'">兄弟字体</Option>
                            <Option value="'qishan-zhong'">Zhong Qi Shan 体</Option>
                        </Select>
                    </div>

                    <div className="form-group">
                        <label>纸张类型</label>
                        <Select value={paperType} onChange={setPaperType} style={{ width: '100%' }}>
                            <Option value="No Paper">无纸张</Option>
                            <Option value="Lined Paper">横线纸</Option>
                        </Select>
                    </div>

                    {/* 新增纸张背景选项 */}
                    <div className="form-group">
                        <label>纸张背景</label>
                        <Select value={paperBackground} onChange={setPaperBackground} style={{ width: '100%' }}>
                            <Option value="None">无背景</Option>
                            <Option value="Style1">样式1</Option>
                            <Option value="Style2">样式2</Option>
                            <Option value="Style3">样式3</Option>
                        </Select>
                    </div>

                    <div className="form-group">
                        <Checkbox checked={borderEnabled} onChange={() => setBorderEnabled(!borderEnabled)}>
                            边框
                        </Checkbox>
                    </div>

                    <div className="form-group">
                        <label>边距设置 (px)</label>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Input
                                    type="number"
                                    value={topMargin}
                                    onChange={(e) => setTopMargin(e.target.value)}
                                    placeholder="上"
                                />
                            </Col>
                            <Col span={8}>
                                <Input
                                    type="number"
                                    value={leftMargin}
                                    onChange={(e) => setLeftMargin(e.target.value)}
                                    placeholder="左"
                                />
                            </Col>
                            <Col span={8}>
                                <Input
                                    type="number"
                                    value={rightMargin}
                                    onChange={(e) => setRightMargin(e.target.value)}
                                    placeholder="右"
                                />
                            </Col>
                        </Row>
                    </div>

                    <div className="form-group">
                        <label>字体大小 (px)</label>
                        <Slider
                            min={12}
                            max={72}
                            value={fontSize}
                            onChange={setFontSize}
                        />
                    </div>

                    <div className="form-group">
                        <label>字体颜色</label>
                        <Input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>文字对齐</label>
                        <Select value={textAlign} onChange={setTextAlign} style={{ width: '100%' }}>
                            <Option value="left">居左</Option>
                            <Option value="center">居中</Option>
                            <Option value="right">居右</Option>
                        </Select>
                    </div>

                    <div className="form-group">
                        <label>行间距</label>
                        <Slider
                            min={1}
                            max={3}
                            step={0.1}
                            value={lineSpacing}
                            onChange={setLineSpacing}
                        />
                    </div>

                    <div className="form-group">
                        <label>字符间距 (px)</label>
                        <Slider
                            min={0}
                            max={10}
                            value={charSpacing}
                            onChange={setCharSpacing}
                        />
                    </div>

                    <Button type="primary" onClick={handleGenerate} style={{ width: '100%' }}>
                        生成图片
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Title level={4}>输入文本</Title>
                            <TextArea
                                rows={15}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="请输入您的文本..."
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <Title level={4}>预览</Title>
                            <div
                                className="preview-area"
                                style={{
                                fontFamily: font,
                                fontSize: `${fontSize}px`,
                                color: fontColor,
                                textAlign: textAlign,
                                marginTop: `${topMargin}px`,
                                marginLeft: `${leftMargin}px`,
                                marginRight: `${rightMargin}px`,
                                lineHeight: `${lineSpacing * fontSize}px`,
                                letterSpacing: `${charSpacing}px`,
                                border: borderEnabled ? '1px solid #000' : 'none',
                                backgroundImage: getPaperBackground(),
                                backgroundSize: getBackgroundSize(),
                                backgroundRepeat: getBackgroundRepeat(),
                                padding: '20px',
                                minHeight: '400px',
                                boxSizing: 'border-box',
                                backgroundPosition: `left ${backgroundOffset}px`,
                                }}
                            >
                                {text.split('\n').map((line, index) => (
                                <p key={index} style={{ margin: 0 }}>{line}</p>
                                ))}
                            </div>

                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}

export default HandwritingGenerator;
