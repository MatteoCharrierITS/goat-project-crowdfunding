# Progetto Capra - Sito Crowdfunding

Un sito web moderno e pulito per la gestione di un progetto di crowdfunding, con frontend responsive e backend Node.js.

## 🌟 Caratteristiche

- **Frontend Responsive**: Design pulito ed elegante che si adatta a tutti i dispositivi
- **Pagina Principale**: Visualizza statistiche in tempo reale, obiettivi e donatori recenti
- **Pagina Contribuisci**: Form intuitivo per effettuare donazioni con importi predefiniti o personalizzati
- **Backend Node.js**: API REST per gestire le donazioni e i dati del crowdfunding
- **Persistenza Dati**: Tutte le donazioni vengono salvate in un file JSON
- **Aggiornamenti Real-time**: Le statistiche si aggiornano automaticamente ogni 30 secondi

## 📋 Requisiti

- Node.js (versione 14 o superiore)
- npm (Node Package Manager)

## 🚀 Installazione

1. Apri un terminale nella cartella del progetto

2. Installa le dipendenze:
```bash
npm install
```

## ▶️ Avvio del Server

Per avviare il server:
```bash
npm start
```

Per lo sviluppo con auto-restart (se hai installato nodemon):
```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`

## 📖 Utilizzo

1. Avvia il server con `npm start`
2. Apri il browser e vai su `http://localhost:3000/index.html`
3. Esplora la pagina principale per vedere le statistiche del crowdfunding
4. Clicca su "Contribuisci" nel menu o nel pulsante in fondo alla pagina
5. Inserisci l'importo della donazione e il tuo nome
6. Clicca su "Dona Ora" per completare la donazione simulata

## 🛠️ API Endpoints

- `GET /api/crowdfunding` - Ottieni i dati del crowdfunding
- `POST /api/donate` - Effettua una donazione
  ```json
  {
    "amount": 50,
    "name": "Mario Rossi",
    "message": "Messaggio opzionale"
  }
  ```
- `GET /api/donations` - Visualizza tutte le donazioni
- `POST /api/reset` - Reimposta tutti i dati (solo per testing)

## 📁 Struttura del Progetto

```
Sito Capra/
├── index.html              # Pagina principale
├── contribuisci.html       # Pagina di donazione
├── styles.css              # Stili CSS
├── main.js                 # JavaScript per la home page
├── contribute.js           # JavaScript per la pagina contribuisci
├── server.js               # Server Node.js/Express
├── package.json            # Dipendenze del progetto
├── README.md               # Questo file
└── data/
    └── crowdfunding-data.json  # Dati delle donazioni (generato automaticamente)
```

## 🎨 Personalizzazione

### Modificare l'obiettivo del crowdfunding

Apri `server.js` e modifica il valore di `goal` nella funzione `initializeData()`:

```javascript
const initialData = {
    goal: 10000,  // Cambia questo valore
    // ...
};
```

### Modificare i colori

Apri `styles.css` e modifica le variabili CSS nella sezione `:root`:

```css
:root {
    --primary-color: #2563eb;  /* Colore primario */
    --secondary-color: #10b981; /* Colore secondario */
    /* ... */
}
```

## 🔄 Reset dei Dati

Per reimpostare tutte le donazioni e ricominciare da zero:

```bash
curl -X POST http://localhost:3000/api/reset
```

Oppure elimina il file `data/crowdfunding-data.json` e riavvia il server.

## 🌐 Deploy su Render

Il progetto è pronto per essere caricato su Render:

### Opzione 1: Deploy Automatico (con Git)

1. Crea un repository su GitHub e carica il progetto
2. Vai su [Render](https://render.com) e crea un account
3. Clicca su "New +" e seleziona "Web Service"
4. Connetti il tuo repository GitHub
5. Render rileverà automaticamente il file `render.yaml` e configurerà tutto
6. Clicca su "Create Web Service"

### Opzione 2: Deploy Manuale

1. Vai su [Render](https://render.com) e crea un account
2. Clicca su "New +" e seleziona "Web Service"
3. Seleziona "Build and deploy from a Git repository" o "Deploy an existing image"
4. Configura:
   - **Name**: progetto-capra
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (per iniziare)

### Configurazione

Il progetto è già configurato per:
- ✅ Usare la porta dinamica fornita da Render (`process.env.PORT`)
- ✅ Gestire URL API sia in locale che in produzione
- ✅ Servire file statici correttamente
- ✅ Persistenza dati tramite file system (attenzione: su Render il filesystem è effimero)

### ⚠️ Importante: Persistenza Dati

Su Render, il filesystem è effimero. Le donazioni salvate verranno perse al riavvio del servizio. Per un deployment in produzione, considera di utilizzare:
- Un database (PostgreSQL, MongoDB)
- Render Disks (storage persistente a pagamento)

## 📝 Note

- Questo è un sistema di pagamento **simulato** - non vengono effettuate transazioni reali
- Le donazioni vengono salvate localmente nel file `data/crowdfunding-data.json`
- Non è richiesta autenticazione o registrazione per effettuare donazioni
- Il sistema è pensato per demo e testing

## 🤝 Contributi

Sentiti libero di personalizzare e migliorare il progetto secondo le tue esigenze!

## 📄 Licenza

ISC
