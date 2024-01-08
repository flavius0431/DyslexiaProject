const cards = document.querySelectorAll(".card");
let letterImageMapping = {
    "A": "avion",
    "B": "barca",
    "C": "carte",
    "D": "dinte",
    "E": "elefant",
    "F": "fluture",
    "G": "girafa",
    "H": "haina",
    "I": "inima",
    "J": "jucarie",
    "K": "koala",
    "L": "luna",
    "M": "melc",
    "N": "nor",
    "O": "ou",
    "P": "peste",
    "R": "rata",
    "S": "soare",
    "T": "tort",
    "U": "urs",
    "V": "vaca",
    "X": "xilofon",
    "Y": "yoyo",
    "Z": "zebra"
};

let foundPairs = 0;
let cardOne, cardTwo;
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
    let clickedCard = e.target.closest('.card'); // Get the closest ancestor with the 'card' class
    console.log(clickedCard);
    playCardAudio(clickedCard);

    if (clickedCard && clickedCard !== cardOne && !disableClick) {
        clickedCard.classList.add("flip");
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableClick = true;
        let cardOneContent = getCardContent(cardOne);
        let cardTwoContent = getCardContent(cardTwo);
        matchCards(cardOneContent, cardTwoContent);
    }
}

function playCardAudio(clickedCard) {
    const cardNumberElement = clickedCard.querySelector(".card-number");
    const cardNumber = cardNumberElement ? cardNumberElement.textContent : null;
    const soundPath = getSoundPath(cardNumber, clickedCard);

    if (soundPath) {
        new Audio(soundPath).play();
    }
}

function getSoundPath(cardNumber, clickedCard) {
    const basePath = cardNumber in letterImageMapping ? 'letterSounds' : 'imageSounds';

    if (basePath === 'imageSounds') {
        const word = letterImageMapping[clickedCard.dataset.letter];
        return `../${basePath}/${word}.mp3`;
    }

    return cardNumber ? `../${basePath}/${cardNumber}.mp3` : null;
}


function getCardContent(card) {
    const cardBackView = card.querySelector(".back-view");
    if (cardBackView.classList.contains("image-back")) {
        return card.dataset.letter; // Use the letter for the image cards
    } else {
        return card.querySelector(".card-number").textContent; // Use the text for the letter cards
    }
}

function matchCards(content1, content2) {
    if (content1 === content2) {
        foundPairs++;
        if (foundPairs == 8) {
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
        cardOne = cardTwo = "";
        disableClick = false;
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = "";
            disableClick = false;
        }, 1200);
    }
}

function shuffleCards() {
    foundPairs = 0;
    cardOne = cardTwo = "";
    let letters = Object.keys(letterImageMapping);
    let shuffledLetters = shuffleArray(letters).slice(0, 8); // Select 8 random letters
    let shuffledLetters2 = [...shuffledLetters]
    shuffledLetters2.sort(() => Math.random() > 0.5 ? 1 : -1);
    let arr = Array(16);
    arr[0] = shuffledLetters[0];
    arr[1] = shuffledLetters2[0];
    arr[2] = shuffledLetters[1];
    arr[3] = shuffledLetters2[1];
    arr[4] = shuffledLetters2[2];
    arr[5] = shuffledLetters[2];
    arr[6] = shuffledLetters2[3];
    arr[7] = shuffledLetters[3];
    arr[8] = shuffledLetters[4];
    arr[9] = shuffledLetters2[4];
    arr[10] = shuffledLetters[5];
    arr[11] = shuffledLetters2[5];
    arr[12] = shuffledLetters2[6];
    arr[13] = shuffledLetters[6];
    arr[14] = shuffledLetters2[7];
    arr[15] = shuffledLetters[7];

    cards.forEach((card, index) => {
        card.classList.remove("flip", "shake");
        card.dataset.letter = arr[index];
        let imgTag = card.querySelector("img");
        if (imgTag) {
            imgTag.src = `images/${letterImageMapping[arr[index]]}.png`;
            card.querySelector(".back-view").classList.add("image-back");
        } else {
            card.querySelector(".card-number").textContent = arr[index];
            card.querySelector(".back-view").classList.remove("image-back");
        }
        card.addEventListener("click", flipCard);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffleCards();

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