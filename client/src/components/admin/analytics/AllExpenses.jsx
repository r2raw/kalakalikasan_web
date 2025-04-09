import React, { forwardRef, useEffect, useRef, useState } from 'react'
import ExpenseTable from '../../table/expenses/ExpenseTable'
import { expensesListColumns } from '../../table/columns/columns'
import FormInput from '../../models/FormInput';
import { currencyFormatter, dateFormatter, dbDateFormatter, dbDateInputFormatter, fullDateFormatter } from '../../../util/formatter';
import PrintModal from '../../models/ui/PrintModal';
import batasan_logo from '../../../assets/logo/batasan_logo.png'
import app_logo from '../../../assets/logo/logo_transparent.png'
import { useReactToPrint } from 'react-to-print';
import AllExpensesPrintView from '../printViews/AllExpensesPrintView';
import _ from 'lodash';
const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
};
const minusOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
};


const today = Date.now()
function AllExpenses({ data, description }) {


    // MODAL HANDLER
    const dialog = useRef(null)
    const contentRef = useRef()
    const handleCloseRestoreModal = () => {
        dialog.current.close()
    }

    const openPrintView = () => {
        dialog.current.open();
    }

    // MODAL HANDLER

    const maxDate = data[0].claiming_date
    const minDate = data[data.length - 1].claiming_date
    const [dateRange, setDateRange] = useState({
        from: dbDateInputFormatter(minDate),
        to: dbDateInputFormatter(maxDate),
    })


    useEffect(() => {
        if (data) {
            setDateRange({
                from: dbDateInputFormatter(data[data.length - 1].claiming_date),
                to: dbDateInputFormatter(data[0].claiming_date),
            })
        }
    }, [data])

    let filteredData = data.filter(item => dbDateInputFormatter(item.claiming_date) <= dateRange.to && dbDateInputFormatter(item.claiming_date) >= dateRange.from);
    const handleInputChange = (e) => {
        const { value, name } = e.target;

        if (!value) {
            if (name == 'to') {
                setDateRange(prev => ({ ...prev, [name]: dbDateInputFormatter(maxDate) }))
            } else {
                setDateRange(prev => ({ ...prev, [name]: dbDateInputFormatter(minDate) }))

            }

            return;
        }

        setDateRange(prev => {
            return {
                ...prev,
                [name]: value,
            }
        })

    }
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: _.kebabCase(`${description} ${today}`),
    });

    const clearDate = () => {

        setDateRange(prev => {
            return {
                from: dbDateInputFormatter(minDate),
                to: dbDateInputFormatter(maxDate),
            }
        })
    }


    const totalExpense = filteredData.reduce((sum, { amount }) => sum + amount, 0)
    return (
        <>
            <PrintModal ref={dialog} onClose={handleCloseRestoreModal}>
                <AllExpensesPrintView
                    filteredData={filteredData}
                    dateRange={dateRange}
                    totalExpense={totalExpense}
                    description={description}
                    ref={contentRef} />
                <div className='flex gap-4 justify-end mt-8 px-4'>
                    <button onClick={handleCloseRestoreModal} className=' hover:bg-gray-400 hover:text-white px-2 rounded-md'>Close</button>
                    <button onClick={handlePrint} className=' bg-accent_color px-2 rounded-md text-white hover:bg-secondary_color'>Print</button>
                </div>
            </PrintModal>
            <div>
                <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                    <FormInput placeholderName={'From'} max={minusOneDay(dateRange.to)} min={dbDateInputFormatter(minDate)} name='from' value={dateRange.from} type='date' onChange={handleInputChange} />
                    <FormInput placeholderName={'to'} max={dbDateInputFormatter(maxDate)} min={addOneDay(dateRange.from)} name='to' value={dateRange.to} type='date' onChange={handleInputChange} />
                    <div className='flex gap-4'>
                        <button onClick={clearDate} className=' hover:bg-gray-400 hover:text-white px-2 rounded-md'>Clear</button>
                        <button onClick={openPrintView} className=' bg-accent_color px-2 rounded-md text-white hover:bg-secondary_color'>Print</button>
                    </div>
                </div>
                <ExpenseTable tableData={filteredData} column={expensesListColumns} collapsible_col={['points', 'method']} />
            </div>
        </>
    )
}

export default AllExpenses