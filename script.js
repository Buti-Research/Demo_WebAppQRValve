// script.js

document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    const lightThemeLink = document.getElementById('light-theme-link');
    const darkThemeLink = document.getElementById('dark-theme-link');

    // Seleziona tutti gli elementi che cambiano stile con il tema
    const elementsToStyle = [
        document.querySelector('.dashboard-header'),
        document.querySelector('#valve-gad-accordion'), // Sezione datasheet
        document.querySelector('#documents-certs'), // Sezione documenti
        document.querySelector('#sensor-data-download'), // Sezione download sensori
        document.querySelector('#parameters'), // Sezione parametri
        document.querySelector('#alerts-log'), // Sezione alerts
        document.querySelector('#maintenance-log'), // Sezione manutenzione
        document.querySelector('#send-alert'), // Sezione invio alert
        document.querySelector('#alert-form'), // Form alert
        document.querySelector('#active-alerts'), // Active alerts
        document.querySelector('#alert-form textarea.form-control'), // Textarea
        document.querySelector('.table'), // Tabelle generiche
        document.querySelector('#pressureChart').closest('canvas'), // Canvas charts
        document.querySelector('#temperatureChart').closest('canvas') // Canvas charts
    ];

    // Seleziona i sottotitoli H2 dentro le sezioni
    const h2Elements = document.querySelectorAll('.dashboard-section h2');

    // Seleziona i bottoni e i body degli accordion
    const accordionButtons = document.querySelectorAll('.accordion-button');
    const accordionBodies = document.querySelectorAll('.accordion-body');

    // Seleziona l'immagine del datasheet
    const datasheetImg = document.querySelector('.valve-datasheet-img');

    // Seleziona le card di stato nell'header (status-card)
    const statusCards = document.querySelectorAll('.status-card');

    // Funzione per applicare il tema
    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
            lightThemeLink.disabled = true;
            darkThemeLink.disabled = false;
            themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>'; // Icona Sole per tema chiaro
            themeToggleBtn.classList.add('dark-theme'); // Stile bottone per tema scuro

            elementsToStyle.forEach(el => {
                if (el) el.classList.add('dark-theme');
            });
            h2Elements.forEach(el => el.classList.add('dark-theme'));
            accordionButtons.forEach(el => el.classList.add('dark-theme'));
            accordionBodies.forEach(el => el.classList.add('dark-theme'));
            if (datasheetImg) datasheetImg.classList.add('dark-theme');

            // Applica la classe dark-theme anche alle card di stato individualmente
            statusCards.forEach(card => card.classList.add('dark-theme'));

            // Per le tabelle striped, aggiungi una classe specifica per il tema scuro
            document.querySelectorAll('.table-striped').forEach(table => {
                table.classList.add('dark-theme-striped');
                table.classList.add('dark-theme'); // Applica anche la classe generica per il bordo
            });


        } else {
            body.classList.remove('dark-theme');
            lightThemeLink.disabled = false;
            darkThemeLink.disabled = true;
            themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>'; // Icona Luna per tema scuro
            themeToggleBtn.classList.remove('dark-theme'); // Rimuovi stile bottone per tema scuro

            elementsToStyle.forEach(el => {
                if (el) el.classList.remove('dark-theme');
            });
            h2Elements.forEach(el => el.classList.remove('dark-theme'));
            accordionButtons.forEach(el => el.classList.remove('dark-theme'));
            accordionBodies.forEach(el => el.classList.remove('dark-theme'));
            if (datasheetImg) datasheetImg.classList.remove('dark-theme');

             // Rimuovi la classe dark-theme dalle card di stato individualmente
            statusCards.forEach(card => card.classList.remove('dark-theme'));

             // Rimuovi la classe specifica per le tabelle striped
            document.querySelectorAll('.table-striped').forEach(table => {
                table.classList.remove('dark-theme-striped');
                table.classList.remove('dark-theme');
            });
        }
    }

    // Controlla la preferenza salvata al caricamento della pagina
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false); // Assicurati che il tema chiaro sia quello di default se non salvato
    }

    // Event Listener per il bottone di toggle
    themeToggleBtn.addEventListener('click', function() {
        const isDark = body.classList.contains('dark-theme');
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light'); // Salva la preferenza
    });

    // --- Il resto del tuo script.js rimane qui sotto ---

    // Dati per i parametri teorici vs reali (simulazione)
    const parameters = [
        { param: 'Pressione Ingresso', theoretical: '10', real: '9.8', unit: 'bar' },
        { param: 'Pressione Uscita', theoretical: '8', real: '7.9', unit: 'bar' },
        { param: 'Temperatura Fluido', theoretical: '30', real: '28.5', unit: '°C' },
        { param: 'Portata', theoretical: '50', real: '49.5', unit: 'm³/h' },
        { param: 'Posizione Valvola', theoretical: '100', real: '99', unit: '%' }
    ];

    const parametersBody = document.getElementById('parameters-body');
    parameters.forEach(p => {
        const row = parametersBody.insertRow();
        row.insertCell().textContent = p.param;
        row.insertCell().textContent = p.theoretical;
        row.insertCell().textContent = p.real;
        row.insertCell().textContent = p.unit;
    });

    // Dati simulati per i grafici
    const generateChartData = () => {
        const labels = Array.from({ length: 10 }, (_, i) => `Ora ${i + 1}`);
        const pressureData = Array.from({ length: 10 }, () => (Math.random() * 2 + 9).toFixed(1)); // Tra 9 e 11
        const temperatureData = Array.from({ length: 10 }, () => (Math.random() * 3 + 25).toFixed(1)); // Tra 25 e 28
        return { labels, pressureData, temperatureData };
    };

    let chartData = generateChartData();

    // Grafico Pressione
    const pressureCtx = document.getElementById('pressureChart').getContext('2d');
    const pressureChart = new Chart(pressureCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Pressione (bar)',
                data: chartData.pressureData,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Pressione (bar)',
                        color: 'body.dark-theme ? #e0e6eb : #333d47' // Colore label asse Y dinamico
                    },
                    ticks: {
                        color: 'body.dark-theme ? #e0e6eb : #333d47' // Colore tick asse Y dinamico
                    },
                    grid: {
                        color: 'body.dark-theme ? #3a4754 : #ebedef' // Colore griglia asse Y dinamico
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tempo',
                        color: 'body.dark-theme ? #e0e6eb : #333d47' // Colore label asse X dinamico
                    },
                    ticks: {
                        color: 'body.dark-theme ? #e0e6eb : #333d47' // Colore tick asse X dinamico
                    },
                    grid: {
                        color: 'body.dark-theme ? #3a4754 : #ebedef' // Colore griglia asse X dinamico
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Nasconde la legenda se c'è un solo dataset
                }
            }
        }
    });

    // Grafico Temperatura
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    const temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: chartData.temperatureData,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperatura (°C)',
                         color: 'body.dark-theme ? #e0e6eb : #333d47'
                    },
                     ticks: {
                        color: 'body.dark-theme ? #e0e6eb : #333d47'
                    },
                    grid: {
                        color: 'body.dark-theme ? #3a4754 : #ebedef'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tempo',
                         color: 'body.dark-theme ? #e0e6eb : #333d47'
                    },
                     ticks: {
                        color: 'body.dark-theme ? #e0e6eb : #333d47'
                    },
                    grid: {
                        color: 'body.dark-theme ? #3a4754 : #ebedef'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Funzione per aggiornare i colori dei grafici Chart.js al cambio tema
    function updateChartColors(isDark) {
        const axisColor = isDark ? '#e0e6eb' : '#333d47';
        const gridColor = isDark ? '#3a4754' : '#ebedef';

        [pressureChart, temperatureChart].forEach(chart => {
            if (chart) {
                chart.options.scales.y.title.color = axisColor;
                chart.options.scales.y.ticks.color = axisColor;
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.x.title.color = axisColor;
                chart.options.scales.x.ticks.color = axisColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.update();
            }
        });
    }

    // Modifica la funzione applyTheme per chiamare updateChartColors
    const originalApplyTheme = applyTheme;
    applyTheme = function(isDark) {
        originalApplyTheme(isDark);
        updateChartColors(isDark);
    };

    // Chiama applyTheme all'inizio per impostare i colori dei grafici correttamente
    applyTheme(localStorage.getItem('theme') === 'dark');

    // Gestione alert form (simulazione)
    const alertForm = document.getElementById('alert-form');
    const alertMessageTextarea = document.getElementById('alertMessage');
    const alertConfirmation = document.getElementById('alert-confirmation');
    const activeAlertsDiv = document.getElementById('active-alerts');
    const alertLogBody = document.getElementById('alert-log-body');

    alertForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impedisce il ricaricamento della pagina
        const message = alertMessageTextarea.value.trim();

        if (message) {
            // Simulazione invio alert
            console.log("Alert inviato:", message);

            // Visualizza messaggio di conferma
            alertConfirmation.classList.remove('d-none');
            alertConfirmation.textContent = `Alert inviato con successo! Messaggio: "${message}"`;

            // Aggiorna "Alert Attivi"
            activeAlertsDiv.classList.remove('d-none');
            activeAlertsDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> **ATTENZIONE:** ${message}`;

            // Aggiungi al log
            const now = new Date();
            const timestamp = now.toLocaleString('it-IT');
            const newRow = alertLogBody.insertRow(0); // Inserisce in cima
            newRow.insertCell().textContent = timestamp;
            newRow.insertCell().textContent = 'Manuale';
            newRow.insertCell().textContent = message;
            newRow.insertCell().textContent = 'Inviato';

            // Resetta il form e nasconde la conferma dopo 5 secondi
            alertMessageTextarea.value = '';
            setTimeout(() => {
                alertConfirmation.classList.add('d-none');
            }, 5000);
        } else {
            alert('Per favore, scrivi un messaggio per l\'alert.');
        }
    });

    // Simulazione del download dati sensori
    document.getElementById('download-sensor-data-btn').addEventListener('click', function() {
        const { labels, pressureData, temperatureData } = chartData;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Time,Pressure (bar),Temperature (°C)\n"; // Headers

        for (let i = 0; i < labels.length; i++) {
            csvContent += `${labels[i]},${pressureData[i]},${temperatureData[i]}\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'sensor_data.csv');
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
        alert('Dati sensori scaricati come sensor_data.csv');
    });

});