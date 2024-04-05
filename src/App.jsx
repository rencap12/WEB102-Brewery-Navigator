import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Import your Home page component
import DetailPage from './DetailPage'; // Import your Detail page component

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breweries/:id" element={<DetailPage />} />
      </Routes>
  );
};

export default App;
