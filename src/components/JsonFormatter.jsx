import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
`;

const JsonContainer = styled.div`
  flex: 1;
  overflow: auto;
  height: 400px;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
`;

const ToggleButton = styled.span`
  cursor: pointer;
  color: #666;
  font-weight: bold;
  margin-right: 5px;
`;

const Key = styled.span`
  color: #881391;
`;

const Value = styled.span`
  color: #1a1aa6;
`;

const JsonList = styled.ul`
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
`;

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      setParsedJson(parsed);
    } catch (error) {
      setParsedJson(null);
    }
  }, [input]);

  return (
    <Container>
      <Title>JSON格式化工具</Title>
      <FlexContainer>
        <div style={{ flex: 1 }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入JSON数据"
          />
        </div>
        <JsonContainer>
          {parsedJson ? (
            <JsonView data={parsedJson} />
          ) : (
            <pre>Invalid JSON</pre>
          )}
        </JsonContainer>
      </FlexContainer>
    </Container>
  );
}

function JsonView({ data }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (Array.isArray(data)) {
    return (
      <div>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '[-]' : '[+]'}
        </ToggleButton>
        {!isExpanded && <span>Array</span>}
        {isExpanded && (
          <JsonList>
            {data.map((item, index) => (
              <li key={index}>
                <JsonView data={item} />
              </li>
            ))}
          </JsonList>
        )}
      </div>
    );
  } else if (typeof data === 'object' && data !== null) {
    return (
      <div>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '{-}' : '{+}'}
        </ToggleButton>
        {!isExpanded && <span>Object</span>}
        {isExpanded && (
          <JsonList>
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>
                <Key>"{key}"</Key>: <JsonView data={value} />
              </li>
            ))}
          </JsonList>
        )}
      </div>
    );
  } else if (typeof data === 'string') {
    return <Value>"{data}"</Value>;
  } else {
    return <Value>{JSON.stringify(data)}</Value>;
  }
}

export default JsonFormatter;
