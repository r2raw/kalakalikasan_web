
import ExpenseForecast from './ExpenseForecast'
import LineCollectedMaterials from './LineCollectedMaterials'
import FeedbackList from './FeedbackList'
import '../../../index.css'
import ExpenseList from './ExpenseList'
function Analytics() {
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='lg:w-3/5 flex flex-col gap-4'>
          <ExpenseForecast />
          <LineCollectedMaterials />
        </div>
        <div className='lg:w-2/5 flex flex-col gap-4'>
          <FeedbackList />
        </div>
      </div>
      <div className='mt-4 flex flex-col gap-4'>
        <ExpenseList />
      </div>
    </>
  )
}

export default Analytics