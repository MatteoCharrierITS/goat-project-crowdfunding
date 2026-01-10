
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
        
        updateSummaryStats(data);
        updateRecentDonors(data.recentDonors);
    } catch (error) {
        console.error('Error loading data:', error);
        updateSummaryStats({
            totalRaised: 0,
            goal: 10000,
            donorsCount: 0,
            percentage: 0,
            recentDonors: []
        });
    }
}

// Funzione per aggiornare le statistiche nel sommario
function updateSummaryStats(data) {
    const summaryRaisedEl = document.getElementById('summaryRaised');
    const summaryGoalEl = document.getElementById('summaryGoal');
    const summaryDonorsEl = document.getElementById('summaryDonors');
    const progressFillEl = document.getElementById('contributionProgressFill');
    const progressTextEl = document.getElementById('contributionProgressText');

    if (summaryRaisedEl) {
        summaryRaisedEl.textContent = `€${data.totalRaised.toLocaleString('en-US')}`;
    }
    
    if (summaryGoalEl) {
        summaryGoalEl.textContent = `€${data.goal.toLocaleString('en-US')}`;
    }
    
    if (summaryDonorsEl) {
        summaryDonorsEl.textContent = data.donorsCount;
    }

    if (progressFillEl && progressTextEl) {
        progressFillEl.style.width = `${data.percentage}%`;
        progressTextEl.textContent = `${Math.round(data.percentage)}%`;
    }
}

// Funzione per aggiornare la lista dei donatori recenti
function updateRecentDonors(donors) {
    const recentDonorsGridEl = document.getElementById('recentDonorsGrid');
    
    if (!recentDonorsGridEl) return;

    if (donors.length === 0) {
        recentDonorsGridEl.innerHTML = '<p class="no-donors">No donations yet</p>';
        return;
    }

    recentDonorsGridEl.innerHTML = donors.map(donor => `
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

// Gestione dei pulsanti di selezione importo
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');

amountButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Rimuovi la selezione dagli altri pulsanti
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Seleziona questo pulsante
        this.classList.add('selected');
        
        // Imposta l'importo nell'input
        const amount = this.dataset.amount;
        customAmountInput.value = amount;
    });
});

// Rimuovi la selezione dai pulsanti quando si digita un importo personalizzato
customAmountInput.addEventListener('input', function() {
    amountButtons.forEach(btn => btn.classList.remove('selected'));
});

// Gestione del form di donazione
const donationForm = document.getElementById('donationForm');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const successMessage = document.getElementById('successMessage');
const donatedAmountEl = document.getElementById('donatedAmount');

donationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Ottieni i dati del form
    const formData = {
        amount: parseFloat(customAmountInput.value),
        name: document.getElementById('donorName').value.trim() || 'Anonimo',
        message: document.getElementById('donorMessage').value.trim()
    };

    // Validation
    if (!formData.amount || formData.amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    // Mostra il loader
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline-block';
    donationForm.querySelector('button[type="submit"]').disabled = true;

    try {
        const response = await fetch(`${API_URL}/donate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            donatedAmountEl.textContent = `€${formData.amount.toLocaleString('en-US')}`;
            donationForm.style.display = 'none';
            successMessage.style.display = 'block';

            // Update data
            loadCrowdfundingData();
        } else {
            alert('Error processing donation. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Connection error. Please verify that the server is running.');
    } finally {
        // Ripristina il pulsante
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
        donationForm.querySelector('button[type="submit"]').disabled = false;
    }
});

// Carica i dati all'avvio
loadCrowdfundingData();

// Aggiorna i dati ogni 30 secondi
setInterval(loadCrowdfundingData, 30000);
