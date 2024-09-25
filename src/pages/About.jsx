import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';
import '../styles/About.css'; // 新增的样式文件

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
          <h1>{t('about.title')}</h1>
          <p>{t('about.description')}</p>
          <h2>{t('about.mission')}</h2>
          <p>{t('about.missionDescription')}</p>
          <h2>{t('about.team')}</h2>
          <p>{t('about.teamDescription')}</p>
          <h2>{t('about.contact')}</h2>
          <div className="social-links">
            <a href="https://x.com/fun000001" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://fisherdaddy.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fas fa-blog"></i> Blog
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;