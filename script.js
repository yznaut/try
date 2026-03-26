const authContainer = document.getElementById('authContainer');
const loginContainer = document.getElementById('loginContainer');
const watchlistContainer = document.getElementById('watchlistContainer');

const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');

const movieInput = document.getElementById('movieInput');
const watchlist = document.getElementById('watchlist');

let currentUser = null;
let movies = [];

// Show Sign Up form
function showSignUp() {
    authContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
    document.querySelector('#authContainer h2').textContent = 'Sign Up';
}

// Show Login form
function showLogin() {
    authContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
    document.querySelector('#authContainer h2').textContent = 'Sign In';
}

// Hash password
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// Save user data
function saveUser(username, passwordHash) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = { passwordHash: passwordHash, movies: [] };
    localStorage.setItem('users', JSON.stringify(users));
}

// Get user data
function getUser(username) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return users[username];
}

// Sign Up
function signUp() {
    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();

    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('Username already exists.');
        return;
    }

    const passwordHash = hashPassword(password);
    saveUser(username, passwordHash);
    alert('Sign Up successful! Please sign in.');
    showLogin();
    signupUsername.value = '';
    signupPassword.value = '';
}

// Sign In
function signIn() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    const user = getUser(username);
    if (!user) {
        alert('User not found.');
        return;
    }

    const passwordHash = hashPassword(password);
    if (passwordHash !== user.passwordHash) {
        alert('Incorrect password.');
        return;
    }

    currentUser = username;
    loadUserMovies();
    showWatchlist();
    loginUsername.value = '';
    loginPassword.value = '';
}

// Show watchlist
function showWatchlist() {
    authContainer.classList.add('hidden');
    loginContainer.classList.add('hidden');
    watchlistContainer.classList.remove('hidden');
    document.querySelector('#watchlistContainer h2').textContent = `Welcome, ${currentUser}`;
    renderWatchlist();
}

// Logout
function logout() {
    currentUser = null;
    movies = [];
    localStorage.removeItem('currentUser');
    showSignUp();
}

// Load movies from user data
function loadUserMovies() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    movies = users[currentUser]?.movies || [];
}

// Save movies to user data
function saveUserMovies() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (currentUser) {
        users[currentUser].movies = movies;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Render watchlist
function renderWatchlist() {
    watchlist.innerHTML = '';
    movies.forEach((movie, index) => {
        const li = document.createElement('li');
        li.className = 'movie-item';

        const span = document.createElement('span');
        span.className = 'movie-title';
        span.textContent = movie;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            removeMovie(index);
        };

        li.appendChild(span);
        li.appendChild(removeBtn);
        watchlist.appendChild(li);
    });
}

function addMovie() {
    const movieTitle = movieInput.value.trim();
    if (movieTitle !== '') {
        movies.push(movieTitle);
        saveUserMovies();
        movieInput.value = '';
        renderWatchlist();
    }
}

function removeMovie(index) {
    movies.splice(index, 1);
    saveUserMovies();
    renderWatchlist();
}

document.getElementById('addButton').onclick = addMovie;
document.querySelector('#movieInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addMovie();
});

// Initialize app with sign-up view
showSignUp();
