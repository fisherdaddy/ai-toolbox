import React from 'react';
import '../styles/Timeline.css';  // 复用已有的Timeline样式
import events from '../data/anthropic-releases.json';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const AnthropicTimeline = () => {
  const { t } = useTranslation();
  useScrollToTop();
  const isLoading = usePageLoading();

  return (
    <>
      <SEO
        title={t('tools.anthropicTimeline.title')}
        description={t('tools.anthropicTimeline.description')}
      />
      {isLoading && <LoadingOverlay />}
      <div className="timeline-container">
        <h1 className="timeline-title">{t('tools.anthropicTimeline.title')}</h1>
        <ul className="timeline">
          {events.map((item, index) => (
            <li className="event" key={index}>
              <div className="event-content">
                <div className="event-date">{item.date}</div>
                <div className="event-title">{item.title}</div>
                <div className="event-feature">{item.feature}</div>
                <div className="event-description">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AnthropicTimeline;