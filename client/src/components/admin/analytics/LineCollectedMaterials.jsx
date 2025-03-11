import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";
import { fetchAvailableYears } from "../../../util/http";
import CustomLoader from "../../models/CustomLoader";

const fetchTotalMaterialsCollected = async () => {
    const response = await axios.get("/total-materials-collected");
    return response.data;
};

// ✅ Normalize dates to LOCAL time
const normalizeToLocalTime = (date) => {
    const localDate = new Date(date);
    return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
};

// ✅ Get the week number based on ISO standards
// const getWeekNumber = (date) => {
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
//     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
// };

// const getStartOfWeek = (date) => {
//     const day = date.getDay(); // Get day of the week (0 - Sunday, 6 - Saturday)
//     const diff = date.getDate() - day; // Adjust to the start of the week (Sunday)
//     return new Date(date.setDate(diff));
// };

// const getEndOfWeek = (date) => {
//     const startOfWeek = getStartOfWeek(new Date(date));
//     return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
// };

// const startOfWeek = getStartOfWeek(new Date());
// const endOfWeek = getEndOfWeek(new Date());

const getWeekNumberInMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfMonth = date.getDate();

    return Math.ceil((dayOfMonth + firstDayWeekday) / 7); // Week number in the month
};

// ✅ Get the start and end of the current week (Sunday - Saturday)
const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};

function LineCollectedMaterials() {
    const [selectedCollectionType, setSelectedCollectionType] = useState("monthly");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allData, setAllData] = useState([]);

    // ✅ Fetch data using React Query
    const { data, isLoading, error } = useQuery({
        queryKey: ["totalMaterialsCollected"],
        queryFn: fetchTotalMaterialsCollected,
        staleTime: 30000,
        gcTime: 30000,
        refetchInterval: 30000,
    });

    const { data: yearData, isLoading: loadingYear, error: yearError } = useQuery({
        queryKey: ["availableYears"],
        queryFn: fetchAvailableYears,
        staleTime: 30000,
        gcTime: 30000,
        refetchInterval: 30000,
    });

    // ✅ Convert Firestore timestamps to JavaScript Date objects
    useEffect(() => {
        if (data) {
            setAllData(
                data.map((item) => ({
                    ...item,
                    date: new Date(item.date.toDate ? item.date.toDate() : item.date),
                }))
            );
        }
    }, [data]);

    // ✅ Filter data based on the selected collection type
    const filteredData = useMemo(() => {
        if (!allData.length) return [];

        let startDate, endDate;

        if (selectedCollectionType === "daily") {
            const { startOfWeek, endOfWeek } = getCurrentWeekRange();
            startDate = startOfWeek;
            endDate = endOfWeek;
        } else if (selectedCollectionType === "weekly") {
            startDate = new Date(selectedYear, new Date().getMonth(), 1);
            endDate = new Date(selectedYear, new Date().getMonth() + 1, 0);
        } else {
            startDate = new Date(selectedYear, 0, 1);
            endDate = new Date(selectedYear, 11, 31);
        }

        return allData.filter(({ date }) => date >= startDate && date <= endDate);
    }, [allData, selectedCollectionType, selectedYear]);

    // ✅ Generate labels dynamically based on the selected type
    const labels = useMemo(() => {
        if (selectedCollectionType === "daily") return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (selectedCollectionType === "weekly") return Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`);
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    }, [selectedCollectionType]);

    // ✅ Extract unique material names for dataset grouping
    const materialNames = [...new Set(filteredData.map(({ material_name }) => material_name))];

    // ✅ Define colors for different materials
    const materialColors = {
        "pet bottle": { borderColor: "rgba(90, 158, 140, 0.6)", backgroundColor: "rgba(90, 158, 140, 1)" },
        "can": { borderColor: "rgb(32, 77, 44, 0.6)", backgroundColor: "rgb(32, 77, 44, 1)" },
    };

    // ✅ Create datasets dynamically for chart
    const datasets = materialNames.map((material) => ({
        label: material,
        data: labels.map((_, index) =>
            filteredData
                .filter(({ date, material_name }) => {
                    const localDate = normalizeToLocalTime(date);
                    if (selectedCollectionType === "daily") return localDate.getDay() === index && material_name === material;
                    if (selectedCollectionType === "weekly") return getWeekNumberInMonth(date) === index + 1 && material_name === material;
                    return localDate.getMonth() === index && material_name === material;
                })
                .reduce((sum, { total_grams }) => sum + total_grams, 0)
        ),
        borderColor: materialColors[material]?.borderColor || "rgba(0, 0, 0, 0.6)",
        backgroundColor: materialColors[material]?.backgroundColor || "rgba(0, 0, 0, 1)",
        fill: false,
    }));

    // ✅ Chart Options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                ticks: {
                    font: { size: window.innerWidth < 768 ? 8 : 14 },
                },
            },
        },
    };

    return (
        <>
            <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                Total collected materials
            </h4>

            <div className="card flex flex-col gap-4">
                <div className="flex gap-4 justify-end w-full">
                    {loadingYear ? (
                        <p>Loading...</p>
                    ) : yearError ? (
                        <p className="text-red-500">⚠️ {yearError.message}</p>
                    ) : (
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                            {yearData.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex gap-2">
                    {["monthly", ...(selectedYear === new Date().getFullYear() ? ["weekly", "daily"] : [])].map((type) => (
                        <label key={type} className="cursor-pointer capitalize px-4 py-2 border rounded-full">
                            <input
                                type="radio"
                                name="collection"
                                value={type}
                                checked={selectedCollectionType === type}
                                onChange={(e) => setSelectedCollectionType(e.target.value)}
                                className="hidden"
                            />
                            {type}
                        </label>
                    ))}
                </div>

                {isLoading ? <CustomLoader /> : error ? <p className="text-red-500">⚠️ {error.message}</p> : <Line data={{ labels, datasets }} options={chartOptions} />}
            </div>
        </>
    );
}

export default LineCollectedMaterials;
