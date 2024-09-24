import { useState, useEffect } from 'react';

const i18n = {
  en: {
    title: 'AI Toolbox',
    description: 'Your one-stop solution for various AI tools.',
    slogan: 'Your collection of intelligent assistants, solving various AI needs in one place.',
    tools: {
      text2image: {
        title: 'Text to Image Card',
        description: 'Convert text to image card',
        inputPlaceholder: 'Enter text (can include titles, e.g. # Title 1)',
        downloadButton: 'Export as Image'
      },
      jsonFormatter: {
        title: 'JSON Formatter',
        description: 'Beautify and validate JSON data',
        inputPlaceholder: 'Enter JSON data',
        invalidJson: 'Invalid JSON',
        copyButton: 'Copy',
        copiedMessage: 'Copied'
      },
      urlDecode: {
        title: 'URL Decoder',
        description: 'Decode URL-encoded strings',
        inputLabel: 'Enter URL to decode',
        resultLabel: 'Decoded result',
        copyButton: 'Copy',
        copiedMessage: 'Copied'
      },
    },
    notFound: {
      title: '404 - Page Not Found',
      description: 'Sorry, the page you are looking for does not exist.',
      back_home: 'Back to Home'
    }
  },
  zh: {
    title: 'AI 工具箱',
    description: '一站式解决各种AI工具需求。',
    slogan: '您的智能助手集合，一站式解决各种 AI 需求。',
    tools: {
      text2image: {
        title: '文字卡片',
        description: '将文字转换为图片卡',
        inputPlaceholder: '输入文本（可包含标题，如# 标题1）',
        downloadButton: '导出为图片'
      },
      jsonFormatter: {
        title: 'JSON 格式化',
        description: '美化和验证 JSON 数据',
        inputPlaceholder: '输入 JSON 数据',
        invalidJson: '无效的 JSON',
        copyButton: '复制',
        copiedMessage: '已复制'
      },
      urlDecode: {
        title: 'URL 解码器',
        description: '解码 URL 编码的字符串',
        inputLabel: '输入需要解码的 URL',
        resultLabel: '解码结果',
        copyButton: '复制',
        copiedMessage: '已复制'
      },
    },
    notFound: {
      title: '404 - 页面未找到',
      description: '抱歉，您访问的页面不存在。',
      back_home: '返回首页'
    }
  },
  ja: {
    title: 'AIツールボックス',
    description: 'あなたのインテリジェントアシスタントコレクション、様々なAIニーズを一箇所で解決します。',
    slogan: 'あなたのインテリジェントアシスタントコレクション、様々なAIニーズを一箇所で解決します。',
    tools: {
      text2image: {
        title: 'テキストから画像',
        description: 'テキストを画像カードに変換',
        inputPlaceholder: 'テキストを入力（タイトルを含めることができます、例：# タイトル1）',
        downloadButton: '画像としてエクスポート'
      },
      jsonFormatter: {
        title: 'JSONフォーマッター',
        description: 'JSONデータを整形し検証する',
        inputPlaceholder: 'JSONデータを入力',
        invalidJson: '無効なJSON',
        copyButton: 'コピー',
        copiedMessage: 'コピーしました'
      },
      urlDecode: {
        title: 'URLデコーダー',
        description: 'URLエンコードされた文字列をデコード',
        inputLabel: 'デコードするURLを入力',
        resultLabel: 'デコード結果',
        copyButton: 'コピー',
        copiedMessage: 'コピーしました'
      },
    },
    notFound: {
      title: '404 - ページが見つかりません',
      description: '申し訳ありませんが、お探しのページは存在しません。',
      back_home: 'ホームに戻る'
    }
  },
  ko: {
    title: 'AI 도구 상자',
    description: '당신의 지능형 어시스턴트 컬렉션, 다양한 AI 요구 사항을 한 곳에서 해결합니다.',
    slogan: '당신의 지능형 어시스턴트 컬렉션, 다양한 AI 요구 사항을 한 곳에서 해결합니다.',
    tools: {
      text2image: {
        title: '텍스트를 이미지로',
        description: '텍스트를 이미지 카드로 변환',
        inputPlaceholder: '텍스트 입력 (제목 포함 가능, 예: # 제목 1)',
        downloadButton: '이미지로 내보내기'
      },
      jsonFormatter: {
        title: 'JSON 포맷터',
        description: 'JSON 데이터 정리 및 검증',
        inputPlaceholder: 'JSON 데이터 입력',
        invalidJson: '유효하지 않은 JSON',
        copyButton: '복사',
        copiedMessage: '복사됨'
      },
      urlDecode: {
        title: 'URL 디코더',
        description: 'URL 인코딩된 문자열 디코딩',
        inputLabel: '디코딩할 URL 입력',
        resultLabel: '디코딩 결과',
        copyButton: '복사',
        copiedMessage: '복사됨'
      },
    },
    notFound: {
      title: '404 - 페이지를 찾을 수 없습니다',
      description: '죄송합니다. 찾고 있는 페이지가 존재하지 않습니다.',
      back_home: '홈으로 돌아가기'
    }
  },
};

let currentLanguage = localStorage.getItem('language') || 'en';
let listeners = [];

export function setLanguage(lang) {
  if (i18n[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    listeners.forEach(listener => listener(currentLanguage));
  }
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key) {
  const keys = key.split('.');
  let value = i18n[currentLanguage];
  for (const k of keys) {
    if (value[k] === undefined) {
      return key;
    }
    value = value[k];
  }
  return value;
}

export function useTranslation() {
  const [lang, setLang] = useState(currentLanguage);

  useEffect(() => {
    const listener = (newLang) => setLang(newLang);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return { t, lang, setLanguage };
}
