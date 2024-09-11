import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JsonFormatter from './components/JsonFormatter';
import Header from './components/Header';
import Footer from './components/Footer';
import TextToImage from './components/TextToImage';
import UrlDecode from './components/UrlDecode';

function App(op) {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text2image" element={<TextToImage />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/url-decode" element={<UrlDecode />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
