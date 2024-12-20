const eenheden = ["mm", "cm", "dm", "m", "dam", "hm", "km"];
//index             0     1     2    3     4      5     6

let dimensie = document.getElementById("dim-select");
let opgave = document.getElementById("opg-input");
let opgEenheid = document.getElementById("opg-eenheid");
let antwoordInput = document.getElementById("antw-input");
let antwEenheid = document.getElementById("antw-eenheid");
let antwIdicator = document.getElementById("antw-indicator");
let aantalOpdrachtenInput = document.getElementById("aantal-opdrachten");
let aantalGoedIndicator = document.getElementById("aantal-goed-indicator");
let aantalProcentindictor = document.getElementById("aantal-procent-goed");

let factor;
let aantalSprongen;
let indexOpgEenheid;
let indexAntwEenheden;
let opgGetal;
let goedAntwoord = false;
let dimValue;
let aantalOpdrachten;
let aantalOpdrachtenGedaan = 0;
let aantalGoed = 0;
let magChecken = true;
let magNieuwGeneren = true;
let aantalOpdrachtenGezet = false;
let time = 0;
let timeInterval;

function BerkenProcentGoed() {
    let aantalProcentGoed = 0;

    aantalProcentGoed = (100 / aantalOpdrachten) * aantalGoed;
    aantalProcentindictor.innerHTML = `Je hebt ${aantalProcentGoed}% goed`;
}

function SetAantalOpdrachten() {
    aantalOpdrachten = aantalOpdrachtenInput.value;
    console.log(aantalOpdrachten);
    UpdateOpdrachtenGedaan();
    aantalOpdrachtenGezet = true;
}

function UpdateOpdrachtenGedaan() {
    aantalGoedIndicator.innerHTML = `${aantalOpdrachtenGedaan}/${aantalOpdrachten}`;
}

// Deze functie geeft een nieuwe opdracht
function GeefNieuweOpdracht() {
    // Als de aantalopdrachten gelijk zijn aan de gemaakte opdrachten dan mag je niet meer opdrachten maken
    if (aantalOpdrachten == aantalOpdrachtenGedaan) {
        console.log("Je hebt alle opdrachten al gedaan.");
    } else if (aantalOpdrachtenGezet == true) {
        // Als de aantalOpdrachten die gedaan moeten worden gezet zijn mag je opdrachten maken
        nieuw();
        BerkenProcentGoed();
    }
}

// All timer functions
// Deze functie update de timer elke seconde
function UpdateTimer() {
    time++;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // console.log(time);
}
// Deze functie start de timer
function StartTimer() {
    timeInterval = setInterval(UpdateTimer, 1000);
}
// Deze functie stopt de timer
function StopTimer() {
    clearInterval(timeInterval);
    console.log(time);
}

function nieuw() {
    if (magNieuwGeneren == true) {
        StartTimer();
        time = 0;

        // sets the user input field empty when a new dimension in created
        antwoordInput.value = "";
        magChecken = true;
        magNieuwGeneren = false;

        dimValue = dimensie.value;

        indexOpgEenheid = Math.floor(Math.random() * 7);
        indexAntwEenheden = Math.floor(Math.random() * 7);

        if (dimValue == 1) {
            opgEenheid.innerHTML = eenheden[indexOpgEenheid];
            antwEenheid.innerHTML = eenheden[indexAntwEenheden];
        } else {
            opgEenheid.innerHTML =
                eenheden[indexOpgEenheid] + "<sup>" + dimValue + "</sup>";
            antwEenheid.innerHTML =
                eenheden[indexAntwEenheden] + "<sup>" + dimValue + "</sup>";
        }

        //nu nog een willekeurig getal in opgave
        opgGetal = (Math.random() * 1000).toFixed(3);
        opgave.value = opgGetal;

        // maakt de factor 10, 100, 1000 afhankelijk van de dimensie keuze van de gebruiker
        factor = Math.pow(10, dimensie.value);

        aantalSprongen = Math.abs(indexOpgEenheid - indexAntwEenheden);

        // maakt de factor van de dimensie
        console.log(factor + " = factor");
        console.log(aantalSprongen + " aantalsprongen");
    }
}

function check() {
    let antwoord;
    let vermenigvuldigWaarde;

    if (aantalOpdrachtenGedaan != aantalOpdrachten && magChecken == true) {
        StopTimer();
        aantalOpdrachtenGedaan++;
        UpdateOpdrachtenGedaan();
        magChecken = false;
        magNieuwGeneren = true;

        // vermenigvuldigWaarde is de waarde die je keer het getal doet
        vermenigvuldigWaarde = Math.pow(factor, aantalSprongen);
        console.log(vermenigvuldigWaarde);

        // als de opgave eenheid groter is dan het uitreken eenheid dan moet je keer doen
        if (indexOpgEenheid > indexAntwEenheden) {
            antwoord = opgGetal * vermenigvuldigWaarde;
        } else {
            antwoord = opgGetal / vermenigvuldigWaarde;
        }
        console.log(antwoord.toFixed(6));

        let antwoordInputFloat = Number(antwoordInput.value);
        antwoordInputFloat = parseFloat(antwoordInputFloat);
        console.log(antwoordInputFloat);

        if (antwoordInputFloat.toFixed(6) === antwoord.toFixed(6)) {
            // antwIdicator.innerHTML = "Dat klopt!"
            goedAntwoord = true;
            aantalGoed++;
        } else {
            // antwIdicator.innerHTML = "Dat is fout"
            goedAntwoord = false;
        }

        // calls de functie die de opgave met het antwoord op het scherm
        LogAnswer(goedAntwoord, antwoordInputFloat, time);
        BerkenProcentGoed();
    }
}

function LogAnswer(check, antwoordInput, time) {
    const antwoordKader = document.getElementById("antwoord-kader");
    const newParagraph = document.createElement("p");
    const newSpan = document.createElement("span");
    const timeAnker = document.createElement("a");

    timeAnker.href = "#";
    timeAnker.innerHTML = " Bekijk je tijd";
    timeAnker.classList.add("link-underline-opacity-0");
    timeAnker.classList.add("link-underline");

    timeAnker.onclick = function(event) {
        event.preventDefault();
        timeAnker.innerHTML = ` ${time} Seconden`;
        timeAnker.style.color = "white";
    };

    if (dimValue == 1) {
        newParagraph.innerHTML = `${opgGetal} ${eenheden[indexOpgEenheid]} = `;
        newSpan.innerHTML = `${antwoordInput} ${eenheden[indexAntwEenheden]}`;
    } else {
        newParagraph.innerHTML = `${opgGetal} ${eenheden[indexOpgEenheid]} <sup>${dimValue}</sup> = `;
        newSpan.innerHTML = `${antwoordInput} ${eenheden[indexAntwEenheden]} <sup>${dimValue}</sup>`;
    }

    newParagraph.appendChild(newSpan);
    newParagraph.appendChild(timeAnker);
    antwoordKader.appendChild(newParagraph);

    if (check == true) {
        newSpan.style.color = "green";
    } else {
        newSpan.style.color = "red";
    }
}
