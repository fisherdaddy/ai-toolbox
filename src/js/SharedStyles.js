import styled from 'styled-components';

export const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: #1a73e8; // Google Blue
  text-align: center;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 12px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335); // Google colors
    border-radius: 2px;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 2000px;
  margin: 10px auto;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
    z-index: -1;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
  }
`;

export const InputText = styled.textarea`
  width: 100%;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  outline: none;
  resize: none;

  @media (min-width: 768px) {
    width: 50%;
    height: 100%;
    border-bottom: none;
    border-right: 1px solid #e0e0e0;
  }
`;

export const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 50%;
    height: 100%;
  }
`;

export const Preview = styled.div`
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  text-align: left;
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 10px;
  font-size: 14px;
  max-height: 200px;

  @media (min-width: 768px) {
    max-height: none;
  }

  h1, h2, h3, h4 {
    color: #2c3e50;
    margin-top: 0.5em;
    margin-bottom: 0.3em;
    line-height: 1.2;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;