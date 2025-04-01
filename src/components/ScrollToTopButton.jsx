import React from 'react';
import { useScrollToTopButton } from '../hooks/useScrollToTopButton';
import { useTranslation } from '../js/i18n';

/**
 * A button that appears when the user scrolls down, allowing them to quickly
 * return to the top of the page with a smooth animation.
 */
const ScrollToTopButton = () => {
  const { showButton, scrollToTop } = useScrollToTopButton();
  const { t } = useTranslation();

  return (
    <button 
      className={`scroll-top-button ${showButton ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label={t('common.scrollToTop', '回到顶部')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
};

export default ScrollToTopButton; 