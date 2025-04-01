import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../styles/HorizontalTimeline.css';
import events from '../data/ai-events.json';
import SEO from './SEO';
import { useTranslation } from '../js/i18n';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';
import ScrollToTopButton from './ScrollToTopButton';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'MODEL_RELEASE', label: 'Model Release' },
  { id: 'RESEARCH', label: 'Research & Papers' },
  { id: 'POLICY', label: 'Policy & Regulation' },
  { id: 'BUSINESS', label: 'Business & Industry' },
  { id: 'CULTURE', label: 'Culture' },
  { id: 'OPEN_SOURCE', label: 'Open Source' }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  return `${month}.${day}`;
};

const getCategoryClass = (categoryArray) => {
  const firstCategory = categoryArray && categoryArray.length > 0 ? categoryArray[0] : null;
  const classes = {
    'MODEL_RELEASE': 'model-release',
    'BUSINESS': 'business-industry',
    'RESEARCH': 'research-papers',
    'POLICY': 'policy-regulation',
    'CULTURE': 'culture',
    'OPEN_SOURCE': 'open-source'
  };
  return firstCategory ? classes[firstCategory] || '' : '';
};

// Helper function to format the last updated date
const formatLastUpdatedDate = (dateString) => {
  const date = new Date(dateString);
  // Using Chinese locale for format YYYY年M月D日
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const AITimeline = () => {
  useScrollToTop();
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [groupedEventsByDate, setGroupedEventsByDate] = useState([]);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);

  // Set the last updated date once on component mount
  useEffect(() => {
    // Sort events by date descending to get the most recent event
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortedEvents.length > 0) {
      setLastUpdatedDate(formatLastUpdatedDate(sortedEvents[0].date));
    }
  }, []);

  // Group events by date after sorting descendingly
  useEffect(() => {
    const filtered = selectedCategory === 'all'
      ? events
      : events.filter(event => event.category.includes(selectedCategory));

    // Sort events by date descending
    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Group sorted events by date
    const grouped = sorted.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});

    // Convert grouped object to array of { date, events } sorted by date descending
    const groupedArray = Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a)) // Ensure dates are sorted descendingly
      .map(date => ({ date, events: grouped[date] }));

    setGroupedEventsByDate(groupedArray);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Helper to check if year changes for year separators
  const shouldShowYearSeparator = (currentDateGroup, previousDateGroup) => {
    if (!previousDateGroup) {
      return true; // Show year for the first group
    }
    return new Date(currentDateGroup.date).getFullYear() !== new Date(previousDateGroup.date).getFullYear();
  };

  return (
    <>
      <SEO
        title={t('tools.aiTimeline.title', 'AI Major Events Timeline')}
        description={t('tools.aiTimeline.description', 'A timeline of major events in AI development, research, and regulation')}
      />
      {isLoading && <LoadingOverlay />}
      <div className="vertical-timeline-container">
        <h1 className="timeline-title">{t('tools.aiTimeline.title', 'AI Major Events Timeline')}</h1>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {t(`tools.aiTimeline.categories.${category.id}`, category.label)}
            </button>
          ))}
        </div>
        
        {/* Attribution and Last Updated Section */}
        <div className="timeline-meta-info">
          <p className="timeline-attribution">
            {t('tools.aiTimeline.attribution', '部分数据参考自')} <a href="https://ai-timeline.org/" target="_blank" rel="noopener noreferrer">ai-timeline.org</a>
          </p>
          {lastUpdatedDate && (
            <p className="timeline-last-updated">
              {t('tools.aiTimeline.lastUpdated', '最近更新')}: {lastUpdatedDate}
            </p>
          )}
        </div>

        <div className="timeline-events-list">
          {groupedEventsByDate.map((dateGroup, index) => {
            const currentYear = new Date(dateGroup.date).getFullYear();
            const showYearSeparator = shouldShowYearSeparator(dateGroup, groupedEventsByDate[index - 1]);
            const markerCategoryClass = dateGroup.events.length > 0 ? getCategoryClass(dateGroup.events[0].category) : '';

            return (
              <React.Fragment key={dateGroup.date}>
                {showYearSeparator && (
                  <div className="timeline-year-separator">
                    {currentYear}
                  </div>
                )}
                <div className={`timeline-event-item ${markerCategoryClass}`}>
                  <div className="event-date">{formatDate(dateGroup.date)}</div>
                  <div className="event-cards-container">
                    {dateGroup.events.map((event, eventIndex) => (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`event-link ${getCategoryClass(event.category)}`}
                        key={event.id || `${dateGroup.date}-${eventIndex}`}
                      >
                        <div className="event-content">
                          <div className="event-title">{event.title}</div>
                          <div className="event-description">{event.description}</div>
                          <div className="event-arrow">↗</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Scroll to top button */}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default AITimeline; 