import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Select, Button, Tabs, Input, Upload, message, Spin, Tooltip, Empty, Card, Space, Typography } from 'antd';
import { 
  UploadOutlined, 
  SwapOutlined, 
  TranslationOutlined, 
  PictureOutlined, 
  SoundOutlined,
  CopyOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  GlobalOutlined,
  FileImageOutlined,
  SyncOutlined,
  PauseOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

// Lazy load the DocumentTranslator component
const DocumentTranslatorContent = lazy(() => import('../components/DocumentTranslatorContent'));

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

// API配置
const API_KEY = '28c81f920240b0fdbca940e07b86b8db';
const API_SECRET = 'd6e57784b134d09a8bed9ca004c98b4f';
const API_BASE_URL = 'https://www.heytransl.com';
const API_TEXT_URL = `${API_BASE_URL}/api/translate/text`;
const API_IMAGE_URL = `${API_BASE_URL}/api/translate/image`;

/**
 * 生成认证头部
 * @param {string} apiKey -  API密钥
 * @param {string} apiSecret -  API密钥
 * @param {object} body - 请求体
 * @returns {Promise<object>} - 包含认证信息的头部对象
 */
function generateHeaders(apiKey, apiSecret, body) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyStr = JSON.stringify(body);
  const messageToSign = `${apiKey}${timestamp}${bodyStr}`;
  
  // 生成HMAC SHA-256签名
  const encoder = new TextEncoder();
  const key = encoder.encode(apiSecret);
  const message = encoder.encode(messageToSign);
  
  return crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => {
    return crypto.subtle.sign(
      'HMAC',
      key,
      message
    );
  }).then(signature => {
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      'X-API-Key': apiKey,
      'X-Timestamp': timestamp,
      'X-Signature': hashHex,
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    };
  });
}

/**
 * 从SSE响应中提取翻译内容
 * @param {object} data - 解析后的JSON对象
 * @returns {string|null} - 提取的翻译内容或null
 */
function extractTranslationContent(data) {
  if (!data) return null;
  
  try {
    // Add debug logging to see the actual structure
    // console.log('Translation data structure:', JSON.stringify(data));
    
    // Handle standard OpenAI style API response
    if (data.choices && data.choices.length > 0) {
      // Check delta.content path
      if (data.choices[0].delta && data.choices[0].delta.content !== undefined) {
        return data.choices[0].delta.content || '';
      }
      
      // Check message.content path
      if (data.choices[0].message && data.choices[0].message.content !== undefined) {
        return data.choices[0].message.content || '';
      }
      
      // Check for text field in the first choice
      if (data.choices[0].text !== undefined) {
        return data.choices[0].text || '';
      }
    }
    
    // Handle different image translation API response formats
    if (data.translated_text !== undefined) {
      return data.translated_text || '';
    }
    
    if (data.translated_chunk !== undefined) {
      return data.translated_chunk || '';
    }
    
    // Check for content directly in the response
    if (data.content !== undefined) {
      return data.content || '';
    }
    
    // Check for text directly in the response
    if (data.text !== undefined) {
      return data.text || '';
    }
    
    // If we have data.result containing the translation
    if (data.result !== undefined) {
      if (typeof data.result === 'string') {
        return data.result;
      } else if (data.result.text !== undefined) {
        return data.result.text || '';
      } else if (data.result.content !== undefined) {
        return data.result.content || '';
      } else if (data.result.translated_text !== undefined) {
        return data.result.translated_text || '';
      }
    }
    
    // If we couldn't extract content through known paths, but the data is a string, return it
    if (typeof data === 'string') {
      return data;
    }
    
    console.warn('Unknown translation data structure:', data);
    return '';
  } catch (e) {
    console.error('提取翻译内容失败:', e, data);
    return '';
  }
}

/**
 * 解析SSE流中的事件数据
 * @param {string} data - SSE事件数据
 * @returns {object|null} - 解析后的JSON对象，或null
 */
function parseSSEData(data) {
  if (!data) return null;
  if (data === '[DONE]') return null;
  
  // Debug SSE data
  // console.log('Raw SSE data:', data);
  
  // Check and remove SSE 'data:' prefix
  let jsonData = data;
  if (typeof data === 'string') {
    if (data.startsWith('data:')) {
      jsonData = data.substring(5).trim();
    }
    
    if (jsonData === '[DONE]') return null;
    
    try {
      // Try to parse as JSON
      return JSON.parse(jsonData);
    } catch (e) {
      // If not valid JSON, check if it's plain text content
      console.warn('Parse SSE data failed, treating as plain text:', e);
      // Return simple object with text content for non-JSON responses
      if (jsonData.trim()) {
        return { text: jsonData.trim() };
      }
      return null;
    }
  } else if (typeof data === 'object') {
    // If already an object, return as is
    return data;
  }
  
  return null;
}

/**
 * 处理SSE流
 * @param {Response} response - Fetch响应对象
 * @param {function} onData - 处理每个数据块的回调
 * @param {function} onDone - 完成时的回调
 * @param {function} onError - 错误时的回调
 */
async function processSSEStream(response, onData, onDone, onError) {
  if (!response.ok) {
    onError(new Error(`HTTP error: ${response.status}`));
    return;
  }
  
  if (!response.body) {
    onError(new Error('响应没有可读数据流'));
    return;
  }

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // 处理缓冲区中剩余的数据
        if (buffer.trim()) {
          const lines = buffer.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.substring(5).trim();
              if (data === '[DONE]') {
                onDone();
                return;
              }
              const parsedData = parseSSEData(data);
              if (parsedData) onData(parsedData);
            }
          }
        }
        break;
      }
      
      // 添加新的数据到缓冲区
      buffer += decoder.decode(value, { stream: true });
      
      // 按照SSE格式分割事件（每行一个data事件）
      const lines = buffer.split('\n');
      
      // 保留最后一个可能不完整的行
      buffer = lines.pop() || '';
      
      // 处理完整的事件行
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim();
          
          if (data === '[DONE]') {
            onDone();
            return;
          }
          
          const parsedData = parseSSEData(data);
          if (parsedData) onData(parsedData);
        }
      }
    }
    
    onDone();
  } catch (error) {
    onError(error);
  }
}

/**
 * 将文件转换为 base64 字符串
 * @param {File} file - 文件对象
 * @returns {Promise<string>} - base64字符串
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const Translator = () => {
  const { t } = useTranslation();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('中文');
  const [loading, setLoading] = useState(false);
  const [streamingTranslation, setStreamingTranslation] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // 在组件卸载时中止所有请求和语音
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // 停止所有语音
      window.speechSynthesis.cancel();
    };
  }, []);
  
  // 键盘剪切板粘贴图片监听
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            
            reader.onload = (event) => {
              setCurrentImage({
                uid: Date.now(),
                name: `粘贴的图片_${Date.now()}.png`,
                status: 'done',
                url: event.target.result,
                originFileObj: file
              });
              
              // 自动开始翻译 - 使用当前选择的目标语言
              // console.log('Translating pasted image with language:', targetLanguage);
              translateImage(file, targetLanguage);
            };
            
            reader.readAsDataURL(file);
            message.success(t('translator.imageAddedFromClipboard'));
            break;
          }
        }
      }
    };
    
    // 添加拖放事件监听
    const handleDragOver = (e) => {
      e.preventDefault();
      if (dropAreaRef.current) {
        dropAreaRef.current.classList.add('border-indigo-500');
      }
    };
    
    const handleDragLeave = (e) => {
      e.preventDefault();
      if (dropAreaRef.current) {
        dropAreaRef.current.classList.remove('border-indigo-500');
      }
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      if (dropAreaRef.current) {
        dropAreaRef.current.classList.remove('border-indigo-500');
      }
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        if (!file.type.startsWith('image/')) {
          message.error(t('translator.uploadImageOnly'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setCurrentImage({
            uid: Date.now(),
            name: file.name,
            status: 'done',
            url: event.target.result,
            originFileObj: file
          });
          
          // 自动开始翻译 - 使用当前选择的目标语言
          // console.log('Translating dropped image with language:', targetLanguage);
          translateImage(file, targetLanguage);
        };
        
        reader.readAsDataURL(file);
        message.success(t('translator.imageAdded'));
      }
    };

    document.addEventListener('paste', handlePaste);
    
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      dropArea.addEventListener('dragover', handleDragOver);
      dropArea.addEventListener('dragleave', handleDragLeave);
      dropArea.addEventListener('drop', handleDrop);
    }
    
    return () => {
      document.removeEventListener('paste', handlePaste);
      
      if (dropArea) {
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('dragleave', handleDragLeave);
        dropArea.removeEventListener('drop', handleDrop);
      }
    };
  }, [targetLanguage]);

  const languages = [
    { value: '中文', label: '中文 (Chinese)' },
    { value: 'English', label: 'English' },
    { value: '日本語', label: '日本語 (Japanese)' },
    { value: '한국어', label: '한국어 (Korean)' },
    { value: 'Español', label: 'Español (Spanish)' },
    { value: 'Français', label: 'Français (French)' },
    { value: 'Deutsch', label: 'Deutsch (German)' },
    { value: 'Русский', label: 'Русский (Russian)' },
    { value: 'Português', label: 'Português (Portuguese)' },
    { value: 'Italiano', label: 'Italiano (Italian)' },
    { value: 'العربية', label: 'العربية (Arabic)' },
  ];

  const translateText = async () => {
    if (!sourceText.trim()) {
      message.warning(t('translator.enterTextPrompt'));
      return;
    }

    // 中止之前的请求（如果有）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setStreamingTranslation(true);
    setTranslatedText(''); // 清空之前的翻译结果
    
    try {
      const requestBody = {
        text: sourceText,
        target_language: targetLanguage,
        stream: true // 启用流式响应
      };
      
      // 生成认证头部
      const headers = await generateHeaders(
        API_KEY, 
        API_SECRET, 
        requestBody
      );

      const response = await fetch(API_TEXT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal
      });

      // 处理SSE流
      await processSSEStream(
        response,
        // 数据处理回调
        (data) => {
          const content = extractTranslationContent(data);
          if (content !== null) {
            // 追加新的翻译内容
            setTranslatedText(prev => prev + content);
          }
        },
        // 完成回调
        () => {
          setLoading(false);
          setStreamingTranslation(false);
        },
        // 错误回调
        (error) => {
          if (error.name !== 'AbortError') {
            console.error('Translation error:', error);
            message.error(t('translator.serviceUnavailable'));
          }
          setLoading(false);
          setStreamingTranslation(false);
        }
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Translation error:', error);
        message.error(t('translator.serviceUnavailable'));
      }
      setLoading(false);
      setStreamingTranslation(false);
    }
  };

  const translateImage = async (file, newTargetLanguage) => {
    if (!file) {
      message.warning(t('translator.uploadImageFirst'));
      return;
    }

    // 中止之前的请求（如果有）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    // Enable streaming state to trigger animation
    setStreamingTranslation(true);
    setTranslatedText(''); // 清空之前的翻译结果

    try {
      // 将图片转换为base64
      const base64Image = await fileToBase64(file);
      
      // 构建请求体
      const requestBody = {
        image_base64: base64Image,
        target_language: newTargetLanguage || targetLanguage, // Use provided language or fall back to state
        stream: true
      };

      // 生成认证头部
      const headers = await generateHeaders(
        API_KEY, 
        API_SECRET,
        requestBody
      );

      const response = await fetch(API_IMAGE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal
      });
      
      // 处理SSE流
      await processSSEStream(
        response,
        // 数据处理回调
        (data) => {
          const content = extractTranslationContent(data);
          if (content !== null) {
            // console.log('Adding image translation content:', content);
            setTranslatedText(prev => prev + content);
          } else {
            console.warn('No content extracted from translation data:', data);
          }
        },
        // 完成回调
        () => {
          // console.log('Image translation complete');
          setLoading(false);
          setStreamingTranslation(false);
        },
        // 错误回调
        (error) => {
          if (error.name !== 'AbortError') {
            console.error('Image translation error:', error);
            message.error(t('translator.imageServiceUnavailable'));
            
            // For demo purposes only. In production, you should remove this section
            if (process.env.NODE_ENV === 'development') {
              setTimeout(() => {
                setTranslatedText("这是从图片中识别并翻译的文本示例。系统会自动识别图片中的所有文字内容，并保持原始格式进行高质量翻译。支持多种语言之间的互译，适用于文档、截图、照片等多种图片类型。");
                setLoading(false);
                setStreamingTranslation(false);
              }, 1500);
            } else {
              setLoading(false);
              setStreamingTranslation(false);
            }
          } else {
            // console.log('Image translation request aborted');
            setLoading(false);
            setStreamingTranslation(false);
          }
        }
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Image translation error:', error);
        message.error(t('translator.imageServiceUnavailable'));
        
        // For demo purposes only. In production, you should remove this section
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            setTranslatedText("这是从图片中识别并翻译的文本示例。系统会自动识别图片中的所有文字内容，并保持原始格式进行高质量翻译。支持多种语言之间的互译，适用于文档、截图、照片等多种图片类型。");
            setLoading(false);
            setStreamingTranslation(false);
          }, 1500);
        } else {
          setLoading(false);
          setStreamingTranslation(false);
        }
      } else {
        setLoading(false);
        setStreamingTranslation(false);
      }
    }
  };

  const handleUpload = (info) => {
    const { file } = info;
    if (file.status !== 'uploading') {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage({
          uid: Date.now(),
          name: file.name,
          status: 'done',
          url: reader.result,
          originFileObj: file.originFileObj
        });
        
        // 自动开始翻译
        translateImage(file.originFileObj, targetLanguage);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };
  
  const removeImage = () => {
    setCurrentImage(null);
    setTranslatedText('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(t('translator.copied'));
    }, (err) => {
      message.error(t('translator.copyFailed'));
      console.error('复制失败: ', err);
    });
  };

  const playText = (text) => {
    if (!text) {
      message.warning(t('translator.noTextToSpeak'));
      return;
    }
    
    // 如果已经在朗读中，则停止朗读
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 监听语音结束事件
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    // 标记为正在朗读
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  
  const handleTabChange = (activeKey) => {
    // Clear translated text when switching tabs
    setTranslatedText('');
    // Reset streaming state
    setStreamingTranslation(false);
    // Stop any ongoing translations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  const tabItems = [
    {
      key: 'text',
      label: (
        <span className="flex items-center gap-2">
          <TranslationOutlined />
          <span>{t('translator.tabs.text')}</span>
        </span>
      ),
      children: (
        <div className="text-translation-container">
          <div className="flex items-center bg-gray-50 rounded-t-lg p-4 border-b border-gray-200">
            <div className="flex items-center mr-2">
              <GlobalOutlined className="text-indigo-500 mr-2" />
              <span className="font-medium">{t('translator.targetLanguageLabel')}</span>
            </div>
            <Select
              value={targetLanguage}
              onChange={setTargetLanguage}
              options={languages}
              style={{ width: 180 }}
              dropdownStyle={{ zIndex: 1001 }}
            />
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 border-r border-gray-200 relative">
              <TextArea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={t('translator.textPlaceholder')}
                autoSize={{ minRows: 12, maxRows: 20 }}
                className="border-none rounded-none !shadow-none focus:shadow-none"
                disabled={loading}
              />
              
              {sourceText && (
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <Tooltip title={isSpeaking && window.speechSynthesis.speaking ? t('translator.tooltip.stopPlayback') : t('translator.tooltip.playSource')}>
                    <Button
                      type="text"
                      icon={isSpeaking && window.speechSynthesis.speaking ? <PauseOutlined /> : <SoundOutlined />}
                      onClick={() => playText(sourceText)}
                      size="small"
                      className="text-gray-500 hover:text-indigo-500"
                    />
                  </Tooltip>
                  <Tooltip title={t('translator.tooltip.copySource')}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(sourceText)}
                      size="small"
                      className="text-gray-500 hover:text-indigo-500"
                    />
                  </Tooltip>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 relative">
              {loading && !streamingTranslation ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="flex flex-col items-center">
                    <Spin size="large" />
                    <span className="mt-4 text-gray-600">{t('translator.translating')}</span>
                  </div>
                </div>
              ) : null}
              <TextArea
                value={translatedText}
                readOnly
                placeholder={t('translator.translationPlaceholder')}
                autoSize={{ minRows: 12, maxRows: 20 }}
                className={`border-none rounded-none !shadow-none bg-gray-50 ${streamingTranslation ? 'streaming-translation' : ''}`}
              />
              
              {translatedText && (
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <Tooltip title={isSpeaking && window.speechSynthesis.speaking ? t('translator.tooltip.stopPlayback') : t('translator.tooltip.playTranslation')}>
                    <Button
                      type="text"
                      icon={isSpeaking && window.speechSynthesis.speaking ? <PauseOutlined /> : <SoundOutlined />}
                      onClick={() => playText(translatedText)}
                      size="small"
                      className="text-gray-500 hover:text-indigo-500"
                    />
                  </Tooltip>
                  <Tooltip title={t('translator.tooltip.copyTranslation')}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(translatedText)}
                      size="small"
                      className="text-gray-500 hover:text-indigo-500"
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 flex justify-center md:justify-end">
            <Button
              type="primary"
              onClick={translateText}
              loading={loading}
              disabled={!sourceText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 px-8"
              size="large"
            >
              {t('translator.translateButton')}
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'image',
      label: (
        <span className="flex items-center gap-2">
          <PictureOutlined />
          <span>{t('translator.tabs.image')}</span>
        </span>
      ),
      children: (
        <div className="image-translation-container" ref={dropAreaRef}>
          <div className="bg-gray-50 rounded-t-lg p-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex items-center mr-2">
                <GlobalOutlined className="text-indigo-500 mr-2" />
                <span className="font-medium">{t('translator.targetLanguageLabel')}</span>
              </div>
              <Select
                value={targetLanguage}
                onChange={(value) => {
                  setTargetLanguage(value);
                  // 更改语言后，如果有当前图片，则重新翻译
                  if (currentImage?.originFileObj) {
                    translateImage(currentImage.originFileObj, value);
                  }
                }}
                options={languages}
                style={{ width: 180 }}
                dropdownStyle={{ zIndex: 1001 }}
              />
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* 图片上传区域 */}
              <div className="w-full md:w-1/2 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 transition-all hover:border-indigo-400 relative group">
                {currentImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={currentImage.url}
                      alt="Source"
                      className="max-w-full max-h-full object-contain"
                    />
                    
                    {/* Replace image overlay */}
                    <div 
                      className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">{t('translator.replaceImage')}</span>
                    </div>
                    
                    {/* Delete button - positioned outside the clickable area */}
                    <div className="absolute top-2 right-2 z-20">
                      <Tooltip title={t('translator.tooltip.deleteImage')}>
                        <Button 
                          type="default" 
                          size="small" 
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="bg-black bg-opacity-50 text-white border-0 hover:bg-red-500"
                        />
                      </Tooltip>
                    </div>
                    
                    {/* Hidden file input for replacing the image */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCurrentImage({
                                uid: Date.now(),
                                name: file.name,
                                status: 'done',
                                url: event.target.result,
                                originFileObj: file
                              });
                              translateImage(file, targetLanguage);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            message.error(t('translator.uploadImageOnlyError'));
                          }
                        }
                        // Clear the input value to allow selecting the same file again
                        e.target.value = '';
                      }}
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error(t('translator.uploadImageOnlyError'));
                      }
                      return isImage;
                    }}
                    onChange={handleUpload}
                    className="image-upload-container"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileImageOutlined className="text-4xl text-gray-400" />
                      <p className="text-gray-500 mt-2">{t('translator.uploadImageButton')}</p>
                    </div>
                  </Upload>
                )}
              </div>
              
              {/* 翻译结果显示区域 - 文本形式 */}
              <div className="w-full md:w-1/2 aspect-video flex flex-col border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  {currentImage && (
                    <div className="flex space-x-2">
                      {/* Removed buttons */}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-auto p-3 relative">
                  {loading && !streamingTranslation ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-10">
                      <Spin size="large" />
                      <span className="mt-4 text-gray-600">{t('translator.imageTranslating')}</span>
                    </div>
                  ) : currentImage ? (
                    <div className="h-full relative">
                      {translatedText || streamingTranslation ? (
                        <TextArea 
                          value={translatedText} 
                          readOnly
                          placeholder={t('translator.translationPlaceholder')}
                          autoSize={{ minRows: 12, maxRows: 20 }}
                          className={`border-none rounded-none !shadow-none bg-gray-50 ${streamingTranslation ? 'streaming-translation' : ''}`}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Empty 
                            description={t('translator.emptyImageResult')} 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Empty 
                        description={t('translator.emptyImagePlaceholder')} 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    </div>
                  )}
                </div>
                
                {/* Action buttons placed outside the TextArea */}
                {currentImage && (translatedText || !loading) && (
                  <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex justify-end space-x-2">
                    {translatedText && (
                      <>
                        <Tooltip title={isSpeaking && window.speechSynthesis.speaking ? t('translator.tooltip.stopPlayback') : t('translator.tooltip.playTranslation')}>
                          <Button
                            type="text"
                            icon={isSpeaking && window.speechSynthesis.speaking ? <PauseOutlined /> : <SoundOutlined />}
                            onClick={() => playText(translatedText)}
                            size="small"
                            className="text-gray-500 hover:text-indigo-500"
                          />
                        </Tooltip>
                        <Tooltip title={t('translator.tooltip.copyTranslation')}>
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(translatedText)}
                            size="small"
                            className="text-gray-500 hover:text-indigo-500"
                          />
                        </Tooltip>
                      </>
                    )}
                    {!loading && currentImage?.originFileObj && (
                      <Tooltip title={t('translator.tooltip.retranslate')}>
                        <Button
                          type="text"
                          icon={<SyncOutlined />}
                          onClick={() => translateImage(currentImage.originFileObj)}
                          size="small"
                          className="text-gray-500 hover:text-indigo-500"
                        />
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   key: 'document',
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <FileOutlined />
    //       <span>{t('translator.tabs.document')}</span>
    //     </span>
    //   ),
    //   children: (
    //     <Suspense fallback={<div className="p-8 flex justify-center"><Spin size="large" /></div>}>
    //       <DocumentTranslatorContent 
    //         currentLanguage={targetLanguage}
    //         onLanguageChange={setTargetLanguage}
    //       />
    //     </Suspense>
    //   ),
    // },
  ];

  return (
    <>
      <SEO
        title={t('translator.title')}
        description={t('translator.description')}
      />
      <div className="flex flex-col items-center pt-16 md:pt-20 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <Tabs
              defaultActiveKey="text"
              items={tabItems}
              className="custom-tabs"
              animated={{ inkBar: true, tabPane: false }}
              onChange={handleTabChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Translator; 