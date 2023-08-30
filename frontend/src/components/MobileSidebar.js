import React, { useState } from 'react';
import '../App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTreeCity, faTree, faEye} from '@fortawesome/free-solid-svg-icons'

export default function MobileSidebar({ map, setTreeStats, tallySpecies, setIsSummaryBoxShowing, setSelectedPostcode, postcodeLayers, isSummaryBoxShowing, isSummaryBoxAvailable, setIsSummaryBoxAvailable, treeLayers, isClicked, isSummaryBoxAvailableRef, areAllTreesShowing, setAreAllTreesShowing }) {

    return(
        <div className='mobile-sidebar'>
            <button 
                className='transparent-mobile-button'
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
                        isSummaryBoxAvailableRef.current = true

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

                        isSummaryBoxAvailableRef.current = false;
                    
                    }
                }}  
            >
            {areAllTreesShowing ? (
                <>
                    <FontAwesomeIcon icon={faTreeCity} style={{height: '80%', width: '80%', alignItems: 'center'}} />
                </>
            ) : (
                <>
                    <FontAwesomeIcon icon={faTree} style={{height: '80%', width: '80%', alignItems: 'center'}} />
                </>
            )}
            </button>
            
            {isSummaryBoxAvailable && !isSummaryBoxShowing ? (
              <button className='transparent-mobile-button' onClick={() => {setIsSummaryBoxShowing(true)}}>
                  <FontAwesomeIcon icon={faEye} />
              </button>
          ) : null}
        </div>
    )
}