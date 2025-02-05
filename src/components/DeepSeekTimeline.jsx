import React from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../styles/Timeline.css';
import events from '../data/deepseek-releases.json';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const Timeline = () => {
  useScrollToTop();
  const { t } = useTranslation();
  const isLoading = usePageLoading();

  return (
    <>
      <SEO
        title={t('tools.deepSeekTimeline.title')}
        description={t('tools.deepSeekTimeline.description')}
      />
      {isLoading && <LoadingOverlay />}
      <div className="timeline-container">
        <h1 className="timeline-title">{t('tools.deepSeekTimeline.title')}</h1>
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

export default Timeline;
