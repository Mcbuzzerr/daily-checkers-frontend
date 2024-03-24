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

        // let loggedInBar = document.getElementById('logged-in-bar');
        // let loggedOutBar = document.getElementById('logged-out-bar');
        // loggedInBar.classList.remove('hidden');
        // loggedOutBar.classList.add('hidden');

        let iframe = document.getElementById('gify-pet-iframe');

        if (getUser()["victories"] > 0) {
            iframe.src = "https://gifypet.neocities.org/pet/pet.html?name=CoolSpot&dob=1709667193&gender=m&element=Water&pet=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2Fgreenchecker.gif&map=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2FcheckerBoardSprite.png&background=https%3A%2F%2Fnekkostarr.nekoweb.org%2Fdaily-checkers-frontend%2Fimg%2Fgray020.png&tablecolor=black&textcolor=black"
        }
    }
};