import { useMemo } from 'react';
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
} from "react-table";

import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

import CustomFilter from '../filters/CustomFilter';
import CustomPagination from '../pagination/CustomPagination';



function ExpenseTable({ tableData, column, collapsible_col }) {
    const columns = useMemo(() => column, [column]);
    const data = useMemo(() => tableData, [tableData]);

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
    }, useGlobalFilter, useSortBy, usePagination)
    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <div className='card flex flex-col gap-8 w-full'>
            <CustomFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table  {...getTableProps()} className=' table-auto w-full'>
                <thead>
                    {headerGroups.map((header) => (
                        <tr {...header.getHeaderGroupProps()} key='table-header-row'>
                            {header.headers.map((col) => {
                                let classes = 'text-smm lg:text-lg';

                                const tableHeadClass = "table-header"
                                if (col.id == 'id') { classes += ' hidden' };

                                if (col.id == 'claiming_date') {
                                    classes += ' text-right'
                                }
                                if (collapsible_col.includes(col.id)) classes += ' hidden md:table-cell';
                                return (
                                    <th {...col.getHeaderProps(col.getSortByToggleProps())} key={col.id} className={classes}>
                                        <div className={tableHeadClass}>
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
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);

                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map((cell) => {
                                    const col = cell.column.id;
                                    let classes = 'text-smm lg:text-lg';

                                    if (col == 'id') {
                                        classes += ' hidden'
                                    }

                                    if (col == 'claiming_date') {
                                        classes += ' text-right'
                                    }

                                    if (collapsible_col.includes(col)) classes += ' hidden md:table-cell';

                                    return (
                                        <td {...cell.getCellProps()} key={cell.column.id} className={classes}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <CustomPagination pageSize={pageSize} setPageSize={setPageSize} previousPage={previousPage} nextPage={nextPage} canNextPage={canNextPage} canPreviousPage={canPreviousPage} pageIndex={pageIndex} pageOptions={pageOptions} />
        </div>
    )
}

export default ExpenseTable