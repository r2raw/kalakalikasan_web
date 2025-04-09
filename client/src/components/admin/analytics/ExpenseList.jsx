import React, { useEffect, useState } from 'react'
import AllExpenses from './AllExpenses'
import { useQuery } from '@tanstack/react-query'
import { fetchListOfExpense } from '../../../util/http'
import CustomLoader from '../../models/CustomLoader'
import RvmExpenses from './RvmExpenses'
import { dbDateFormatter } from '../../../util/formatter'


const getAvailableYear = (data) => {

    let availableYear = new Set();

    availableYear.add(2024)
    data.forEach(item => {
        const itemYear = new Date(dbDateFormatter(item.claiming_date)).getFullYear()

        availableYear.add(itemYear)
    });

    const sortedYear = [...availableYear].sort((a, b) => b - a)
    return sortedYear;

}
const getAvailableMonths = (data) => {

    let availableMonths = new Set();

    data.forEach(item => {
        const itemYear = new Date(dbDateFormatter(item.claiming_date)).getMonth()

        availableMonths.add(itemYear)
    });

    const sortedMonths = [...availableMonths].sort((a, b) => a - b)
    return sortedMonths;

}

const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function ExpenseList() {


    const [filterType, setFilterType] = useState('')
    const [availableYear, setAvailableYear] = useState([]);
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState('');
    // const [filteredData, setFitleredData] = useState([]);


    const { data, isPending, isError, error } = useQuery({
        queryKey: ['expenses', 'list'],
        queryFn: ({ signal }) => fetchListOfExpense({ signal }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })


    useEffect(() => {
        if (data) {
            const years = getAvailableYear(data.expenses)
            setAvailableYear(years)
            setSelectedYear(years[0])
        }
    }, [data])

    const handleFilterChange = (e) => {
        const { value } = e.target;

        setFilterType(value);
    }

    const handleSelectedYearChange = (e) => {
        const { value } = e.target;
        setSelectedMonth('');
        setSelectedYear(value);
    }
    const handleSelectedMonthChange = (e) => {
        const { value } = e.target;
        setFilterType('')
        setSelectedMonth(value);
    }

    let content = <p>No content found</p>
    let yearSelection = <></>
    let monthSelection = <></>

    if (isPending) {
        content = <CustomLoader />
    }

    if (data) {

        let filteredData = data.expenses;
        filteredData = filteredData.filter(item => {
            const claiming_date = new Date(dbDateFormatter(item.claiming_date)).getFullYear()

            return claiming_date == selectedYear;
        })


        if (availableYear.length > 0) {

            const availableMonths = getAvailableMonths(filteredData);
            if (availableMonths.length > 0) {
                monthSelection =
                    <div className='flex gap-2'>
                        <label className=''>Month:</label>
                        <select onChange={handleSelectedMonthChange} className='border cursor-pointer bg-transparent'>
                            <option value=''>All</option>
                            {availableMonths.map(month => <option key={month} value={month}>
                                {monthsArr[month]}
                            </option>)}
                        </select>

                    </div>
            }

            yearSelection = <div className='flex gap-2 lg:order-2'>
                <div className='flex gap-2'>
                    <label className=''>Year:</label>
                    <select onChange={handleSelectedYearChange} className='border cursor-pointer bg-transparent'>
                        {availableYear.map(year => <option key={year}>
                            {year}
                        </option>)}
                    </select>

                </div>
                {monthSelection}
            </div>
        }

        if (selectedMonth != '') {

            filteredData = filteredData.filter(item => {
                const claiming_date = new Date(dbDateFormatter(item.claiming_date)).getMonth()

                return claiming_date == selectedMonth;
            })

        }

        let description = 'Payment Request and RVM Expense Report'

        if (filterType == 'vendo') {
            description = 'RVM Expense Report'
            filteredData = filteredData.filter(item => item.type == 'RVM')
        }
        if (filterType == 'paymentRequest') {

            description = 'Payment Request Expense Report'
            filteredData = filteredData.filter(item => item.type == 'Points Conversion Request')
        }
        if (filteredData.length > 0) {
            content = <AllExpenses data={filteredData} description={description} />

            if (filterType == 'vendo') {
                content = <RvmExpenses data={filteredData} description={description}  />
            }
        }

    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                List of expenses
            </h4>
            <div className='flex flex-col lg:flex-row justify-between gap-4'>
                <div className='flex gap-4 order-1'>
                    <div>
                        <input type='radio' id='all' name='expenseType' value='' className='hidden peer' checked={filterType == ''} onChange={handleFilterChange} />
                        <label htmlFor='all' className='cursor-pointer peer-checked:text-white p-2 rounded-md peer-checked:bg-accent_color border'>All</label>
                    </div>
                    <div>
                        <input type='radio' id='paymentRequest' name='expenseType' value='paymentRequest' className='hidden peer' checked={filterType == 'paymentRequest'} onChange={handleFilterChange} />
                        <label htmlFor='paymentRequest' className='cursor-pointer peer-checked:text-white p-2 rounded-md peer-checked:bg-accent_color border'>Payment Request</label>
                    </div>
                    <div>
                        <input type='radio' id='vendo' name='expenseType' value='vendo' className='hidden peer' checked={filterType == 'vendo'} onChange={handleFilterChange} />
                        <label htmlFor='vendo' className='cursor-pointer  peer-checked:text-white p-2 rounded-md peer-checked:bg-accent_color border'>RVM</label>
                    </div>
                </div>
                {yearSelection}
            </div>

            {content}
        </>
    )
}

export default ExpenseList