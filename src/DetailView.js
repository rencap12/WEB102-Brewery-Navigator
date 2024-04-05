// DetailView.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailView = () => {
  const { id } = useParams();
  const [breweryDetails, setBreweryDetails] = useState(null);

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        setBreweryDetails(response.data);
      } catch (error) {
        console.error('Error fetching brewery details:', error);
      }
    };

    fetchBreweryDetails();
  }, [id]);

  if (!breweryDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Detail View for Brewery {breweryDetails.name}</h2>
      <p>Name: {breweryDetails.name}</p>
      <p>Type: {breweryDetails.brewery_type}</p>
      <p>Address: {breweryDetails.address_1}</p>
      <p>City: {breweryDetails.city}</p>
      <p>State: {breweryDetails.state_province}</p>
      <p>Postal Code: {breweryDetails.postal_code}</p>
      <p>Country: {breweryDetails.country}</p>
      <p>Phone: {breweryDetails.phone}</p>
      <p>Website: <a href={breweryDetails.website_url}>{breweryDetails.website_url}</a></p>
    </div>
  );
};

export default DetailView;
