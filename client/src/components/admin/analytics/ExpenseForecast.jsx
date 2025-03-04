import { useRef, useEffect } from "react";
import { fetchExpenseForecast } from "../../../util/http";
import { useQuery } from "@tanstack/react-query";
import CustomLoader from "../../models/CustomLoader";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; 

function ExpenseForecast() {
    const chartRef = useRef(null); // Reference for the chart instance

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["analytics", "forecast"],
        queryFn: ({ signal }) => fetchExpenseForecast({ signal }),
        staleTime: 3000,
        gcTime: 30000,
        refetchInterval: 3000,
    });

    let growthRate = <h1 className="py-8">0%</h1>;
    let currentExpense = <h1>0</h1>
    let chartContent = <p>No data found!</p>;


    useEffect(() => {
        // Cleanup previous chart instance before rendering a new one
        if (chartRef.current !== null) {
            chartRef.current.destroy();
        }
    }, [data]); // Run when `data` updates

    if (isPending) {
        growthRate = <CustomLoader />;
        chartContent = <CustomLoader />;
        currentExpense = <CustomLoader />
    }
    if (isError) {
        growthRate = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
        </div>

        currentExpense = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
        </div>

        chartContent = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
        </div>
    }

    if (data) {
        growthRate = <h1 className="py-8 card w-full">{data.growth_rate}</h1>;

        if (data.months && data.months.length > 0) {

            const chartData = {
                labels: data.months.map((item) => item.name),
                datasets: [
                    {
                        label: "Monthly Expense Forecast",
                        data: data.months.map((item) => item.expense),
                        backgroundColor: "rgba(90, 158, 140, 0.6)", // #5A9E8C (Muted Teal)
                        borderColor: "rgba(90, 158, 140, 1)",
                        borderWidth: 1,
                    },
                ],
            };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            };
            const findCurrentExpense = data.months.find(item => item.name == 'This Month')
            console.log(findCurrentExpense);
            currentExpense = <h1 className="py-8 card w-full">{findCurrentExpense.expense}</h1>
            chartContent = (
                <Bar
                    ref={(ref) => (chartRef.current = ref?.chartInstance ?? null)} // Set reference
                    data={chartData}
                    options={chartOptions}
                />
            );
        }
    }

    return (
        <>
            <div className="grid md:grid-cols-2 gap-4 w-full">
                <div className="w-full flex flex-col gap-2 items-center justify-center ">
                    <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                        Growth rate expense
                    </h4>
                    {growthRate}
                </div>
                <div className="w-full flex flex-col gap-2 items-center justify-center">
                    <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                        This month&apos;s expense
                    </h4>
                    {currentExpense}
                </div>
            </div>
            <div className="w-full my-4 card">{chartContent}</div>
        </>
    );
}

export default ExpenseForecast;
