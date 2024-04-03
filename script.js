let words = [];
let currentWord = '';
let currentLetterIndex = 0;
let attemptFailed = false;

const successMessages = [
    "Fantastic job!",
    "You're doing great!",
    "Excellent work!",
    "You got it right!",
    "Amazing! Keep it up!"
];

const tryAgainMessages = [
    "Almost there, try again!",
    "You can do it!",
    "Keep going, you're getting there!",
    "Don't give up, you're learning!",
    "You're so close, try again!"
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareDragAndDropElements(word) {
    let mixedLetters = shuffleArray(word.split(''));
    document.getElementById('mixedLetters').innerHTML = mixedLetters
        .map((letter, index) => `<span draggable="true" class="drag" id="drag${index}" ondragstart="drag(event)">${letter}</span>`)
        .join('');
    document.getElementById('letterBoxes').innerHTML = new Array(word.length)
        .fill('')
        .map((_, index) => `<span id="drop${index}" class="drop" ondragover="allowDrop(event)" ondrop="drop(event)"></span>`)
        .join('');
}

function setNewWord(retry = false) {
    if (!retry) {
        currentWord = words[Math.floor(Math.random() * words.length)];
    }

    prepareDragAndDropElements(currentWord);

    document.getElementById('nextWordBtn').style.display = 'none';
    document.getElementById('tryAgainBtn').style.display = 'none';
    document.getElementById('checkBtn').style.display = 'inline-block';
    document.getElementById('hearHintBtn').style.display = 'inline-block';
    document.getElementById('result').innerHTML = '';
    document.getElementById('celebration').style.display = 'none';
    document.getElementById('motivation').style.display = 'none';

    currentLetterIndex = 0;
    attemptFailed = false;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dropTarget = ev.target;

    if (dropTarget.classList.contains('drop') && !dropTarget.textContent && parseInt(dropTarget.id.replace('drop', '')) === currentLetterIndex) {
        dropTarget.appendChild(document.getElementById(data));
        dropTarget.classList.add('filled');
        currentLetterIndex++;
    }
}

function checkSpelling() {
    const userAnswer = Array.from(document.getElementById('letterBoxes').children)
                            .map(child => child.textContent.trim())
                            .join('');

    if (userAnswer === currentWord) {
        document.getElementById('result').textContent = successMessages[Math.floor(Math.random() * successMessages.length)];
        document.getElementById('celebration').style.display = 'block';
        document.getElementById('nextWordBtn').style.display = 'inline-block';
    } else {
        document.getElementById('result').textContent = tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)];
        document.getElementById('motivation').style.display = 'block';
        document.getElementById('tryAgainBtn').style.display = 'inline-block';
    }

    document.getElementById('hearHintBtn').style.display = 'none';
}

function resetCurrentWord() {
    prepareDragAndDropElements(currentWord);
    document.getElementById('result').textContent = '';
    document.getElementById('celebration').style.display = 'none';
    document.getElementById('motivation').style.display = 'none';
    document.getElementById('checkBtn').style.display = 'inline-block';
    document.getElementById('hearHintBtn').style.display = 'inline-block';
    document.getElementById('tryAgainBtn').style.display = 'none';
    currentLetterIndex = 0;
}

function initializeGame() {
    const userInput = document.getElementById('wordInput').value.trim();
    words = userInput ? userInput.split(/\s+/).filter(word => word.length > 0) : [];
    if (words.length === 0) {
        alert('Choose your words to start the game.');
        return;
    }
    document.getElementById('wordInputContainer').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    setNewWord();
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
}
