import { useState } from 'react'
import './App.scss';
import PokerTable from './components/PokerTable';
import Header from './components/Header';
import Modal from './components/Modal';

function App() {

  return (
    <>
      <Header />
      <Modal />
      <PokerTable />
    </>
  )
}

export default App
