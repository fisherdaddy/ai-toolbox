import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';

const JsonFormatter = lazy(() => import('./components/JsonFormatter'));
const TextToImage = lazy(() => import('./components/TextToImage'));
const UrlDecode = lazy(() => import('./components/UrlDecode'));
const About = lazy(() => import('./pages/About'));
const OpenAITimeline = lazy(() => import('./components/Timeline'));

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text2image" element={<TextToImage />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/url-decode" element={<UrlDecode />} />
              <Route path="/about" element={<About />} />
              <Route path="/openai-timeline" element={<OpenAITimeline />} />
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
