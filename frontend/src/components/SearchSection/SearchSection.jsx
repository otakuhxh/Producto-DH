import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (checkOut && !checkIn) {
      alert('Por favor selecciona una fecha de check-in');
      return;
    }
    
    onSearch({
      location: searchTerm,
      checkIn,
      checkOut
    });
  };

  return (
    <section className="search-section">
      <h1>Busca ofertas en hoteles, casas y mucho más</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="¿Qué alojamiento buscas?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="date-inputs">
          <div className="input-group">
            <label>Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="input-group">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
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
/*import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (checkOut && !checkIn) {
      alert('Por favor selecciona una fecha de check-in');
      return;
    }
    
    onSearch({
      location: searchInput,
      checkIn,
      checkOut
    });
  };

  return (
    <section className="search-section">
      <h1>Busca ofertas en hoteles, casas y mucho más</h1>
      <form onSubmit={handleSubmit} className="search-form">
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
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="input-group">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
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
*/