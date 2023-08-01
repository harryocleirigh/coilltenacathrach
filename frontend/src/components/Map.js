import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from './Navbar';

// data
import neighbourhoods from '../data/revisedneighbourhood.geojson'

function Map() {

    let popup; // Create a variable to hold the current popup

    const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_API_KEY;
    const BASE_API_URL = 'http://127.0.0.1:5000'
    const mapContainer = useRef(null);
    const map = useRef(null);

    // comment
    
    // Use States
    const [trees, setTrees] = useState([]);
    const [singleTreeData, setSingleTreeData] = useState(null);

    // chunks of data
    const [treesOne, setTreesOne] = useState(null);
    const [treesTwo, setTreesTwo] = useState(null);
    const [treesThree, setTreesThree] = useState(null);
    const [treesFour, setTreesFour] = useState(null);
    const [treesFive, setTreesFive] = useState(null);
    const [treesSix, setTreesSix] = useState(null);
    const [treesSeven, setTreesSeven] = useState(null);
    const [treesEight, setTreesEight] = useState(null);
    const [treesNine, setTreesNine] = useState(null);

    // postcodes in double
    const [postcodes, setPostcodes] = useState(null);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const retryCount = useRef(0);

    // fetch data locally - create react app treats imports as static assets and will therefore look to point to a url:
    // on mount fetch this data

    const add3DBuildings = (map) => {

        map.addLayer({
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
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

        // loop over the neighborhoods and create a new layer for each
        neighbourhoods.features.forEach((neighbourhood) => {

            // construct the layer ID
            const layerId = `${neighbourhood.properties.postcodes}`;

            console.log(layerId)

            // add new properties to our neighbourhood objects so that we can reuse them later (on hover effect)
            neighbourhood.id = layerId;

            // add new line id to our neighbourhood objects so that we can reuse them later (on hover effect)
            const lineLayerId = layerId + '-line';

            // add two distinct layer types:
            // 1. Fill layer -> we will use this to colour in our boundaries
            // 2. Line layer -> we will use this layer to highlight the borders of our boundaries on hover
            
            if (!map.getLayer(layerId)) {

                console.log(`Adding layer: ${neighbourhood.properties.postcodes}`);

                map.addLayer({
                    id: neighbourhood.properties.postcodes,
                    type: 'fill',
                    source: {
                    type: 'geojson',
                    data: neighbourhood
                    },
                    paint: {
                    'fill-color': '#888', // fill color
                    'fill-opacity-transition': { duration: 600 }, // .6 second transition
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.6,
                        0.1
                    ],
                    }
                });

                console.log(`Layer ${neighbourhood.properties.postcodes} added successfully.`);

            }

            if (!map.getLayer(lineLayerId)) {

                console.log(`Adding line layer: ${neighbourhood.properties.postcodes+'-line'}`);

                map.addLayer({
                    id: neighbourhood.properties.postcodes+'-line',
                    type: 'line',
                    source: {
                    type: 'geojson',
                    data: neighbourhood
                    },
                    paint: {  
                    'line-color': '#000000',
                    'line-width': 1,
                    'line-width-transition': { duration: 600 }, // .6 second transition
                    }
                });

                console.log(`Line layer ${neighbourhood.properties.postcodes+'-line'} added successfully.`);

            }  
        });
    }

    // Init map
    useEffect(() => {
        if (!map.current) {
            // swap out access token
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/harryocleirigh/clkp8dbvm00ls01phf9bl7of1',
                center: [-6.278533590277888, 53.31333318416409],
                zoom: 10,
                pitch: 0,
                // maxZoom: 15,
                // minZoom: 11
            });

            map.current.on('load', () => {
                add3DBuildings(map.current);
                fetchTrees(`${BASE_API_URL}/trees/1`, setTreesOne, 1);
                fetchTrees(`${BASE_API_URL}/trees/2`, setTreesTwo, 2);
                fetchTrees(`${BASE_API_URL}/trees/3`, setTreesThree, 3);
                fetchTrees(`${BASE_API_URL}/trees/4`, setTreesFour, 4);
                fetchTrees(`${BASE_API_URL}/trees/5`, setTreesFive, 5);
                fetchTrees(`${BASE_API_URL}/trees/6`, setTreesSix, 6);
                fetchTrees(`${BASE_API_URL}/trees/7`, setTreesSeven, 7);
                fetchTrees(`${BASE_API_URL}/trees/8`, setTreesEight, 8);
                fetchTrees(`${BASE_API_URL}/trees/9`, setTreesNine, 9);
                handleMouseOver();
            });
        }
    }, []); // Empty dependency array so this only runs once

    // Fetch neighbourhoods
    useEffect(() => {
        fetch(neighbourhoods)
        .then(response => response.json())
        .then(data => {
            setPostcodes(data);
        })
        .catch(error => console.error(error));
    }, []); // Empty dependency array so this only runs once

    // Add postcodes to map when they're fetched
    useEffect(() => {
        if (map.current && postcodes) {
            addPostcodes(map.current, postcodes);
        }
    }, [postcodes]); // Runs whenever postcodes state changes

    // Add postcodes to map when they're fetched
    useEffect(() => {
        console.log(postcodes)
    }, [postcodes]); // Runs whenever postcodes state changes


    const fetchTrees = async (url, setTreeData, treeNumber) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
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

            if (popup) {
                popup.remove();
            }
    
            // Create the popup after data has been fetched and set
            popup = new mapboxgl.Popup({ offset: 25 })
                .setLngLat(tree.geometry.coordinates)
                .setHTML(`<p>${data.Species_Co}</p>`) // Use `data.id` because `data` is the response from the fetch
                .addTo(map.current);
            
        } catch (error) {
            console.error('Error fetching data for a single tree', error);
        }   
    }

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
                'paint': {
                    'circle-color': '#C1E1C1',
                    'circle-opacity': 1,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 1.5,  // At zoom level 14 or less, radius is 2
                        14.01, 3 // At zoom level 14.01 or more, radius is 4
                    ],
                }
            }, 'settlement-subdivision-label');
        };
    
        const addDataToMap = () => {
            const treesData = [
                {id: 'treesOne', data: treesOne},
                {id: 'treesTwo', data: treesTwo},
                {id: 'treesThree', data: treesThree},
                {id: 'treesFour', data: treesFour},
                {id: 'treesFive', data: treesFive},
                {id: 'treesSix', data: treesSix},
                {id: 'treesSeven', data: treesSeven},
                {id: 'treesEight', data: treesEight},
                {id: 'treesNine', data: treesNine},
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
                ['treesOne', 'treesTwo', 'treesThree', 'treesFour', 'treesFive', 'treesSix', 'treesSeven', 'treesEight', 'treesNine'].forEach((id) => {
                    if (map.current.getSource(id)) {
                        map.current.removeLayer(id);
                        map.current.removeSource(id);
                    }
                });
            }
        };    

    }, [treesOne, treesTwo, treesThree, treesFour, treesFive, treesSix, treesSeven, treesEight, treesNine, map.current]);

    const handleMouseOver = () => {
        map.current.on('mousemove', (e) => {

            // Query the features under the mouse pointer
            const features = map.current.queryRenderedFeatures(e.point, { layers: ['treesOne', 'treesTwo', 'treesThree', 'treesFour', 'treesFive', 'treesSix', 'treesSeven', 'treesEight', 'treesNine'] });
            
            if (features.length > 0) {

                map.current.getCanvas().style.cursor = 'pointer';

                const tree = features[0];
                const singleTree = tree.properties.id;
                fetchSingleTree(singleTree, tree);
            } 
        });
    
        map.current.on('mouseleave', () => {

            if (popup) {
                popup.remove();
                popup = null;
            }
        });
    }

    return  (
        <div>
            <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
            <Navbar />
        </div>
    )
}

export default Map;