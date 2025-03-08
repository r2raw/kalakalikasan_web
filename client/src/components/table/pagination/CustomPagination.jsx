import React from 'react'

import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
function CustomPagination({pageSize, setPageSize, previousPage,nextPage, canNextPage, canPreviousPage, pageIndex, pageOptions}) {
    return (
        <div className="flex w-full justify-between md:justify-end">
            <div className='flex'>
                <select
                className='text-smm md:text-base'
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 25, 50, 100].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                {/* <span className="dropdown text-ssm">
                    <ArrowDropDownSharpIcon />
                </span> */}
            </div>
            <div className='flex items-center justify-center'>
                <div
                    className="pagination-arrow text-smm  md:text-base"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    <ArrowBackIosNewSharpIcon sx={{ fontSize: 20 }} />
                </div>
                <p className='text-smm md:text-base'>
                    Page: {pageIndex + 1} of {pageOptions.length}
                </p>
                <div
                    className="pagination-arrow text-ssm md:text-base"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >
                    <ArrowForwardIosSharpIcon sx={{ fontSize: 20 }} />
                </div>
            </div>
        </div>
    )
}

export default CustomPagination