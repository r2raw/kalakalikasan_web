import React from 'react'
import CustomTable from '../../table/CustomTable'
import DUMMY_STORES from '../../../dummy_data/DUMMY_STORES.json'
import { storeColumns } from '../../table/columns/columns'
import TableViewActions from '../../table/tableActions/TableViewActions'
import { useNavigate } from 'react-router-dom'
function StoreApplication() {

  const navigate = useNavigate();

  const handleViewClick = (id)=>{
    navigate('./' + id)
  }
  return (
    <div className='flex gap-8 flex-col'>
      <h2 className='text-dark_font'>Application Requests</h2>
      <CustomTable tableData={DUMMY_STORES} column={storeColumns} collapsible_col={[]} actionType='view' onView={handleViewClick} />
    </div>
  )
}

export default StoreApplication