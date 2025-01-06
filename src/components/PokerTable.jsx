import React, { useState } from 'react';
import PokerCard from 'react-pokercards';
import pokersolver from 'pokersolver';


const generateDeck = () => {
  const suits = ['c', 'd', 'h', 's']; // Clubs, Diamonds, Hearts, Spades
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(`${rank}${suit}`);
    });
  });
  return deck;
};

const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const PokerTable = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [result, setResult] = useState('');
  const [winningRank, setWinningRank] = useState('');
  const [playerRank, setPlayerRank] = useState('');
  const [botRank, setBotRank] = useState('');


  const dealCards = () => {
    let deck = shuffleDeck(generateDeck()); // Mischia il mazzo

    // Distribuisci 2 carte personali per ciascun giocatore
    const player = deck.splice(0, 2);
    const bot = deck.splice(0, 2);
    const community = deck.splice(0, 5);
    
    setPlayerHand(player);
    setBotHand(bot);
    setCommunityCards(community);

    // Combina le carte personali e quelle comuni per valutare le mani
    const playerCards = [...player, ...community];
    const botCards = [...bot, ...community];

    const playerHandResult = pokersolver.Hand.solve(playerCards);
    const botHandResult = pokersolver.Hand.solve(botCards);

    setPlayerRank(playerHandResult.name);
    setBotRank(botHandResult.name);

    // Confronta le mani
    const hands = [playerHandResult, botHandResult];
    const winners = pokersolver.Hand.winners(hands);
    
    // Controlla il risultato
    if (winners.length === 1) {
        setResult(winners[0] === playerHandResult ? 'Hai vinto!' : 'Hai perso!');
        setWinningRank(winners[0].descr);
    } else if (winners.length === 2) {
        setResult('Pareggio!');
        setWinningRank(playerHandResult.name);
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
        <p>{playerRank}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Carte del bot:</h3>
        {botHand.map((card) => (
          <PokerCard short={card} key={card}/>
        ))}
        <p>{botRank}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Carte comuni:</h3>
        {communityCards.map((card, index) => (
          <PokerCard short={card} key={`community-${index}`} />
        ))}
      </div>
      <h2 style={{ marginTop: '20px' }}>{result}</h2>
      <h3>{winningRank}</h3>
    </div>
  );
};

export default PokerTable;
