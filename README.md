# Poker One-Shot

Questo è un semplice gioco di poker costruito con React. Il progetto simula una partita di poker tra un giocatore e un bot, dove le mani del bot e del giocatore vengono valutate e confrontate. Non esistono le puntate con le fiche, ma per battere il bot esiste un sistema di punteggio apposito.

## Funzionalità

- **Mazzo di Carte:** Viene utilizzato un mazzo mescolato per distribuire le carte al giocatore e al bot.
- **Carte Comuni:** Vengono rivelate carte comuni (flop, turn, river) in modo sequenziale.
- **Valutazione delle Mani:** Le mani del giocatore e del bot vengono valutate utilizzando il sistema di classificazione delle mani di poker.
- **Progressione del Gioco:** Il gioco segue il flusso base del poker, dove le carte vengono distribuite e le mani vengono valutate.

## Modalità di Gioco

1. **Distribuzione delle Carte:** Il gioco inizia con la distribuzione delle carte sia al giocatore che al bot.
2. **Carte Comuni:** Le carte comuni vengono rivelate in tre fasi:
   - **Flop:** 3 carte
   - **Turn:** 1 carta
   - **River:** 1 carta
3. **Valutazione delle Mani:** Dopo ogni fase, le mani del giocatore e del bot vengono valutate per determinarne la classifica.
4. **Vincitore:** Dopo che la carta river viene rivelata, il gioco confronta le mani e annuncia il vincitore.

## Sistema di Punteggio

1. **Obiettivo:** Vince chi raggiunge almeno 5 punti.
2. **Punteggio per la vittoria:** Se il giocatore vince la mano, guadagna **+2 punti**.
3. **Punteggio per la sconfitta:** Se il giocatore perde, guadagna **-2 punti**.
4. **Punteggio per il pareggio:** Se la partita finisce in pareggio, il giocatore non guadagna né perde punti, ottenendo **0 punti**.
5. **Fold:** Se il giocatore decide di fare fold, perde **-1 punto**.
6. **Fold gratuito:** Durante la partita, il giocatore ha a disposizione un numero limitato di fold gratuiti, che non influenzano il punteggio.
7. **Sbircia** Possibilità di vedere la combinazione di carte del bot, una volta per sessione.