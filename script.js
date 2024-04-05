let words = [];
let currentWord = '';
let selectedLetterId = '';

const successMessages = [
    "Great job!",
    "Correct, You're doing great!",
    "Excellent work!",
    "Correct, You got it right!",
    "Amazing! Keep it up!"
];

const tryAgainMessages = [
    "Almost there, try again!",
    "You can do it, try again!",
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
        .map((letter, index) => `<span class="letter" id="drag${index}" onclick="selectLetter('${index}', '${letter}')" ontouchstart="selectLetter('${index}', '${letter}')">${letter}</span>`)
        .join('');

    document.getElementById('letterBoxes').innerHTML = new Array(word.length)
        .fill('')
        .map((_, index) => `<span id="drop${index}" class="box" onclick="placeLetter('${index}')" ontouchstart="placeLetter('${index}')"></span>`)
        .join('');
}

function selectLetter(id, letter) {
    if (selectedLetterId !== '') {
        document.getElementById(selectedLetterId).classList.remove('selected');
    }
    selectedLetterId = `drag${id}`;
    document.getElementById(selectedLetterId).classList.add('selected');
}

function placeLetter(dropId) {
    if (!selectedLetterId) return;

    const draggedElement = document.getElementById(selectedLetterId);
    const letter = draggedElement.textContent;
    const dropTarget = document.getElementById(`drop${dropId}`);

    // Check if the drop target box is empty before placing the letter
    if (dropTarget.textContent === '') {
        dropTarget.textContent = letter; // Place the letter in the new box
        draggedElement.textContent = ''; // Clear the original box
        draggedElement.classList.remove('selected'); // Remove selection highlight
        selectedLetterId = ''; // Reset selectedLetterId
    }
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
}

function checkSpelling() {
    const userAnswer = Array.from(document.getElementById('letterBoxes').children)
                            .map(child => child.textContent.trim())
                            .join('');
    const isCorrect = userAnswer === currentWord;
    document.getElementById('result').textContent = isCorrect ? successMessages[Math.floor(Math.random() * successMessages.length)] : tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)];
    document.getElementById('celebration').style.display = isCorrect ? 'block' : 'none';
    document.getElementById('motivation').style.display = isCorrect ? 'none' : 'block';
    document.getElementById('nextWordBtn').style.display = isCorrect ? 'inline-block' : 'none';
    document.getElementById('tryAgainBtn').style.display = isCorrect ? 'none' : 'inline-block';
    playSound(isCorrect);
}

function playSound(isCorrect) {
    const sound = isCorrect ? document.getElementById('correctSound') : document.getElementById('incorrectSound');
    sound.play();
}

function resetCurrentWord() {
    setNewWord(true); // Resetting with the same word
}

function initializeGame() {
    const userInput = document.getElementById('wordInput').value.trim();
    words = userInput.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) {
        alert('Please enter some words to start the game.');
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

// Remove automatic invocation to avoid alert on page load
// document.addEventListener('DOMContentLoaded', initializeGame);
