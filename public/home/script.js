let userName = document.getElementById('userName');
let userImg = document.getElementById('userImg');
let availableRideContainer = document.getElementById('availableRideContainer');
let currentRideDiv = document.getElementById('currentRideDiv');
let realProfile = document.getElementById('realProfile');
let profileSkeleton = document.getElementById('profileSkeleton');
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    fetchDetails();
    manageCurrentRide();
    fetchTwoAvailableRides();

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});
async function fetchDetails() {
    fetch('/homePage', {
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
        profileSkeleton.classList.add('hidden');
        profileSkeleton.classList.remove('flex');
        userName.innerHTML = data.firstName + ' ' + data.lastName;
        userImg.src = data.img;
        realProfile.classList.add('flex');
        realProfile.classList.remove('hidden');

        if(data.unreadMessagesCount>0){
            document.getElementById('notification-badge').classList.remove('hidden');
            document.getElementById('notification-badge').classList.add('flex');
            document.getElementById('notification-badge').innerHTML = data.unreadMessagesCount;
        }

    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}
function fetchTwoAvailableRides() {
    fetch('/ride/getHomePageRides', {
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
        availableRideContainer.innerHTML = '';
        if(data.length === 0){
            availableRideContainer.innerHTML = `<div id="noCurrentRideDiv" class="bg-[#6d74fc] opacity-90 rounded-xl mt-2 py-4">
            <p class="text-center font-lg text-white">No Suggestion available right now.</p>
        </div>`
        }
        data.forEach(ride => {
            availableRideContainer.innerHTML += manageAvailableTemplete(ride);
        });
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}
function manageAvailableTemplete(ride) {
    return `<div class="bg-[#fff] mt-2 rounded-lg shadow p-4 mb-3 cursor-pointer" onclick="OpenFindRide('${ride._id}')">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <img class="w-12 h-12 rounded-[2rem] object-cover"
                            src="${ride.driver.img}" alt="driver image">
                        <div class="ml-2 capitalize">
                            <p class="m-0 text-lg capitalize">${ride.driver.firstName} ${ride.driver.lastName}</p>
                            <p class="ml-auto text-sm text-[#c1c3c5]">${ride.vehicleDetails.model}</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <p class="text-lg"><span class="text-[#6d74fc] font-medium">Rs.${ride.fare}</span>/pax</p>
                        <p class="ml-4 text-[#c1c3c5] text-sm"><span id="availableSeats">${ride.availableSeats}</span> seats left</p>
                    </div>
                </div>
                <div class="flex items-center mt-3">
                    <div class="flex flex-col items-center">
                        <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                        <div class="h-6 w-0.5 bg-gray-400"></div>
                        <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                        <div class="h-6 w-0.5 bg-gray-400"></div>
                        <div class="w-2.5 h-2.5 bg-[#6d74fc] rounded-full"></div>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm text-[#6d74fc]">${new Date(ride.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p class="text-sm text-black">${ride.from}</p>
                        <p class="mt-4 text-sm text-[#6d74fc]">${new Date(ride.leaveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p class="text-sm text-black">${ride.to}</p>
                    </div>
                </div>
            </div>`;
}
function manageCurrentTemplete(ride, type) {

    return `<div class="bg-white z-10 mt-2 rounded-lg shadow px-4 py-1 flex items-center justify-between cursor-pointer w-full" onclick="getCurrentRideDetails('${ride._id}', '${type}')">
                <div class="flex items-center">
                    <div class="flex flex-col items-center space-y-1">
                        <div class="w-6 h-6 flex items-center justify-center rounded-full bg-[#6d74fc] text-white">
                        <svg class="w-2 h-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="8" cy="8" r="8" fill="#fff"></circle> </g></svg>
                        </div>
                        <div class="border-l-2 border-dashed border-indigo-500 h-6 mt-1"></div>
                        <div class="w-7 h-7 flex items-center justify-center rounded-full bg-[#6d74fc] mt-1 p-1">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 6 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex flex-col items-start space-y-2 my-3 ml-4">
                        <div>
                            <p class="text-base font-medium text-gray-700">${ride.from}</p>
                            <p class="text-sm text-gray-500">${new Date(ride.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-700">${ride.to}</p>
                            <p class="text-sm text-gray-500">${new Date(ride.leaveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-end text-right">
                    <div class="mb-2">
                        <p class="text-lg"><span class="text-[#6d74fc] font-medium">Rs.${ride.fare}</span>/pax</p>
                        <p class="text-sm text-gray-500">${ride.availableSeats} Seats Left</p>
                    </div>
                    
                    <button class="w-8 h-8 flex items-center justify-center bg-[#6d74fc] text-white rounded-full mt-3">
                        ➜
                    </button>
                </div>
            </div>`;
}
function manageNoCurrentTemplete() {
    return `<div id="noCurrentRideDiv" class="bg-[#6d74fc] opacity-90 rounded-xl mt-2 py-4">
                <p class="text-center font-lg text-white">No current ride available.</p>
            </div>`
}

function manageRideDetailsTempleteForPassenger(ride) {
    let carImg = `<img src="/bike.webp" alt="Driver Photo" class="h-24 object-contain">`;
    if(ride.vehicleDetails.vehicleType === "car"){
        carImg = `<img src="/car.webp" alt="Driver Photo" class="h-[4.5rem] object-contain">`;
    }

    let passengerImg = ``;
    for (let passenger of ride.passengers) {
        passengerImg += `<img src="${passenger.img}" alt="Passenger 1" class="w-6 h-6 rounded-full object-cover">`
    }
    for (let i = 0; i < ride.availableSeats; i++) {
        passengerImg += `<img src="/circle-dashed-svgrepo-com.svg" alt="Passenger Placeholder" class="w-6 h-6 rounded-full object-cover">`
    }
    return `
        <div
        class="bg-white w-[calc(100dvw-2rem)] z-10 sm:w-[80vw] sm:h-[90vh] sm:flex rounded-lg shadow-xl relative overflow-hidden">
        <!-- Map Section -->
        <div class="relative sm:w-1/2 sm:h-full sm:rounded-l-lg flex-shrink-0">
            <!-- Close Button -->
            <button id="closeRideDetails"
                class="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <!-- Map Screenshot -->
            <img src="/map_moblie.webp" alt="Map Screenshot" class="w-full h-44 object-cover rounded-l-lg sm:hidden">
            <img src="/map_desktop.webp" alt="Map Screenshot" class="w-full h-full object-cover rounded-l-lg hidden sm:block">
        </div>

        <!-- Content Section -->
        <div class="px-6 py-4 sm:w-1/2 sm:h-full sm:overflow-y-auto">
            <!-- Ride Info -->
            <div class="flex justify-between mb-4">
                <div class="flex flex-col">
                    <div class="text-gray-800 font-semibold text-lg mb-2">${new Date(ride.datetime).toLocaleDateString()}</div>
                    <div class="flex items-center">
                        <div class="flex flex-col items-center">
                            <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                            <div class="h-6 w-0.5 bg-gray-400"></div>
                            <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                            <div class="h-6 w-0.5 bg-gray-400"></div>
                            <div class="w-2.5 h-2.5 bg-[#6d74fc] rounded-full"></div>
                        </div>
                        <div class="ml-4 text-sm">
                            <p class="text-gray-500">${new Date(ride.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p class="text-black">${ride.from}</p>
                            <p class="mt-4 text-gray-500">${new Date(ride.leaveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p class="text-black">${ride.to}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-between">
                    ${carImg}
                    <div class="capitalize flex flex-col justify-between items-center">
                        <p class="text-gray-800 font-medium text-[16px] capitalize">${ride.vehicleDetails.model}</p>
                        <p class="text-gray-500 text-[12px]">${ride.vehicleDetails.color} - ${ride.vehicleDetails.numberPlate}</p>
                    </div>
                </div>
            </div>
            <hr class="my-3">
            <!-- Driver Info -->
            <div class="flex items-center justify-between space-x-2"> 
            <div class="flex items-center space-x-2"> 
                <img src="${ride.driver.img}" alt="Driver Photo" class="w-14 h-14 rounded-full object-cover">
                <div class="capitalize flex flex-col">
                    <p class="text-gray-800 font-medium text-xl">${ride.driver.firstName} ${ride.driver.lastName}</p>
                    <p class="text-gray-500 text-sm">${ride.driver.department}</p>
                 </div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" onclick="openWhatsApp('${ride.driver.phone}')" class="w-10 h-10">
        </div>
            <hr class="my-3">
            <div class="mt-4 flex justify-between items-center">
                <p class="text-sm text-gray-600 font-medium">${ride.availableSeats} Available Seats</p>
                <div class="flex space-x-2">
                ${passengerImg}
                </div>
            </div>
            <div class="mt-2 flex justify-between items-center">
                <p class="text-sm text-gray-600 font-medium">Fare Per Passenger</p>
                <p class="text-xl text-[#6d74fc] font-semibold">Rs. ${ride.fare}</p>
            </div>
            <div class="mt-6">
                <button id="cancelBooking" onclick="confirmDelete('${ride._id}', 'passenger')"
                    class="bg-red-500 text-white w-full px-6 py-2.5 rounded-lg hover:bg-red-600">
                    Leave Ride
                </button>
            </div>
        </div>
    </div>`;

}
function manageRideDetailsTempleteForDriver(ride) {
    let carImg = `<img src="/bike.webp" alt="Driver Photo" class="h-24 object-contain">`;
    if(ride.vehicleDetails.vehicleType === "car"){
        carImg = `<img src="/car.webp" alt="Driver Photo" class="h-[4.5rem] object-contain">`;
    }
    let passengerDetails = '';
    if (ride.passengers.length > 0) {
        for (let passenger of ride.passengers) {
            passengerDetails += `
                <div class="flex items-center justify-between mt-6">
                    <div class="flex items-center space-x-2">
                        <img src="${passenger.img}" alt="Passenger" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <p class="text-gray-900 font-medium">${passenger.firstName} ${passenger.lastName}</p>
                            <p class="text-sm text-gray-500">${passenger.department}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="w-10 h-10 flex items-center justify-center cursor-pointer" onclick="openWhatsApp('${passenger.phone}')">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" class="w-8 h-8">
                        </button>
                        <svg onclick="confirmDeleteP('${ride._id}', '${passenger._id}')" class="w-8 h-8 cursor-pointer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#6d74fc">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <circle style="fill:none;stroke:#6d74fc;stroke-width:2;stroke-miterlimit:10;" cx="14" cy="11" r="6"></circle>
                                <path style="fill:none;stroke:#6d74fc;stroke-width:2;stroke-miterlimit:10;" d="M5,26c0-4.971,4.029-9,9-9 c1.864,0,3.596,0.567,5.032,1.537"></path>
                                <circle style="fill:none;stroke:#6d74fc;stroke-width:2;stroke-miterlimit:10;" cx="24" cy="24" r="7"></circle>
                                <line style="fill:none;stroke:#6d74fc;stroke-width:2;stroke-miterlimit:10;" x1="21" y1="27" x2="27" y2="21"></line>
                                <line style="fill:none;stroke:#6d74fc;stroke-width:2;stroke-miterlimit:10;" x1="21" y1="21" x2="27" y2="27"></line>
                            </g>
                        </svg>
                    </div>
                </div>`;
        }
    } else {
        passengerDetails = '<p class="text-gray-500">0 passengers right now</p>';
    }

    // Check if the ride's datetime is in the past
    let rideDateTime = new Date(ride.datetime);
    let currentDateTime = new Date();
    let showCompleteButton = rideDateTime < currentDateTime;

    return `
    <div class="bg-white w-[calc(100dvw-2rem)] sm:w-[80vw] sm:h-[90vh] sm:flex rounded-lg shadow-xl relative overflow-hidden">
        <!-- Map Section -->
        <div class="relative sm:w-1/2 sm:h-full sm:rounded-l-lg flex-shrink-0">
            <!-- Close Button -->
            <button id="closeRideDetails" class="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <!-- Map Screenshot -->
           <img src="/map_moblie.webp" alt="Map Screenshot" class="w-full h-44 object-cover rounded-l-lg sm:hidden">
            <img src="/map_desktop.webp" alt="Map Screenshot" class="w-full h-full object-cover rounded-l-lg hidden sm:block">
        </div>

        <!-- Content Section -->
        <div class="px-6 py-4 sm:w-1/2 sm:h-full sm:overflow-y-auto">
            <!-- Ride Info -->
            <div class="flex justify-between mb-4">
                <div class="flex flex-col">
                    <div class="text-gray-800 font-semibold text-lg mb-2">${new Date(ride.datetime).toLocaleDateString()}</div>
                    <div class="flex items-center">
                        <div class="flex flex-col items-center">
                            <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                            <div class="h-6 w-0.5 bg-gray-400"></div>
                            <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                            <div class="h-6 w-0.5 bg-gray-400"></div>
                            <div class="w-2.5 h-2.5 bg-[#6d74fc] rounded-full"></div>
                        </div>
                        <div class="ml-4 text-sm">
                            <p class="text-gray-500">${new Date(ride.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p class="text-black">${ride.from}</p>
                            <p class="mt-4 text-gray-500">${new Date(ride.leaveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p class="text-black">${ride.to}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-between">
                    ${carImg}
                    <div class="capitalize flex flex-col justify-between items-center">
                        <p class="text-gray-800 font-medium text-[16px] capitalize">${ride.vehicleDetails.model}</p>
                        <p class="text-gray-500 text-[12px]">${ride.vehicleDetails.color} - ${ride.vehicleDetails.numberPlate}</p>
                    </div>
                </div>
            </div>
            <hr class="my-3">
            <div class="">
                <p class="text-gray-700 font-medium text-md">Passenger Details</p>
                <div class="space-y-3">
                    ${passengerDetails}
                </div>
            </div>
            
            <div class="mt-6 flex ${showCompleteButton ? 'space-x-4 justify-center' : 'justify-center'}">
                <button id="cancelRideBtn" onclick="confirmDelete('${ride._id}', 'driver')" 
                    class="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 ${showCompleteButton ? '' : 'w-full'}">
                    Cancel Ride
                </button>
                ${showCompleteButton ? `
                <button id="completeRideBtn" onclick="confirmComplete('${ride._id}')" 
                    class="bg-[#6d74fc] text-white px-5 py-2.5 rounded-lg hover:bg-[#5d62c3]">
                    Complete Ride
                </button>
                ` : ''}
            </div>
        </div>      
    </div>`;
}

function openWhatsApp(phone) {
    window.open(`https://wa.me/92${phone}?text=Hello%20from%20UniRide`, '_blank');
}

function OpenFindRide(id) {
    window.location.href = `/find_ride?id=${id}`;
}
function manageCurrentRide() {
    fetch('/ride/getCurrentRide', {
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
        currentRideDiv.innerHTML = '';
        if (data.ride)
            currentRideDiv.innerHTML += manageCurrentTemplete(data.ride, data.type);
        else
            currentRideDiv.innerHTML += manageNoCurrentTemplete();
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}
function cancelBooking(id) {
    fetch('/ride/cancelBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rideId: id })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        closeModal();
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        manageCurrentRide();
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}
function cancelRide(id) {
    fetch('/ride/cancelRide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rideId: id })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        closeModal();
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        manageCurrentRide();
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}

function removePassenger(rideId, passengerId) {
    fetch('/ride/removePassenger', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rideId: rideId, passengerId: passengerId})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        closeModalForP();
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        manageCurrentRide();
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}

function getCurrentRideDetails(id, type) {
    socket.emit('fetchRidebyId', { id: id });

    socket.off('sendRideOfId');

    socket.on('sendRideOfId', (details) => {
        openRideDetails(details, type);
    });
}

const rideDetails = document.getElementById('rideDetails');

function openRideDetails(rideData, type) {
    if (type === 'driver')
        rideDetails.innerHTML = manageRideDetailsTempleteForDriver(rideData);
    else
        rideDetails.innerHTML = manageRideDetailsTempleteForPassenger(rideData);
    rideDetails.classList.remove('hidden');
    rideDetails.classList.add('flex'); // Show modal
    document.body.classList.add('overflow-hidden');

    document.getElementById('closeRideDetails').addEventListener('click', () => {
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
    document.getElementById('myModal').classList.remove('flex');
}

function confirmDelete(id, type) {
    document.getElementById('myModal').classList.add('flex');
    document.getElementById('myModal').classList.remove('hidden');

    if (type === 'passenger') {
        document.querySelector('#myModal h2').innerHTML = 'Leave Ride';
        document.querySelector('#myModal p').innerHTML = 'Are you sure you want to leave this ride?';
    } else if (type === 'driver') {
        document.querySelector('#myModal h2').innerHTML = 'Cancel Ride';
            document.querySelector('#myModal p').innerHTML = 'Are you sure you want to cancel this ride?';
            
    }

    document.getElementById('confirmDeleteButton').onclick = function () {
        if (type === 'passenger') {
            cancelBooking(id);
        } else if (type === 'driver') {
            cancelRide(id);
        }
    }
}

function closeModalForP() {
    document.getElementById('myModalForP').classList.add('hidden');
    document.getElementById('myModalForP').classList.remove('flex');
}
function confirmDeleteP(rideId, passengerId) {

    document.getElementById('myModalForP').classList.add('flex');
    document.getElementById('myModalForP').classList.remove('hidden');

    document.getElementById('confirmDeleteButtonForP').onclick = function () {
        removePassenger(rideId, passengerId);
    }
}

function closeModalForComplete() {
    document.getElementById('myModalForComplete').classList.add('hidden');
    document.getElementById('myModalForComplete').classList.remove('flex');
}
function confirmComplete(rideId) {

    document.getElementById('myModalForComplete').classList.add('flex');
    document.getElementById('myModalForComplete').classList.remove('hidden');

    document.getElementById('confirmDeleteButtonForComplete').onclick = function () {
        completeRide(rideId);
    }
}


function completeRide(rideId){
    fetch('/ride/completeRide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rideId: rideId})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        closeModalForComplete();
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        manageCurrentRide();
    }).catch(error => {
        console.error('problem with fetching data :', error);
    });
}