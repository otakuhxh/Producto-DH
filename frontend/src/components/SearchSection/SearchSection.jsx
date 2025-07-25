import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = () => {
  const [searchInput, setSearchInput] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', { searchInput, checkIn, checkOut });
    // Aquí iría la lógica para conectar con el backend
  };

  return (
    <section className="search-section">
      <h1>Busca ofertas en hoteles, casas y mucho más</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="¿A dónde vamos?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="date-inputs">
          <div className="input-group">
            <label>Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
    </section>
  );
};

export default SearchSection;