import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [breweries, setBreweries] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [totalMicroBreweries, setTotalMicroBreweries] = useState(0);
  const [totalKoreanBreweries, setTotalKoreanBreweries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredType, setFilteredType] = useState(null);
  const [citySearchTerm, setCitySearchTerm] = useState('');

  const fetchDefaultBreweries = async () => {
    try {
      const response = await axios.get('https://api.openbrewerydb.org/v1/breweries');
      setBreweries(response.data);
      setFilteredType(null);
      setCitySearchTerm(''); // Reset city search term
    } catch (error) {
      console.error('Error fetching default breweries:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.openbrewerydb.org/v1/breweries');
        setBreweries(response.data);

        const metaResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta');
        setMetaData(metaResponse.data);

        const microResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=micro');
        setTotalMicroBreweries(microResponse.data.total);

        const koreanResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_country=south_korea');
        setTotalKoreanBreweries(koreanResponse.data.total);

        // Fetch default breweries here
        fetchDefaultBreweries();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    handleSearch();
  }, [searchTerm]);

  const filterByType = async type => {
    try {
      const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_type=${type}`);
      setBreweries(response.data);
      setFilteredType(type);
      setCitySearchTerm(''); // Reset city search term
    } catch (error) {
      console.error('Error fetching breweries by type:', error);
    }
  };

  useEffect(() => {
    const filterByCity = async () => {
      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${citySearchTerm}`);
        setBreweries(response.data);
        setFilteredType(null);
      } catch (error) {
        console.error('Error fetching breweries by city:', error);
      }
    };

    filterByCity();
  }, [citySearchTerm]);

  const resetFilters = async () => {
    try {
      await fetchDefaultBreweries();
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  const totalBreweries = metaData ? metaData.total : 0;

  return (
    <div className="container">
      <header className="header">
        <h1>Brewery Navigator</h1>
      </header>
      <div className="sidebar">
        <div className="summary">
          <h2>Summary Statistics</h2>
          <p>Total Breweries: {totalBreweries}</p>
          <p>Total Microbreweries: {totalMicroBreweries}</p>
          <p>Total Korean Breweries: {totalKoreanBreweries}</p>
        </div>
        <div className="filter-buttons">
          <h2>Filter By Name</h2>
          <input
            className="search-bar"
            type="text"
            placeholder="Search by brewery name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h2>Filter By City</h2>
          <input
            className="search-bar"
            type="text"
            placeholder="Enter city name"
            value={citySearchTerm}
            onChange={(e) => setCitySearchTerm(e.target.value)}
          />
          <h2>Filter By Type</h2>
          <button onClick={() => filterByType('micro')}>Micro</button>
          <button onClick={() => filterByType('nano')}>Nano</button>
          <button onClick={() => filterByType('regional')}>Regional</button>
          <button onClick={() => filterByType('brewpub')}>Brewpub</button>
          <button onClick={() => filterByType('large')}>Large</button>
          <button onClick={() => filterByType('planning')}>Planning</button>
          <button onClick={() => filterByType('bar')}>Bar</button>
          <button onClick={() => filterByType('contract')}>Contract</button>
          <button onClick={() => filterByType('proprietor')}>Proprietor</button>
          <button onClick={() => filterByType('closed')}>Closed</button>
          <button onClick={resetFilters}>Reset</button>
        </div>
      </div>
      <div className="list-container">
        <div className="list">
          {searchResults.length > 0 ? (
            searchResults.map(brewery => (
              <div key={brewery.id} className="brewery-info">
                <h2>{brewery.name}</h2>
                <p>Type: {brewery.brewery_type}</p>
                <p>City: {brewery.city}</p>
                <p>State: {brewery.state}</p>
              </div>
            ))
          ) : (
            breweries.map(brewery => (
              <div key={brewery.id} className="brewery-info">
                <h2>{brewery.name}</h2>
                <p>Type: {brewery.brewery_type}</p>
                <p>City: {brewery.city}</p>
                <p>State: {brewery.state}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
