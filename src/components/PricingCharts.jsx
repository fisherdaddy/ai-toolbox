import React from 'react';
import PricingChart from '../components/PricingChart';
import OpenaiPricing from '../data/openai-pricing.json';
import LLMPricing from '../data/llm-pricing.json';
import VisionPricing from '../data/vision-model-pricing.json';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const PricingCharts = () => {
  const { t } = useTranslation();
  const lastUpdateTime = '2024-11-06 21:30'; // 硬编码的更新时间

  return (
    <>
      <SEO
        title={t('tools.modelPrice.title')}
        description={t('tools.modelPrice.description')}
      />
      <div className="pricing-charts-container">
        <div className="update-time">数据最后更新时间: {lastUpdateTime}</div>
        <PricingChart data={OpenaiPricing} />
        <PricingChart data={LLMPricing} />
        <PricingChart data={VisionPricing} />
      </div>
    </>
  );
};

export default PricingCharts;
