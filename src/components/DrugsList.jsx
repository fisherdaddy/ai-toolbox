import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../styles/DrugsList.css';
import drugs from '../data/original-drugs-chn.json';
import SEO from '../components/SEO';
import { useTranslation } from '../js/i18n';
import { usePageLoading } from '../hooks/usePageLoading';
import LoadingOverlay from './LoadingOverlay';

const DrugsList = () => {
  useScrollToTop();
  const { t } = useTranslation();
  const isLoading = usePageLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter drugs based on search term and category
  const filteredDrugs = drugs
    .filter(category => selectedCategory === 'all' || category.category === selectedCategory)
    .map(category => ({
      ...category,
      list: category.list.filter(drug => 
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.factory.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.list.length > 0);

  const totalDrugs = drugs.reduce((acc, curr) => acc + curr.list.length, 0);
  const filteredTotalDrugs = filteredDrugs.reduce((acc, curr) => acc + curr.list.length, 0);

  // Add schema.org structured data for SEO
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": t('tools.drugsList.title'),
      "description": t('tools.drugsList.description'),
      "keywords": ["drugs", "medicine", "China", "NMPA", "pharmaceutical"],
      "url": "https://fishersama.com/drugs-list",
      "creator": {
        "@type": "Organization",
        "name": "National Medical Products Administration",
        "url": "https://www.nmpa.gov.cn/"
      },
      "dateModified": new Date().toISOString().split('T')[0],
      "license": "https://www.nmpa.gov.cn/",
      "numberOfItems": totalDrugs
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [t, totalDrugs]);

  return (
    <>
      <SEO
        title={t('tools.drugsList.title')}
        description={t('tools.drugsList.description')}
        keywords="drugs,medicine,China,NMPA,pharmaceutical,original drugs"
      />
      {isLoading && <LoadingOverlay />}
      <div className="drugs-container">
        <header className="page-header">
          <h1 className="drugs-title">{t('tools.drugsList.title')}</h1>
          <p className="page-description">{t('tools.drugsList.description')}</p>
        </header>
        
        {/* Search and Filter Section */}
        <div className={`search-section ${isSearchFocused ? 'focused' : ''}`}>
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder={t('tools.drugsList.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="search-input"
                  aria-label={t('tools.drugsList.searchPlaceholder')}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    aria-label={t('tools.drugsList.clearSearch')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="search-stats" role="status" aria-live="polite">
                {t('tools.drugsList.showing')} {filteredTotalDrugs} / {totalDrugs} {t('tools.drugsList.items')}
              </div>
            </div>
            <div className="category-filter">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
                aria-label={t('tools.drugsList.selectCategory')}
              >
                <option value="all">{t('tools.drugsList.allCategories')}</option>
                {drugs.map(category => (
                  <option key={category.category} value={category.category}>
                    {category.category} ({category.list.length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Drugs List */}
        <div className="drugs-list" role="main">
          {filteredDrugs.length === 0 ? (
            <div className="no-results">
              <p>{t('tools.drugsList.noResults')}</p>
            </div>
          ) : (
            filteredDrugs.map((category, categoryIndex) => (
              <section key={categoryIndex} className="category-section">
                <div className="category-header">
                  <h2 className="category-title">{category.category}</h2>
                  <span className="category-count">
                    {category.list.length} {t('tools.drugsList.items')}
                  </span>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{t('tools.drugsList.drugName')}</th>
                        <th scope="col">{t('tools.drugsList.manufacturer')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.list.map((drug, drugIndex) => (
                        <tr key={drugIndex}>
                          <td>{drug.name}</td>
                          <td>{drug.factory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </div>

        {/* Source Information */}
        <footer className="source-info">
          <h3>{t('tools.drugsList.sourceTitle')}</h3>
          <p>{t('tools.drugsList.sourceDescription')}</p>
          <a 
            href="https://mp.weixin.qq.com/s/EBu_ZTy5uovPa_8kCs_TBQ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
          >
            {t('tools.drugsList.sourceUrl')}
          </a>
          <p className="update-time">
            {t('tools.drugsList.lastUpdate')}: {new Date().toLocaleDateString()}
          </p>
        </footer>
      </div>
    </>
  );
};

export default DrugsList; 