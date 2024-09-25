import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';

const Footer = React.memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} {t('footer.copyRight')}
        <span className="footer-separator" />
        <Link to="/about" className="footer-link">
          {t('navigation.about')}
        </Link>
      </p>
    </footer>
  );
});

export default Footer;