import React, { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';
import SearchIcon from './search.svg';


const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedValue, setDisplayedValue] = useState('Iligan City');
    const [searchResult, setSearchResult] = useState(null);
    const [latitude, setLatitude] = useState('8.2263');
    const [longitude, setLongitude] = useState('124.2385');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
  
    const fetchWeatherData = useCallback(async () => {
      const apiKey = '5547dd5aab46608722fe1d8b508d64a4';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
      try {
        const response = await axios.get(apiUrl);
        console.log('Weather API Response:', response.data);
  
        const weatherCondition = response.data.weather[0].main.toLowerCase();
  
        if (weatherCondition.includes('rain')) {
          setModalMessage("It's about to rain, bring an umbrella or raincoat!");
          setShowModal(true);
        } else if (weatherCondition.includes('clear') || weatherCondition.includes('Sunny')) {
          setModalMessage('The weather is hot. Remember to drink enough water!');
          setShowModal(true);
        } 
  
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }, [latitude, longitude]);
  
    useEffect(() => {
      fetchWeatherData();
    }, [fetchWeatherData]);

  const searchBarangay = async () => {
    const openCageApiKey = '3d476ebe12ba4289ada944f4ee3fbd2c';
    const openCageApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${searchQuery},Iligan&key=${openCageApiKey}`;
    

    try {
      const response = await axios.get(openCageApiUrl);

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        const components = result.components;
        if (components.city && components.city.toLowerCase().includes('iligan')) {
          setSearchResult(result);
          setLatitude(result.geometry.lat);
          setLongitude(result.geometry.lng);
          setDisplayedValue(searchQuery);
        } else {
          setSearchResult(null);
          setDisplayedValue('Location not Found');
        }
      } else {
        setSearchResult(null);
        setDisplayedValue('No results found');
      }
    } catch (error) {
      setSearchResult(null);
      setDisplayedValue('Error searching for barangay');
    }
  };
  

  if (!weather) {
    return <div className='loads'>Loading...</div>;
  }

  const { main, weather: weatherDetails } = weather;
  const temperature = Math.round(main.temp);
  const description = weatherDetails[0].description;

  let WeatherIcon;
  if (description.includes('clear')) {
    WeatherIcon = './images/clear.png';
  } else if (description.includes('rain')) {
    WeatherIcon = './images/rainy.png';
  } else if (description.includes('cloud')) {
    WeatherIcon = './images/cloudy.png';
  } else {
    WeatherIcon = './images/sunny.png';
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('srchBtn').click();
    }
  };

  return (
    <>
      <div className='header'>
        <img src='./logoW.svg' alt='Logo' />
        <h2>Weather Forecast</h2>
        <div className='search-bar'>
          <input
            id='srchBar'
            type='text'
            placeholder='Search Barangay...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id='srchBtn' onClick={searchBarangay}>
            <img src={SearchIcon} style={{ width: '20px', height: '20px' }} alt='search' />
          </button>
        </div>
      </div>

      <div className='content'>
        <div className='search-result'>{searchResult !== null ? <p>{displayedValue}</p> : <p>{displayedValue}</p>}</div>
        <p className='temp'>{temperature}°</p>
        <p className='desc'>{description}</p>
        <img className='icon' src={WeatherIcon} alt={description} draggable='false' />
      </div>

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;
