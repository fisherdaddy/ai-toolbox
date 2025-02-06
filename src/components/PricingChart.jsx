// PricingChart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../styles/PricingChart.css';

const ChartLegend = ({ onLegendClick, highlightedBarTypes }) => {
  return (
    <div className="legend">
      <div
        className="legend-item"
        onClick={() => onLegendClick('input')}
        style={{ cursor: 'pointer', opacity: highlightedBarTypes.input ? 1 : 0.5 }}
      >
        <div className="legend-color input-color"></div>
        <span>Input Price</span>
      </div>
      <div
        className="legend-item"
        onClick={() => onLegendClick('output')}
        style={{ cursor: 'pointer', opacity: highlightedBarTypes.output ? 1 : 0.5 }}
      >
        <div className="legend-color output-color"></div>
        <span>Output Price</span>
      </div>
    </div>
  );
};

const ChartBar = ({ price, type, maxPrice, highlighted }) => {
  const getBarHeight = () => {
    return (price / maxPrice) * 300;
  };

  return (
    <div
      className={`bar ${type}-bar`}
      style={{
        height: `${getBarHeight()}px`,
        opacity: highlighted ? 1 : 0.3,
      }}
    >
      <span className="price-label">{price}</span>
    </div>
  );
};

const ProviderColumn = ({ provider, maxPrice, highlightedBarTypes }) => (
  <div className="chart-column">
    <div className="bars-container">
      <ChartBar
        price={provider.inputPrice}
        type="input"
        maxPrice={maxPrice}
        highlighted={highlightedBarTypes.input}
      />
      <ChartBar
        price={provider.outputPrice}
        type="output"
        maxPrice={maxPrice}
        highlighted={highlightedBarTypes.output}
      />
    </div>
    <div className="provider-info">
      <img
        src={`${provider.logo}`}
        alt={`${provider.name} logo`}
        className="provider-logo"
      />
      <span className="provider-name">{provider.name}</span>
    </div>
  </div>
);

const YAxis = ({ maxPrice }) => {
  const numberOfTicks = 5;
  const tickValues = [];

  for (let i = 0; i <= numberOfTicks; i++) {
    const value = ((maxPrice / numberOfTicks) * i).toFixed(2);
    tickValues.push(value);
  }

  return (
    <div className="y-axis">
      {tickValues.reverse().map((value, index) => (
        <div key={index} className="y-axis-label">
          {value}
        </div>
      ))}
    </div>
  );
};

const GridLines = () => (
  <div className="grid-lines">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="grid-line" style={{ bottom: `${(index / 4) * 100}%` }}></div>
    ))}
  </div>
);

const PricingChart = ({ data }) => {
  useScrollToTop();
  const [highlightedBarTypes, setHighlightedBarTypes] = useState({
    input: true,
    output: true,
  });
  const chartAreaRef = useRef(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (chartAreaRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = chartAreaRef.current;
        setHasScroll(scrollWidth > clientWidth);
        // 只在滚动到最左侧时显示提示
        setShowScrollHint(scrollWidth > clientWidth && scrollLeft === 0);
      }
    };

    const handleScroll = () => {
      if (chartAreaRef.current) {
        const { scrollLeft } = chartAreaRef.current;
        // 当用户开始滚动时隐藏提示
        if (scrollLeft > 0) {
          setShowScrollHint(false);
        }
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    if (chartAreaRef.current) {
      chartAreaRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', checkScroll);
      if (chartAreaRef.current) {
        chartAreaRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [data]);

  const handleScrollHintClick = () => {
    if (chartAreaRef.current) {
      const { scrollWidth, clientWidth } = chartAreaRef.current;
      chartAreaRef.current.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: 'smooth'
      });
      setShowScrollHint(false);
    }
  };

  const handleLegendClick = (barType) => {
    setHighlightedBarTypes((prevState) => ({
      ...prevState,
      [barType]: !prevState[barType],
    }));
  };

  const getMaxPrice = () => {
    const prices = data.providers.flatMap((provider) => [
      provider.inputPrice,
      provider.outputPrice,
    ]);
    return Math.max(...prices);
  };

  const maxPrice = getMaxPrice();

  return (
    <div className="pricing-chart">
      <h1 className="chart-title">{data.title}</h1>
      <h2 className="chart-subtitle">{data.subtitle}</h2>

      <ChartLegend onLegendClick={handleLegendClick} highlightedBarTypes={highlightedBarTypes} />

      <div className={`chart-area ${hasScroll ? 'has-scroll' : ''}`} ref={chartAreaRef}>
        <YAxis maxPrice={maxPrice} />
        <div className="chart-container">
          <GridLines />
          {data.providers.map((provider) => (
            <ProviderColumn
              key={provider.name}
              provider={provider}
              maxPrice={maxPrice}
              highlightedBarTypes={highlightedBarTypes}
            />
          ))}
        </div>
        {showScrollHint && (
          <div 
            className="scroll-hint-container"
            onClick={handleScrollHintClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="scroll-hint">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingChart;
