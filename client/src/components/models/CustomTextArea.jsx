import React, { useEffect, useRef } from 'react'

function CustomTextArea({ placeholderName, val, maxVal, ...props }) {

    const textAreaRef = useRef(null);

    useEffect(() => {

        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }, [val])
    return (
        <div className='relative'>
            <textarea placeholder=' ' ref={textAreaRef} className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg  w-full resize-none h-fit py-4 px-2' rows='4' maxLength={500} value={val} {...props} />
            <span className=' pointer-events-none absolute left-0 scale-75 -top-[30px]  peer-placeholder-shown:top-[10px]  -translate-x-2  duration-300   text-light_font'>{placeholderName}</span>
            <span className='absolute bottom-2 right-2'>{val?.length.toString() || '0'}/500</span>
        </div>
    )
}

export default CustomTextArea