import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../App.css';

function SummaryBox ({selectedPostcode, treeStats}){

    const [labels, setLabels] = useState(null);
    const [data, setData] = useState(null)
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);

    const chartRef = useRef(null);

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

    // function used to make the chart options
    const makeChartOptions = () => {
        const options = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
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
    
    return (
        <div className='floating-summary-box'>
            <h1 style={{textAlign: 'center', marginBottom: '24px'}}>Trees of {selectedPostcode}</h1>
            <div className='chart-holder'>
                {chartData && chartOptions ? (
                    <Pie 
                        style={{height: '100%'}}
                        data={chartData} 
                        options={chartOptions}           
                    />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    )
}
    
export default SummaryBox;