document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}
document.getElementById('backPage').href = 'javascript:void(0);';

document.addEventListener('DOMContentLoaded', () => {
    getMessages();
});

function getMessages() {
    fetch('/inbox', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        const inbox = document.getElementById('inbox');
        if (data.messages.length === 0) {
            inbox.innerHTML = `<div class="flex flex-col min-h-screen">
        <div class="flex-grow p-4 flex items-center justify-center">
            <p id="no-alerts" class="mb-40">No Notification.</p>
        </div>
    </div>`;
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
            data.messages.reverse().forEach(message => {
                const div = document.createElement('div');
                
                const isRead = message.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-gray-700 font-semibold';

                div.innerHTML = `
                    <div class="card ${isRead} p-4 mt-4 rounded-lg shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-lg font-semibold">Message</h5>
                            <p class="card-text text-sm">${message.message}</p>
                            <p class="text-xs text-gray-400">${new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                `;
                inbox.appendChild(div);
            });
        }
    }).catch(error => {
        console.error('Problem with fetching data:', error);
    });
}
