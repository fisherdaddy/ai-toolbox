import React from 'react';
import '../styles/Timeline.css';
import events from '../data/openai-releases.json';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';


const timeline = () => {
  const { t } = useTranslation();

  return (
    <>
     <SEO
        title={t('tools.openAITimeline.title')}
        description={t('tools.openAITimeline.description')}
      />
      <div className="container">
        <div className="timeline-title">OpenAI 产品发布时间线</div>
        <ul className="timeline">
          {events.map((item, index) => (
            <li className="event" key={index}>
              <div className="event-content">
                <div className="event-date">{item.date}</div>
                <div className="event-title">{item.title}</div>
                <div class="event-feature">{item.feature}</div>
                <div class="event-description">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default timeline;
