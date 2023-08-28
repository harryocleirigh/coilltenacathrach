import React from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity } from '@fortawesome/free-solid-svg-icons'

export default function Navbar({ treeLayers, postcodeLayers, resetMap, setPostCodeLayersVisibility, setGlobalLayersVisibility }) {

  return (
    
    <div className="navbar">
      <div className="navbar-links-wrapper">
        <FontAwesomeIcon 
          icon={faTreeCity} 
          onClick={() => window.location.reload()} 
          style={{height: '100%', width: '36px', cursor: 'pointer'}}/>
      </div>
      <h1>Trees of Dublin</h1>
    </div>
  );
} 