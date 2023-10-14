var ballElement = document.getElementById('ball');
var rod1Element = document.getElementById('rod1');
var rod2Element = document.getElementById('rod2');
//declaring variables
const playerNameStorageKey = "PingPongPlayerName";
const maxScoreStorageKey = "PingPongMaxScore";
const playerRod1 = "Player 1";
const playerRod2 = "Player 2";


let currentScore,
    highestScore,
    movement,
    currentRod,
    ballSpeedX = 2,
    ballSpeedY = 2;
//if the player is not playing the game, the game is not active
let isGameActive = false;

let screenWidth = window.innerWidth,
    screenHeight = window.innerHeight;

    //function to start the game,

(function () {
    currentRod = localStorage.getItem(playerNameStorageKey);
    highestScore = localStorage.getItem(maxScoreStorageKey);
//if the current rod is null or the highest score is null, the game will start
    if (currentRod === null || highestScore === null) {
        alert("Welcome to Ping Pong! Let's start.");
        highestScore = 0;
        currentRod = playerRod1;
    } else {
        alert(currentRod + " has the highest score of " + highestScore * 100);
    }

    resetGameBoard(currentRod);
})();

//function to reset the game board

function resetGameBoard(playerName) {
    rod1Element.style.left = (screenWidth - rod1Element.offsetWidth) / 2 + 'px';
    rod2Element.style.left = (screenWidth - rod2Element.offsetWidth) / 2 + 'px';
    ballElement.style.left = (screenWidth - ballElement.offsetWidth) / 2 + 'px';
//if the player name is player 2, the ball will be at the top of the rod 1
    if (playerName === playerRod2) {
        ballElement.style.top = (rod1Element.offsetTop + rod1Element.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (playerName === playerRod1) {
        ballElement.style.top = (rod2Element.offsetTop - rod2Element.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    currentScore = 0;
    isGameActive = false;
}
//function to store the player win
function storePlayerWin(player, score) {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem(playerNameStorageKey, player);
        localStorage.setItem(maxScoreStorageKey, highestScore);
    }
//if the player wins, the game will be reset
    clearInterval(movement);
    resetGameBoard(player);

    alert(player + " wins with a score of " + (score * 100) + ". The highest score is: " + (highestScore * 100));
}

//function to move the rod, if the rod is not at the end of the screen, the rod will move
window.addEventListener('keypress', function () {
    let rodSpeed = 20;
    let rodRect = rod1Element.getBoundingClientRect();

    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < screenWidth)) {
        rod1Element.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2Element.style.left = rod1Element.style.left;
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1Element.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2Element.style.left = rod1Element.style.left;
    }
//if the game is not active, the game will start,
    if (event.code === "Enter") {
        if (!isGameActive) {
            isGameActive = true;
            let ballRect = ballElement.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDiameter = ballRect.width;
            //declaring variables
            

            let rod1Height = rod1Element.offsetHeight;
            let rod2Height = rod2Element.offsetHeight;
            let rod1Width = rod1Element.offsetWidth;
            let rod2Width = rod2Element.offsetWidth;
//in this the movement of the ball is set, the ball will move in the x and y axis
            movement = setInterval(function () {
                ballX += ballSpeedX;
                ballY += ballSpeedY;
                let ballPos = ballX + ballDiameter / 2;
//in this rod 1 and rod 2 are set to move in the x axis
                let rod1X = rod1Element.getBoundingClientRect().x;
                let rod2X = rod2Element.getBoundingClientRect().x;

                ballElement.style.left = ballX + 'px';
                ballElement.style.top = ballY + 'px';
//if the ball is at the end of the screen, the ball will move in the opposite direction
                if ((ballX + ballDiameter) > screenWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }
//if the ball is at the top of the rod 1 or rod 2, the ball will move in the opposite direction
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY;
                    currentScore++;
//if the ball is not at the top of the rod 1 or rod 2, the player will win
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storePlayerWin(playerRod2, currentScore);
                    }
                    //if the ball is at the end of the screen, the ball will move in the opposite direction
                } else if ((ballY + ballDiameter) >= (screenHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY;
                    currentScore++;
//if the ball is not at the end of the screen, the player will win
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storePlayerWin(playerRod1, currentScore);
                    }
                }
                
            }, 10);
        }
    }
});
