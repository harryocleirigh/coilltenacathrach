import React, { useEffect, useState, useRef } from 'react';
import { Pie, getElementsAtEvent } from 'react-chartjs-2';
import Chart, { ArcElement, Legend, Tooltip } from 'chart.js/auto';
import '../App.css';

Chart.register(
    ArcElement,
    Tooltip,
    Legend
)

function SummaryBox ({selectedPostcode, treeStats, map}){

    const [labels, setLabels] = useState(null);
    const [data, setData] = useState(null)
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);

    const chartRef = useRef();

    const segmentClicked = (event) => {

        const clickedElements = chartRef.current.getElementsAtEventForMode(event, 'point', { intersect: true }, true);
    
        console.log('Clicked elements:', clickedElements);
    
        if (clickedElements.length > 0) {

            const dataIndex = clickedElements[0].index;
            const datasetIndex = clickedElements[0].datasetIndex;
            
            if (chartData && chartData.labels && chartData.datasets) {
                const label = chartData.labels[dataIndex];
                const value = chartData.datasets[datasetIndex].data[dataIndex];
    
                console.log(`Clicked on: ${label} - #: ${value}`);

                highlightTreeOnMap(label)
            } else {
                console.error('chartData or its properties are undefined.');
            }
        }
    }    

    useEffect(() => {

        if (treeStats) {

            console.log(treeStats);

            // Sort the treeStats by value in descending order
            const sortedTreeStatsArray = Object.entries(treeStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 12);

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
    
        if (selectedPostcode.length >= 9) {
            stringSlice = selectedPostcode.slice(-2);
        } else {
            stringSlice = selectedPostcode.slice(-1);
        }
    
        console.log(stringSlice);
    
        const layerId = `D${stringSlice}`;
    
        if (map && map.current) { 
            map.current.setFilter(layerId, ['==', ['get', 'species'], treeName]);
        } else if (map) {  
            map.setFilter(layerId, ['==', ['get', 'species'], treeName]);
        } else {
            console.error("Map object is not available.");
        }
    }

    const resetTreeHighlight = () => {

        let stringSlice;
    
        if (selectedPostcode.length >= 9) {
            stringSlice = selectedPostcode.slice(-2);
        } else {
            stringSlice = selectedPostcode.slice(-1);
        }
    
        console.log(stringSlice);
    
        const layerId = `D${stringSlice}`;
    
        if (map && map.current) {  
            map.current.setFilter(layerId, null);
        } else if (map) {  
            map.setFilter(layerId, null);
        } else {
            console.error("Map object is not available.");
        }
    }

    // function used to make the chart options
    const makeChartOptions = () => {
        const options = {      
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    onClick: (e, legendItem) => {}, // Disable the default toggling behavior
                    display: true,  // Display legend for Pie charts
                    position: 'right',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12,
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

    useEffect(() => {
        
        console.log(treeStats);

    }, [treeStats]);    
    
    return (
        <div className='floating-summary-box'>
            <h1 style={{textAlign: 'center', marginBottom: '30px'}}>Trees of {selectedPostcode}</h1>
            <div className='chart-holder'>
                <button onClick={resetTreeHighlight}> Reset Filter</button>
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
    
export default SummaryBox;