import React from 'react'
import ContentItem from './ContentItem'

function ContentContainer({ header, data }) {
    return (
        <div>
            <h2 className='text-dark_font'>{header}</h2>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {data.map(item => <ContentItem key={item.id} data={item} />)}
            </div>
        </div>
    )
}

export default ContentContainer