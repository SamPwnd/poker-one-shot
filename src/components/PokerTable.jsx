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
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [botHand, setBotHand] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [result, setResult] = useState('');
    const [winningRank, setWinningRank] = useState('');
    const [playerRank, setPlayerRank] = useState('');
    const [botRank, setBotRank] = useState('');
    const [gameStage, setGameStage] = useState(0); // 0: Pre-flop, 1: Flop, 2: Turn, 3: River, 4: Decide, 5: Show Winner
    const [hasFolded, setHasFolded] = useState(false);


    const dealCards = () => {
        const newDeck = shuffleDeck(generateDeck());
        setDeck(newDeck); // Mischia il mazzo

        // Distribuisci 2 carte personali per ciascun giocatore
        const player = newDeck.splice(0, 2);
        const bot = newDeck.splice(0, 2);

        setPlayerHand(player);
        setBotHand(bot);

        // Inizia il gioco con le carte comuni vuote
        setCommunityCards([]);
        setGameStage(1); // Comincia con il flop

        setResult('');
        setPlayerRank('');
        setBotRank('');
        setWinningRank('');
        setHasFolded(false);
    }

    const updateHands = (newCommunityCards) => {
        // Combina le carte personali e quelle comuni per valutare le mani
        const playerCards = [...playerHand, ...newCommunityCards];
        const botCards = [...botHand, ...newCommunityCards];

        const playerHandResult = pokersolver.Hand.solve(playerCards);
        const botHandResult = pokersolver.Hand.solve(botCards);

        setPlayerRank(playerHandResult.name);
        setBotRank(botHandResult.name);

        return { playerHandResult, botHandResult };
    };

    const revealFlop = () => {
        const flop = deck.splice(0, 3);
        setCommunityCards([...communityCards, ...flop]);
        setDeck(deck);
        setGameStage(2);
        updateHands([...communityCards, ...flop]);
    };

    const revealTurn = () => {
        const turn = deck.splice(0, 1);
        setCommunityCards([...communityCards, ...turn]);
        setDeck(deck);
        setGameStage(3);
        updateHands([...communityCards, ...turn]);
    };

    const revealRiver = () => {
        const river = deck.splice(0, 1);
        setCommunityCards([...communityCards, ...river]);
        setDeck(deck);
        setGameStage(4);
        updateHands([...communityCards, ...river]);
    }
    
    const revealWinner = () => {
        const { playerHandResult, botHandResult } = updateHands([...communityCards]);
        const winners = pokersolver.Hand.winners([playerHandResult, botHandResult]);
        
        if (winners.length === 1) {
            setResult(winners[0] === playerHandResult ? 'Hai vinto!' : 'Hai perso!');
            setWinningRank(winners[0].descr);
        } else {
            setResult('Pareggio!');
            setWinningRank(playerHandResult.name);
        }

        setGameStage(5)
    };

    const handleFold = () => {
        setHasFolded(true);
        setResult('Hai fatto fold! Il bot vince.');
        setGameStage(5);
    };


    return (
        <div>
            <button onClick={dealCards} disabled={(gameStage !== 0 && gameStage !== 5)}>Distribuisci carte</button>

            {gameStage === 1 && <button onClick={revealFlop} disabled={hasFolded} >Scopri il Flop</button>}
            {gameStage === 2 && <button onClick={revealTurn} disabled={hasFolded} >Scopri il Turn</button>}
            {gameStage === 3 && <button onClick={revealRiver} disabled={hasFolded} >Scopri il River</button>}
            {gameStage === 4 && <button onClick={revealWinner} disabled={hasFolded}>Vedi il Vincitore</button>}

            {gameStage > 0 && gameStage < 5 && (
                <button onClick={handleFold} disabled={hasFolded}>
                Fold
                </button>
            )}
            
            {gameStage > 0 && (
                <>
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
                    {/* Mostra carte coperte per quelle non ancora rivelate */}
                    {Array.from({ length: 5 - communityCards.length }).map((_, index) => (
                        <PokerCard isBackwards={true} key={`hidden-${index}`} />
                    ))}
                </div>
                </>
            )}
            
            <h2 style={{ marginTop: '20px' }}>{result}</h2>
            <h3>{winningRank}</h3>
        </div>
    );
};

export default PokerTable;
