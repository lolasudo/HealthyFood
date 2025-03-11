import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

const TestApp = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<div>Главная страница</div>} />
      </Routes>
    </Router>
  );
};

export default TestApp;