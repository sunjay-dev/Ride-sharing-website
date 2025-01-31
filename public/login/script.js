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
}

function loginFn() {
    const email = document.getElementById('email-address').value;
    const password = document.getElementById('password').value;
    if(email === '' || password === '') {
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
    e.preventDefault();
    loginFn();
});