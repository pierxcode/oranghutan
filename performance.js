document.addEventListener("DOMContentLoaded", function() {
  let input = document.getElementById("input");
  let punten = document.getElementById("punten");
  let button = document.getElementById("submit");
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];
  let tableContainer = document.querySelector('.table-container'); // Voeg de selectie van de tabelcontainer toe

  // Initiële dataset voor de grafiek
  const initialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Omzet per maand',
      data: Array(12).fill(0), // Start met allemaal nullen
      backgroundColor: [
        '#34d399',
        '#3b82f6',
        '#fb7185',
        '#fcd34d',
        '#c084fc',
        '#818cf8',
        '#5eead4',
        '#34d399',
        '#3b82f6',
        '#fb7185',
        '#fcd34d',
        '#c084fc'
      ],
      borderColor: 'transparent',
      borderRadius: 6
    }]
  };

  // Configuratie voor de grafiek
  const config = {
    type: 'bar',
    data: initialData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  // Maak de grafiek
  var myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  // Checken of localStorage beschikbaar is
  function isLocalStorageAvailable() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Functie om opgeslagen gegevens te laden
  function loadStoredData() {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available.');
      return;
    }

    let storedData = JSON.parse(localStorage.getItem('logData')) || [];

    // Vul de tabel met opgeslagen gegevens
    storedData.forEach(data => {
      let newRow = table.insertRow();
      let maandCell = newRow.insertCell(0);
      let revenueCell = newRow.insertCell(1);
      let actionCell = newRow.insertCell(2);

      maandCell.textContent = data.maand;
      revenueCell.textContent = data.revenue;

      // Voeg de verwijderknop toe
      actionCell.innerHTML = `
        <div class="tooltip">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-backspace" data-action="delete">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
            <path d="M12 10l4 4m0 -4l-4 4" />
          </svg>
          <span class="tooltiptext">Verwijder</span>
        </div>
      `;

      // Voeg een event listener toe voor de verwijderknop
      actionCell.querySelector('svg').addEventListener('click', function() {
        deleteRow(newRow);
      });

      updateChart(data.maand, data.revenue);
    });

    // Controleer of er nu rijen in de tabel zijn met echte gegevens
    let hasData = Array.from(table.rows).some(row => row.cells[1].textContent.trim() !== '');
    if (hasData) {
      tableContainer.classList.add('visible');
    }
  }

  // Functie om opgeslagen gegevens op te slaan
  function saveDataToStorage(maand, revenue) {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available.');
      return;
    }

    let storedData = JSON.parse(localStorage.getItem('logData')) || [];
    storedData.push({ maand: maand, revenue: revenue });
    localStorage.setItem('logData', JSON.stringify(storedData));
  }

  // Functie om de grafiek te resetten naar de initiële staat
  function resetChart() {
    if (typeof myChart !== 'undefined') {
      myChart.data.datasets[0].data = Array(initialData.labels.length).fill(0);
      myChart.update();
    } else {
      console.error('myChart is not initialized.');
    }
  }

  // Functie om de grafiek te updaten
  function updateChart(maand, revenue) {
    if (typeof myChart !== 'undefined') {
      // Voeg de nieuwe gegevens toe aan de dataset
      let index = myChart.data.labels.indexOf(maand);
      if (index !== -1) {
        myChart.data.datasets[0].data[index] = revenue;
        myChart.update();
      } else {
        console.error('Month not found in chart labels.');
      }
    } else {
      console.error('myChart is not initialized.');
    }
  }

  // Functie om gegevens op te slaan na verwijdering
  function saveDataToStorageAfterDeletion() {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available.');
      return;
    }

    let storedData = Array.from(table.rows).map(row => ({
      maand: row.cells[0].textContent,
      revenue: parseFloat(row.cells[1].textContent)
    }));
    
    localStorage.setItem('logData', JSON.stringify(storedData));
  }

  // Functie om een rij te verwijderen
  function deleteRow(row) {
    let revenueValue = parseFloat(row.cells[1].textContent);
    totalRevenue -= revenueValue;
    row.remove();
    updateChartDataAfterDeletion(); // Update de grafiek na verwijdering
    saveDataToStorageAfterDeletion(); // Sla de gewijzigde gegevens op
    updateTableVisibility(); // Update tabel zichtbaarheid
  }

  // Functie om de grafiek bij te werken na verwijdering
  function updateChartDataAfterDeletion() {
    if (typeof myChart !== 'undefined') {
      myChart.data.datasets[0].data = myChart.data.labels.map(maand => {
        let row = Array.from(table.rows).find(row => row.cells[0].textContent === maand);
        return row ? parseFloat(row.cells[1].textContent) : 0;
      });
      myChart.update();
    } else {
      console.error('myChart is not initialized.');
    }
  }

  // Functie om de zichtbaarheid van de tabelcontainer bij te werken
  function updateTableVisibility() {
    let hasData = table.rows.length > 0;
    if (hasData) {
      tableContainer.classList.add('visible');
    } else {
      tableContainer.classList.remove('visible');
    }
  }

  // Laad opgeslagen gegevens bij het laden van de pagina
  loadStoredData();

  // Light mode / dark mode toggle
  document.getElementById('mode-toggle').addEventListener('click', function() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = modeToggle.querySelector('.mode-icon');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
      modeIcon.src = '/assets/images/moon-stars.svg';
      modeIcon.alt = 'Switch to Dark Mode';
      localStorage.setItem('theme', 'light');
    } else {
      modeIcon.src = '/assets/images/sun.svg';
      modeIcon.alt = 'Switch to Light Mode';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Pas thema toe op basis van opgeslagen voorkeur
  function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    if (savedTheme === 'light') {
      body.classList.add('light-mode');
      document.getElementById('mode-toggle').querySelector('.mode-icon').src = '/assets/images/moon-stars.svg';
    } else {
      body.classList.remove('light-mode');
      document.getElementById('mode-toggle').querySelector('.mode-icon').src = '/assets/images/sun.svg';
    }
  }
  applySavedTheme(); // Pas het opgeslagen thema toe bij laden van de pagina

  let formElements = [input, punten, button]; // Voeg hier alle form elementen toe

  // Focus automatisch op het eerste inputveld
  input.focus();

  formElements.forEach((element, index) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // voorkom standaardgedrag
        if (element === button) {
          button.click(); // verstuur het formulier
        } else {
          // Ga naar het volgende element in het formulier
          if (index < formElements.length - 1) {
            formElements[index + 1].focus();
          }
        }
      }
    });
  });

  let totalRevenue = 0;
  let firstInputAdded = false; // Variabele om bij te houden of de eerste invoer is toegevoegd

  // Voeg een event listener toe aan de knop voor de klik gebeurtenis
  button.addEventListener("click", function() {
    // Haal de waarden uit de invoervelden
    let maandValue = input.value;
    let revenueValue = parseFloat(punten.value);

    if (maandValue === "" || isNaN(revenueValue)) {
      alert("🤖 Beep boop - kloppen je maand en revenue?");
      return;
    }

    // Als dit de eerste invoer is, verwijder dan de initiële data uit de grafiek
    if (!firstInputAdded) {
      resetChart(); // Reset de grafiek naar de initiële staat
      firstInputAdded = true; // Markeer dat de eerste invoer is toegevoegd
    }

    // Voeg de revenue toe aan het totaal
    totalRevenue += revenueValue;

    // Maak een nieuwe rij
    let newRow = table.insertRow();
    let maandCell = newRow.insertCell(0);
    let revenueCell = newRow.insertCell(1);
    let actionCell = newRow.insertCell(2);

    maandCell.textContent = maandValue;
    revenueCell.textContent = revenueValue;

    // Voeg de verwijderknop toe
    actionCell.innerHTML = `
      <div class="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-backspace" data-action="delete">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
          <path d="M12 10l4 4m0 -4l-4 4" />
        </svg>
        <span class="tooltiptext">Verwijder</span>
      </div>
    `;

    // Voeg een event listener toe voor de verwijderknop
    actionCell.querySelector('svg').addEventListener('click', function() {
      deleteRow(newRow);
    });

    // Update de grafiek met de nieuwe gegevens
    updateChart(maandValue, revenueValue);

    // Sla de ingevoerde gegevens op in localStorage
    saveDataToStorage(maandValue, revenueValue);

    // Controleer of er nu rijen in de tabel zijn met echte gegevens
    let hasData = Array.from(table.rows).some(row => row.cells[1].textContent.trim() !== '');
    if (hasData) {
      tableContainer.classList.add('visible');
    }
  });

  // Reset tabel data
  document.getElementById('resetButton').addEventListener('click', function() {
    if (confirm('Weet je zeker dat je alles wil wissen?')) {
      localStorage.removeItem('logData');
      // Verwijder alle rijen uit de tabel
      while (table.rows.length) {
        table.deleteRow(0);
      }
      // Update de visuele weergave
      document.querySelector('.table-container').classList.remove('visible');
      resetChart(); // Reset de grafiek na verwijderen van data
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});