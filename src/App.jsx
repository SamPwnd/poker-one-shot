import { useState } from 'react'
import './App.css'
import PokerTable from './components/PokerTable';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Texas Hold'em Poker</h1>
        <PokerTable />
      </div>
    </>
  )
}

export default App
