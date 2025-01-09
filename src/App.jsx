import { useState } from 'react'
import './App.scss';
import PokerTable from './components/PokerTable';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  return (
    <>
    <Header />
    <PokerTable />
    <Footer />
    </>
  )
}

export default App
