import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';
import '../styles/About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('about.title')}
        description={t('about.description')}
      />
      <main>
        <section className="about-section">
          <div className="about-header">
            <h1>{t('about.title')}</h1>
            <p>{t('about.description')}</p>
          </div>
          
          <div className="about-grid">
            <div className="about-card">
              <h2>
                <i className="fas fa-rocket"></i>
                {t('about.mission')}
              </h2>
              <p>{t('about.missionDescription')}</p>
            </div>
            
            <div className="about-card">
              <h2>
                <i className="fas fa-users"></i>
                {t('about.team')}
              </h2>
              <p>{t('about.teamDescription')}</p>
            </div>
            
            <div className="about-card">
              <h2>
                <i className="fas fa-envelope"></i>
                {t('about.contact')}
              </h2>
              <div className="social-links">
                <a href="https://x.com/fun000001" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://fisherdaddy.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fas fa-blog"></i> Blog
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;