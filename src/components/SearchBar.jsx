import React from 'react';
import '../App.css';
// import Box from '@material-ui/core/Box';
// import { FaSearch } from 'react-icons/fa' // иконка

function SearchBar() {
  return (
    <div className="search-bar-container">
      {/* на всяк случай эконку */}
      {/* <FaSearch style={{ marginRight: '8px' }} /> */}
      <input
        type="text"
        placeholder="Поиск по сайту"
      />
    </div>
  )
}

export default SearchBar
