window.onload = () => {
    if (!isUserLoggedIn()) {
        let logoutButton = document.getElementById('log-out-button');
        logoutButton.classList.add('hidden');
        let gamesButton = document.getElementById('games-button');
        gamesButton.classList.add('disabled');
        let profileButton = document.getElementById('profile-button');
        profileButton.classList.add('disabled');
        let inviteButton = document.getElementById('invite-button');
        inviteButton.classList.add('disabled');
    } else {
        let registerButton = document.getElementById('register-button');
        registerButton.classList.add('hidden');
        let loginButton = document.getElementById('login-button');
        loginButton.classList.add('hidden');

        let loggedInBar = document.getElementById('logged-in-bar');
        let loggedOutBar = document.getElementById('logged-out-bar');
        loggedInBar.classList.remove('hidden');
        loggedOutBar.classList.add('hidden');

        let iframe = document.getElementById('gify-pet-iframe');

        if (getUser()["victories"] > 0) {
            iframe.src = "https://gifypet.neocities.org/pet/pet.html?name=CoolSpot&dob=1709667193&gender=m&element=Water&pet=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2Fgreenchecker.gif&map=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2FcheckerBoardSprite.png&background=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2Fgray020.png&tablecolor=black&textcolor=black"
        }
    }
};

const copyCodeToClipboard = (event) => {
    console.log(event.target.id);
    const buttonCode = `<a href="https://daily-checkers.nekoweb.org" target="_blank"><img id="daily-checkers-button" src="https://daily-checkers.nekoweb.org/img/DailyCheckersButton.gif"
    alt="DailyCheckers88by31gif" width="176px" height="62px"></a>`
    const logoCode = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Blaka+Hollow&display=swap" rel="stylesheet">
    <style>
        .logo-outer {
            padding: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid black;
            box-shadow: 7px 7px 0px black;
            position: relative;
            background-color: transparent;
            text-decoration: none;
            flex-direction: column;
            margin: 20px;
            max-width: 220px;
            max-height: 220px;
        }

        .logo-outer>* {
            pointer-events: none;
            image-rendering: pixelated;
        }

        .logo-outer::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-image: url(https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/gray020.png);
            filter: contrast(1);
            z-index: 0;
        }

        .logo-outer>.slanted-board {
            width: 300px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate3d(1, 0, 0, 45deg);
            z-index: 1
        }

        .logo-outer>.clock {
            width: 80px;
            z-index: 2;
        }

        .logo-outer>p {
            z-index: 1;
            font-size: 60px;
            color: black;
            margin-bottom: 5px;
            font-family: "Blaka Hollow";
            text-shadow: 3px 3px 0px white;
            width: 200px;
            margin: 0;
            font-weight: normal;
        }

        .logo-outer>.daily {
            text-align: right;
        }

        .logo-outer>.piece-1 {
            width: 70px;
            height: 70px;
            position: absolute;
            top: 50%;
            left: 18%;
            transform: translate(-50%, -50%) rotate3d(1, 0, 0, 45deg);
            border-radius: 50%;
            border: dashed 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            overflow: hidden;
            text-wrap: nowrap;
            user-select: none;
            z-index: 1;
            background-color: black;
            border-color: white;
            color: black;
        }

        .logo-outer>.piece-1::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-image: url(https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/gray020.png);
            z-index: -1;
            filter: brightness(0.6) contrast(2) opacity(0.3);
        }

        .logo-outer>.piece-2 {
            width: 70px;
            height: 70px;
            position: absolute;
            top: 50%;
            left: 82%;
            transform: translate(-50%, -50%) rotate3d(1, 0, 0, 45deg);
            border-radius: 50%;
            border: dashed 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            overflow: hidden;
            text-wrap: nowrap;
            user-select: none;
            z-index: 1;
            background-color: white;
            border-color: black;
            color: black;
        }

        .logo-outer>.piece-2::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-image: url(https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/gray020.png);
            z-index: -1;
            filter: brightness(1.2) contrast(2) opacity(0.3);
        }
    </style>
    <a href="https://daily-checkers.nekoweb.org" id="daily-checkers-logo" onclick="copyCodeToClipboard(event)"
        class="logo-outer">
        <img src="https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/checkerBoardSpriteTileNeg45Deg.png" alt=""
            class="slanted-board">
        <div class="piece-1"></div>
        <p class="daily">The Daily</p>
        <img class="clock" src="https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/clock.gif"
            alt="A ticking clock">
        <p class="checkers">Checkers</p>
        <div class="piece-2"></div>
    </a>
    `

    switch (event.target.id) {
        case "daily-checkers-button":
            navigator.clipboard.writeText(buttonCode);
            alert("Code copied to clipboard");
            break;
        case "daily-checkers-logo":
            navigator.clipboard.writeText(logoCode);
            alert("Code copied to clipboard, but be wary it's a bit complicated. You'll probably want to move the styles to a CSS file.")
            break;

        default:
            break;
    }
}