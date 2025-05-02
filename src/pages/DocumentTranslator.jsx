import React, { useState, useRef, useEffect } from 'react';
import { Select, Button, Spin, Tooltip, Empty, Upload, message } from 'antd';
import { 
  UploadOutlined, 
  SoundOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  FileOutlined,
  FileImageOutlined,
  SyncOutlined,
  PauseOutlined
} from '@ant-design/icons';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

// Import PDF.js
// Note: In a real implementation, you might want to properly set up PDF.js with its worker
const pdfjsLib = window.pdfjsLib;
if (pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';
}

// API configuration - reusing the same API as the Translator component
const API_KEY = '28c81f920240b0fdbca940e07b86b8db';
const API_SECRET = 'd6e57784b134d09a8bed9ca004c98b4f';
const API_BASE_URL = 'https://www.heytransl.com';
const API_DOCUMENT_URL = `${API_BASE_URL}/api/translate/document`;

/**
 * Generate authentication headers
 * @param {string} apiKey - API key
 * @param {string} apiSecret - API secret
 * @param {object} body - Request body
 * @returns {Promise<object>} - Object containing authentication headers
 */
function generateHeaders(apiKey, apiSecret, body) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyStr = JSON.stringify(body);
  const messageToSign = `${apiKey}${timestamp}${bodyStr}`;
  
  // Generate HMAC SHA-256 signature
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
 * Convert file to base64 string
 * @param {File} file - File object
 * @returns {Promise<string>} - base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Extract translation content from SSE response
 * @param {object} data - Parsed JSON object
 * @returns {string|null} - Extracted translation content or null
 */
function extractTranslationContent(data) {
  if (!data) return null;
  
  try {
    // Handle various response formats
    if (data.document_translation) {
      return data.document_translation;
    }
    
    if (data.translation_progress) {
      return data.translation_progress;
    }
    
    // For compatibility with existing extractTranslationContent function
    if (data.choices && data.choices.length > 0) {
      if (data.choices[0].delta && data.choices[0].delta.content !== undefined) {
        return data.choices[0].delta.content || '';
      }
      
      if (data.choices[0].message && data.choices[0].message.content !== undefined) {
        return data.choices[0].message.content || '';
      }
      
      if (data.choices[0].text !== undefined) {
        return data.choices[0].text || '';
      }
    }
    
    // Handle other possible response formats
    if (data.translated_text !== undefined) {
      return data.translated_text || '';
    }
    
    if (data.content !== undefined) {
      return data.content || '';
    }
    
    if (data.text !== undefined) {
      return data.text || '';
    }
    
    console.warn('Unknown translation data structure:', data);
    return '';
  } catch (e) {
    console.error('Failed to extract translation content:', e, data);
    return '';
  }
}

/**
 * Parse SSE event data
 * @param {string} data - SSE event data
 * @returns {object|null} - Parsed JSON object, or null
 */
function parseSSEData(data) {
  if (!data) return null;
  if (data === '[DONE]') return null;
  
  let jsonData = data;
  if (typeof data === 'string') {
    if (data.startsWith('data:')) {
      jsonData = data.substring(5).trim();
    }
    
    if (jsonData === '[DONE]') return null;
    
    try {
      return JSON.parse(jsonData);
    } catch (e) {
      if (jsonData.trim()) {
        return { text: jsonData.trim() };
      }
      return null;
    }
  } else if (typeof data === 'object') {
    return data;
  }
  
  return null;
}

/**
 * Process SSE stream
 * @param {Response} response - Fetch response object
 * @param {function} onData - Callback for processing each data chunk
 * @param {function} onDone - Callback for when processing is complete
 * @param {function} onError - Callback for errors
 */
async function processSSEStream(response, onData, onDone, onError) {
  if (!response.ok) {
    onError(new Error(`HTTP error: ${response.status}`));
    return;
  }
  
  if (!response.body) {
    onError(new Error('Response has no readable data stream'));
    return;
  }

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
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
      
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
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

const DocumentTranslator = () => {
  const { t } = useTranslation();
  const [targetLanguage, setTargetLanguage] = useState('中文');
  const [loading, setLoading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [pdfScale, setPdfScale] = useState(1);
  const [documentData, setDocumentData] = useState(null);
  const [displayMode, setDisplayMode] = useState('translation'); // 'translation', 'bilingual', 'original'
  const [activeBlock, setActiveBlock] = useState(null);
  const pdfContentRef = useRef(null);
  const translationContentRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const abortControllerRef = useRef(null);
  
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Setup file drop event handlers
  useEffect(() => {
    // Clipboard paste handler
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        for (const item of items) {
          if (item.type.indexOf('application/pdf') !== -1) {
            const file = item.getAsFile();
            handleDocumentFile(file);
            message.success('Document added from clipboard');
            break;
          }
        }
      }
    };
    
    // Drag and drop handlers
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
        
        if (file.type !== 'application/pdf') {
          message.error('Please upload a PDF file');
          return;
        }
        
        handleDocumentFile(file);
        message.success('Document added');
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
  }, []);

  // Handle window resize for PDF scale
  useEffect(() => {
    const handleResize = debounce(() => {
      if (currentDocument) {
        loadPDF(currentDocument.url);
      }
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentDocument]);
  
  // Helper function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleDocumentFile = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCurrentDocument({
        uid: Date.now(),
        name: file.name,
        status: 'done',
        url: event.target.result,
        originFileObj: file
      });
      
      // Load PDF and translate
      loadPDF(event.target.result);
      translateDocument(file, targetLanguage);
    };
    reader.readAsDataURL(file);
  };

  const translateDocument = async (file, language) => {
    if (!file) {
      message.warning('Please upload a document first');
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setDocumentData(null);

    try {
      // Convert document to base64
      const base64Document = await fileToBase64(file);
      
      // Build request body
      const requestBody = {
        document_base64: base64Document,
        document_name: file.name,
        target_language: language || targetLanguage,
        stream: true
      };

      // Generate auth headers
      const headers = await generateHeaders(
        API_KEY, 
        API_SECRET,
        requestBody
      );

      const response = await fetch(API_DOCUMENT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal
      });
      
      let translationResult = null;
      
      // Process SSE stream
      await processSSEStream(
        response,
        // Data callback
        (data) => {
          const content = extractTranslationContent(data);
          if (content) {
            if (typeof content === 'object') {
              // For structured translation data
              translationResult = content;
              setDocumentData(content);
            } else if (data.translation_progress) {
              // Handle progress updates if needed
              console.log('Translation progress:', data.translation_progress);
            }
          }
        },
        // Complete callback
        () => {
          setLoading(false);
          if (translationResult) {
            setDocumentData(translationResult);
          }
        },
        // Error callback
        (error) => {
          if (error.name !== 'AbortError') {
            console.error('Document translation error:', error);
            message.error('Document translation service temporarily unavailable');
            
            // For development testing - use mock data
            if (process.env.NODE_ENV === 'development') {
              setTimeout(() => {
                // Mock data structure
                setDocumentData({
                  pages: [
                    {
                      page_idx: 0,
                      para_blocks: [
                        {
                          type: 'title',
                          text: 'Document Translation Example',
                          translation: '文档翻译示例',
                          bbox: [50, 50, 500, 100]
                        },
                        {
                          type: 'text',
                          text: 'This is an example of document translation with immersive bilingual reading.',
                          translation: '这是一个带有沉浸式双语阅读的文档翻译示例。',
                          bbox: [50, 150, 500, 200]
                        }
                      ]
                    }
                  ]
                });
                setLoading(false);
              }, 1500);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Document translation error:', error);
        message.error('Document translation service temporarily unavailable');
        
        // For development testing
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            // Add mock data here similar to above
            setLoading(false);
          }, 1500);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const loadPDF = async (url) => {
    if (!pdfjsLib) {
      message.error('PDF.js library not loaded. Please refresh the page.');
      return;
    }
    
    try {
      // Clear previous content
      if (pdfContentRef.current) {
        pdfContentRef.current.innerHTML = '';
      }
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfInstance(pdf);
      
      const pdfContainer = pdfContentRef.current;
      if (!pdfContainer) return;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1 });

        const containerWidth = pdfContainer.clientWidth - 40;
        const scale = containerWidth / originalViewport.width;
        setPdfScale(scale);

        const dpr = window.devicePixelRatio || 2;
        const scaledViewport = page.getViewport({ scale: scale * dpr });

        const pageDiv = document.createElement('div');
        pageDiv.className = 'pdf-page';
        pageDiv.setAttribute('data-page-number', pageNum);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        canvas.style.width = `${scaledViewport.width / dpr}px`;
        canvas.style.height = `${scaledViewport.height / dpr}px`;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };

        pageDiv.appendChild(canvas);
        pdfContainer.appendChild(pageDiv);
        await page.render(renderContext);
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      message.error('Failed to load PDF document');
    }
  };

  const renderTranslations = () => {
    if (!documentData || !documentData.pages) return null;
    
    return documentData.pages.map((page, pageIndex) => {
      const pageNumber = page.page_idx + 1;
      
      return page.para_blocks.map((paraBlock, blockIndex) => {
        // Create paragraph block
        const paraDiv = (
          <div 
            key={`${pageNumber}-${blockIndex}`}
            className={`paragraph-block ${activeBlock === `${pageNumber}-${blockIndex}` ? 'active' : ''}`}
            onClick={() => {
              setActiveBlock(`${pageNumber}-${blockIndex}`);
              highlightOriginalText(pageNumber, paraBlock.bbox);
            }}
          >
            {/* Original text block */}
            {(paraBlock.text || paraBlock.type === 'image' || paraBlock.type === 'table') && (
              <div 
                className="origin-block"
                style={{ 
                  display: displayMode === 'original' || displayMode === 'bilingual' ? 'block' : 'none',
                  fontFamily: '"Merriweather", Georgia, serif',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#555',
                  padding: '5px'
                }}
              >
                {renderParaBlock(paraBlock, 'original')}
              </div>
            )}
            
            {/* Translation block */}
            {(paraBlock.translation || paraBlock.type === 'image' || paraBlock.type === 'table') && (
              <div 
                className="translation-block"
                style={{ 
                  display: displayMode === 'translation' || displayMode === 'bilingual' ? 'block' : 'none',
                  fontFamily: '"Noto Sans SC", "Microsoft YaHei", Arial, sans-serif',
                  fontSize: '18px',
                  lineHeight: 1.6,
                  color: '#333',
                  padding: '5px',
                  backgroundColor: displayMode === 'bilingual' ? '#f3f4f6' : 'transparent'
                }}
              >
                {renderParaBlock(paraBlock, 'translation')}
              </div>
            )}
          </div>
        );
        
        return paraDiv;
      });
    });
  };

  const renderParaBlock = (paraBlock, mode) => {
    const isOriginal = mode === 'original';
    const content = isOriginal ? paraBlock.text : paraBlock.translation;
    
    switch (paraBlock.type) {
      case 'title':
        return <h1>{content}</h1>;
        
      case 'text':
        return <p>{content}</p>;
        
      case 'image':
        // Render image with caption
        return (
          <div className="image-block">
            {paraBlock.image_url && <img src={paraBlock.image_url} alt="Document image" />}
            {paraBlock.caption && <p className="image-caption">{isOriginal ? paraBlock.caption : paraBlock.caption_translation}</p>}
          </div>
        );
        
      case 'table':
        // Render table with caption
        return (
          <div className="table-block">
            {paraBlock.table_html && <div dangerouslySetInnerHTML={{ __html: paraBlock.table_html }} />}
            {paraBlock.caption && <p className="table-caption">{isOriginal ? paraBlock.caption : paraBlock.caption_translation}</p>}
          </div>
        );
        
      default:
        return <p>{content}</p>;
    }
  };

  const highlightOriginalText = (pageNumber, bbox) => {
    // Remove previous highlights
    document.querySelectorAll('.highlighted').forEach(el => {
      el.parentElement.removeChild(el);
    });

    // Find corresponding page
    const pageDiv = document.querySelector(`.pdf-page[data-page-number="${pageNumber}"]`);
    if (!pageDiv) return;

    // Create highlight element
    const [x1, y1, x2, y2] = bbox;
    const highlightEl = document.createElement('div');
    highlightEl.className = 'highlighted';
    highlightEl.style.position = 'absolute';
    highlightEl.style.left = `${x1 * pdfScale}px`;
    highlightEl.style.top = `${y1 * pdfScale}px`;
    highlightEl.style.width = `${(x2 - x1) * pdfScale}px`;
    highlightEl.style.height = `${(y2 - y1) * pdfScale}px`;
    highlightEl.style.backgroundColor = 'yellow';
    highlightEl.style.opacity = '0.5';
            
    pageDiv.appendChild(highlightEl);

    // Scroll to highlight
    pageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleUpload = (info) => {
    const { file } = info;
    if (file.status !== 'uploading') {
      handleDocumentFile(file.originFileObj);
    }
  };
  
  const removeDocument = () => {
    setCurrentDocument(null);
    setDocumentData(null);
    
    // Clear PDF container
    if (pdfContentRef.current) {
      pdfContentRef.current.innerHTML = '';
    }
    
    // Clear translation container
    if (translationContentRef.current) {
      translationContentRef.current.innerHTML = '';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard');
    }, (err) => {
      message.error('Copy failed');
      console.error('Copy failed: ', err);
    });
  };

  return (
    <>
      <SEO
        title={t('documentTranslator.title', 'Document Translator')}
        description={t('documentTranslator.description', 'Translate documents with immersive bilingual reading')}
      />
      <div className="flex flex-col items-center pt-16 md:pt-20 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header section */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <GlobalOutlined className="text-indigo-500 mr-2" />
                  <span className="font-medium mr-2">Target Language:</span>
                  <Select
                    value={targetLanguage}
                    onChange={(value) => {
                      setTargetLanguage(value);
                      // Retranslate if document exists
                      if (currentDocument?.originFileObj) {
                        translateDocument(currentDocument.originFileObj, value);
                      }
                    }}
                    options={languages}
                    style={{ width: 180 }}
                    dropdownStyle={{ zIndex: 1001 }}
                  />
                </div>
                
                <div className="flex items-center">
                  <span className="font-medium mr-2">Display Mode:</span>
                  <Select
                    value={displayMode}
                    onChange={setDisplayMode}
                    options={[
                      { value: 'translation', label: 'Translation Only' },
                      { value: 'bilingual', label: 'Bilingual' },
                      { value: 'original', label: 'Original Only' }
                    ]}
                    style={{ width: 180 }}
                    dropdownStyle={{ zIndex: 1001 }}
                  />
                </div>
                
                {!currentDocument && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <InfoCircleOutlined className="mr-1" />
                    <span>Upload PDF documents for immersive bilingual reading</span>
                  </div>
                )}
                
                {currentDocument && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{currentDocument.name}</span>
                    <Button
                      type="text"
                      danger
                      icon={<UploadOutlined />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Document
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.type === 'application/pdf') {
                            handleDocumentFile(file);
                          } else {
                            message.error('Please upload a PDF file');
                          }
                        }
                        e.target.value = '';
                      }}
                      style={{ display: 'none' }}
                      accept="application/pdf"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content area */}
            {!currentDocument ? (
              <div 
                ref={dropAreaRef}
                className="p-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-8 transition-all hover:border-indigo-400"
              >
                <FileOutlined className="text-5xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Upload Your Document</h3>
                <p className="text-gray-500 mb-6 text-center">Drag & drop your PDF here, or click to browse</p>
                
                <Upload
                  name="document"
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  beforeUpload={(file) => {
                    const isPdf = file.type === 'application/pdf';
                    if (!isPdf) {
                      message.error('You can only upload PDF files!');
                    }
                    return isPdf;
                  }}
                  onChange={handleUpload}
                >
                  <Button icon={<UploadOutlined />} size="large" type="primary" className="bg-indigo-600 hover:bg-indigo-700">
                    Select Document
                  </Button>
                </Upload>
                
                <p className="text-gray-400 mt-4 text-sm">Supports PDF documents</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row h-[800px]">
                {/* PDF viewer side */}
                <div 
                  ref={pdfContentRef} 
                  className="w-full md:w-1/2 overflow-y-auto p-4 bg-gray-100 border-r border-gray-200"
                  style={{
                    height: '100%'
                  }}
                >
                  {loading && !documentData && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Spin size="large" />
                      <p className="mt-4 text-gray-600">Loading document...</p>
                    </div>
                  )}
                </div>
                
                {/* Translation side */}
                <div 
                  className="w-full md:w-1/2 overflow-y-auto p-4 bg-white"
                  style={{
                    height: '100%'
                  }}
                >
                  {loading && !documentData ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Spin size="large" />
                      <p className="mt-4 text-gray-600">Translating document...</p>
                    </div>
                  ) : documentData ? (
                    <div 
                      ref={translationContentRef}
                      className="translation-content-container"
                    >
                      {renderTranslations()}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Empty 
                        description="Translation will appear here" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .pdf-page {
          position: relative;
          margin-bottom: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          background-color: white;
        }
        
        .highlighted {
          background-color: yellow !important;
          opacity: 0.5;
        }
        
        .paragraph-block {
          margin-bottom: 5px;
          cursor: pointer;
          box-sizing: border-box;
          border: 1px solid transparent;
          padding: 5px;
        }
        
        .paragraph-block.active {
          border: 1px dashed #183bc8;
          background-color: rgba(24, 59, 200, 0.05);
        }
        
        .translation-content-container img {
          max-width: 100%;
          height: auto;
        }
        
        /* Styles for math formulas */
        .katex {
          font-size: 1.1em;
        }
      `}</style>
    </>
  );
};

export default DocumentTranslator; 