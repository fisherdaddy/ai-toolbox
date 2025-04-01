import { useState, useEffect } from 'react';

/**
 * Custom hook to manage a scroll-to-top button that appears
 * when the user scrolls beyond the viewport height
 */
export const useScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled beyond one viewport height
      const scrollThreshold = window.innerHeight * 0.7;
      setShowButton(window.scrollY > scrollThreshold);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return { showButton, scrollToTop };
};

export default useScrollToTopButton; 