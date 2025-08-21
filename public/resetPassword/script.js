const loader = document.getElementById('loader');

function togglePassword(fieldId, eyeId, closeEyeId) {
    const field = document.querySelector(`input[name="${fieldId}"]`);
    const eyeOpen = document.getElementById(eyeId);
    const eyeClose = document.getElementById(closeEyeId);

    if (field.type === "password") {
        field.type = "text";
        eyeOpen.classList.add("hidden");
        eyeClose.classList.remove("hidden");
    } else {
        field.type = "password";
        eyeOpen.classList.remove("hidden");
        eyeClose.classList.add("hidden");
    }
}
async function resetPassword() {

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = document.getElementById('token').value;

    if (!confirmPassword || !password) {
        document.querySelector("div[role='alert']").classList.remove('hidden');
        document.querySelector("div[role='alert'] span").innerHTML = 'Please fill all fields.';
        return;
    }

    if (password !== confirmPassword) {
        document.querySelector("div[role='alert']").classList.remove('hidden');
        document.querySelector("div[role='alert'] span").innerHTML = 'Passwords do not match.';
        return;
    }

    loader.classList.remove('hidden');
    loader.classList.add('flex');

    fetch('/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password, confirmPassword })
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
            document.querySelector("div[role='success']").classList.remove('hidden');
            document.querySelector("div[role='alert']").classList.add('hidden');
            document.querySelector("div[role='success'] span").innerHTML = response.message;

            setTimeout(() => {
                window.location.href = '/login';
            }, 800);
        })
        .catch(error => {
            document.querySelector("div[role='success']").classList.add('hidden');
            document.querySelector("div[role='alert']").classList.remove('hidden');
            document.querySelector("div[role='alert'] span").innerHTML = error.message;
        }).finally(() => {

            loader.classList.add('hidden');
            loader.classList.remove('flex');
            document.getElementById('confirmPassword').value = '';
            document.getElementById('password').value = '';
        })
}
document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();
    resetPassword();
});