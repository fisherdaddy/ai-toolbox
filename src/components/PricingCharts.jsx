import React from 'react';
import PricingChart from '../components/PricingChart';
import OpenaiPricing from '../data/openai-pricing.json';
import LLMPricing from '../data/llm-pricing.json';
import VisionPricing from '../data/vision-model-pricing.json';
import SEO from '../components/SEO';

const PricingCharts = () => {
  const lastUpdateTime = '2024-11-06 21:30';

  return (
    <>
      <SEO
        title="AI Model Pricing Comparison"
        description="Compare prices of different AI models"
      />
      <div className="pricing-charts-container">
        <div className="update-time">
          Last Updated: {lastUpdateTime}
        </div>
        <PricingChart data={OpenaiPricing} />
        <PricingChart data={LLMPricing} />
        <PricingChart data={VisionPricing} />
      </div>
    </>
  );
};

export default PricingCharts;
