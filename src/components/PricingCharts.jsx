import React from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import PricingChart from '../components/PricingChart';
import OpenaiPricing from '../data/openai-pricing.json';
import LLMPricing from '../data/llm-pricing.json';
import VisionPricing from '../data/vision-model-pricing.json';
import SEO from '../components/SEO';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const PricingCharts = () => {
  useScrollToTop();
  const isLoading = usePageLoading();
  const lastUpdateTime = '2024-12-18 19:56';

  return (
    <>
      <SEO
        title="AI Model Pricing Comparison"
        description="Compare prices of different AI models"
      />
      {isLoading && <LoadingOverlay />}
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
