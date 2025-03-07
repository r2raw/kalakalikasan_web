import _ from 'lodash'
import { titleCase } from 'title-case';
import { currencyFormatter, dbDateFormatter, truncateText } from '../../../util/formatter'
export const schedColumns = [
    { Header: 'Id', accessor: 'id', },
    { Header: 'Barangay', accessor: 'barangay', },
    { Header: 'Date', accessor: 'date', },
    { Header: 'From', accessor: 'start_time', },
    { Header: 'To', accessor: 'end_time', },
]

export const accountColumns = [
    { Header: 'Id', accessor: 'id', },
    {
        Header: 'Name', accessor: 'firstname',
        Cell: ({ row }) => {
            const image = row.original.image;

            let imageContent = <div className='rounded-full bg-light_font h-8 w-8 flex justify-center items-center'>
                <span className=' text-white text-sm'>{`${_.startCase(row.original.firstname).substring(0, 1)}${_.startCase(row.original.lastname).substring(0, 1)}`}</span>
            </div>

            if (image) {
                const imageUrl = `${import.meta.env.VITE_BASE_URL}/userImg/${image}`
                imageContent = <img
                    src={`${import.meta.env.VITE_BASE_URL}/userImg/${image}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full "
                />
            }
            const fullname = `${titleCase(row.original.firstname)} ${titleCase(row.original.lastname)}`;

            return (
                <div className="flex items-center space-x-4">
                    {imageContent}
                    <span>{truncateText(fullname, 20)}</span>
                </div>
            )
        }
    },
    {Header: 'Role', accessor: 'role', Cell: ({value}) =>titleCase(value)},
    { Header: 'Contact', accessor: 'mobile_num', },
    { Header: 'Email', accessor: 'email', },
]


export const contentColumn = [
    { Header: 'Id', accessor: 'id', },
    { Header: 'Title', accessor: 'title', Cell: ({ value }) => titleCase(value), },
    { Header: 'Type', accessor: 'type', Cell: ({ value }) => titleCase(value), },
    // { Header: 'Created on', accessor: 'date_created', },
]
export const storeColumns = [
    { Header: 'Id', accessor: 'id', },
    { Header: 'Store Name', accessor: 'store_name', },
    { Header: 'Application date', accessor: 'application_date', Cell: ({ value }) => dbDateFormatter(value) },
]

export const paymentColumns = [
    { Header: 'Id', accessor: 'id', },
    { Header: 'Store Name', accessor: 'store_name', Cell:({value})=> titleCase(value)},
    { Header: 'Amount', accessor: 'amount', Cell:({value})=> currencyFormatter(value)},
    { Header: 'Request date', accessor: 'date_requested', Cell: ({ value }) => dbDateFormatter(value) },
]