import React from 'react'
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

function CustomFilter({ filter, setFilter }) {
    return (
        <div className='w-full flex justify-end items-center '>
            <div className='relative flex w-full lg:w-1/5 items-center'>
                <input
                    className='w-full p-2 peer border-b-2 border-dark_font'
                    type="text"
                    value={filter || ""}
                    placeholder=" "
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                <span className="absolute left-2 -top-1/2 translate-y-1/2 scale-75 duration-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 pointer-events-none">Search</span>
                <span className=""><SearchSharpIcon /></span>
            </div>
        </div>
    )
}

export default CustomFilter