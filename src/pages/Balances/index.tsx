import TransactionSummary from '../../components/Balances'
import { sampleData } from '../../menu-item'

const Balances = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <TransactionSummary />
    </div>
  )
}

export default Balances