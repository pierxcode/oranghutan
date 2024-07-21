document.addEventListener("DOMContentLoaded", function() {
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];
  let tableContainer = document.querySelector('.table-container');
  let totalPoints = 0; // Verplaats deze variabele hier om bereikproblemen te voorkomen
  let donutChart = null; // Verplaats deze variabele hier om bereikproblemen te voorkomen

  // Controleer of er gegevens zijn opgeslagen in localStorage
  let storedData = JSON.parse(localStorage.getItem('tableData')) || [];

  // Herstel de gegevens en bouw de tabel op
  storedData.forEach(data => {
    // Maak een nieuwe rij
    let newRow = table.insertRow(0);

    // Maak de naam input cel in de nieuwe rij
    let newCell = newRow.insertCell(0);
    newCell.appendChild(document.createTextNode(data.naam));

    // Maak de punten cel in de nieuwe rij
    let newCell1 = newRow.insertCell(1);
    newCell1.appendChild(document.createTextNode(data.punten));

    // Maak de waarde cel in de nieuwe rij
    let newCell2 = newRow.insertCell(2);
    newCell2.appendChild(document.createTextNode(data.waarde));

    // Maak de percentage cel in de nieuwe rij
    let newCell3 = newRow.insertCell(3);
    newCell3.appendChild(document.createTextNode(data.percentage));

    // Maak de datum cel in de nieuwe rij
    let newCell4 = newRow.insertCell(4);
    newCell4.appendChild(document.createTextNode(data.datum));

    // Voeg punten toe aan het totaal
    totalPoints += parseFloat(data.punten);
  });

  // Controleer of er nu rijen in de tabel zijn met echte gegevens
  let hasData = Array.from(table.rows).some(row => {
    return row.cells[1].textContent.trim() !== '';
  });

  // Als er gegevens zijn, maak de tabel container zichtbaar
  if (hasData) {
    tableContainer.classList.add('visible');
  }

  // Focus automatisch op het eerste inputveld
  let input = document.getElementById("input");
  input.focus();

  let punten = document.getElementById("punten");
  let button = document.getElementById("submit");
  let formElements = [input, punten, button]; // Voeg hier alle form elementen toe

  formElements.forEach((element, index) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Voorkom standaard gedrag
        if (element === button) {
          button.click(); // Verzend het formulier
        } else {
          // Ga naar het volgende element in het formulier
          if (index < formElements.length - 1) {
            formElements[index + 1].focus();
          }
        }
      }
    });
  });

  // Initieer de donut chart bij het laden van de pagina
  updateDonutChart();

  // Voeg een event listener toe aan de knop voor de klikgebeurtenis
  button.addEventListener("click", () => {
    // Haal de waarden uit de invoervelden
    let naamValue = input.value;
    let puntenValue = parseFloat(punten.value);

    if (naamValue === "" || isNaN(puntenValue)) {
      alert("🤖 Beep boop - kloppen je naam en punten?");
      return;
    }

    // Voeg de punten toe aan het totaal
    totalPoints += puntenValue;

    // Maak een nieuwe rij
    let newRow = table.insertRow(0);

    // Maak de naam input cel in de nieuwe rij
    let newCell = newRow.insertCell(0);
    newCell.appendChild(document.createTextNode(naamValue));

    // Maak de punten cel in de nieuwe rij
    let newCell1 = newRow.insertCell(1);
    newCell1.appendChild(document.createTextNode(puntenValue));

    // Maak de waarde cel in de nieuwe rij
    let newCell2 = newRow.insertCell(2);
    newCell2.appendChild(document.createTextNode(puntenValue * 4)); // Voorbeeldwaarde

    // Voeg de huidige datum en tijd toe aan de nieuwe cel
    let currentDate = new Date();
    let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let timeOptions = { hour: '2-digit', minute: '2-digit' };

    let dateText = currentDate.toLocaleDateString('nl-NL', dateOptions);
    let timeText = currentDate.toLocaleTimeString('nl-NL', timeOptions);

    let newCell4 = newRow.insertCell(3); // Voeg cel toe voor percentage
    let percentage = (puntenValue / totalPoints) * 100;
    newCell4.appendChild(document.createTextNode(percentage.toFixed(2) + "%"));

    let newCell5 = newRow.insertCell(4); // Voeg cel toe voor datum
    newCell5.appendChild(document.createTextNode(dateText));

    // Update het percentage voor alle rijen in de tabel
    updatePercentages();

    // Update de donut chart
    updateDonutChart();

    // Sla de tabelgegevens op in localStorage
    saveTableData();

    // Maak de invoervelden niet leeg na het toevoegen van een rij
    // input.value = "";
    // punten.value = "";
  });

  function updatePercentages() {
    let rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
      let puntenCell = rows[i].cells[1];
      let percentageCell = rows[i].cells[3];
      let puntenValue = parseFloat(puntenCell.textContent);
      let percentage = (puntenValue / totalPoints) * 100;
      percentageCell.textContent = percentage.toFixed(2) + "%";
    }
  }

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
    if (donutChart) {
      donutChart.destroy();
    }

    // Controleer of er data is
    if (data.length === 0) {
      // Voeg een placeholder dataset toe
      labels = ['Voeg een aandeelhouder toe'];
      data = [1];
    }

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
            display: false,
          },
          title: {
            display: false,
            text: 'Aandelenverdeling'
          }
        }
      },
    });
  }

  function saveTableData() {
    let tableRows = table.rows;
    let dataToSave = [];

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

    localStorage.setItem('tableData', JSON.stringify(dataToSave));
  }
});

  // Maak het logo klikbaar en stuur naar index1.html
  const logo = document.querySelector('.logo');
  logo.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
