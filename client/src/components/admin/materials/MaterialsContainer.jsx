import React from 'react'
import MaterialItem from './MaterialItem'

function MaterialsContainer({ header }) {
    return (
        <div>
            <h2 className='text-dark_font'>{header}</h2>
            <div className='grid grid-cols-4 gap-4'>
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
                <MaterialItem />
            </div>
        </div>
    )
}

export default MaterialsContainer