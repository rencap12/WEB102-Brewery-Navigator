import React from 'react';
import DetailView from './DetailView';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './App.css'; // Import the CSS file for styling

const DetailPage = () => {
  return (
    <div className="detailPageContainer">
      <h1 className="detailPageHeader">Detail Page</h1>
      <div className="detailPageContent">
        <DetailView />
        <Link to="/" className="homeButton">Home</Link>
      </div>
    </div>
  );
};

export default DetailPage;
