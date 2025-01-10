import React, { useState, useEffect } from 'react';
import PokerCard from 'react-pokercards';
import pokersolver from 'pokersolver';
import { TbCardsFilled } from "react-icons/tb";


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
    const [freeFolds, setFreeFolds] = useState(2);
    const [score, setScore] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [botHint, setBotHint] = useState(''); // Mostra i punti del bot
    


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
        setBotHint('');
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
        setBotHint('');

        return { playerHandResult, botHandResult };
    };

    const revealFlop = () => {
        const flop = deck.splice(0, 3);
        setCommunityCards([...communityCards, ...flop]);
        setDeck(deck);
        setGameStage(2);
        setBotHint('');
        updateHands([...communityCards, ...flop]);
    };

    const revealTurn = () => {
        const turn = deck.splice(0, 1);
        setCommunityCards([...communityCards, ...turn]);
        setDeck(deck);
        setGameStage(3);
        setBotHint('');
        updateHands([...communityCards, ...turn]);
    };

    const revealRiver = () => {
        const river = deck.splice(0, 1);
        setCommunityCards([...communityCards, ...river]);
        setDeck(deck);
        setGameStage(4);
        setBotHint('');
        updateHands([...communityCards, ...river]);
    }
    
    const revealWinner = () => {
        const { playerHandResult, botHandResult } = updateHands([...communityCards]);
        const winners = pokersolver.Hand.winners([playerHandResult, botHandResult]);
        setBotHint(botRank)
        if (winners.length === 1) {
            if (winners[0] === playerHandResult) {
                setResult('Hai vinto!');
                setWinningRank(winners[0].descr);
                updateScore(2); // Vittoria = +2
            } else {
                setResult('Hai perso!');
                setWinningRank(winners[0].descr);
                updateScore(-2); // Sconfitta = -2
            }
        } else {
            setResult('Pareggio!');
            setWinningRank(playerHandResult.name);
            updateScore(0); // Pareggio = 0
        }

        setGameStage(5)
    };

    const handleFold = () => {
        if (freeFolds > 0 && gameStage < 4) {
            // Fold gratuito
            setFreeFolds((prevFolds) => prevFolds - 1);
        }
        else {
            updateScore(-1); // Fold = -1
        }
        setHasFolded(true);
        setResult('Hai fatto fold!');
        setGameStage(5);
        setBotHint(botRank)
    };

    const getFoldButtonText = () => {
        if (gameStage >= 4 || freeFolds === 0) {
            return 'Fold'; // Fase successiva al River o nessun fold gratuito
        }
        return `Fold (${freeFolds})`; // Mostra il numero di fold gratuiti rimanenti
    };

    const updateScore = (change) => {
        setScore((prevScore) => prevScore + change);
    };

    const showBotHint = () => {
        if (!hintUsed) {
            setBotHint(botRank);
            setHintUsed(true);
        }
    };

    const resetGame = () => {
        setGameStage(0); // Reset del gioco
        setScore(0);
        setFreeFolds(2);
    }

    useEffect(() => {
        if (score >= 5) {
            setResult('Hai raggiunto 5 punti! Congratulazioni!');
            resetGame();
        }
    }, [score]);
    


    return (
        <div className='relative'>
            {gameStage > 0 && (
                <>
                <div className='mt-6'>
                    <h3>Carte del bot:</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {botHand.map((card) => (
                            <PokerCard short={card} key={card}/>
                        ))}
                        {gameStage === 4 || botHint && <p>{botHint}</p>}
                    </div>   
                </div>
                <div className='mt-6'>
                    <h3>Carte comuni:</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {communityCards.map((card, index) => (
                            <PokerCard short={card} key={`community-${index}`} />
                        ))}
                        {/* Mostra carte coperte per quelle non ancora rivelate */}
                        {Array.from({ length: 5 - communityCards.length }).map((_, index) => (
                            <PokerCard isBackwards={true} key={`hidden-${index}`} />
                        ))}
                    </div>
                </div>
                <div className='mt-6'>
                    <h3>Le tue carte:</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {playerHand.map((card) => (
                            <PokerCard short={card} key={card}/>
                        ))}
                        <p>{playerRank}</p>
                    </div>
                </div>
                </>
            )}

            <section className='controls fixed left-0 bottom-0 bg-red-900'>
                {gameStage > 0 && (
                    <>
                    <h2 className='mt-6'>{result}</h2>
                    <h3>{winningRank}</h3>
                    <h3>Punteggio attuale: {score}</h3>
                    </>
                )}
                
                {gameStage === 1 && <button onClick={revealFlop} disabled={hasFolded} >Scopri il Flop</button>}
                {gameStage === 2 && <button onClick={revealTurn} disabled={hasFolded} >Scopri il Turn</button>}
                {gameStage === 3 && <button onClick={revealRiver} disabled={hasFolded} >Scopri il River</button>}
                {gameStage === 4 && <button onClick={revealWinner} disabled={hasFolded}>Vedi il Vincitore</button>}
                {gameStage > 0 && gameStage < 5 && (
                    <>
                        <button onClick={handleFold} disabled={hasFolded}>
                            {getFoldButtonText()}
                        </button>
                        <button onClick={showBotHint} disabled={hintUsed || gameStage === 0}>
                            Usa suggerimento
                        </button>
                    </>
                )}

                {gameStage > 0 && <button onClick={resetGame}>RESET</button>}
            </section>
            
            <section className='relative top-64'>
                {(gameStage === 0 || gameStage === 5) && 
                <div className='flex flex-col justify-center items-center' onClick={dealCards}>
                    <button className='rounded-full w-20 h-20 p-0 flex justify-center items-center bg-emerald-800' disabled={(gameStage !== 0 && gameStage !== 5)}>
                        <TbCardsFilled size='42'/>
                    </button>
                    <p className='p-2 absolute font-semibold -bottom-7 rounded-xl text-lg bg-emerald-800'>Distribuisci carte</p>
                </div>
                }
            </section>
        </div>
    );
};

export default PokerTable;
