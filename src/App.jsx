import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

const DevTools = lazy(() => import('./pages/DevTools'));
const ImageTools = lazy(() => import('./pages/ImageTools'));
const Blog = lazy(() => import('./pages/Blog'));
const AIProduct = lazy(() => import('./pages/AIProduct'));

const JsonFormatter = lazy(() => import('./components/JsonFormatter'));
const MarkdownToImage = lazy(() => import('./components/MarkdownToImage'));
const UrlEnDecode = lazy(() => import('./components/UrlEnDecode'));
const About = lazy(() => import('./pages/About'));
const OpenAITimeline = lazy(() => import('./components/OpenAITimeline'));
const PricingCharts  = lazy(() => import('./components/PricingCharts'));
const HandwriteGen  = lazy(() => import('./components/HandwriteGen'));
const ImageBase64Converter  = lazy(() => import('./components/ImageBase64Converter'));
const QuoteCard = lazy(() => import('./components/QuoteCard'));
const LatexToImage = lazy(() => import('./components/LatexToImage'));

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />

              <Route path="/dev-tools" element={<DevTools />} />
              <Route path="/image-tools" element={<ImageTools />} />
              <Route path="/ai-products" element={<AIProduct />} />
              <Route path="/blog" element={<Blog />} />

              <Route path="/markdown-to-image" element={<MarkdownToImage />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/url-encode-and-decode" element={<UrlEnDecode />} />
              <Route path="/openai-timeline" element={<OpenAITimeline />} />
              <Route path="/llm-model-price" element={<PricingCharts />} />
              <Route path="/handwriting" element={<HandwriteGen />} />
              <Route path="/image-base64" element={<ImageBase64Converter />} />
              <Route path="/quote-card" element={<QuoteCard />} />
              <Route path="/latex-to-image" element={<LatexToImage />} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
        </main>-
      </div>
      <Footer />
    </div>
  );
}

export default App;
