import React, { useState, useEffect } from 'react';
import PokerCard from 'react-pokercards';
import pokersolver from 'pokersolver';
import Confetti from 'react-confetti';
import { TbCardsFilled } from "react-icons/tb";
import { GiCardPickup } from "react-icons/gi";
import { RiResetLeftFill } from "react-icons/ri";


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
    const [won, setWon] = useState(false);
    const [hasFolded, setHasFolded] = useState(false);
    const [freeFolds, setFreeFolds] = useState(2);
    const [score, setScore] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [botHint, setBotHint] = useState(''); // Mostra i punti del bot
    const [isBotCardsBack,setIsBotCardsBack] = useState(true);
    
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
        
        const playerHandResult = pokersolver.Hand.solve(player);
        const botHandResult = pokersolver.Hand.solve(bot);
        
        setResult('');
        setWon(false);
        setPlayerRank(playerHandResult.name);
        setBotRank(botHandResult.name);
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

    const updateGameResult = (change, message, winnerRank) => {
        setResult(message);
        setWinningRank(winnerRank);
        updateScore(change);
    };

    const revealCard = (numCards) => {
        const revealedCards = deck.splice(0, numCards);
        setCommunityCards([...communityCards, ...revealedCards]);
        setDeck(deck);
        setBotHint('');
        updateHands([...communityCards, ...revealedCards]);
    }

    const revealFlop = () => {
        revealCard(3);
        setGameStage(2);
    };

    const revealTurn = () => {
        revealCard(1);
        setGameStage(3);
    };

    const revealRiver = () => {
        revealCard(1);
        setGameStage(4);
    }
    
    const revealWinner = () => {
        const { playerHandResult, botHandResult } = updateHands([...communityCards]);
        const winners = pokersolver.Hand.winners([playerHandResult, botHandResult]);
        setBotHint(botRank)
        if (winners.length === 1) {
            if (winners[0] === playerHandResult) {
                updateGameResult(2, 'Hai vinto!', winners[0].descr)
                setWon(true);
            } else {
                updateGameResult(-2, 'Hai perso!', winners[0].descr)
            }
        } else {
            updateGameResult(0, 'Pareggio!', playerHandResult.name)
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
        setResult('Hai foldato!');
        setGameStage(5);
        setBotHint(botRank)
    };

    const getFoldButtonText = () => {
        if (gameStage >= 4 || freeFolds === 0) {
            return 'FOLD'; // Fase successiva al River o nessun fold gratuito
        }
        return `FOLD (${freeFolds})`; // Mostra il numero di fold gratuiti rimanenti
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
        setWon(false);
        setHintUsed(false);
        setFreeFolds(2);
    }

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.playbackRate = Math.random() * (1.5 - 0.8) + 0.8;
        audio.volume = 0.7
        audio.play().catch((error) => console.error('Errore durante la riproduzione audio:', error));
    };

    useEffect(() => {
        if (gameStage > 0 && gameStage < 5) {
            playSound('/flip.mp3');
        }
    }, [gameStage]);
        
    useEffect(() => {
        if (score >= 5) {
            setResult('Hai raggiunto 5 punti! Congratulazioni!');
        }
        if (gameStage === 5) {
            setIsBotCardsBack(false);
        }
        else {
            setIsBotCardsBack(true);
        }
    }, [score, gameStage]);
    


    return (
        <main className={`poker-table${gameStage === 5 ? '--overlay h-[calc(100vh-142px)]' : ' h-[calc(100vh-154px)]'} relative section-container pb-7 overflow-auto`}>
            {won && <Confetti />}
            {gameStage > 0 && (
                <>
                <div className='mt-20'>
                    <h3>Carte del bot</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {botHand.map((card) => (
                            <PokerCard isBackwards={isBotCardsBack} size={120} short={card} key={card}/>
                        ))}
                    </div>   
                    <p className='mt-1'>{gameStage === 5 || botHint ? botHint : '_'}</p>
                </div>
                <div className='mt-6'>
                    <h3>Carte comuni:</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {communityCards.map((card, index) => (
                            <PokerCard size={90} short={card} key={`community-${index}`} />
                        ))}
                        {/* Mostra carte coperte per quelle non ancora rivelate */}
                        {Array.from({ length: 5 - communityCards.length }).map((_, index) => (
                            <PokerCard size={90} isBackwards={true} key={`hidden-${index}`} />
                        ))}
                    </div>
                </div>
                <div className='mt-6'>
                    <h3>Le tue carte</h3>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {playerHand.map((card) => (
                            <PokerCard size={120} short={card} key={card}/>
                        ))}
                    </div>
                    <p className='mt-1'>{playerRank}</p>
                </div>
                </>
            )}

            <section className='controls fixed left-0 bottom-0 bg-gradient-to-b from-red-800 to-red-900 rounded-t-xl rounded-tr-xl pb-3 w-full z-20'>
                {gameStage > 0 && (
                    <div className='bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-t-xl rounded-tr-xl mb-3 p-px'>
                        <h2>{result}</h2>
                        <h3>{winningRank}</h3>
                        <h3>Punteggio attuale: {score}</h3>
                    </div>
                )}
                <div className='flex section-container flex-wrap justify-center gap-2 items-stretch'>
                    {gameStage === 1 && <button className='w-full flex items-center justify-center gap-3 text-lg' onClick={revealFlop} disabled={hasFolded}>Scopri il Flop<GiCardPickup size={26} /></button>}
                    {gameStage === 2 && <button className='w-full flex items-center justify-center gap-3 text-lg' onClick={revealTurn} disabled={hasFolded}>Scopri il Turn<GiCardPickup size={26} /></button>}
                    {gameStage === 3 && <button className='w-full flex items-center justify-center gap-3 text-lg' onClick={revealRiver} disabled={hasFolded}>Scopri il River<GiCardPickup size={26} /></button>}
                    {gameStage === 4 && <button className='w-full flex items-center justify-center gap-3 text-lg' onClick={revealWinner} disabled={hasFolded}>Vedi il Vincitore<GiCardPickup size={26} /></button>}
                    {gameStage > 0 && gameStage < 5 && (
                        <>
                            <button onClick={handleFold} className='flex-1' disabled={hasFolded}>
                                {getFoldButtonText()}
                            </button>
                            <button onClick={showBotHint} className='flex-1' disabled={hintUsed || gameStage === 0}>
                                SBIRCIA
                            </button>
                        </>
                    )}

                    {gameStage > 0 && <button onClick={resetGame} className='flex-1 flex items-center justify-center gap-2'>RESET<RiResetLeftFill /></button>}
                </div>
            </section>
            
            {((gameStage === 0 || gameStage === 5) && score < 5) && 
                <section className={`z-20 relative ${gameStage === 5 ? '-top-64' : 'top-64'}`}>
                    <div className='flex flex-col justify-center items-center' onClick={dealCards}>
                        <button className='rounded-full w-24 h-24 p-0 flex justify-center items-center bg-emerald-800' disabled={(gameStage !== 0 && gameStage !== 5)}>
                            <TbCardsFilled size='56'/>
                        </button>
                        <p className='p-3 absolute font-semibold -bottom-8 rounded-3xl text-xl bg-emerald-800'>Distribuisci carte</p>
                    </div>
                </section>
            }
            {score >= 5 && <p className='won-txt'>HAI VINTO!</p>}
        </main>
    );
};

export default PokerTable;
