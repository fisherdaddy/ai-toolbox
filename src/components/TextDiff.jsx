import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../js/i18n';
import SEO from './SEO';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

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

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  resize: none;
  background: rgba(255, 255, 255, 0.9);
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const DiffContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DiffViewContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const DiffPanel = styled.div`
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

const LineNumbersContainer = styled.div`
  width: 40px;
  padding-right: 10px;
  text-align: right;
  color: #6e7681;
  user-select: none;
  border-right: 1px solid #d0d7de;
`;

const DiffContent = styled.div`
  display: flex;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
  margin-top: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
`;

const DiffLine = styled.div`
  display: flex;
  width: 100%;
  background-color: ${props => {
    if (props.$added) return 'rgba(46, 160, 67, 0.15)';
    if (props.$removed) return 'rgba(248, 81, 73, 0.15)';
    return 'transparent';
  }};
`;

const LineContent = styled.div`
  padding: 0 8px;
  flex: 1;
  color: ${props => {
    if (props.$added) return '#1a7f37';
    if (props.$removed) return '#cf222e';
    return 'inherit';
  }};
`;

const LineNumber = styled.div`
  color: #6e7681;
  padding: 0 8px;
  text-align: right;
  user-select: none;
  min-width: 40px;
  border-right: 1px solid #d0d7de;
`;

const DiffHeader = styled(TitleLabel)`
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

function TextDiff() {
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const processText = (text) => {
    return text.split('\n');
  };

  const oldLines = processText(oldText);
  const newLines = processText(newText);
  const maxLines = Math.max(oldLines.length, newLines.length);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <SEO
        title={t('tools.textDiff.title')}
        description={t('tools.textDiff.description')}
      />
      <Container>
        <DiffViewContainer>
          <DiffPanel>
            <DiffHeader>{t('tools.textDiff.originalText')}</DiffHeader>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder={t('tools.textDiff.originalPlaceholder')}
              style={{
                width: '100%',
                height: '200px',
                padding: '8px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                fontFamily: 'Monaco, Menlo, Consolas, monospace',
                resize: 'none'
              }}
            />
            <DiffContent>
              <LineNumber>
                {oldLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </LineNumber>
              <div style={{ flex: 1 }}>
                {oldLines.map((line, i) => (
                  <DiffLine
                    key={i}
                    $removed={!newLines.includes(line)}
                  >
                    <LineContent $removed={!newLines.includes(line)}>
                      {line}
                    </LineContent>
                  </DiffLine>
                ))}
              </div>
            </DiffContent>
          </DiffPanel>

          <DiffPanel>
            <DiffHeader>{t('tools.textDiff.newText')}</DiffHeader>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={t('tools.textDiff.newPlaceholder')}
              style={{
                width: '100%',
                height: '200px',
                padding: '8px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                fontFamily: 'Monaco, Menlo, Consolas, monospace',
                resize: 'none'
              }}
            />
            <DiffContent>
              <LineNumber>
                {newLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </LineNumber>
              <div style={{ flex: 1 }}>
                {newLines.map((line, i) => (
                  <DiffLine
                    key={i}
                    $added={!oldLines.includes(line)}
                  >
                    <LineContent $added={!oldLines.includes(line)}>
                      {line}
                    </LineContent>
                  </DiffLine>
                ))}
              </div>
            </DiffContent>
          </DiffPanel>
        </DiffViewContainer>
      </Container>
    </>
  );
}

export default TextDiff; 