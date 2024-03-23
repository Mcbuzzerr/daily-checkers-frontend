let loggedInUser = null;
let gameList = [];
let gameHistory = [];

const getGameList = async () => {
    let url = `https://${PREFIX}.execute-api.us-west-1.amazonaws.com/${STAGE}/game/list`
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('authToken')}`,
        },
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById('loading-slate').style.display = "none";
        if (data.hasOwnProperty("message")) {
            if (data.message == "No games found") {
                console.log("No games found")
            }
        }
        return data;
    });

    for (let i = 0; i < response.length; i++) {
        if (response[i].gameOver) {
            gameHistory.push(response[i]);
        } else {
            gameList.push(response[i]);
        }
    }

    if (gameList.length === 0) {
        document.getElementById('no-games-message').classList.remove('hidden');
    }

    for (let i = 0; i < gameList.length; i++) {
        let game = gameList[i];


        let inviteElement = document.createElement('div');
        inviteElement.classList.add('slate');
        inviteElement.classList.add('game');
        let turn = game.turnCount % 2 === 1 ? "White" : "Black";
        let totalWhite = 0;
        let totalBlack = 0;

        if (game.board !== null) {
            for (let iter = 0; iter < game.board.length; iter++) {
                let row = game.board[iter];
                for (let j = 0; j < row.length; j++) {
                    let cell = row[j];
                    if (cell !== null) {
                        if (Object.keys(cell)[0].split("-")[1] == "A") {
                            totalBlack++;
                        } else {
                            totalWhite++;
                        }
                    }
                }
            }
        }


        let whoseLoggedIn = null;
        if (game.players.B.id === loggedInUser.id) {
            whoseLoggedIn = "B";
        } else {
            whoseLoggedIn = "A";
        }

        let header3Text = null;
        let winner = getWinner(game);
        if (game.gameOver) {
            header3Text = `Game Over! <span class="player-name bold">${game.players[winner].username}</span> has won!`;
        } else {
            if (game.players.B.id === loggedInUser.id) {
                header3Text = `You have invited <span class="player-name bold">${game.players.A["username"]}</span> to play a game of checkers.`;
            } else {
                header3Text = `<span class="player-name bold">${game.players.B["username"]}</span> has invited you to play a game of checkers.`;
            }
        }

        let turnText = getTimeUntilNextTurn(game.players[whoseLoggedIn]) == "0:0:0" ? "Now!" : getTimeUntilNextTurn(game.players[whoseLoggedIn]);
        if (turnText == "Now!" && whoseLoggedIn == "A" && turn == "White") {
            turnText = "After Opponent";
        } else if (turnText == "Now!" && whoseLoggedIn == "B" && turn == "Black") {
            turnText = "After Opponent";
        }

        inviteElement.innerHTML = `
            <h3>
                ${header3Text}
            </h3>
            <div class="button-container">
                <p class="button submit" onclick="playGameClicked('${game.id}')">${getTimeUntilNextTurn(game.players[whoseLoggedIn]) == "0:0:0" ? "Play Game" : "View Game"}</p>
                <h3 class="no-margin" style="text-align: left; flex-grow:1; padding-left: 10px;" id="${game.id + "-timer"}">Next Turn: <br /><span class="bold">${turnText}</span></h3>
                <h3 class="no-margin" id="vs">
                    <span style="color: black; ${turn == "Black" ? "font-weight: bold; text-decoration: underline;" : ""}">${totalBlack}</span> vs. <span style="color: white; ${turn == "White" ? "font-weight: bold; text-decoration: underline;" : ""}">${totalWhite}</span>
                </h1>
                <p class="button cancel" style="visibility: ${game.gameOver ? "hidden" : "visible"};" onclick="handleConcedeClicked('${game.id}')">Concede</p>
                </div>
            `; // turncount % 2 = 1 or 0, 0 is black or white idk yet
        updateTimer(game.players[whoseLoggedIn], game.id + "-timer", whoseLoggedIn, turn);
        document.getElementById('game-container').appendChild(inviteElement);
    }

    if (gameList.length !== 0) {
        console.log(document.getElementById('no-games-message'));
        document.getElementById('no-games-message').classList.add('hidden');
    }

    if (gameHistory.length !== 0) {
        renderHistory();
        document.getElementById('no-history-message').classList.add('hidden');
    }
};

const updateTimer = (player, id, whoseLoggedIn, turn) => {
    let timer = setInterval(() => {
        let time = getTimeUntilNextTurn(player);

        let turnText = time == "0:0:0" ? "Now!" : time;
        if (turnText == "Now!" && ((whoseLoggedIn == "A" && turn == "White") || (whoseLoggedIn == "B" && turn == "Black"))) {
            turnText = "After Opponent";
        }
        document.getElementById(id).innerHTML = `Next Turn: <br /><span class="bold">${turnText}</span>`;

        if (time == "0:0:0") {
            clearInterval(timer);
        }
    }, 1000);
}

const playGameClicked = (gameId) => {
    window.location.href = `play_game.html?game=${gameId}`;
};

const handleConcedeClicked = (gameId) => {
    let areTheySure = confirm("Are you sure you want to concede the game?");
    if (areTheySure) {
        fetch(`https://${PREFIX}.execute-api.us-west-1.amazonaws.com/${STAGE}/game/concede/${gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`,
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            window.location.href = "games.html";
        });
    }
}

const handleNewGameClicked = (event) => {
    if (event.target.classList.contains('disabled')) {
        return;
    }
    event.target.classList.add('disabled');
    fetch(`https://${PREFIX}.execute-api.us-west-1.amazonaws.com/${STAGE}/invite/random`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`,
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.hasOwnProperty("message")) {
                alert(data.message);
            } else if (data.hasOwnProperty("gameID")) {
                window.location.href = "play_game.html?game=" + data.gameID;
            }
            event.target.classList.remove('disabled');
        }).catch((error) => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.')
            event.target.classList.remove('disabled');
        });
};

const handleOpenGameHistoryClicked = (event) => {
    if (event.target.classList.contains('active')) {
        console.log("Close Game History Clicked")
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('game-history-container').classList.add('hidden');
        event.target.classList.remove('active');
        return;
    }
    console.log("Open Game History Clicked");
    event.target.classList.add('active');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('game-history-container').classList.remove('hidden');
    console.log(gameHistory);
    console.log(gameList);
    console.log("York")
};

const renderHistory = () => {
    for (let i = 0; i < gameHistory.length; i++) {
        let game = gameHistory[i];
        let inviteElement = document.createElement('div');
        inviteElement.classList.add('slate');
        inviteElement.classList.add('game');
        let turn = game.turnCount % 2 === 1 ? "White" : "Black";
        let totalWhite = 0;
        let totalBlack = 0;

        if (game.board !== null) {
            for (let iter = 0; iter < game.board.length; iter++) {
                let row = game.board[iter];
                for (let j = 0; j < row.length; j++) {
                    let cell = row[j];
                    if (cell !== null) {
                        if (Object.keys(cell)[0].split("-")[1] == "A") {
                            totalBlack++;
                        } else {
                            totalWhite++;
                        }
                    }
                }
            }
        }

        let winner = getWinner(game);
        let winner_name = "";
        console.log(winner)
        console.log(game.players);
        let header3Text = `Game Over! <span class="player-name bold">${game.players[winner]?.username}</span> has won!`;

        inviteElement.innerHTML = `
            <h3>
                ${header3Text}
            </h3>
            <div class="button-container">
                <p class="button submit" onclick="playGameClicked('${game.id}')">View Game</p>
                <h3 class="no-margin" style="text-align: left; flex-grow:1; padding-left: 10px;" id="${game.id + "-timer"}">Game Over</h3>
                <h3 class="no-margin" id="vs">
                    <span style="color: black; ${turn == "Black" ? "font-weight: bold; text-decoration: underline;" : ""}">${totalBlack}</span> vs. <span style="color: white; ${turn == "White" ? "font-weight: bold; text-decoration: underline;" : ""}">${totalWhite}</span>
                </h1>
                <p class="button cancel" style="visibility: hidden;" onclick="handleConcedeClicked('${game.id}')">Concede</p>
                </div>
            `; // turncount % 2 = 1 or 0, 0 is black or white idk yet
        document.getElementById('game-history-container').appendChild(inviteElement);
    }
}

const getWinner = (game) => {
    // Check who has more pieces left
    if (game.winner !== null) {
        let winner_id = game.winner;
        if (game.players.A.id === winner_id) {
            return "A";
        } else {
            return "B";
        }
    } else {
        return null;
    }
}

const getTimeUntilNextTurn = (player) => {
    if (!player.hasOwnProperty("lastTurnTakenAt")) {
        return "00:00:00";
    }
    let lastTurnA = new Date(player.lastTurnTakenAt);
    // convert from UTC to local time
    lastTurnA.setMinutes(lastTurnA.getMinutes() - lastTurnA.getTimezoneOffset());
    let aDayAfterLastTurnA = new Date(lastTurnA);
    aDayAfterLastTurnA.setDate(aDayAfterLastTurnA.getDate() + 1);
    let now = new Date();
    let timeUntilNextTurn = aDayAfterLastTurnA - now;


    // Format as a string DD:HH:MM:SS
    let timeSinceLastTurnAString = formatTimeSinceLastTurn(timeUntilNextTurn);

    return timeSinceLastTurnAString;
}

const formatTimeSinceLastTurn = (time) => {
    let hours = Math.max(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0);
    let minutes = Math.max(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)), 0);
    let seconds = Math.max(Math.floor((time % (1000 * 60)) / 1000), 0);
    return `${hours}:${minutes}:${seconds}`;
}

const getHoursSinceLastTurn = (time) => {
    let now = new Date();
    let lastTurn = new Date(time);
    lastTurn.setMinutes(lastTurn.getMinutes() - lastTurn.getTimezoneOffset());
    let hours = Math.floor((now - lastTurn) / (1000 * 60 * 60));
    return hours;
}

window.onload = () => {
    loggedInUser = getUser();
    if (!loggedInUser) {
        window.location.href = 'index.html';
    } else {
        getGameList();
    }
};