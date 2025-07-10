// Funzioni helper per la simulazione dei dati
function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Elenco Parametri Standard Teorici vs Reali ---
const ctxPressure = document.getElementById('pressureChart').getContext('2d');
window.pressureChartInstance = new Chart(ctxPressure, {
    type: 'line',
    data: {
        labels: Array(10).fill(''),
        datasets: [{
            label: 'Pressione Reale (bar)',
            data: Array(10).fill(10),
            borderColor: 'rgb(12, 91, 211)',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        animation: false,
        scales: {
            y: { beginAtZero: false, suggestedMin: 9, suggestedMax: 11 },
            x: { display: false }
        },
        plugins: {
            legend: { display: true }
        }
    }
});

const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
window.temperatureChartInstance = new Chart(ctxTemperature, {
    type: 'line',
    data: {
        labels: Array(10).fill(''),
        datasets: [{
            label: 'Temperatura Reale (°C)',
            data: Array(10).fill(25),
            borderColor: 'rgb(253, 45, 45)',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        animation: false,
        scales: {
            y: { beginAtZero: false, suggestedMin: 23, suggestedMax: 27 },
            x: { display: false }
        },
        plugins: {
            legend: { display: true }
        }
    }
});

function updateParameters() {
    const params = [
        { name: "Pressione Ingresso", theoretical: "10 bar", real: getRandomValue(9.5, 10.5) + " bar" },
        { name: "Pressione Uscita", theoretical: "5 bar", real: getRandomValue(4.8, 5.2) + " bar" },
        { name: "Temperatura", theoretical: "25 °C", real: getRandomValue(24, 26) + " °C" },
        { name: "Posizione Valvola", theoretical: "Aperta (100%)", real: getRandomValue(99, 100) + "%" },
        { name: "Velocità Flusso", theoretical: "100 L/min", real: getRandomValue(98, 102) + " L/min" },
        { name: "Thickness / Corrosion", theoretical: "0.5 mm", real: "0.33 mm" }

    ];
    const tbody = document.getElementById('parameters-body');
    tbody.innerHTML = ''; // clear table
    params.forEach(p => {
        const row = tbody.insertRow();
        row.insertCell().textContent = p.name;
        row.insertCell().textContent = p.theoretical;
        row.insertCell().textContent = p.real;
        row.insertCell().textContent = p.name.includes("Pressione") ? "bar" : (p.name.includes("Temperatura") ? "°C" : (p.name.includes("Valvola") ? "%" : "L/min"));
    });

    // random update chart
    if (window.pressureChartInstance) {
        window.pressureChartInstance.data.datasets[0].data.push(parseFloat(params[0].real));
        window.pressureChartInstance.data.datasets[0].data.shift(); // remove first to have windows ????
        window.pressureChartInstance.update();
    }
    if (window.temperatureChartInstance) {
        window.temperatureChartInstance.data.datasets[0].data.push(parseFloat(params[2].real));
        window.temperatureChartInstance.data.datasets[0].data.shift();
        window.temperatureChartInstance.update();
    }
}
setInterval(updateParameters, 1000); // update every 1 sec
updateParameters();

// --- Elenco Status Operativi di Lavoro ---
function updateOperationalStatus() {
    const valveStates = ["Aperta (100%)", "Chiusa (0%)", "Apertura...", "Chiusura..."];
    const actuatorStates = ["Operativo", "Manutenzione Richiesta", "Errore"];
    const modeStates = ["Manuale", "Automatico"];
    const connectionStates = ["Connesso", "Disconnesso", "Riconnessione..."];

    const valveStatusEl = document.getElementById('valve-status');
    const actuatorStatusEl = document.getElementById('actuator-status');
    const modeStatusEl = document.getElementById('mode-status');
    const connectionStatusEl = document.getElementById('connection-status');

    valveStatusEl.textContent = valveStates[getRandomInt(0, valveStates.length - 1)];
    actuatorStatusEl.textContent = actuatorStates[getRandomInt(0, actuatorStates.length - 1)];
    modeStatusEl.textContent = modeStates[getRandomInt(0, modeStates.length - 1)];
    // connectionStatusEl.textContent = connectionStates[getRandomInt(0, connectionStates.length - 1)];

    // change the color based on random state
    const actuatorCard = actuatorStatusEl.closest('.card');
    actuatorCard.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-info');
    if (actuatorStatusEl.textContent === "Operativo") {
        actuatorCard.classList.add('bg-success');
    } else if (actuatorStatusEl.textContent === "Manutenzione Richiesta") {
        actuatorCard.classList.add('bg-warning');
    } else if (actuatorStatusEl.textContent === "Errore") {
        actuatorCard.classList.add('bg-danger');
    } else {
        actuatorCard.classList.add('bg-info'); 
    }
}
setInterval(updateOperationalStatus, 10000); // update every 10 sec
updateOperationalStatus(); 

// --- Alert Attivi e Log ---
let alertCounter = 0;
const alertLog = []; 
function addSimulatedAlert() {
    alertCounter++;
    const now = new Date().toLocaleString('it-IT');
    const alertTypes = ["Critico", "Avviso", "Informazione"];
    const alertMessages = [
        "Pressione eccessiva rilevata.",
        "Manutenzione programmata in arrivo.",
        "Valvola in stato di chiusura lenta.",
        "Anomalia nel sensore di temperatura.",
        "Connessione persa con sensore."
    ];
    const alertStates = ["Attivo", "Risolto"];

    const randomType = alertTypes[getRandomInt(0, alertTypes.length - 1)];
    const randomMsg = alertMessages[getRandomInt(0, alertMessages.length - 1)];
    const randomState = alertStates[getRandomInt(0, alertStates.length - 1)];

    const newAlert = {
        timestamp: now,
        type: randomType,
        message: randomMsg,
        state: randomState
    };
    alertLog.unshift(newAlert); 
    if (alertLog.length > 10) { 
        alertLog.pop();
    }

    const tbody = document.getElementById('alert-log-body');
    tbody.innerHTML = ''; // clear the table
    alertLog.forEach(alertItem => {
        const row = tbody.insertRow();
        row.insertCell().textContent = alertItem.timestamp;
        row.insertCell().textContent = alertItem.type;
        row.insertCell().textContent = alertItem.message;
        row.insertCell().textContent = alertItem.state;
    });

    // Mostra alert attivo casualmente
    const activeAlertDiv = document.getElementById('active-alerts');
    if (Math.random() > 0.7 && newAlert.state === "Attivo" && newAlert.type === "Critico") { // Mostra un alert critico attivo ogni tanto
        activeAlertDiv.classList.remove('d-none');
        activeAlertDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> <strong>${newAlert.type}:</strong> ${newAlert.message}`;
    } else {
        activeAlertDiv.classList.add('d-none');
    }
}
setInterval(addSimulatedAlert, 15000); // every 5 sec
addSimulatedAlert(); // first update

// --- Sensor Data Download ---
document.getElementById('download-sensor-data-btn').addEventListener('click', function() {
    const data = [
        ['Timestamp', 'Pressure In (bar)', 'Pressure Out (bar)', 'Temperature (°C)', 'Valve Position (%)'],
    ];

    const startDate = new Date('2024-01-01T00:00:00');
    for (let i = 0; i < 200; i++) { // 200 data point
        const currentTimestamp = new Date(startDate.getTime() + i * 3600 * 1000); // Ogni ora
        data.push([
            currentTimestamp.toISOString(),
            getRandomValue(9.5, 10.5),
            getRandomValue(4.8, 5.2),
            getRandomValue(24, 26),
            getRandomInt(0, 100)
        ]);
    }

    let csvContent = data.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sensor_data_demo.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Il tuo browser non supporta il download diretto. Copia il contenuto seguente:\n\n' + csvContent);
    }
});

// --- Invio Alert ---
document.getElementById('alert-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impedisce il ricaricamento della pagina
    const message = document.getElementById('alertMessage').value;
    if (message.trim() === '') {
        alert('Il messaggio non può essere vuoto.');
        return;
    }

    console.log("Simulazione invio alert:", message);

    const now = new Date().toLocaleString('it-IT');
    const newManualAlert = {
        timestamp: now,
        type: "Manuale",
        message: message,
        state: "Inviato"
    };
    alertLog.unshift(newManualAlert); // manual alert
    if (alertLog.length > 10) {
        alertLog.pop();
    }
    const tbody = document.getElementById('alert-log-body');
    tbody.innerHTML = ''; // refresh the table
    alertLog.forEach(alertItem => {
        const row = tbody.insertRow();
        row.insertCell().textContent = alertItem.timestamp;
        row.insertCell().textContent = alertItem.type;
        row.insertCell().textContent = alertItem.message;
        row.insertCell().textContent = alertItem.state;
    });


    document.getElementById('alert-confirmation').classList.remove('d-none');
    document.getElementById('alertMessage').value = ''; // clear field
    setTimeout(() => {
        document.getElementById('alert-confirmation').classList.add('d-none');
    }, 3000); // hide after 3 sec
});