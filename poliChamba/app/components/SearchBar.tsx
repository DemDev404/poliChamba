import React from 'react';
import './SearchBar.css';

export const SearchBar = () => {
  return (
    <form className="search-form">
      <div className="input-group">
        <label htmlFor="what">Qué</label>
        <input 
          id="what" 
          type="text" 
          placeholder="Puesto, palabra clave o empresa" 
        />
      </div>
      <div className="input-group">
        <label htmlFor="where">Dónde</label>
        <input 
          id="where" 
          type="text" 
          placeholder="Ciudad, estado o código postal" 
        />
      </div>
      <button type="submit" className="search-button">
        Buscar Empleos
      </button>
    </form>
  );
};