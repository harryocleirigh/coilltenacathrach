import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart, { ArcElement, Legend, Tooltip } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRotateBack, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import '../App.css';

Chart.register(
    ArcElement,
    Tooltip,
    Legend
)

function MobileSummaryBox ({selectedPostcode, treeStats, map, resetMap, setIsSummaryBoxShowing, isSummaryBoxShowing}){

    const [labels, setLabels] = useState(null);
    const [data, setData] = useState(null)
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);
    const [filteringInProgress, setFilteringInProgress] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");

    const chartRef = useRef();

    const dropDownOptions = 
        treeStats ? 
            Object.keys(treeStats).sort().map((key, index) => 
                <option key={index} value={key}>
                    {key}
                </option>
            )
            : null;

    const dropdownValueSelected = (value) => {

        const dropdownValue = (value.target.value)
        setIsSummaryBoxShowing(false);
        setDropdownValue(dropdownValue)
        highlightTreeOnMap(dropdownValue)
        

    }

    const segmentClicked = (event) => {

        const clickedElements = chartRef.current.getElementsAtEventForMode(event, 'point', { intersect: true }, true);
        
        if (clickedElements.length > 0) {

            const dataIndex = clickedElements[0].index;
            const datasetIndex = clickedElements[0].datasetIndex;
            
            if (chartData && chartData.labels && chartData.datasets) {
                
                const label = chartData.labels[dataIndex];

                setDropdownValue(label);

                setIsSummaryBoxShowing(false);

                highlightTreeOnMap(label)

            } else {
                console.error('chartData or its properties are undefined.');
            }
        }
    }    

    useEffect(() => {

        if (treeStats) {

            // Sort the treeStats by value in descending order
            const sortedTreeStatsArray = Object.entries(treeStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 16);

            // Convert the sorted array back to an object
            const topTreeStats = Object.fromEntries(sortedTreeStatsArray);

            // If you need to extract the labels and data separately:
            const extractedLabels = Object.keys(topTreeStats);
            const extractedData = Object.values(topTreeStats);
            
            setLabels(extractedLabels);
            setData(extractedData);
            
            const chartOptions = makeChartOptions();
            const chartData = makeChartData(extractedLabels, extractedData);
            
            setChartData(chartData);
            setChartOptions(chartOptions);

        }
    }, [treeStats]);

    const highlightTreeOnMap = (treeName) => {

        let stringSlice;
        let layerId;
    
        if (selectedPostcode === 0 || !selectedPostcode) {
            layerId = 'ALL';
        } else {
            if (selectedPostcode.length >= 9) {
                // "D______11 => D11"
                stringSlice = selectedPostcode.slice(-2);
            } else {
                // "D______1 => D1"
                stringSlice = selectedPostcode.slice(-1);
            }
            layerId = `D${stringSlice}`;
        }
    
        if (map && map.current) { 
            map.current.setFilter(layerId, ['==', ['get', 'species'], treeName]);
        } else if (map) {  
            map.setFilter(layerId, ['==', ['get', 'species'], treeName]);
        } else {
            console.error("Map object is not available.");
        }
    } 

    const resetTreeHighlight = () => {

        setDropdownValue("")
        setFilteringInProgress(true);  // Start the animation
    
        if(!selectedPostcode){
            map.current.setFilter('ALL', null);
        } else {
            let stringSlice;
            if (selectedPostcode.length >= 9) {
                stringSlice = selectedPostcode.slice(-2);
            } else {
                stringSlice = selectedPostcode.slice(-1);
            }
    
            const layerId = `D${stringSlice}`;
        
            if (map && map.current) {  
                map.current.setFilter(layerId, null);
            } else if (map) {  
                map.setFilter(layerId, null);
            } else {
                console.error("Map object is not available.");
            }
        }
    }
    
    // animation timer to indicate to user that the filtering is occuring
    useEffect(() => {
        const handleMapIdle = () => {
            setFilteringInProgress(false);  // End the animation
        };
    
        // Attach the event listener
        if (map && map.current) {
            map.current.on('idle', handleMapIdle);
        }
    
        // Clean up the event listener on component unmount
        return () => {
            if (map && map.current) {
                map.current.off('idle', handleMapIdle);
            }
        };
    }, [map]);

    // function used to make the chart options
    const makeChartOptions = () => {
        const options = {      
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    onClick: (e, legendItem) => {
                        setDropdownValue(legendItem.text)
                        highlightTreeOnMap(legendItem.text)
                    },
                    display: false,  // Display legend for Pie charts
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        color: 'white',
                        font: {
                            size: 10,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: 'white',
                    bodyColor: 'white',
                },
                title: {
                    display: false,
                },
            }
        };
        return options;
    }
    
    // function used to make the chart data
    const makeChartData = (names, dataValues) => {

        const colours = [
            '#66c2a5', // Aqua green
            '#fc8d62', // Coral
            '#8da0cb', // Periwinkle blue
            '#e78ac3', // Orchid pink
            '#a6d854', // Lime green
            '#ffd92f', // Sunny yellow
            '#e5c494', // Sandstone
            '#b3b3b3', // Grey
            '#57a0d3', // Sky blue
            '#d95f02',  // Tangerine
            '#33a02c', // Forest green
            '#e31a1c', // Bright red
            '#ff7f00', // Bright orange
            '#6a3d9a', // Deep purple
            '#b15928', // Burnt orange
            '#f28e2b', // Goldfish orange
            '#76b7b2', // Teal green
            '#ff9da7', // Salmon pink
            '#70ad47'  // Pastel green
        ];
        
        const data = {
            labels: names,
            datasets: [
                {
                    data: dataValues,
                    backgroundColor: colours.slice(0, dataValues.length)
                }
            ],
        };
    
        return data;
    } 
    
    // Draggable Div
    const boxRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const handleMouseDown = (e) => {
        const rect = boxRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffsetX(e.clientX - rect.left);
        setOffsetY(e.clientY - rect.top);
    }
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
    
        const containerRect = document.querySelector('.map-container').getBoundingClientRect();
        const navbarRect = document.querySelector('.navbar').getBoundingClientRect();
    
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
    
        const maxX = containerRect.left + containerRect.width - boxRef.current.clientWidth;
        const maxY = containerRect.top + containerRect.height - boxRef.current.clientHeight;
    
        // Ensure the box doesn't go above the bottom of the navbar
        const minY = navbarRect.bottom;
    
        if (x < containerRect.left) x = containerRect.left;
        if (y < minY) y = minY; // Use minY instead of containerRect.top
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
    
        boxRef.current.style.left = x + 'px';
        boxRef.current.style.top = y + 'px';
    };    
    
    const handleMouseUp = (e) => {
        e.preventDefault();
        setIsDragging(false);
    }

    useEffect(() => {

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging, offsetX, offsetY]);

    return (
        <div className={`floating-summary-box-mobile${isSummaryBoxShowing ? ' open' : ''}`} ref={boxRef} onMouseDown={handleMouseDown}>
            <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                {selectedPostcode ? <button className="summarybox-tertiary-button" onClick={() => resetMap()}> 
                    <FontAwesomeIcon icon={faArrowLeft} /> <span style={{marginLeft: '8px'}}>Go Back</span>
                </button> : <div style={{ width: '101px'}}></div>}
                <button className='summarybox-tertiary-button' onClick={() => {setIsSummaryBoxShowing(false);}}>
                    <FontAwesomeIcon icon={faEyeSlash} /> <span style={{marginLeft: '8px'}}>Hide Window</span>
                </button>
            </div>
            <h1 style={{fontSize: '24px', textAlign: 'center', marginTop: '8px', marginBottom: '24px'}}>{selectedPostcode ? `Trees of ${selectedPostcode}` : "Trees of Dublin"}</h1>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <select  value={dropdownValue} className='summarybox-dropdown' onChange={dropdownValueSelected}>
                    <option value="" disabled selected>Filter by tree</option>
                    {dropDownOptions}
                </select>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <button className='reset-filter-button' onClick={resetTreeHighlight}>
                        <FontAwesomeIcon className={filteringInProgress ? "rotating" : ""} icon={faArrowRotateBack} /> <span style={{marginLeft: '8px'}}>Reset Filter</span>
                    </button>
                </div>
            </div>
            <div className='chart-holder-mobile'>
                {chartData && chartOptions ? (
                    <Pie 
                        style={{height: '100%'}}
                        ref={chartRef}
                        data={chartData} 
                        options={chartOptions}
                        onClick={segmentClicked}
                    />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    )
}
    
export default MobileSummaryBox;