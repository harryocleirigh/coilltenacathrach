import React, { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity } from '@fortawesome/free-solid-svg-icons'
import { isVisible } from '@testing-library/user-event/dist/utils';

export default function Navbar({ treeLayers, postcodeLayers, resetMap, setPostCodeLayersVisibility, setGlobalLayersVisibility }) {

  const [treesAreVisible, setTreesAreVisible] = useState(true);
  const [postcodesAreVisible, setPostcodesAreVisible] = useState(false);

  return (
    
    <div className="navbar">
      <div className="navbar-links-wrapper">
        <FontAwesomeIcon 
          icon={faTreeCity} 
          onClick={() => window.location.reload()} 
          style={{height: '100%', width: '36px', cursor: 'pointer'}}/>
      </div>
      {/* <button onClick={() => {setGlobalLayersVisibility(treeLayers, treesAreVisible); setTreesAreVisible(!treesAreVisible)}}>Show/Hide Trees</button>
      <button onClick={() => {setPostCodeLayersVisibility(postcodeLayers, postcodesAreVisible); setPostcodesAreVisible(!postcodesAreVisible); console.log(postcodeLayers)}}>Show/Hide Postcodes</button> */}

      {/* <button 
        onClick={() => {
          if (postcodesAreVisible) { 
            console.log('is vis')
            setPostCodeLayersVisibility(postcodeLayers, postcodesAreVisible);
            setPostcodesAreVisible(!postcodesAreVisible);
          } else {
            console.log('not vis')
            setGlobalLayersVisibility(postcodesAreVisible);
            setPostcodesAreVisible(!postcodesAreVisible);
          }
          }}>
        Show/Hide Postcodes
      </button> */}
    </div>
  );
} 
