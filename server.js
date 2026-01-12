const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'crowdfunding-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve i file statici dalla directory corrente

// Assicurati che la directory data esista
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Inizializza i dati se il file non esiste
function initializeData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            goal: 7000,
            totalRaised: 0,
            donorsCount: 0,
            donations: []
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Leggi i dati dal file
function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (error) {
        console.error('Errore nella lettura dei dati:', error);
        return initializeData();
    }
}

// Scrivi i dati nel file
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Errore nella scrittura dei dati:', error);
    }
}

// Calcola la percentuale di completamento
function calculatePercentage(totalRaised, goal) {
    return Math.min((totalRaised / goal) * 100, 100);
}

// Ottieni i dati recenti (ultimi 10 donatori)
function getRecentDonors(donations) {
    return donations
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
}

// Route per ottenere i dati del crowdfunding
app.get('/api/crowdfunding', (req, res) => {
    try {
        const data = readData();
        const percentage = calculatePercentage(data.totalRaised, data.goal);
        const recentDonors = getRecentDonors(data.donations);

        res.json({
            goal: data.goal,
            totalRaised: data.totalRaised,
            donorsCount: data.donorsCount,
            percentage: percentage,
            recentDonors: recentDonors
        });
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        res.status(500).json({ error: 'Errore nel recupero dei dati' });
    }
});

// Route per effettuare una donazione
app.post('/api/donate', (req, res) => {
    try {
        const { amount, name, message } = req.body;

        // Validazione
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Importo non valido' });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Nome richiesto' });
        }

        // Leggi i dati attuali
        const data = readData();

        // Crea la nuova donazione
        const donation = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            name: name.trim(),
            message: message ? message.trim() : '',
            timestamp: Date.now()
        };

        // Aggiorna i dati
        data.donations.push(donation);
        data.totalRaised += donation.amount;
        data.donorsCount += 1;

        // Salva i dati
        writeData(data);

        // Rispondi con i dati aggiornati
        const percentage = calculatePercentage(data.totalRaised, data.goal);
        const recentDonors = getRecentDonors(data.donations);

        res.json({
            success: true,
            donation: donation,
            crowdfunding: {
                goal: data.goal,
                totalRaised: data.totalRaised,
                donorsCount: data.donorsCount,
                percentage: percentage,
                recentDonors: recentDonors
            }
        });

        console.log(`Nuova donazione ricevuta: €${amount} da ${name}`);
    } catch (error) {
        console.error('Errore nell\'elaborazione della donazione:', error);
        res.status(500).json({ error: 'Errore nell\'elaborazione della donazione' });
    }
});

// Route per ottenere tutte le donazioni (opzionale, per amministrazione)
app.get('/api/donations', (req, res) => {
    try {
        const data = readData();
        res.json({
            donations: data.donations.sort((a, b) => b.timestamp - a.timestamp),
            totalCount: data.donations.length
        });
    } catch (error) {
        console.error('Errore nel recupero delle donazioni:', error);
        res.status(500).json({ error: 'Errore nel recupero delle donazioni' });
    }
});

// Route per reimpostare i dati (solo per testing)
app.post('/api/reset', (req, res) => {
    try {
        const initialData = {
            goal: 10000,
            totalRaised: 0,
            donorsCount: 0,
            donations: []
        };
        writeData(initialData);
        res.json({ success: true, message: 'Dati reimpostati' });
        console.log('Dati reimpostati');
    } catch (error) {
        console.error('Errore nel reset dei dati:', error);
        res.status(500).json({ error: 'Errore nel reset dei dati' });
    }
});

// Inizializza i dati all'avvio
initializeData();

// Avvia il server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🐐 Server Progetto Capra Avviato con Successo! 🐐      ║
║                                                            ║
║   Server in ascolto su: http://localhost:${PORT}             ║
║                                                            ║
║   API Endpoints disponibili:                              ║
║   • GET  /api/crowdfunding  - Ottieni dati crowdfunding  ║
║   • POST /api/donate        - Effettua una donazione     ║
║   • GET  /api/donations     - Visualizza tutte donazioni ║
║   • POST /api/reset         - Reimposta i dati           ║
║                                                            ║
║   Frontend disponibile su:                                ║
║   • http://localhost:${PORT}/index.html                      ║
║   • http://localhost:${PORT}/contribuisci.html               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// Gestione degli errori
process.on('uncaughtException', (error) => {
    console.error('Errore non gestito:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rifiutata non gestita:', promise, 'Motivo:', reason);
});
