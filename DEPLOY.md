# 🚀 Guida al Deploy su Render

Questa guida ti aiuterà a caricare il sito del Progetto Capra su Render.

## Prerequisiti

- Account GitHub (per il deploy automatico) o file del progetto
- Account su [Render.com](https://render.com) (gratuito)

## Metodo 1: Deploy con GitHub (Consigliato)

### Passo 1: Carica il progetto su GitHub

1. Crea un nuovo repository su GitHub
2. Nel terminale, esegui:

```bash
cd "c:\Users\matte\Desktop\Sito Capra"
git init
git add .
git commit -m "Initial commit - Progetto Capra Crowdfunding"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/TUO-REPO.git
git push -u origin main
```

### Passo 2: Connetti Render a GitHub

1. Vai su [Render Dashboard](https://dashboard.render.com)
2. Clicca su **"New +"** in alto a destra
3. Seleziona **"Web Service"**
4. Clicca su **"Connect GitHub"** (se non l'hai già fatto)
5. Autorizza Render ad accedere ai tuoi repository

### Passo 3: Configura il Web Service

1. Seleziona il repository del progetto
2. Render rileverà automaticamente il file `render.yaml` 
3. Oppure configura manualmente:
   - **Name**: `progetto-capra` (o il nome che preferisci)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (per iniziare)

4. Clicca su **"Create Web Service"**

### Passo 4: Attendi il Deploy

- Render installerà le dipendenze e avvierà il server
- Il processo richiede 2-5 minuti
- Quando completo, vedrai "Your service is live 🎉"

### Passo 5: Visita il Sito

Il tuo sito sarà disponibile su:
```
https://progetto-capra.onrender.com/index.html
```

## Metodo 2: Deploy Manuale (senza Git)

### Passo 1: Prepara il progetto

1. Assicurati che tutti i file siano presenti nella cartella
2. Verifica che `package.json` e `server.js` siano configurati correttamente

### Passo 2: Usa Render Dashboard

1. Vai su [Render Dashboard](https://dashboard.render.com)
2. Clicca su **"New +"** → **"Web Service"**
3. Seleziona **"Build and deploy from a public Git repository"**
4. Carica il progetto manualmente o usa una repo pubblica

## ⚙️ Configurazione Avanzata

### Variabili d'Ambiente (opzionali)

Nella dashboard di Render, puoi aggiungere variabili d'ambiente:

- `NODE_ENV`: `production`
- `PORT`: (gestito automaticamente da Render)

### Aggiornamenti Automatici

Con il deploy via GitHub:
- Ogni push al branch `main` farà partire un nuovo deploy automaticamente
- Puoi disabilitare questa funzione nelle impostazioni del servizio

### Monitoraggio

Nella dashboard di Render puoi:
- Vedere i log in tempo reale
- Monitorare l'uso delle risorse
- Configurare health checks
- Impostare notifiche

## 🔧 Risoluzione Problemi

### Il sito non si carica

1. Controlla i log nella dashboard Render
2. Verifica che il comando start sia `npm start`
3. Assicurati che tutte le dipendenze siano in `package.json`

### Le donazioni spariscono

Render usa un filesystem effimero sul piano Free. Le donazioni vengono salvate ma potrebbero essere perse al riavvio. Soluzioni:
- Usa Render Disks (a pagamento)
- Integra un database (PostgreSQL gratuito disponibile)
- Considera MongoDB Atlas (ha un tier gratuito)

### Errore 503

- Il servizio potrebbe essere in fase di avvio (attendi 1-2 minuti)
- Sul piano Free, i servizi si "addormentano" dopo inattività e impiegano ~30 secondi a riattivarsi

## 📊 Piano Free di Render

Il piano gratuito include:
- ✅ 750 ore/mese di runtime
- ✅ SSL automatico (HTTPS)
- ✅ Deploy automatici da GitHub
- ⚠️ Il servizio si "addormenta" dopo 15 minuti di inattività
- ⚠️ Primo caricamento lento dopo inattività (~30 secondi)
- ⚠️ Filesystem effimero (i dati salvati su disco vengono persi al riavvio)

## 🎯 Prossimi Passi

Dopo il deploy:

1. **Testa il sito**: Vai su `https://tuo-servizio.onrender.com/index.html`
2. **Fai una donazione di prova**: Verifica che tutto funzioni
3. **Personalizza il dominio**: Puoi aggiungere un dominio personalizzato nelle impostazioni
4. **Condividi**: Il tuo sito è online e accessibile a tutti!

## 🔗 Link Utili

- [Documentazione Render](https://render.com/docs)
- [Render Status](https://status.render.com)
- [Community Forum](https://community.render.com)

---

Per qualsiasi problema, controlla sempre i log nella dashboard di Render! 🐐
