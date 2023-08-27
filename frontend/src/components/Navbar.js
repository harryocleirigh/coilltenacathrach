import React, { useState } from 'react';
import '../App.css';

export default function Navbar({ treeLayers, postcodeLayers, postcodeLineLayers, setLayersVisibility }) {

  const [treesAreVisible, setTreesAreVisible] = useState(true);
  const [postcodesAreVisible, setPostcodesAreVisible] = useState(false);

  return (
    
    <div className="navbar">
      <div className="navbar-links-wrapper">
      <button className="transparent-button" >
        </button>
      </div>
      <button onClick={() => {setLayersVisibility(treeLayers, treesAreVisible); setTreesAreVisible(!treesAreVisible)}}>Show/Hide Trees</button>
      <button onClick={() => {setLayersVisibility(postcodeLayers, postcodesAreVisible); setPostcodesAreVisible(!postcodesAreVisible); console.log(postcodeLayers)}}>Show/Hide Postcodes</button>
    </div>
  );
} 
