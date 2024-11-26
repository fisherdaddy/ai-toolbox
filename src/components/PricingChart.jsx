// PricingChart.jsx
import React, { useState } from 'react';
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

      <div className="chart-area">
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
      </div>
    </div>
  );
};

export default PricingChart;
