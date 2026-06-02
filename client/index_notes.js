// DOM Elements
const loginFormBox = document.getElementById('login-form-box');
const signupFormBox = document.getElementById('signup-form-box');
const toSignupLink = document.getElementById('to-signup');
const toLoginLink = document.getElementById('to-login');

// Toggle between Login and Signup


toSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormBox.classList.add('hidden');
    signupFormBox.classList.remove('hidden');
});

toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupFormBox.classList.add('hidden');
    loginFormBox.classList.remove('hidden');
});

document.getElementById('login-form').addEventListener('submit', (e) => {

    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch("http://localhost:5001/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.message === "Login successful") {

            localStorage.setItem("loggedInEmail", email);

            window.location.href = "dashboard_notes.html";

        } else {

            alert(data.message);

        }

    })

    .catch(err => console.log(err));

});

// Sign Up Form Submission
document.getElementById('signup-form').addEventListener('submit', (e) => {

    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    fetch("http://localhost:5001/signup", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            email,
            password
        })

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        if (data.message === "Signup successful") {

            signupFormBox.classList.add('hidden');
            loginFormBox.classList.remove('hidden');

        }

    })

    .catch(err => console.log(err));

});

