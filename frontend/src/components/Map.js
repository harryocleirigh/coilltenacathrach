import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from './Navbar';
import SummaryBox from './SummaryBox'
import centroid from '@turf/centroid';
import { feature } from '@turf/helpers';

// data
import neighbourhoods from '../data/revisedneighbourhood.geojson'
import { click } from '@testing-library/user-event/dist/click';

function Map() {

    const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_API_KEY;
    const BASE_API_URL = 'http://127.0.0.1:8000'
    const STYLE = 'mapbox://styles/harryocleirigh/clkp8dbvm00ls01phf9bl7of1';   
    const mapContainer = useRef(null);
    const map = useRef(null);
    const originalLNG = -6.260259
    const originalLAT = 53.349811
    
    // global layers:
    const [treeLayers, setTreeLayers] = useState(['D1', 'D2', 'D3', 'D4', 'D5', 'D6','D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D6W'])
    const [postcodeLayers, setPostcodeLayers] = useState([]);
    const [postcodeLineLayers, setPostcodeLineLayers] = useState([]);
    const [postcodeTextLayers, setPostcodeTextLayers] = useState([]);

    // Use States and Refs
    const [singleTreeData, setSingleTreeData] = useState(null);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const isClicked = useRef(false);

    const [isSummaryBoxShowing, setIsSummaryBoxShowing] = useState(false);
    const [selectedPostcode, setSelectedPostcode] = useState(null);

    const [treeStats, setTreeStats] = useState(null);

    // Pop up properties  
    const markerHeight = 10;
    const markerRadius = 10;
    const linearOffset = 5;

    const popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };

    // Instantiate popup once and reuse it
    const popup = useRef(new mapboxgl.Popup({
        offset: popupOffsets,
        closeButton: false,
        closeOnClick: false,
    }));

    // chunks of data
    const [D1, setD1] = useState(null);
    const [D2, setD2] = useState(null);
    const [D3, setD3] = useState(null);
    const [D4, setD4] = useState(null);
    const [D5, setD5] = useState(null);
    const [D6, setD6] = useState(null);
    const [D7, setD7] = useState(null);
    const [D8, setD8] = useState(null);
    const [D9, setD9] = useState(null);
    const [D10, setD10] = useState(null);
    const [D11, setD11] = useState(null);
    const [D12, setD12] = useState(null);
    const [D6W, setD6W] = useState(null);

    // hashmap to access chunked data very quickly from slicing postcode string Dublin 1 = 1 etc.,
    const postcodeToData = {
        "1": D1,
        "2": D2,
        "3": D3,
        "4": D4,
        "5": D5,
        "6": D6,
        "7": D7,
        "8": D8,
        "9": D9,
        "10": D10,
        "11": D11,
        "12": D12,
        "6W": D6W
    };

    // postcodes in Dublin
    const [postcodes, setPostcodes] = useState(null);

    const [error, setError] = useState(null);
    const retryCount = useRef(0);

    // fetch data locally - create react app treats imports as static assets and will therefore look to point to a url:
    const add3DBuildings = (map) => {

        map.addLayer({
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 12,
            'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
            }
        });
    };

    const addPostcodes = (map, neighbourhoods) => {
    
        // Temp arrays to hold layers
        let tempPostcodeLayers = [];
        let tempPostcodeLineLayers = [];
        let tempPostcodeTextLayers = [];

        // loop over the neighborhoods and create a new layer for each
        neighbourhoods.features.forEach((neighbourhood) => {

            const layerId = neighbourhood.properties.postcodes;
            const lineLayerId = `${layerId}-line`;
            const textLayerId = `${layerId}-text`;

            if (!map.getLayer(layerId)) {
                
                map.addLayer({
                    id: neighbourhood.properties.postcodes,
                    type: 'fill',
                    source: {
                    type: 'geojson',
                    data: neighbourhood
                    },
                    paint: {
                    'fill-color': '#326932', // fill color
                    'fill-opacity-transition': { duration: 0.4 }, // .6 second transition
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        0.4
                    ],
                    }
                });

                tempPostcodeLayers.push(layerId);

            }

            if (!map.getLayer(lineLayerId)) {

                map.addLayer({
                    id: neighbourhood.properties.postcodes+'-line',
                    type: 'line',
                    source: {
                    type: 'geojson',
                    data: neighbourhood
                    },
                    paint: {  
                    'line-color': '#b6d7a8',
                    'line-width': 1,
                    'line-width-transition': { duration: 600 }, // .6 second transition
                    }
                });

                tempPostcodeLineLayers.push(lineLayerId);

            }  

            if (!map.getLayer(textLayerId)) {

                map.addLayer({
                    id: textLayerId,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: neighbourhood
                    },
                    layout: {
                        'text-field': ['to-string', ['get', 'postcodes']],
                        'text-size': 12 
                    },
                    paint: {
                        'text-color': '#B1FFB1'
                    }
                });

                tempPostcodeTextLayers.push(textLayerId)
            }
        });

        setPostcodeLayers(prevLayers => [...prevLayers, ...tempPostcodeLayers]);
        setPostcodeLineLayers(prevLayers => [...prevLayers, ...tempPostcodeLineLayers]);
        setPostcodeTextLayers(prevLayers => [...prevLayers, ...tempPostcodeTextLayers]);
    }

    // Init map
    useEffect(() => {
        if (!map.current) {
            // swap out access token
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [originalLNG, originalLAT],
                zoom: 11,
                pitch: 30,
                maxZoom: 20,
                minZoom: 10
            });

            map.current.on('load', () => {
                add3DBuildings(map.current);
                fetchTrees(`${BASE_API_URL}/trees/1`, setD1, 1);
                fetchTrees(`${BASE_API_URL}/trees/2`, setD2, 2);
                fetchTrees(`${BASE_API_URL}/trees/3`, setD3, 3);
                fetchTrees(`${BASE_API_URL}/trees/4`, setD4, 4);
                fetchTrees(`${BASE_API_URL}/trees/5`, setD5, 5);
                fetchTrees(`${BASE_API_URL}/trees/6`, setD6, 6);
                fetchTrees(`${BASE_API_URL}/trees/7`, setD7, 7);
                fetchTrees(`${BASE_API_URL}/trees/8`, setD8, 8);
                fetchTrees(`${BASE_API_URL}/trees/9`, setD9, 9);
                fetchTrees(`${BASE_API_URL}/trees/10`, setD10, 10);
                fetchTrees(`${BASE_API_URL}/trees/11`, setD11, 11);
                fetchTrees(`${BASE_API_URL}/trees/12`, setD12, 12);
                fetchTrees(`${BASE_API_URL}/trees/13`, setD6W, 13);
            });
        }
    }, []); // Empty dependency

    // Set up an event listener for the style.load event
    useEffect(() => {
        if (map.current) {
        map.current.on('style.load', () => {
            setIsStyleLoaded(true);
        });
        }
    }, [map]);
    
    // Add postcodes to map when they're fetched and the style is loaded
    useEffect(() => {
        if (map.current && postcodes && isStyleLoaded) {
            addPostcodes(map.current, postcodes);
        }
        if (map.current && postcodes && postcodes.features) {
            initialiseMouseEvents(map.current, postcodes);
        }
    }, [postcodes, isStyleLoaded, map]); // Runs whenever postcodes state or isStyleLoaded state changes

    useEffect(() => {
        
        const addSourceAndLayer = (id, data) => {
            if (map.current.getSource(id)) {
                map.current.removeLayer(id);
                map.current.removeSource(id);
            }
        
            map.current.addSource(id, {
                'type': 'geojson',
                'data': data,
                tolerance: 10
            });
        
            map.current.addLayer({
                'id': id,
                'type': 'circle',
                'source': id,
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'circle-color': '#326932',
                    'circle-opacity': 1,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 2,  // At zoom level 14 or less, radius is 2
                        14.01, 4 // At zoom level 14.01 or more, radius is 4
                    ],
                }
            }, 'settlement-subdivision-label');
        };
    
        const addDataToMap = () => {
            const treesData = [
                {id: 'D1', data: D1},
                {id: 'D2', data: D2},
                {id: 'D3', data: D3},
                {id: 'D4', data: D4},
                {id: 'D5', data: D5},
                {id: 'D6', data: D6},
                {id: 'D7', data: D7},
                {id: 'D8', data: D8},
                {id: 'D9', data: D9},
                {id: 'D10', data: D10},
                {id: 'D11', data: D11},
                {id: 'D12', data: D12},
                {id: 'D6W', data: D6W},
            ];
        
            treesData.forEach(tree => {
                if (tree.data && map.current) {
                    addSourceAndLayer(tree.id, tree.data);
                }
            });
        };

        addDataToMap();

        return () => {
            // Do cleanup here
            // For instance, remove sources and layers from the map
            if (map.current) {
                ['D1', 'D2', 'D3', 'D4', 'D5', 'D6','D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D6W'].forEach((id) => {
                    if (map.current.getSource(id)) {
                        map.current.removeLayer(id);
                        map.current.removeSource(id);
                    }
                });
            }
        };    

    }, [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D6W, map.current]);

    const initialiseMouseEvents = (map) => {

        postcodes.features.forEach((postcode) => {

            map.on('mousemove', postcode.properties.postcodes, (e) => handleMouseMovePostcode(postcode, map, e))

            map.on('mouseleave', postcode.properties.postcodes, () => handleMouseLeavePostcode(postcode, map))

            map.on('click', postcode.properties.postcodes, (e) => handleClickPostcode(postcode, map, e))
        
        },

        handleMouseOverTree()

    )};

    const handleMouseMovePostcode = (postcode, map) => {

        map.getCanvas().style.cursor = 'pointer';

        if(!isClicked.current){
        
            const layerId = postcode.properties.postcodes;
            const lineLayerId = `${layerId}-line`;
        
            map.setPaintProperty(layerId, 'fill-opacity', 0.8);
            map.setPaintProperty(lineLayerId, 'line-width', 3);
        }

    };

    const handleMouseLeavePostcode = (postcode, map) => {

        if (!isClicked.current){

            const layerId = postcode.properties.postcodes;
            const lineLayerId = `${layerId}-line`;

            map.getCanvas().style.cursor = '';
            map.setPaintProperty(layerId, 'fill-opacity', 0.5);
            map.setPaintProperty(lineLayerId, 'line-width', 1);
        }
    };

    const handleClickPostcode = (postcode, map, e) => {

        if (isClicked.current){

            treeLayers.forEach(layer => {
                map.setLayoutProperty(layer, 'visibility', 'none');
            })
            
        }
    
        setSelectedPostcode(postcode.properties.postcodes);
        
        isClicked.current = true;

        const features = map.queryRenderedFeatures(e.point);

        const clickedPostCode = postcode.properties.postcodes

        if (features.length > 0) {
            
            postcodes.features.forEach((postcode) => {

                const layerId = postcode.properties.postcodes;
                const lineLayerId = `${layerId}-line`;

                if (clickedPostCode != layerId){
                    map.setPaintProperty(layerId, 'fill-opacity', 0);
                    map.setPaintProperty(lineLayerId, 'line-width', 0);
                }            
            });

            const [firstFeature] = features;

            // Create a GeoJSON feature object from the clicked feature
            const geojsonFeature = feature(firstFeature.geometry);
    
            // Use turf to calculate the centroid of the feature
            const featureCentroid = centroid(geojsonFeature);
    
            // Get the coordinates of the centroid
            const [lng, lat] = featureCentroid.geometry.coordinates;
    
            // Fly to the centroid of the polygon
            map.flyTo({ center: [lng, lat], zoom: 13, essential: true });

            const layerId = postcode.properties.postcodes;
            const lineLayerId = `${layerId}-line`;
            map.setPaintProperty(layerId, 'fill-opacity', 0.3);
            map.setPaintProperty(lineLayerId, 'line-width', 3);

            let singlePostcode;
            if (layerId.length >= 9){
                singlePostcode = layerId.slice(-2)
            } else {
                singlePostcode = layerId.slice(-1)
            }

            map.setLayoutProperty(`D${singlePostcode}`, 'visibility', 'visible');

            setIsSummaryBoxShowing(true);

        }

    };

    const getExistingLayers = () => {
        return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6','D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D6W'].filter(layer => map.current.getLayer(layer));
    };   

    const handleMouseOverTree = () => {
        map.current.on('mousemove', (e) => {
            const existingLayers = getExistingLayers();
            const features = map.current.queryRenderedFeatures(e.point, { layers: existingLayers });
            if (features.length > 0) {
                const tree = features[0];
                const singleTree = tree.properties.id;
                if (singleTree){
                    map.current.getCanvas().style.cursor = 'pointer';
                    fetchSingleTree(singleTree, tree);
                }
                map.current.getCanvas().style.current = '';
            } else {
                if (popup.current){
                    popup.current.remove();
                }
            }
        });
    
        getExistingLayers().forEach((layer) => {
            map.current.on('mouseleave', layer, () => {
                if (popup.current) {
                    popup.current.remove();
                }
                map.current.getCanvas().style.cursor = '';
            });
        });
    };
    
    const setPostCodeLayersVisibility = (layerIds, isVisible) => {
        layerIds.forEach(layerId => {
            if (map.current.getLayer(layerId)) {
                map.current.setPaintProperty(layerId, 'fill-opacity', 0.5)
                map.current.setPaintProperty(layerId+'-line', 'line-width', 1)
                isClicked.current = false;
            }
            map.current.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
            map.current.setLayoutProperty(layerId+'-line', 'visibility', isVisible ? 'visible' : 'none');
        });
    };

    // fetch operations
    const fetchTrees = async (url, setTreeData, treeNumber) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}: ${url}, ${setTreeData}, ${treeNumber}`;
                throw new Error(message);
            }
            const data = await response.json();
            setTreeData(data);
        } 
        catch (err) {
            console.log(err);
            if (retryCount.current < 3) {
                retryCount.current++;
                setTimeout(() => fetchTrees(url, setTreeData, treeNumber), 3000);
            } 
            else {
                setError(`Failed to fetch Trees ${treeNumber}`);
                setTreeData([]);
            }
        }
    };

    const fetchSingleTree = async (ID, tree) => {
        try {
            const response = await fetch(`${BASE_API_URL}/singletree/${ID}`);
            if (!response.ok) {
                throw new Error('There has been an error getting the tree data');
            }
            const data = await response.json();
            setSingleTreeData(data);

            if (popup.current) {
                popup.current.remove();
            }
    
            // Create the popup after data has been fetched and set
            popup.current.setLngLat(tree.geometry.coordinates).setHTML(`<p>${data.Species_Co}</p>`).addTo(map.current);
            
        } catch (error) {
            console.error('Error fetching data for a single tree', error);
        }   
    }

    // Fetch postcodes
    useEffect(() => {
        fetch(neighbourhoods)
        .then(response => response.json())
        .then(data => {
            setPostcodes(data);
        })
        .catch(error => console.error(error));
    }, []); // Empty dependency

    // Define the tally function outside the component for better performance
    const tallySpecies = (features) => {
        return features.reduce((hashmap, feature) => {
            const species = feature.properties.species;
            if (species !== null) {
                hashmap[species] = (hashmap[species] || 0) + 1;
            }
            return hashmap; 
        }, {});
    };
    
    // use effect to handle requests to get the data for the chart bar
    useEffect(() => {

        if(selectedPostcode){

            let singlePostcode; 

            if (selectedPostcode.length >= 9){
                singlePostcode = selectedPostcode.slice(-2)
            } else {
                singlePostcode = selectedPostcode.slice(-1)
            }

            const postcodeData = postcodeToData[singlePostcode]

            if (postcodeData){
                const speciesTally = tallySpecies(postcodeData.features); 
                setTreeStats(speciesTally);
            }
        }       

    }, [selectedPostcode])

    const resetMap = () => {

        console.log('click')

        isClicked.current = false;

        treeLayers.forEach(layer => {
            map.current.setLayoutProperty(layer, 'visibility', 'none');
        })

        postcodeLayers.forEach(layer => {
            map.current.setPaintProperty(layer, 'fill-opacity', 0.5)
            map.current.setPaintProperty(layer+'-line', 'line-width', 1)
        })

        map.current.flyTo({ center: [originalLNG, originalLAT], zoom: 11, essential: true })

        if (popup.current){
            popup.current.remove()
        }

        if (isSummaryBoxShowing){
            setIsSummaryBoxShowing(false);
        }

    }

    return  (
        <div>
        
            <div ref={mapContainer} style={{ width: '100%', height: '100vh' }}> 

            {isSummaryBoxShowing ? (
                <SummaryBox
                    selectedPostcode={selectedPostcode}
                    treeStats={treeStats}
                />
                ) : <></>}

            <Navbar 
                treeLayers={treeLayers}
                postcodeLayers={postcodeLayers}
                postcodeLineLayers={postcodeLineLayers}
                setPostCodeLayersVisibility={setPostCodeLayersVisibility}
                resetMap={resetMap}
            />
        </div>

    </div>
    );
}

export default Map;