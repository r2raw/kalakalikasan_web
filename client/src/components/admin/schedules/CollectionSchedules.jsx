import React from 'react'
import CustomTable from '../../table/CustomTable'
import { schedColumns } from '../../table/columns/columns'
import dummy_data from '../../../dummy_data/MOCK_DATA.json';
import TableActivateAction from '../../table/tableActions/TableActivateAction';
const collapsible_col = ['start_time', 'end_time']
function CollectionSchedules() {
  return (
    <div>
      <CustomTable tableData={dummy_data} column={schedColumns} collapsible_col={collapsible_col} canView={false} actionType={<TableActivateAction />} />
    </div>
  )
}

export default CollectionSchedules