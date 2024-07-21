// Lijst met alle namen
// Alle namen hebben een nummer, beginnend bij 0
let friendsList = ["John", "mart", "Jack", "Jill", "leo", "Jared", "luna", "eva", "henk", "karel", "marco", "peter"];

// Stel de min en max in van de array voor een bestaand random nummer
let min = 0
let max = 12

// Math.floor rond af naar beneden
// Math.ceil rond af naar boven
// Math.round rond af naar dichtsbijzijnde

// Random nummer functie roepen, die geeft een random nummer tussen 0 en 1, bijvoorbeeld 0.45

// die vermenigvuldigen met de uitkomst van (12 - 0), en dan plus 0
// bijvoorbeeld 0.45 * 12 = 5.4, 5.4 + 0 is dan afgerond = 5
// of bijvoorbeeld 0.81 * 12 = 9.72, 9.72 + 0 = 10
// 10 is dan de waarde die wordt opgeslagen in x
// x is de index van de array die wordt gelogd

let x = Math.round(Math.random() * (max - min) + min)

// for loop die zo lang i kleiner is dan 6 door gaat, en elke keer een random nummer genereert
// Zodra de loop klaar is wordt het index nummer gelogd in de console
// Dit wordt 6 keer herhaald
for (let i = 0; i < 6; i++) {
  console.log(friendsList[x]);
  x = Math.floor(Math.random() * (max - min) + min)
}


// Als je geen dubbele namen wil hebben
// Kan je de functie uitbreiden zodat deze de naam die al is gelogd verwijderd wordt uit de array
// Dus de loop moet zijn iets van: (let i = 0; i < 6 && !friendsList[x]; i++)


// Doel:

// 6 random Namen

// 1 = lijst met alle namen = OK
// 2 = alle namen tellen = OK
// 3 = alle namen een nummer geven = OK
// 4 = random nummer genereren = OK
// 5 = random nummer koppelen aan index  
// 6 = index console loggen
// 7 = for loop totdat i = 6

// Verwijder dubbele namen
// Nog steeds 6 hebben

//Functies en condities//
//w3schools.com//
//Maak kleine GPT opdracht//