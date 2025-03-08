import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from "chart.js/auto";
import { fetchAvailableYears } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';

const fetchTotalMaterialsCollected = async () => {
    const response = await axios.get('/total-materials-collected');
    return response.data;
};

function LineCollectedMaterials() {
    const [selectedCollectionType, setSelectedCollectionType] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allData, setAllData] = useState([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['totalMaterialsCollected'],
        queryFn: fetchTotalMaterialsCollected,
        staleTime: 30000,
        gcTime: 30000,
        refetchInterval: 30000,
    });

    const { data: yearData, isLoading: loadingYear, error: yearError } = useQuery({
        queryKey: ['availableYears'],
        queryFn: fetchAvailableYears,
        staleTime: 30000,
        gcTime: 30000,
        refetchInterval: 30000,
    });

    useEffect(() => {
        if (data) {
            setAllData(
                data.map(item => ({
                    ...item,
                    date: new Date(item.date.toDate ? item.date.toDate() : item.date),
                }))
            );
        }
    }, [data]);

    const getWeekNumber = (date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
    };

    const normalizeToUTC = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const filteredData = useMemo(() => {
        if (!allData.length) return [];

        let startDate = new Date(selectedYear, 0, 1);
        let endDate = new Date(selectedYear, 11, 31);

        if (selectedCollectionType === 'daily' || selectedCollectionType === 'weekly') {
            startDate = new Date(selectedYear, new Date().getMonth(), 1);
            endDate = new Date(selectedYear, new Date().getMonth() + 1, 0);
        }

        return allData.filter(({ date }) => date >= startDate && date <= endDate);
    }, [allData, selectedCollectionType, selectedYear]);

    const labels = useMemo(() => {
        if (selectedCollectionType === "daily") return ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
        if (selectedCollectionType === "weekly") return Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`);
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    }, [selectedCollectionType]);

    const materialNames = [...new Set(filteredData.map(({ material_name }) => material_name))];

    const materialColors = {
        "pet bottle": { borderColor: "rgba(90, 158, 140, 0.6)", backgroundColor: "rgba(90, 158, 140, 1)" },
        "can": { borderColor: "rgb(32, 77, 44, 0.6)", backgroundColor: "rgb(32, 77, 44, 1)" }
    };

    const datasets = materialNames.map(material => ({
        label: material,
        data: labels.map((_, index) => {
            return filteredData
                .filter(({ date, material_name }) => {
                    if (selectedCollectionType === "daily") return normalizeToUTC(date).getUTCDay() === index && material_name === material;
                    if (selectedCollectionType === "weekly") return getWeekNumber(date) === index + 1 && material_name === material;
                    return date.getMonth() === index && material_name === material;
                })
                .reduce((sum, { total_grams }) => sum + total_grams, 0);
        }),
        borderColor: materialColors[material]?.borderColor || "rgba(0, 0, 0, 0.6)",
        backgroundColor: materialColors[material]?.backgroundColor || "rgba(0, 0, 0, 1)",
        fill: false,
    }));

    const chartOptions = {
        responsive: true,
        // maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    font: {
                        size: window.innerWidth < 768 ? 8 : 14, // Adjust based on screen width
                    }
                },
    
                beginAtZero: true,
            },
            x: {
                ticks: {
                    font: {
                        size: window.innerWidth < 768 ? 8 : 14, // Adjust based on screen width
                    }
                },
    
            },
        },
    };

    return (
        <>
            <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white  text-sm md:text-xl">
                Total collected materials
            </h4>
            <div className='card flex flex-col gap-4'>
                <div className='flex gap-4 justify-end w-full'>
                    {loadingYear ? <p>Loading...</p> : yearError ? <p className="text-red-500">⚠️ {yearError.message}</p> : (
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                            {yearData.map((year) => (<option key={year} value={year}>{year}</option>))}
                        </select>
                    )}
                </div>

                <div className='flex gap-2'>
                    {["monthly", ...(selectedYear === new Date().getFullYear() ? ["weekly", "daily"] : [])].map(type => (
                        <div key={type}>
                            <input
                                className='peer hidden'
                                id={type}
                                type='radio'
                                name='collection'
                                value={type}
                                checked={selectedCollectionType === type}
                                onChange={(e) => setSelectedCollectionType(e.target.value)}
                            />
                            <label htmlFor={type} className='peer-checked:bg-accent_color border peer-checked:text-base_color text-smm md:text-base border-accent_color rounded-full px-4 py-2 cursor-pointer capitalize'>
                                {type}
                            </label>
                        </div>
                    ))}
                </div>

                {isLoading ? <CustomLoader /> : error ? <p className="text-red-500">⚠️ {error.message}</p> : <Line data={{ labels, datasets }}
                    options={chartOptions} />}
            </div>
        </>
    );
}

export default LineCollectedMaterials;
