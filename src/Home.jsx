import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'; // Updated import
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';
import DetailPage from './DetailPage';

const Home = () => {
  const [breweries, setBreweries] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [totalMicroBreweries, setTotalMicroBreweries] = useState(0);
  const [totalKoreanBreweries, setTotalKoreanBreweries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredType, setFilteredType] = useState(null);
  const [citySearchTerm, setCitySearchTerm] = useState('');

  const [totalNanoBreweries, setTotalNanoBreweries] = useState(0);
  const [totalRegionalBreweries, setTotalRegionalBreweries] = useState(0);
  const [totalBrewpubs, setTotalBrewpubs] = useState(0);
  const [totalLargeBreweries, setTotalLargeBreweries] = useState(0);
  const [totalPlanningBreweries, setTotalPlanningBreweries] = useState(0);
  const [totalBarBreweries, setTotalBarBreweries] = useState(0);
  const [totalContractBreweries, setTotalContractBreweries] = useState(0);
  const [totalProprietorBreweries, setTotalProprietorBreweries] = useState(0);
  const [totalClosedBreweries, setTotalClosedBreweries] = useState(0);

  useEffect(() => {
    const fetchBreweryTotals = async () => {
      try {
        const microResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=micro');
        setTotalMicroBreweries(microResponse.data.total);

        const nanoResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=nano');
        setTotalNanoBreweries(nanoResponse.data.total);

        const regionalResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=regional');
        setTotalRegionalBreweries(regionalResponse.data.total);

        const brewpubResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=brewpub');
        setTotalBrewpubs(brewpubResponse.data.total);

        const largeResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=large');
        setTotalLargeBreweries(largeResponse.data.total);

        const planningResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=planning');
        setTotalPlanningBreweries(planningResponse.data.total);

        const barResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=bar');
        setTotalBarBreweries(barResponse.data.total);

        const contractResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=contract');
        setTotalContractBreweries(contractResponse.data.total);

        const proprietorResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=proprietor');
        setTotalProprietorBreweries(proprietorResponse.data.total);

        const closedResponse = await axios.get('https://api.openbrewerydb.org/v1/breweries/meta?by_type=closed');
        setTotalClosedBreweries(closedResponse.data.total);
      } catch (error) {
        console.error('Error fetching brewery totals:', error);
      }
    };

    fetchBreweryTotals();
  }, []);


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

  // Fetch default breweries
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle search
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

  // Filter breweries by type
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

  // Filter breweries by city
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

  // Reset filters
  const resetFilters = async () => {
    try {
      await fetchDefaultBreweries();
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  // Total breweries
  const totalBreweries = metaData ? metaData.total : 0;

  // Data for the chart
  const chartData = [
    { type: 'Micro', count: totalMicroBreweries },
    { type: 'Nano', count: totalNanoBreweries },
    { type: 'Regional', count: totalRegionalBreweries },
    { type: 'Brewpub', count: totalBrewpubs },
    { type: 'Large', count: totalLargeBreweries },
    { type: 'Planning', count: totalPlanningBreweries },
    { type: 'Bar', count: totalBarBreweries },
    { type: 'Contract', count: totalContractBreweries },
    { type: 'Proprietor', count: totalProprietorBreweries },
    { type: 'Closed', count: totalClosedBreweries }
  ];

  const maxCount = Math.max(...chartData.map(data => data.count));

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
                <Link to={`/breweries/${brewery.id}`}>See Details</Link> {/* Added Link */}
              </div>
            ))
          ) : (
            breweries.map(brewery => (
              <div key={brewery.id} className="brewery-info">
                <h2>{brewery.name}</h2>
                <p>Type: {brewery.brewery_type}</p>
                <p>City: {brewery.city}</p>
                <p>State: {brewery.state}</p>
                <Link to={`/breweries/${brewery.id}`}>See Details</Link> {/* Added Link */}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="chart-container">
        <h2 style={{textAlign: 'center'}}>Number of Breweries by Type</h2>
        <BarChart width={700} height={500} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" angle={-45} textAnchor="end" interval={0} height={100} />
          <YAxis domain={[0, maxCount + 10]} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
      <Routes> 
        <Route path="/breweries/:id" element={<DetailPage />} /> {/* Wrapped Route inside Routes */}
      </Routes> 
    </div>
  );
};

export default Home;
