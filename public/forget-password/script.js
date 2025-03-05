const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        if (email) {
            fetch('/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            }).then(response => {
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
                    form.querySelector('input').value = "";
                    document.querySelector("div[role='success']").classList.remove('hidden');
                    document.querySelector("div[role='alert']").classList.add('hidden');
                    document.querySelector("div[role='success'] span").innerHTML = response.message;
                    
                })
                .catch(error => {
                    document.querySelector("div[role='success']").classList.add('hidden');
                    document.querySelector("div[role='alert']").classList.remove('hidden');
                    document.querySelector("div[role='alert'] span").innerHTML = error.message;
                });
        }
       
    });

    document.getElementById('backPage').href = 'javascript:void(0);';
    document.getElementById('backPage').onclick = () => {
        if (window.history.length <= 1) {
            window.location.href = '/login';
        } else {
            window.history.back();
        }
    }

    document.getElementById('autofill-button').addEventListener('click', () => {
        let email = document.getElementById('email-address');
        if(!email.value.includes('@students.muet.edu.pk')) {
            email.value += '@students.muet.edu.pk';
        }
    });