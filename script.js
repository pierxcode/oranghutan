document.addEventListener("DOMContentLoaded", function() {
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];
  let tableContainer = document.querySelector('.table-container');
  let totalPoints = 0;
  let donutChart = null;

  // Initialiseer de tabel bij het laden van de pagina
  initializeTable();

  // Functie om de tabel te initialiseren en gegevens uit localStorage op te halen
  function initializeTable() {
      let storedData = JSON.parse(localStorage.getItem('tableData')) || [];
      
      // Voeg opgeslagen data toe aan de tabel
      storedData.forEach(data => {
          addRowToTable(data);
      });

      // Werk de zichtbaarheid van de tabel bij
      updateTableVisibility();
      updateDonutChart();
  }

  // Functie om een rij toe te voegen aan de tabel
  function addRowToTable(data) {
      let newRow = table.insertRow(0);

      // Voeg cellen toe met gegevens
      newRow.insertCell(0).appendChild(document.createTextNode(data.naam));
      newRow.insertCell(1).appendChild(document.createTextNode(data.punten));
      newRow.insertCell(2).appendChild(document.createTextNode(data.waarde));
      newRow.insertCell(3).appendChild(document.createTextNode(data.percentage));
      newRow.insertCell(4).appendChild(document.createTextNode(data.datum));

      // Voeg de verwijderknop toe aan de laatste cel
      let deleteCell = newRow.insertCell(5);
      deleteCell.innerHTML = `
      <div class="tooltip">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-backspace">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
              <path d="M12 10l4 4m0 -4l-4 4" />
          </svg>
          <span class="tooltiptext">Verwijder</span>
      </div>
      `;
      deleteCell.querySelector('svg').addEventListener('click', function() {
          deleteRow(newRow);
      });

      // Werk het totaal aantal punten bij
      totalPoints += parseFloat(data.punten);

      // Update percentages en grafiek
      updatePercentages();
      updateDonutChart();
      
      // Zorg ervoor dat de tabel zichtbaar is
      updateTableVisibility();
  }

  // Functie om een rij te verwijderen
  function deleteRow(row) {
      // Verwijder de rij uit de tabel
      let puntenCell = row.cells[1];
      totalPoints -= parseFloat(puntenCell.textContent);
      row.remove();

      // Update percentages en grafiek
      updatePercentages();
      updateDonutChart();
      saveTableData();
      updateTableVisibility();
  }

  // Functie om percentages in de tabel te updaten
  function updatePercentages() {
      let rows = table.rows;
      for (let i = 0; i < rows.length; i++) {
          let puntenCell = rows[i].cells[1];
          let percentageCell = rows[i].cells[3];
          let puntenValue = parseFloat(puntenCell.textContent);
          let percentage = (totalPoints > 0) ? (puntenValue / totalPoints) * 100 : 0;
          percentageCell.textContent = percentage.toFixed(2) + "%";
      }
  }

  // Functie om de donut chart bij te werken
  function updateDonutChart() {
      let canvas = document.getElementById('donutChart');
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetWidth; // Houd het vierkant

      let rows = table.rows;
      let labels = [];
      let data = [];
      for (let i = 0; i < rows.length; i++) {
          labels.push(rows[i].cells[0].textContent);
          data.push(parseFloat(rows[i].cells[1].textContent));
      }

      // Verwijder de oude grafiek indien deze bestaat
      if (donutChart) {
          donutChart.destroy();
      }

      // Zorg ervoor dat de chart altijd zichtbaar is
      if (data.length === 0) {
          labels = ['Geen gegevens beschikbaar'];
          data = [1];
      }

      // Maak een nieuwe donut chart aan
      donutChart = new Chart(canvas, {
          type: 'doughnut',
          data: {
              labels: labels,
              datasets: [{
                  data: data,
                  borderColor: 'transparent',
                  backgroundColor: [
                      '#34d399',
                      '#3b82f6',
                      '#fb7185',
                      '#fcd34d',
                      '#c084fc',
                      '#818cf8',
                      '#5eead4'
                  ],
                  hoverOffset: 4
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '63%',
              plugins: {
                  legend: {
                      display: false, // Verberg de legenda
                  },
                  title: {
                      display: false,
                      text: 'Aandelenverdeling'
                  }
              }
          },
      });
  }

  // Functie om tabelgegevens op te slaan in localStorage
  function saveTableData() {
      let tableRows = table.rows;
      let dataToSave = [];

      // Verzamel gegevens van elke rij
      for (let i = 0; i < tableRows.length; i++) {
          let row = tableRows[i];
          let rowData = {
              naam: row.cells[0].textContent,
              punten: row.cells[1].textContent,
              waarde: row.cells[2].textContent,
              percentage: row.cells[3].textContent,
              datum: row.cells[4].textContent
          };
          dataToSave.push(rowData);
      }

      // Sla de gegevens op in localStorage
      localStorage.setItem('tableData', JSON.stringify(dataToSave));
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

  // Voeg een event listener toe voor de submit-knop
  document.getElementById('submit').addEventListener("click", () => {
      let naamValue = document.getElementById("input").value;
      let puntenValue = parseFloat(document.getElementById("punten").value);

      // Controleer of de invoer geldig is
      if (naamValue === "" || isNaN(puntenValue)) {
          alert("🤖 Beep boop - kloppen je naam en punten?");
          return;
      }

      let rowData = {
          naam: naamValue,
          punten: puntenValue,
          waarde: puntenValue * 4,
          percentage: (totalPoints > 0) ? (puntenValue / totalPoints) * 100 : 0,
          datum: new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };

      // Voeg de rij toe aan de tabel
      addRowToTable(rowData);

      // Sla de gegevens op
      saveTableData();

      // Update de Donut Chart
      updateDonutChart();

      // Reset de invoervelden
      document.getElementById("input").value = "";
      document.getElementById("punten").value = "";

      // Herstel automatische selectie van de invoervelden
      document.getElementById("input").focus();
  });

  // Auto-selecteer de tekst in het eerste invoerveld bij het laden van de pagina
  let eersteInput = document.getElementById("input");
  if (eersteInput) {
    eersteInput.focus();
    eersteInput.select();
  }

  // Functie om het volgende veld te selecteren bij Enter-toets
  function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let inputs = Array.from(document.querySelectorAll('input, button'));
        let currentIndex = inputs.indexOf(document.activeElement);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            document.getElementById('submit').click(); // Submit de form
        }
    }
  }

  // Voeg een keydown event listener toe aan het document
  document.addEventListener('keydown', handleEnterKey);
});

document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});