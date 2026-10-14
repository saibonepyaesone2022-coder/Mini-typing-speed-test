/* =========================================
   TEXT DATA
========================================= */

const texts = {

    easy: [
        "Learning to type faster can save time every day. Practice makes your fingers more comfortable with the keyboard.",
        "I enjoy learning programming because I can create useful things with code. Every small project helps me improve.",
        "The best way to learn a new skill is to practice regularly. Stay patient and keep trying even when it feels difficult."
    ],

    medium: [
        "Software engineering requires patience, problem solving and continuous learning. A good programmer does not stop learning after writing a successful program.",
        "JavaScript is a powerful language for creating interactive websites. By combining HTML, CSS and JavaScript, developers can build useful web applications.",
        "When learning programming, mistakes are normal. Reading error messages carefully and testing your code step by step can help you find and fix problems."
    ],

    hard: [
        "Modern software development involves algorithms, data structures, databases, security, testing and system design. Developers must continuously adapt to new technologies.",
        "Debugging a complicated application can be challenging because one small mistake may affect many different components. Careful testing and logical thinking are essential.",
        "Artificial intelligence, cloud computing and cybersecurity are changing the technology industry rapidly. Software engineers need strong fundamentals and a willingness to learn continuously."
    ]
};


/* =========================================
   GET ELEMENTS
========================================= */

const difficulty =
    document.getElementById("difficulty");

const textLength =
    document.getElementById("textLength");

const timeLimit =
    document.getElementById("timeLimit");

const newTestButton =
    document.getElementById("newTest");

const restartButton =
    document.getElementById("restart");

const finishButton =
    document.getElementById("finish");

const clearHistoryButton =
    document.getElementById("clearHistory");

const textDisplay =
    document.getElementById("textDisplay");

const typingInput =
    document.getElementById("typingInput");

const timerElement =
    document.getElementById("timer");

const wpmElement =
    document.getElementById("wpm");

const accuracyElement =
    document.getElementById("accuracy");

const correctElement =
    document.getElementById("correct");

const errorsElement =
    document.getElementById("errors");

const charactersElement =
    document.getElementById("characters");

const messageElement =
    document.getElementById("message");

const resultElement =
    document.getElementById("result");

const finalWpmElement =
    document.getElementById("finalWpm");

const finalDetailsElement =
    document.getElementById("finalDetails");

const bestScoreElement =
    document.getElementById("bestScore");

const historyList =
    document.getElementById("historyList");


/* =========================================
   VARIABLES
========================================= */

let currentText = "";

let timer = null;

let startTime = null;

let remainingTime = 60;

let testRunning = false;

let finished = false;

let correctCount = 0;

let wrongCount = 0;

let lastWrongPosition = -1;


/* =========================================
   GET RANDOM TEXT
========================================= */

function getRandomText(level) {

    const list = texts[level];

    const randomIndex =
        Math.floor(Math.random() * list.length);

    return list[randomIndex];
}


/* =========================================
   PREPARE TEXT LENGTH
========================================= */

function prepareText(text, length) {

    if (length === "short") {
        return text.substring(0, 100);
    }

    if (length === "medium") {
        return text.substring(0, 190);
    }

    return text;
}


/* =========================================
   NEW TEST
========================================= */

function createNewTest() {

    stopTimer();

    currentText = prepareText(
        getRandomText(difficulty.value),
        textLength.value
    );

    remainingTime =
        Number(timeLimit.value);

    startTime = null;

    testRunning = false;

    finished = false;

    correctCount = 0;

    wrongCount = 0;

    lastWrongPosition = -1;

    typingInput.value = "";

    typingInput.disabled = false;

    timerElement.textContent =
        remainingTime;

    timerElement.classList.remove(
        "warning"
    );

    resultElement.classList.remove(
        "show"
    );

    messageElement.textContent =
        "Start typing. Timer begins automatically.";

    renderText();

    updateStats();

    typingInput.focus();
}


/* =========================================
   RENDER TEXT
========================================= */

function renderText() {

    textDisplay.innerHTML = "";

    for (
        let i = 0;
        i < currentText.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.textContent =
            currentText[i];

        if (i === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);
    }
}


/* =========================================
   UPDATE TEXT
========================================= */

function updateTextDisplay() {

    const typed =
        typingInput.value;

    const spans =
        textDisplay.querySelectorAll("span");

    correctCount = 0;

    wrongCount = 0;

    for (
        let i = 0;
        i < spans.length;
        i++
    ) {

        spans[i].className = "";

        if (i < typed.length) {

            if (
                typed[i] ===
                currentText[i]
            ) {

                spans[i].classList.add(
                    "correct"
                );

                correctCount++;

            } else {

                spans[i].classList.add(
                    "incorrect"
                );

                wrongCount++;
            }

        } else if (
            i === typed.length &&
            !finished
        ) {

            spans[i].classList.add(
                "current"
            );
        }
    }

    updateStats();
}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (
        testRunning ||
        finished
    ) {
        return;
    }

    testRunning = true;

    startTime = Date.now();

    timer = setInterval(
        function() {

            remainingTime--;

            timerElement.textContent =
                remainingTime;

            if (remainingTime <= 10) {

                timerElement.classList.add(
                    "warning"
                );
            }

            updateStats();

            if (remainingTime <= 0) {

                finishTest(
                    "Time is up!"
                );
            }

        },
        1000
    );
}


/* =========================================
   STOP TIMER
========================================= */

function stopTimer() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;
    }

    testRunning = false;
}


/* =========================================
   CALCULATE WPM
========================================= */

function calculateWPM() {

    if (startTime === null) {
        return 0;
    }

    let elapsed =
        (Date.now() - startTime) / 1000;

    if (elapsed < 1) {
        elapsed = 1;
    }

    const minutes =
        elapsed / 60;

    const words =
        correctCount / 5;

    return Math.max(
        0,
        Math.round(words / minutes)
    );
}


/* =========================================
   CALCULATE ACCURACY
========================================= */

function calculateAccuracy() {

    const total =
        correctCount + wrongCount;

    if (total === 0) {
        return 100;
    }

    return Math.round(
        (correctCount / total) * 100
    );
}


/* =========================================
   UPDATE STATS
========================================= */

function updateStats() {

    wpmElement.textContent =
        calculateWPM();

    accuracyElement.textContent =
        calculateAccuracy() + "%";

    correctElement.textContent =
        correctCount;

    errorsElement.textContent =
        wrongCount;

    charactersElement.textContent =
        typingInput.value.length;
}


/* =========================================
   BEEP
========================================= */

function beep() {

    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        const audio =
            new AudioContextClass();

        const oscillator =
            audio.


createOscillator();

        const gain =
            audio.createGain();

        oscillator.frequency.value = 300;

        gain.gain.value = 0.08;

        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.1
        );

    } catch (error) {

        console.log(
            "Beep unavailable."
        );
    }
}


/* =========================================
   TYPING EVENT
========================================= */

typingInput.addEventListener(
    "input",
    function() {

        if (finished) {
            return;
        }

        if (
            !testRunning &&
            typingInput.value.length > 0
        ) {

            startTimer();

            messageElement.textContent =
                "Typing...";
        }

        const typed =
            typingInput.value;

        if (typed.length > 0) {

            const index =
                typed.length - 1;

            if (
                index < currentText.length &&
                typed[index] !==
                currentText[index]
            ) {

                if (
                    lastWrongPosition !== index
                ) {

                    beep();

                    lastWrongPosition =
                        index;
                }
            }
        }

        updateTextDisplay();

        if (
            typed.length >=
            currentText.length
        ) {

            finishTest(
                "You completed the text!"
            );
        }
    }
);


/* =========================================
   FINISH TEST
========================================= */

function finishTest(reason) {

    if (finished) {
        return;
    }

    finished = true;

    stopTimer();

    typingInput.disabled = true;

    const wpm =
        calculateWPM();

    const accuracy =
        calculateAccuracy();

    messageElement.textContent =
        reason;

    finalWpmElement.textContent =
        wpm + " WPM";

    finalDetailsElement.textContent =
        "Accuracy: " +
        accuracy +
        "% | Correct: " +
        correctCount +
        " | Errors: " +
        wrongCount;

    resultElement.classList.add(
        "show"
    );

    saveResult(
        wpm,
        accuracy
    );

    updateBestScore();

    displayHistory();

    updateTextDisplay();
}


/* =========================================
   HISTORY
========================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                "typingHistory"
            );

        if (!saved) {
            return [];
        }

        const data =
            JSON.parse(saved);

        if (Array.isArray(data)) {
            return data;
        }

        return [];

    } catch (error) {

        return [];
    }
}


function saveResult(
    wpm,
    accuracy
) {

    const history =
        getHistory();

    history.unshift({

        wpm: wpm,

        accuracy: accuracy,

        difficulty:
            difficulty.value,

        length:
            textLength.value,

        date:
            new Date().toLocaleString()

    });

    if (history.length > 10) {

        history.pop();
    }

    try {

        localStorage.setItem(
            "typingHistory",
            JSON.stringify(history)
        );

    } catch (error) {

        console.log(
            "History could not be saved."
        );
    }
}


/* =========================================
   DISPLAY HISTORY
========================================= */

function displayHistory() {

    const history =
        getHistory();

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            "<p style='color:#64748b;'>No test history yet.</p>";

        return;
    }

    history.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.
            className =
                "history-item";

            const number =
                document.createElement(
                    "span"
                );

            number.textContent =
                "#" + (index + 1);

            const score =
                document.createElement(
                    "span"
                );

            score.textContent =
                item.wpm + " WPM";

            const accuracy =
                document.createElement(
                    "span"
                );

            accuracy.textContent =
                item.accuracy + "%";

            const date =
                document.createElement(
                    "span"
                );

            date.textContent =
                item.date;

            div.appendChild(number);

            div.appendChild(score);

            div.appendChild(accuracy);

            div.appendChild(date);

            historyList.appendChild(div);
        }
    );
}


/* =========================================
   BEST SCORE
========================================= */

function updateBestScore() {

    const history =
        getHistory();

    if (history.length === 0) {

        bestScoreElement.textContent =
            "🏆 Best Score: 0 WPM";

        return;
    }

    let best = 0;

    history.forEach(
        function(item) {

            const score =
                Number(item.wpm);

            if (score > best) {
                best = score;
            }
        }
    );

    bestScoreElement.textContent =
        "🏆 Best Score: " +
        best +
        " WPM";
}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryButton.addEventListener(
    "click",
    function() {

        const answer =
            confirm(
                "Clear all typing history?"
            );

        if (!answer) {
            return;
        }

        localStorage.removeItem(
            "typingHistory"
        );

        displayHistory();

        updateBestScore();

        messageElement.textContent =
            "History cleared.";
    }
);


/* =========================================
   BUTTONS
========================================= */

newTestButton.addEventListener(
    "click",
    function() {

        createNewTest();
    }
);


restartButton.addEventListener(
    "click",
    function() {

        createNewTest();
    }
);


finishButton.addEventListener(
    "click",
    function() {

        if (
            !finished &&
            typingInput.value.length > 0
        ) {

            finishTest(
                "Test finished manually."
            );

        } else if (!finished) {

            messageElement.textContent =
                "Please type something first.";
        }
    }
);


/* =========================================
   SETTINGS CHANGE
========================================= */

difficulty.addEventListener(
    "change",
    createNewTest
);

textLength.addEventListener(
    "change",
    createNewTest
);

timeLimit.addEventListener(
    "change",
    createNewTest
);


/* =========================================
   INITIALIZE
========================================= */

displayHistory();

updateBestScore();

createNewTest();
