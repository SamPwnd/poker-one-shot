import React, { useState } from 'react';

const Header = () => {
    const [showInstructions, setShowInstructions] = useState(false);

    const toggleInstructions = () => {
        setShowInstructions((prev) => !prev);
    };

    return (
        <div className="relative">
            <button 
                onClick={toggleInstructions} 
                className="absolute top-4 left-4 bg-zinc-900 text-white px-4 py-2 rounded-full shadow"
            >
                ?
            </button>

            {/* Pop-up Istruzioni */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 rounded-lg flex justify-center items-center z-50">
                    <div className="bg-zinc-900 p-6 m-8 rounded-lg shadow-lg max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Guida</h2>
                        <ul className="list-disc list-inside text-left">
                            <h3 className='text-xl mb-2'>L'obiettivo è arrivare ad almeno 5 punti in una sessione</h3>
                            <li>Una sessione è formata da più mani, finisce quando ottieni 5 o più punti o quando premi il tasto <b>RESET</b>.</li>
                            <li>Il punteggio totale è calcolato in base ai risultati delle partite:
                                <ul className="ml-4 list-inside">
                                    <li className='bg-emerald-700 max-w-fit rounded-md my-1 px-2'>Vittoria: +2 punti</li>
                                    <li className='bg-slate-800 max-w-fit rounded-md my-1 px-2'>Pareggio: 0 punti</li>
                                    <li className='bg-amber-900 max-w-fit rounded-md my-1 px-2'>Fold: -1 punto</li>
                                    <li className='bg-red-900 max-w-fit rounded-md my-1 px-2'>Sconfitta: -2 punti</li>
                                </ul>
                            </li>
                            <li>Le carte comuni vengono rivelate progressivamente (Flop, Turn, River).</li>
                            <li>Hai 2 <b>Fold</b> gratuiti per sessione, ma puoi usarli solo prima di vedere il River.</li>
                            <li>Premendo il tasto <b>SUGGERIMENTO</b> puoi vedere i punti che ha in mano l'avversario in quella precisa fase della partita, ma puoi farlo solo una volta per sessione.</li>
                            <li>Qui non ci sono fiches e non ci sono monete, l'avversario non può fare FOLD e non può bluffare. Sembra facile, ma lo è davvero?</li>
                        </ul>
                        <button 
                            onClick={toggleInstructions} 
                            className="mt-5 bg-zinc-800 text-white px-5 py-3 rounded-full shadow hover:bg-zinc-700"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
