import { useState } from 'react'
import './App.css'
import PokerTable from './components/PokerTable';

function App() {

  return (
    <>
      <div>
        <h1>Texas Hold'em Poker</h1>
        <h2>One Shot</h2>
        <PokerTable />
      </div>
    </>
  )
}

export default App
