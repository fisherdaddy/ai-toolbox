import React from 'react';
import { useTranslation } from '../js/i18n';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <p>&copy; 2024 {t('footer.copyRight')}</p>
    </footer>
  );
}

export default Footer;