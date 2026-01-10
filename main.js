// API endpoint - usa URL relativo per funzionare sia in locale che in produzione
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Funzione per formattare le date
function timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

// Funzione per ottenere le iniziali del nome
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Funzione per caricare i dati del crowdfunding
async function loadCrowdfundingData() {
    try {
        const response = await fetch(`${API_URL}/crowdfunding`);
        const data = await response.json();
        
        updateStats(data);
        updateDonorsList(data.recentDonors);
    } catch (error) {
        console.error('Error loading data:', error);
        // Usa dati di fallback se il server non è disponibile
        updateStats({
            totalRaised: 0,
            goal: 10000,
            donorsCount: 0,
            percentage: 0,
            recentDonors: []
        });
    }
}

// Funzione per aggiornare le statistiche
function updateStats(data) {
    const totalRaisedEl = document.getElementById('totalRaised');
    const goalAmountEl = document.getElementById('goalAmount');
    const donorsCountEl = document.getElementById('donorsCount');
    const progressFillEl = document.getElementById('progressFill');
    const progressTextEl = document.getElementById('progressText');

    if (totalRaisedEl) {
        totalRaisedEl.textContent = `€${data.totalRaised.toLocaleString('en-US')}`;
    }
    
    if (goalAmountEl) {
        goalAmountEl.textContent = `€${data.goal.toLocaleString('en-US')}`;
    }
    
    if (donorsCountEl) {
        donorsCountEl.textContent = data.donorsCount;
    }

    if (progressFillEl && progressTextEl) {
        progressFillEl.style.width = `${data.percentage}%`;
        progressTextEl.textContent = `${Math.round(data.percentage)}%`;
    }
}

// Funzione per aggiornare la lista dei donatori
function updateDonorsList(donors) {
    const donorsListEl = document.getElementById('donorsList');
    
    if (!donorsListEl) return;

    if (donors.length === 0) {
        donorsListEl.innerHTML = '<p class="no-donors">Be the first to support our project!</p>';
        return;
    }

    donorsListEl.innerHTML = donors.map(donor => `
        <div class="donor-card">
            <div class="donor-avatar">${getInitials(donor.name)}</div>
            <div class="donor-info">
                <h4>${donor.name}</h4>
                <div class="donor-amount">€${donor.amount.toLocaleString('en-US')}</div>
                <div class="donor-time">${timeAgo(donor.timestamp)}</div>
                ${donor.message ? `<div class="donor-message">"${donor.message}"</div>` : ''}
            </div>
        </div>
    `).join('');
}

// Animazione smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carica i dati all'avvio
loadCrowdfundingData();

// Aggiorna i dati ogni 30 secondi
setInterval(loadCrowdfundingData, 30000);
