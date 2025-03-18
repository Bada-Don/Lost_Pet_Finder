// app-updated.jsx
import React, { useState, useEffect, useRef } from 'react';
import AuthPage from './Pages/AuthPage';
import HomePage from './Pages/homePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;