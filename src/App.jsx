import { useState } from 'react'
import './App.css'
import PokerTable from './components/PokerTable';
import Header from './components/Header';

function App() {

  return (
    <>
    <Header />
      <div>
        <h1>Texas Hold'em Poker</h1>
        <h2 className="mt-1">One Shot</h2>
        <PokerTable />
      </div>
    </>
  )
}

export default App
