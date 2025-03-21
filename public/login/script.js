const showPassword = document.getElementById('show-password');
const eyeImage = document.getElementById('eyeImage');
const CloseEyeImage = document.getElementById('CloseEyeImage');
const password = document.getElementById('password');
showPassword.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        CloseEyeImage.classList.add('hidden');
        eyeImage.classList.remove('hidden');

    } else {
        password.type = 'password';
        CloseEyeImage.classList.remove('hidden');
        eyeImage.classList.add('hidden');
    }
});

function closeErrorPage() {
    document.querySelector("div[role='alert']").className += " hidden";
    
    const url = new URL(window.location);
    url.searchParams.delete("error"); // Remove 'error' param
    window.history.replaceState({}, document.title, url.pathname);
}

function loginFn() {
    const email = document.getElementById('email-address').value;
    const password = document.getElementById('password').value;
    if (email === '' || password === '') {
        document.querySelector("div[role='alert']").classList.remove('hidden');
        document.querySelector("div[role='alert'] span").innerHTML = 'Please fill in all fields.';
        return;
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(err => {
                    throw new Error(err.message || 'Incorrect Email or Password.');
                });
            }
        })
        .then(response => {
            window.location.href = '/home';
        })
        .catch(error => {
            document.querySelector("div[role='alert']").classList.remove('hidden');
            document.querySelector("div[role='alert'] span").innerHTML = error.message;
        });
    document.getElementById('email-address').value = '';
    document.getElementById('password').value = '';
}

document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    const email = document.getElementById('email-address');
    if (email.checkValidity()) {
        e.preventDefault();
        loginFn();
    }
    else{
        email.reportValidity();
    }
});

document.getElementById('autofill-button').addEventListener('click', () => {
    let email = document.getElementById('email-address');
    if (!email.value.includes('@students.muet.edu.pk')) {
        email.value += '@students.muet.edu.pk';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const error = new URLSearchParams(window.location.search).get('error');
    if (error) {
        document.querySelector("div[role='alert']").classList.remove('hidden');
        document.querySelector("div[role='alert'] span").innerHTML = error;
    }
});