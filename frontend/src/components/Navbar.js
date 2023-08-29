import React, { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity } from '@fortawesome/free-solid-svg-icons'

export default function Navbar({ map, setTreeStats, tallySpecies, setIsSummaryBoxShowing, setSelectedPostcode, postcodeLayers}) {

  const [areAllTreesShowing, setAreAllTreesShowing] = useState(false)

  return (
    
    <div className="navbar">
      <div className="navbar-links">
        <FontAwesomeIcon 
          icon={faTreeCity} 
          onClick={() => window.location.reload()} 
          style={{height: '100%', width: '36px', cursor: 'pointer'}}/>
          <h1>Trees of Dublin</h1>
      </div>
      <button 
        className='transparent-button'
        onClick={() => {
          if (!areAllTreesShowing) {

            map.current.setLayoutProperty('ALL', 'visibility', 'visible');

            postcodeLayers.forEach(layer => {
              map.current.setLayoutProperty(layer, 'visibility', 'none');
              map.current.setLayoutProperty(layer+'-line', 'visibility', 'none');
              map.current.setLayoutProperty(layer+'-text', 'visibility', 'none');
            });
      
            const allLayerData = map.current.getSource('ALL')._data.features;
          
            setAreAllTreesShowing(true);
            const speciesTally = tallySpecies(allLayerData);
            console.log(speciesTally);
            setTreeStats(speciesTally);
            setIsSummaryBoxShowing(true);
            setSelectedPostcode(null);

          } else {

            map.current.setLayoutProperty('ALL', 'visibility', 'none');

            postcodeLayers.forEach(layer => {
              map.current.setLayoutProperty(layer, 'visibility', 'visible');
              map.current.setLayoutProperty(layer+'-line', 'visibility', 'visible');
              map.current.setLayoutProperty(layer+'-text', 'visibility', 'visible');
            });
                  
            setAreAllTreesShowing(false);
            setTreeStats(null);
            setIsSummaryBoxShowing(false);
            setSelectedPostcode(null);
      
          }
        }}  
      >
        {areAllTreesShowing ? "Show postcodes" : "Show all trees" }
      </button>
    </div>
  );
} 