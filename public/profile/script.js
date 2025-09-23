let imageUrl = document.getElementById('userImage');
let imageName = document.getElementById('imageName');
let joiningDate = document.getElementById('joiningDate');
let detailsForm = document.getElementById('detailsForm');
let RidesForm = document.getElementById('RidesForm');
let userName = document.getElementById('userName');

document.addEventListener("DOMContentLoaded", (event) => {
    getPersonalDetails();
    getUserRideStats();
});
function getPersonalDetails() {
    fetch('/profile', {
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
            detailsForm.innerHTML = "";
            imageUrl.src= data.user.img;
            userName.innerHTML = "";
            userName.innerHTML = data.user.firstName + " "+ data.user.lastName;
            joiningDate.innerHTML = formatDate(data.user.createdAt);      

            let values = ["Email", "Phone", "Deperatment"]

            for(let i=0;i<3; i++){
                let div= document.createElement('div');
                div.className="flex justify-between items-center";

                let p1 = document.createElement('p');
                p1.className="text-sm font-semibold text-gray-800";
                p1. innerHTML =values[i];

                let p2 = document.createElement('p');
                p2.className="text-sm text-gray-800";
                if(values[i]==="Email"){
                    let parts = data.user.email.split("@"); 
                    p2.innerHTML = parts[0].toUpperCase()+"@"+ parts[1];
                }
                else if(values[i]==="Phone")
                p2. innerHTML =data.user.phone;
                else
                p2. innerHTML =data.user.department;

                div.appendChild(p1);
                div.appendChild(p2);

                detailsForm.appendChild(div);
            }


        }) .catch(error => {
            console.error('Error:', error);
        });
}

function getUserRideStats(){
    fetch('/getUserRideStats', {
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
        RidesForm.innerHTML = "";
        let values = ["Created", "Completed", "Canceled"]

        for(let i=0;i<3; i++){
            let div= document.createElement('div');
            div.className="flex justify-between items-center";

            let p1 = document.createElement('p');
            p1.className="text-sm font-semibold text-gray-800";
            p1. innerHTML =values[i];

            let p2 = document.createElement('p');
            p2.className="text-sm text-gray-800";
            if(i===0)
                p2.innerHTML = data.ridesCreated;
            else if(i===1)
            p2. innerHTML =data.ridesCompleted;
            else
            p2. innerHTML =data.ridesCanceled;

            div.appendChild(p1);
            div.appendChild(p2);

            RidesForm.appendChild(div);
        }
    }) .catch(error => {
        console.error('Error:', error);
    });
}

function formatDate(dateString) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${monthNames[month]}, ${year}`;
}

document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}