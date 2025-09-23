document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    window.location.href = '/home';
}

let filterDiv = document.getElementById('filterDiv');
let cancelButton = document.getElementById('cancelButton');
let applyFilters = document.getElementById('applyFilters');
let resetFilter = document.getElementById('resetFilter');
let filterBtn = document.getElementById('filterBtn');

filterBtn.addEventListener('click', () => {
    filterDiv.classList.add("flex");
    filterDiv.classList.remove("hidden");
    document.body.classList.add('overflow-hidden');
});

cancelButton.addEventListener('click', () => {
    filterDiv.classList.remove("flex");
    filterDiv.classList.add("hidden");
    document.body.classList.remove('overflow-hidden');
});

resetFilter.addEventListener('click', () => {
    document.getElementById('fromLocation').value = "";
    document.getElementById('toLocation').value = "";
    document.getElementById('price').value = "150";
    document.querySelector('input[value="both"]').checked = true;
});

let ridenotificationBadge = document.getElementById('ridenotificationBadge');
let ridesBoxes = document.getElementById('ridesBoxes');
let socket;
let currentFilters = {};
let newRidescount = 0;
let ridescount = 0;
function connectToSocketAndFetchRides() {
    newRidescount = 0;
    ridenotificationBadge.classList.add("hidden");

    if (!socket) {

        socket = io();

        socket.on('connect', () => {
            socket.emit('fetchRides', { filters: currentFilters });
        });

        socket.on('rides', (rides) => {
            updateRidesUI(rides);
        });

        socket.on('newRide', () => {
            newRidescount++;
            ridenotificationBadge.innerHTML = `${newRidescount} new ride available`;
            ridenotificationBadge.classList.remove("hidden");

        });
        socket.on('decreaseSeat', (rideId) => {
            const rideElement = ridesBoxes.querySelector(`#id${rideId}`);
            if (rideElement) {
                let availableSeatsElement = rideElement.querySelector('#availableSeats');
                if (availableSeatsElement) {
                    let s = parseInt(availableSeatsElement.innerHTML, 10);
                    availableSeatsElement.innerHTML = --s;
                    if (s === 0) {
                        rideElement.classList.add("hidden");
                    }
                }
            }
        })
        socket.on('error', (error) => {
            console.error('Socket Error:', error);
        });
    } else {
        socket.emit('fetchRides', { filters: currentFilters });
    }
}
ridenotificationBadge.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    connectToSocketAndFetchRides();
});
function updateFilters(newFilters) {
    currentFilters = { ...newFilters };

    if (socket) {
        socket.emit('fetchRides', { filters: currentFilters });
    }
}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        console.log('Disconnected from server');
        socket = null;
    }
}

//Apply filters
document.getElementById('applyFilters').addEventListener('click', () => {
    const from = document.getElementById('fromLocation').value || undefined;
    const to = document.getElementById('toLocation').value || undefined;
    const maxFare = document.getElementById('price').value || undefined;
    const vehicleType = document.querySelector('input[name="vehicleType"]:checked')?.value || undefined;

    const filters = {};

    if (from) filters.from = from;
    if (to) filters.to = to;
    if (maxFare) filters.fare = { $lte: parseInt(maxFare, 10) };
    if (vehicleType && vehicleType !== "both") filters.vehicleDetails = { type: vehicleType };

    updateFilters(filters);

    document.getElementById('filterDiv').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateRidesUI(rides, clear = true) {
    ridescount = 0;

    if (clear) {
        await sleep(1000);
        ridesBoxes.innerHTML = "";
    }
    for (const date in rides) {
        const dateHeading = document.createElement('h3');
        dateHeading.textContent = date;
        dateHeading.className = 'm-4 text-xl font-semibold text-gray-700';
        ridesBoxes.appendChild(dateHeading);

        const ridesForDate = rides[date];
        ridesForDate.forEach(ride => {
            ridescount++;
            let templete = manageRidesTemplete(ride)
            ridesBoxes.innerHTML += templete;
        })
    }

    // if (ridescount === 0) {
    //     ridesBoxes.innerHTML = `
    //         <div id="ridesBoxes" class="flex-grow flex flex-col items-center justify-center text-center  min-h-[calc(100vh-14rem)]">
    //         <img src="/home/car_logo.webp" alt="Car with people" class="w-52 mb-4">
    //         <h1 class="text-3xl font-bold text-gray-500">No rides available.</h1>
    //         <p class="text-gray-500 mt-2">Please try back later.</p>
    // </div>
    //     `;
    // }    

    document.getElementById('countRides').innerHTML = ridescount;
}

function manageRidesTemplete(ride) {
    return `
        <div class="bg-[#fff] rounded-lg shadow p-4 mb-6 cursor-pointer" onclick="fetchDataAboutRide('${ride._id}')" id="id${ride._id}">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <img class="w-12 h-12 rounded-[2rem] object-cover" src="${ride.driver.img}" />
                    <div class="ml-2 capitalize">
                        <p class="m-0 text-lg">${ride.driver.firstName} ${ride.driver.lastName}</p>
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
                    <p class="text-sm text-gray-500">${new Date(ride.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p class="text-sm text-black">${ride.from}</p>
                    <p class="mt-4 text-sm text-gray-500">${new Date(ride.leaveDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p class="text-sm text-black">${ride.to}</p>
                </div>
            </div>
        </div>`;
}
function manageRideDetailsTemplete(ride) {
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
        class="bg-white w-[calc(100dvw-2rem)] sm:w-[80vw] sm:h-[90vh] sm:flex rounded-lg shadow-xl relative overflow-hidden">
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
            <div id="readOnlyerror"
            class="absolute left-1/2 w-max transform z-20 -translate-x-1/2 text-red-500 sm:text-[1rem] font-semibold opacity-0 pointer-events-none transition-all duration-500 ease-out">
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
            <div class="flex items-center space-x-2">
                <img src="${ride.driver.img}" alt="Driver Photo" class="w-14 h-14 rounded-full object-cover">
                <div class="capitalize flex flex-col justify-between">
                    <p class="text-gray-800 font-medium text-xl">${ride.driver.firstName} ${ride.driver.lastName}</p>
                    <p class="text-gray-500 text-sm">${ride.driver.department}</p>
                </div>
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
                <button id="confirmRideDetails" onclick="confirmRide('${ride._id}')"
                    class="bg-[#6d74fc] text-white w-full px-6 py-2.5 rounded-lg hover:bg-[#5e63d0]">
                    Reserve a Seat
                </button>
            </div>
        </div>
    </div>`;
}

function confirmRide(rideId) {
    fetch('/ride/confirmRide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify({ rideId: rideId })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.log(errorData.message)
                throw new Error(errorData.message || 'Something went wrong');
            });
        }
        return response.json();
    }).then(data => {
        window.location.href = "/ride/joined"
    }).catch((error) => {
        console.log(error)
        showError(error.message);
    });
}

function fetchDataAboutRide(id) {
    if (socket) {
        socket.emit('fetchRidebyId', { id: id });
        socket.off('sendRideOfId');
        socket.on('sendRideOfId', (details) => {
            openRideDetails(details);
        })
    }
}

const rideDetails = document.getElementById('rideDetails');

function openRideDetails(rideData) {
    rideDetails.innerHTML = manageRideDetailsTemplete(rideData);
    rideDetails.classList.remove('hidden');
    rideDetails.classList.add('flex'); // Show modal
    document.body.classList.add('overflow-hidden');

    document.getElementById('closeRideDetails').addEventListener('click', () => {
        rideDetails.classList.remove('flex');
        rideDetails.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
}

function checkRideFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const rideId = urlParams.get('id');

    if (rideId && socket) {
        socket.emit('fetchRidebyId', { id: rideId });
        socket.off('sendRideOfId');

        socket.on('sendRideOfId', (details) => {
            if (details) {
                openRideDetails(details);
            } else {
                console.log('No ride found for the given ID');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectToSocketAndFetchRides();
    checkRideFromURL();
});


window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        // When scrolled down, reduce top spacing
        ridenotificationBadge.classList.replace("top-20", "top-4");
    } else {
        // When near the top, keep it below the header
        ridenotificationBadge.classList.replace("top-4", "top-20");
    }
});

function showError(message) {

    const errorDiv = document.getElementById("readOnlyerror");
    errorDiv.textContent = message;
    errorDiv.classList.remove("opacity-0", "pointer-events-none"); 
    errorDiv.classList.add("-translate-y-1", "opacity-100"); 

    setTimeout(() => {
        errorDiv.classList.remove("-translate-y-1", "opacity-100");
        errorDiv.classList.add("-translate-y-40", "opacity-0", "pointer-events-none");

        setTimeout(() => {
            errorDiv.classList.remove("-translate-y-40"); 
        }, 500);
    }, 2500);
}