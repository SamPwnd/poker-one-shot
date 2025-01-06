import React, { useState } from 'react';
import PokerCard from 'react-pokercards';
import PokerHand from 'poker-hand-evaluator';

const generateRandomCard = () => {
  const suits = ['c', 'd', 'h', 's']; // Clubs, Diamonds, Hearts, Spades
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return `${rank}${suit}`;
};

const PokerTable = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [result, setResult] = useState('');
  const [winningRank, setWinningRank] = useState('');
  const [playerRank, setPlayerRank] = useState('');
  const [botRank, setBotRank] = useState('');



  const dealCards = () => {
    const generateUniqueHand = () => {
        const hand = new Set(); // Creiamo un Set vuoto
        while (hand.size < 5) {
          hand.add(generateRandomCard()); // Aggiunge solo carte uniche
        }
        return Array.from(hand); // Converte il Set in un array
    };

    const player = generateUniqueHand();
    const bot = generateUniqueHand();
    
    setPlayerHand(player);
    setBotHand(bot);

    // Crea istanze delle mani
    const playerPokerHand = new PokerHand(player.join(' '));
    const botPokerHand = new PokerHand(bot.join(' '));

    setPlayerRank(playerPokerHand.getRank())
    setBotRank(botPokerHand.getRank())

    // Confronta le mani
    const comparison = playerPokerHand.compareWith(botPokerHand);
    if (comparison === 1) {
      setResult('Hai vinto!');
      setWinningRank(playerPokerHand.getRank())
    } else if (comparison === 2) {
      setResult('Hai perso!');
      setWinningRank(botPokerHand.getRank())
    } else {
      setResult('Pareggio!');
      setWinningRank(playerPokerHand.getRank())
    }

  };

  return (
    <div>
      <button onClick={dealCards}>Distribuisci carte</button>
      <div style={{ marginTop: '20px' }}>
        <h3>Le tue carte:</h3>
        {playerHand.map((card) => (
          <PokerCard short={card} key={card}/>
        ))}
        {playerRank}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Carte del bot:</h3>
        {botHand.map((card) => (
          <PokerCard short={card} key={card}/>
        ))}
        {botRank}
      </div>
      <h2 style={{ marginTop: '20px' }}>{result}</h2>
      <h3>{winningRank}</h3>
    </div>
  );
};

export default PokerTable;
