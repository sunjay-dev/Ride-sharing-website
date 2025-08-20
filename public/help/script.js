document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    const form = document.getElementById('signup-form');
    if (form.checkValidity()) {
      e.preventDefault();

      const dataToSend = {
        email: document.querySelector('input[name="email"]').value,
        name: document.querySelector('input[name="name"]').value,
        subject: document.querySelector('input[name="subject"]').value,
        description: document.querySelector('textarea[name="description"]').value // Use textarea for description
    };

      fetch('/help', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })
        .then(response => {

          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'Something went wrong');
            });
        }
        return response.json();
        })
        .then(data => {
          document.querySelector('div[role="alert"]').classList.add('hidden');
          document.querySelector('div[role="success"]').classList.remove('hidden');
          document.querySelector('div[role="success"] > span').innerHTML = data.message;

          document.querySelector('input[name="email"]').value= "";
          document.querySelector('input[name="name"]').value= "";
          document.querySelector('input[name="subject"]').value= "";
          document.querySelector('textarea[name="description"]').value= "";
        })
        .catch((error) => {
            document.querySelector('div[role="alert"]').classList.remove('hidden');
            document.querySelector('div[role="success"]').classList.add('hidden');
          document.querySelector('div[role="alert"] > span').innerHTML = error.message;
        });
    } else {
      form.reportValidity(); 
    }
})

  document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}