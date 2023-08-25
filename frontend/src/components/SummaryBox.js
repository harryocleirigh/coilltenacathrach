import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../App.css';

function SummaryBox ({selectedPostcode, treeStats}){

    const [labels, setLabels] = useState(null);
    const [data, setData] = useState(null)
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);

    useEffect(() => {

        if (treeStats) {

            console.log(treeStats);

            // Sort the treeStats by value in descending order
            const sortedTreeStatsArray = Object.entries(treeStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8);

            // Convert the sorted array back to an object
            const top10TreeStats = Object.fromEntries(sortedTreeStatsArray);

            // If you need to extract the labels and data separately:
            const extractedLabels = Object.keys(top10TreeStats);
            const extractedData = Object.values(top10TreeStats);
            
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
            indexAxis: 'y', // Change this to 'y' for horizontal bars
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    },
                },
                x: {
                    display: true,
                    grid: {
                        display: false,
                        color: 'white'
                    },
                    ticks:{
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {},
                title: {
                    display: true,
                    text: ``,
                    color: 'white',
                    font: {
                        size: 12,
                        family: 'Inter'  // Set font family to 'Inter' here
                    },
                    align: 'center'
                },
            },
        };
        return options;
    }    

    // function used to make the chart data
    const makeChartData = (names, dataValues) => {
        
        const data = {
            labels: names,
            datasets: [
                { 
                    label: ``,
                    barThickness: 36,
                    data: dataValues,
                    backgroundColor: '#326932'
                },
            ],
        };

        return data
    }

    return (
        <div className='floating-summary-box'>
            <h1 style={{textAlign: 'center', marginBottom: '0px'}}>Trees of {selectedPostcode}</h1>
            <div className='chart-holder'>
                {chartData && chartOptions ? (
                    <Bar data={chartData} options={chartOptions}/>
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    )
}
    
export default SummaryBox;