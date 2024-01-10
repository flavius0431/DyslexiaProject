const cards = document.querySelectorAll(".card");

let foundPairs = 0;
let cardOne = null, cardTwo = null;
let disableClick = false;

function goBack() {
    let currentStars = getStarsCountFromURL();
    window.location.href = `../mainPage.html?stars=${currentStars}`;
}

function getStarsCountFromURL() {
    let params = new URLSearchParams(window.location.search);
    return parseInt(params.get('stars')) || 0;
}

function flipCard(e) {
    let clickedCard = e.target;
    console.log(clickedCard);
    playCardAudio(clickedCard);

    if (!disableClick && clickedCard !== cardOne) {
        clickedCard.classList.add("flip");

        if (!cardOne) {
            cardOne = clickedCard;
        } else if (!cardTwo) {
            cardTwo = clickedCard;
            disableClick = true;
            matchCards(cardOne, cardTwo);
        } else {
            cardOne = clickedCard;
            cardTwo = null;
            disableClick = false;
        }
    }
}

function playCardAudio(clickedCard) {
    let cardNumber = clickedCard.querySelector(".card-number").textContent;
    var audio;
    switch (cardNumber) {
        case 'A':
            audio = new Audio('../letterSounds/A.mp3');
            break;
        case 'B':
            audio = new Audio('../letterSounds/B.mp3');
            break;
        case 'C':
            audio = new Audio('../letterSounds/C.mp3');
            break;
        case 'D':
            audio = new Audio('../letterSounds/D.mp3');
            break;
        case 'E':
            audio = new Audio('../letterSounds/E.mp3');
            break;
        case 'F':
            audio = new Audio('../letterSounds/F.mp3');
            break;
        case 'G':
            audio = new Audio('../letterSounds/G.mp3');
            break;
        case 'H':
            audio = new Audio('../letterSounds/H.mp3');
            break;
    }
    audio.play();
}


function matchCards(cardOne, cardTwo) {
    let letter1 = cardOne.querySelector(".card-number").textContent;
    let letter2 = cardTwo.querySelector(".card-number").textContent;
    console.log(letter1);
    console.log(letter2);
    if (letter1 == letter2) {

        foundPairs++;
        if (foundPairs == 12) {
            setTimeout(() => {
                var audio = new Audio('../congratulation-sound-effect.mp3');
                audio.play();

                setTimeout(() => {
                    var congratulationSound = new Audio('../letterSounds/congratulations-letters.mp3');
                    congratulationSound.play();

                    customAlert.alert("⭐⭐⭐ BRAVO! Ai castigat jocul! ⭐⭐⭐", "Felicitari!");
                    setTimeout(() => {
                        customAlert.ok();
                    }, 5000);

                    setTimeout(() => {
                        // redirect to the main page
                        let currentStars = getStarsCountFromURL();
                        currentStars++;  
                        // Redirect to the main page with the updated stars count
                        window.location.href = `../mainPage.html?stars=${currentStars}`;
                    }, 5000);
                }, 1000); // Add a delay of 1000 milliseconds (1 second) between the audios
            }, 1500);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = null;
        return disableClick = false;
    }

    //two cards don't match
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400); //added shake after 400ms

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = null;
        //console.log(cardOne);
        disableClick = false;

    }, 1200); //removed shake and flip after 1.2s

}

function shuffleCards() {
    foundPairs = 0;
    cardOne = cardTwo = null;
    //making the deck random
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    let result = arr.map((value, index) => {
        // Assuming 'A' corresponds to 1, 'B' to 2, and so on
        return String.fromCharCode('A'.charCodeAt(0) + (value - 1) % 8);
    });
    //removing flip class and adding random number to each card
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let number = result[index];
        card.querySelector(".back-view .card-number").textContent = number;
        card.addEventListener("click", flipCard);
    });

}

function togglePop() {
    let popup = document.getElementById('popAlert');
    popup.classList.toggle('active');
}

shuffleCards();

// Notification
function CustomAlert() {
    this.alert = function (message, title) {
        document.body.innerHTML = document.body.innerHTML + '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot"></div></div></div>';

        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');

        let winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        dialogbox.style.top = "50px";

        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";

        document.getElementById('dialogboxhead').style.display = 'block';

        if (typeof title === 'undefined') {
            document.getElementById('dialogboxhead').style.display = 'none';
        } else {
            document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;
        }
        document.getElementById('dialogboxbody').innerHTML = message;
    }

    this.ok = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}

let customAlert = new CustomAlert();