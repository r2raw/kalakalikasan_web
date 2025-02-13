import React from 'react'
import CustomTable from '../../table/CustomTable'
import { schedColumns } from '../../table/columns/columns'
import dummy_data from '../../../dummy_data/MOCK_DATA.json';
import TableDefaultAction from '../../table/tableActions/TableDefaultAction';
const collapsible_col = ['start_time', 'end_time']
function PaymentRequest() {
  return (
    <div>
      <CustomTable tableData={dummy_data} column={schedColumns} collapsible_col={collapsible_col} canView={false} actionType={<TableDefaultAction />} />
    </div>
  )
}

export default PaymentRequest