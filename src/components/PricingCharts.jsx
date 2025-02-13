import React, { useState } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import PricingChart from '../components/PricingChart';
import OpenaiPricing from '../data/openai-pricing.json';
import LLMPricing from '../data/llm-pricing.json';
import VisionPricing from '../data/vision-model-pricing.json';
import ModelRanking from '../data/model-ranking.json';
import ModelRankingMath from '../data/model-ranking-math.json';
import ModelRankingCode from '../data/model-ranking-code.json';
import ModelRankingWeb from '../data/model-ranking-web.json';
import ModelRankingWriting from '../data/model-ranking-writing.json';
import SEO from '../components/SEO';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const TabRankingCharts = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: '综合能力', data: ModelRanking },
    { id: 'math', name: '数学能力', data: ModelRankingMath },
    { id: 'code', name: '代码能力', data: ModelRankingCode },
    { id: 'web', name: 'Web 开发能力', data: ModelRankingWeb },
    { id: 'writing', name: '写作能力', data: ModelRankingWriting },
  ];

  return (
    <div className="tab-ranking-charts">
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}
            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
          >
            <PricingChart data={tab.data} showPricing={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingCharts = () => {
  useScrollToTop();
  const isLoading = usePageLoading();
  const lastUpdateTime = '2025-02-06 18:00';

  return (
    <>
      <SEO
        title="AI Model Pricing & Ranking Comparison"
        description="Compare prices and performance rankings of different AI models"
      />
      {isLoading && <LoadingOverlay />}
      <div className="pricing-charts-container">
        <div className="update-time">
          Last Updated: {lastUpdateTime}
        </div>
        <PricingChart data={OpenaiPricing} />
        <PricingChart data={LLMPricing} />
        <PricingChart data={VisionPricing} />
        <TabRankingCharts />
      </div>
    </>
  );
};

export default PricingCharts;
