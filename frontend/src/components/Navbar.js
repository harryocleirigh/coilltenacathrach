import React, { useState } from 'react';

import '../App.css';


export default function Navbar({ treeLayers, postcodeLayers, postcodeLineLayers, setLayerVisibility }) {

  const [treesAreVisible, setTreesAreVisible] = useState(false);
  const [postcodesAreVisible, setPostcodesAreVisible] = useState(false);

  return (
    
    <div className="navbar">
      <div className="navbar-links-wrapper">
      <button className="transparent-button" >
        </button>
      </div>
      <button onClick={() => {setLayerVisibility(treeLayers, treesAreVisible); setTreesAreVisible(!treesAreVisible)}}>Show/Hide Trees</button>
      <button onClick={() => {setLayerVisibility(postcodeLayers, postcodesAreVisible); setPostcodesAreVisible(!postcodesAreVisible)}}>Show/Hide Postcodes</button>
    </div>
  );
} 
