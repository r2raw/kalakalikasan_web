import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";
import { fetchAvailableSalesYears, fetchSalesTrend } from "../../../util/http";
import CustomLoader from "../../models/CustomLoader";
import { useParams } from "react-router-dom";

function SalesTrendChart() {
    const { id } = useParams();
    const [selectedView, setSelectedView] = useState("monthly");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allData, setAllData] = useState([]);

    // Fetch sales trend data using React Query
    const { data, isLoading, error } = useQuery({
        queryKey: ["stores", id, "sales-trend"],
        queryFn: ({ signal }) => fetchSalesTrend({ signal, id }),
        staleTime: 30000,
        gcTime: 30000,
        refetchInterval: 30000,
    });


    const { data: availableYears, isLoading: loadingYears, error: yearError } = useQuery({
        queryKey: ["stores", id, "available-sales-years"],
        queryFn: ({ signal }) => fetchAvailableSalesYears({ signal, id }),
        staleTime: 30000,
        gcTime: 30000,
    });

    // Process Firestore timestamps & store in state
    useEffect(() => {
        if (data) {
            setAllData(
                data.map(item => ({
                    ...item,
                    date: new Date(item.date),
                }))
            );
        }
    }, [data]);

    // Date filtering logic
    const filteredData = useMemo(() => {
        if (!allData.length) return [];

        let startDate = new Date(selectedYear, 0, 1);
        let endDate = new Date(selectedYear, 11, 31);

        if (selectedView === "daily" || selectedView === "weekly") {
            startDate = new Date(selectedYear, new Date().getMonth(), 1);
            endDate = new Date(selectedYear, new Date().getMonth() + 1, 0);
        }

        return allData.filter(({ date }) => date >= startDate && date <= endDate);
    }, [allData, selectedView, selectedYear]);

    // Labels for the X-Axis (Months, Weeks, Days)
    const labels = useMemo(() => {
        if (selectedView === "daily") return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (selectedView === "weekly") return Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`);
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }, [selectedView]);

    // Process sales data
    const dataset = [
        {
            label: "Total Sales",
            data: labels.map((_, index) => {
                return filteredData
                    .filter(({ date }) => {
                        if (selectedView === "daily") return date.getDay() === index;
                        if (selectedView === "weekly") return Math.ceil(date.getDate() / 7) === index + 1;
                        return date.getMonth() === index;
                    })
                    .reduce((sum, { sales }) => sum + sales, 0);
            }),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Sales Trend
            </h4>
            <div className="card flex flex-col gap-4">
                {/* Year & View Selection */}
                <div className="flex gap-4 justify-end w-full">
                    {loadingYears ? (
                        <p>Loading...</p>
                    ) : yearError ? (
                        <p className="text-red-500">⚠️ {yearError.message}</p>
                    ) : (
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                            {availableYears.length === 0 ? (
                                <option value="">No sales available</option>
                            ) : (
                                availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))
                            )}
                        </select>
                    )}
                </div>

                {/* Time Filter Options */}
                <div className="flex gap-2">
                    {["monthly", "weekly", "daily"].map(view => (
                        <div key={view}>
                            <input
                                className="peer hidden"
                                id={view}
                                type="radio"
                                name="salesView"
                                value={view}
                                checked={selectedView === view}
                                onChange={(e) => setSelectedView(e.target.value)}
                            />
                            <label htmlFor={view} className="peer-checked:bg-accent_color border peer-checked:text-base_color border-accent_color rounded-full px-4 py-2 cursor-pointer capitalize">
                                {view}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                {isLoading ? <CustomLoader /> : error ? <p className="text-red-500">⚠️ {error.message}</p> : <Line data={{ labels, datasets: dataset }} />}
            </div>
        </div>
    );
}

export default SalesTrendChart;
