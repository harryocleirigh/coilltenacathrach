import React, { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity, faTree, faEye} from '@fortawesome/free-solid-svg-icons'

export default function Navbar({ map, setTreeStats, tallySpecies, setIsSummaryBoxShowing, setSelectedPostcode, postcodeLayers, isSummaryBoxShowing, isSummaryBoxAvailable, setIsSummaryBoxAvailable, treeLayers, isClicked}) {

  const [areAllTreesShowing, setAreAllTreesShowing] = useState(false)

  return (
    
    <div className="navbar">
      <div className="navbar-links">
        <FontAwesomeIcon 
          icon={faTreeCity} 
          onClick={() => window.location.reload()} 
          style={{height: '100%', width: '36px', cursor: 'pointer'}}/>
          <h1 className='h1-sidebar-heading'>Trees of Dublin</h1>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', gap: '24px'}}>
        {isSummaryBoxAvailable && !isSummaryBoxShowing ? (
              <button className='transparent-button' onClick={() => {setIsSummaryBoxShowing(true)}}>
                  <FontAwesomeIcon icon={faEye} />
                  <span style={{marginLeft: '12px'}}>Show Window</span>
              </button>
          ) : null}
        <button 
          className='transparent-button'
          onClick={() => {
            if (!areAllTreesShowing) {

              // set to spire lng lat and original zoom level on map load
              map.current.flyTo({ center: [-6.260259, 53.349811], zoom: 11, essential: true });

              map.current.setLayoutProperty('ALL', 'visibility', 'visible');

              postcodeLayers.forEach(layer => {
                map.current.setLayoutProperty(layer, 'visibility', 'none');
                map.current.setLayoutProperty(layer+'-line', 'visibility', 'none');
                map.current.setLayoutProperty(layer+'-text', 'visibility', 'none');
              });

              treeLayers.forEach(layer => {
                map.current.setLayoutProperty(layer, 'visibility', 'none');
                map.current.setFilter(layer, null);
              })
        
              const allLayerData = map.current.getSource('ALL')._data.features;
            
              setAreAllTreesShowing(true);
              const speciesTally = tallySpecies(allLayerData);
              console.log(speciesTally);
              setTreeStats(speciesTally);
              setIsSummaryBoxShowing(true);
              setSelectedPostcode(null);
              setIsSummaryBoxAvailable(true);

            } else {

              isClicked.current = false;

              map.current.setLayoutProperty('ALL', 'visibility', 'none');

              postcodeLayers.forEach(layer => {
                map.current.setLayoutProperty(layer, 'visibility', 'visible');
                map.current.setLayoutProperty(layer+'-line', 'visibility', 'visible');
                map.current.setLayoutProperty(layer+'-text', 'visibility', 'visible');
              });

              postcodeLayers.forEach(layer => {
                map.current.setPaintProperty(layer, 'fill-opacity', 0.4)
                map.current.setPaintProperty(layer+'-line', 'line-width', 1)
                map.current.setPaintProperty(layer+'-text', 'text-color', '#B1FFB1')
              })
                    
              setAreAllTreesShowing(false);
              setTreeStats(null);
              setIsSummaryBoxShowing(false);
              setSelectedPostcode(null);
              setIsSummaryBoxAvailable(false);
        
            }
          }}  
        >
        {areAllTreesShowing ? (
                <>
                    <FontAwesomeIcon icon={faTreeCity} />
                    <span style={{marginLeft: '12px'}}>Show postcodes</span>
                </>
            ) : (
                <>
                    <FontAwesomeIcon icon={faTree} />
                    <span style={{marginLeft: '12px'}}>Show all trees</span>
                </>
            )}
        </button>
      </div>
    </div>
  );
} 