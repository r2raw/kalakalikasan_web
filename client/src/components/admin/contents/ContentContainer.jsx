import React from 'react'
import ContentItem from './ContentItem'

function ContentContainer({ header }) {
    return (
        <div>
            <h2 className='text-dark_font'>{header}</h2>
            <div className='grid grid-cols-4 gap-4'>
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
            </div>
        </div>
    )
}

export default ContentContainer