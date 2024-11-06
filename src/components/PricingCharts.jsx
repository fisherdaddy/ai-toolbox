// App.jsx 或其他父组件
import React from 'react';
import PricingChart from '../components/PricingChart';
import OpenaiPricing from '../data/openai-pricing.json';
import LLMPricing from '../data/llm-pricing.json';
import VisionPricing from '../data/vision-model-pricing.json';

const PricingCharts = () => {
  const lastUpdateTime = '2024-11-06 21:30'; // 硬编码的更新时间

  return (
    <div className="pricing-charts-container">
      <div className="update-time">数据最后更新时间: {lastUpdateTime}</div>
      <PricingChart data={OpenaiPricing} />
      <PricingChart data={LLMPricing} />
      <PricingChart data={VisionPricing} />
    </div>
  );
};

export default PricingCharts;
