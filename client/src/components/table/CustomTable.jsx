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

function CustomTable({ tableData, column, collapsible_col, actionType }) {
    const columns = useMemo(() => column, []);
    const data = useMemo(() => tableData, []);

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
        data
    }, useGlobalFilter, useSortBy, usePagination)

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div className='card flex flex-col gap-8'>
            <CustomFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table  {...getTableProps()} className='table-fixed'>
                <thead>
                    {headerGroups.map((header) => (
                        <tr key={header.id} {...header.getHeaderGroupProps()}>
                            {header.headers.map((col) => {
                                let classes = 'text-smm lg:text-lg';
                                if (col.id == 'id') { classes += ' w-6' };

                                if (collapsible_col.includes(col.id)) classes += ' hidden md:table-cell';

                                return (
                                    <th key={col.id} {...col.getHeaderProps(col.getSortByToggleProps())} className={classes}>
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
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    const col = cell.column.id;

                                    let classes = 'text-smm lg:text-lg';

                                    if (collapsible_col.includes(col)) classes += ' hidden md:table-cell';
                                    {/* if (col == 'start_time' || col == 'end_time') {
                                        classes += ' hidden md:table-cell'
                                    } */}
                                    return (
                                        <td key={cell.row.id} {...cell.getCellProps()} className={classes}>
                                            <p>{cell.render("Cell")}</p>
                                        </td>
                                    );
                                })}

                                <td className="text-smm  lg:text-lg ">
                                    <div className='flex flex-col items-end'>
                                        {actionType}
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