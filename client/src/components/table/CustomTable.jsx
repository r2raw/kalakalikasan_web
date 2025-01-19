import React, { useMemo } from 'react';
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
} from "react-table";

import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

import CustomFilter from './filters/CustomFilter';
import CustomPagination from './pagination/CustomPagination';
import CustomTableActionItem from './columns/CustomTableActionItem';
import TableActivateAction from './tableActions/TableDefaultAction';
import TableViewActions from './tableActions/TableViewActions';
import TableRestoreActions from './tableActions/TableRestoreActions';
import TableDefaultAction from './tableActions/TableDefaultAction';

import actionLoader from '../../assets/gifs/actionloader.gif'

function accountsFilterFunction(rows, columnIds, filterValue) {

   
    return rows.filter(row => {
        const { original } = row;

        // Flatten composite fields
        const fullname = `${original.fullname.firstname} ${original.fullname.lastname}`;

        // Combine all searchable fields into a single string
        const rowValues = Object.values({
            ...original,
            fullname, // Include the combined fullname in the search
        }).join(' ').toLowerCase();

        return rowValues.includes(filterValue.toLowerCase());
    });
}


const defaultGlobalFilter = (rows, columnIds, filterValue) => {
    return rows.filter(row => {
        // Combine all cell values into a single string
        const rowValues = Object.values(row.values)
            .join(' ')
            .toLowerCase();

        // Check if the filterValue exists in the concatenated string
        return rowValues.includes(filterValue.toLowerCase());
    });
};


function CustomTable({ tableData, column, collapsible_col, actionType, onEdit, onDelete, onView, onRestore, moduleType }) {
    const columns = useMemo(() => column, [column]);
    const data = useMemo(() => tableData, [tableData]);

    const filterUsed = useMemo(() => {
        return moduleType ? accountsFilterFunction : defaultGlobalFilter;
    }, [moduleType]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        setPageSize,
    } = useTable({
        columns,
        data,
        globalFilter: filterUsed,
    }, useGlobalFilter, useSortBy, usePagination)
    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div className='card flex flex-col gap-8'>
            <CustomFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table  {...getTableProps()} className=' table-auto'>
                <thead>
                    {headerGroups.map((header) => (
                        <tr {...header.getHeaderGroupProps()} key='table-header-row'>
                            {header.headers.map((col) => {
                                let classes = 'text-smm lg:text-lg';
                                if (col.id == 'id') { classes += ' hidden' };

                                if (collapsible_col.includes(col.id)) classes += ' hidden md:table-cell';
                                return (
                                    <th {...col.getHeaderProps(col.getSortByToggleProps())} key={col.id} className={classes}>
                                        <div className="table-header">
                                            {col.render("Header")}
                                            <span className="sort-indicator">
                                                {col.isSorted ? (
                                                    col.isSortedDesc ? (
                                                        <ArrowDropDownSharpIcon />
                                                    ) : (
                                                        <ArrowDropUpSharpIcon />
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </span>
                                        </div>
                                    </th>
                                )
                            })}
                            <th className="text-smm w-24  lg:text-lg text-right">Action</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);

                        const id = row.original.id; 

                        let actionButtons = null;
                        if (actionType === 'view') {
                            actionButtons = <TableViewActions id={id} onView={onView} />;
                        } else if (actionType === 'restore') {
                            actionButtons = <TableRestoreActions id={id} onRestore={onRestore} />;
                        } else {
                            actionButtons = <TableDefaultAction id={id} onEdit={onEdit} onDelete={onDelete} />;
                        }

                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map((cell, index) => {
                                    const col = cell.column.id;
                                    let classes = 'text-smm lg:text-lg';

                                    if (col == 'id') {
                                        classes += ' hidden'
                                    }

                                    if (collapsible_col.includes(col)) classes += ' hidden md:table-cell';
                                    {/* if (col == 'start_time' || col == 'end_time') {
                                        classes += ' hidden md:table-cell'
                                    } */}

                                    return (
                                        <td {...cell.getCellProps()} key={cell.column.id} className={classes}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}

                                <td className="text-smm  lg:text-lg ">
                                    <div className='flex justify-end'>
                                        {actionButtons}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <CustomPagination pageSize={pageSize} setPageSize={setPageSize} previousPage={previousPage} nextPage={nextPage} canNextPage={canNextPage} canPreviousPage={canPreviousPage} pageIndex={pageIndex} pageOptions={pageOptions} />
        </div>
    )
}

export default CustomTable