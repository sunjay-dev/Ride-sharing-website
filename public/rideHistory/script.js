document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}
const availableTab = document.getElementById('availableTab');
const historyTab = document.getElementById('historyTab');
const availableContent = document.getElementById('no-message');
const historyContent = document.getElementById('no-history');
const underline = document.getElementById('underline');
const rideDetails = document.getElementById('rideDetails');
let fetchedPassengerOne = false;
function switchTab(tab) {
    if (tab === 'available') {
        availableTab.classList.add('text-[#6d74fc]', 'border-[#6d74fc]');
        availableTab.classList.remove('text-gray-500', 'border-transparent');
        historyTab.classList.add('text-gray-500', 'border-transparent');
        historyTab.classList.remove('text-[#6d74fc]', 'border-[#6d74fc]');
        underline.style.transform = 'translateX(0)';

        availableContent.classList.remove('hidden');
        historyContent.classList.add('hidden');

    } else if (tab === 'history') {
        historyTab.classList.add('text-[#6d74fc]', 'border-[#6d74fc]');
        historyTab.classList.remove('text-gray-500', 'border-transparent');
        availableTab.classList.add('text-gray-500', 'border-transparent');
        availableTab.classList.remove('text-[#6d74fc]', 'border-[#6d74fc]');
        underline.style.transform = 'translateX(100%)';
        availableContent.classList.add('hidden');
        historyContent.classList.remove('hidden');
        if (!fetchedPassengerOne) {
            fetchAsaPassenger();
            fetchedPassengerOne = true;
        }
    }
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options).replace(',', '');
}
function ridestemplete(ride, driver) {
    let status = "Completed";
    let color = "bg-[#6d74fc]";
    if (ride.status === 'canceled') {
        status = 'Canceled';
        color = "bg-[#cb5656]"
    }
    return `
        <div class=" rounded-lg shadow bg-[#fcfcfc] mt-4  cursor-pointer mx-auto" onclick="getDetails('${ride._id}',${driver})">
        <div class="p-4">
            <div class="space-y-4">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-[16px] font-semibold text-gray-800">${formatDate(ride.datetime)}</p>
                        <div class="flex items-start mt-1">
                            <div class="flex flex-col items-center">
                                <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                                <div class="h-6 w-0.5 bg-gray-400"></div>
                                <div class="w-2.5 h-2.5 bg-[#6d74fc] rounded-full"></div>
                            </div>
                            <div class="space-y-2 flex flex-col ml-4">
                                <p class="text-sm text-gray-700">${ride.from}</p>
                                <p class="text-sm text-gray-700">${ride.to}</p>
                            </div>
                        </div>
                    </div>
                    <div class=" space-y-3 text-end">
                        <p class="text-[16px] text-gray-700 font-semibold">Rs. ${ride.fare}/pax</p>
                        <button class="text-gray-500 hover:text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="-mt-1 rounded-b-lg ${color} text-white py-2">
            <p class="text-sm font-semibold text-center">Status: ${status}</p>
        </div>
</div>`
}
function NoRideTemplete() {
    return `<div class="text-center text-gray-500 mt-4">
        <p>No rides available.</p>
    </div>`
}
document.addEventListener("DOMContentLoaded", () => {
    fetch('/ride/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(response => {
            availableContent.innerHTML = '';
            response.forEach(ride => {
                availableContent.innerHTML += ridestemplete(ride, true);
            });

            if (!availableContent.hasChildNodes()) {
                availableContent.innerHTML = NoRideTemplete();
            }
        })
        .catch(error => {
            console.error("Error fetching ride history:", error);
        });
});

function fetchAsaPassenger() {
    fetch('/ride/history/passenger', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(response => {
            historyContent.innerHTML = '';
            response.forEach(ride => {
                historyContent.innerHTML += ridestemplete(ride, false);
            });
            if (!historyContent.hasChildNodes()) {
                historyContent.innerHTML = NoRideTemplete();
            }
        })
        .catch(error => {
            console.error("Error fetching ride history:", error);
        });
}

function getDetails(id, driver) {
    fetch('/ride/history/getRideById', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rideId: id })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(response => {
            rideDetails.innerHTML = manageRideDetailsTemplete(response, driver);
            rideDetails.classList.remove('hidden');
            rideDetails.classList.add('flex');
            document.getElementById('closeRideDetails').addEventListener('click', () => {
                rideDetails.classList.add('hidden');
                rideDetails.classList.remove('flex');
            })
        })
        .catch(error => {
            console.error("Error fetching ride history:", error);
        });
}
function manageRideDetailsTemplete(ride, driver) {
    let hd;
    if (driver) {
        hd = "hidden"
    }
    let carImg = `<img src="/bike.webp" alt="Driver Photo" class="h-24 object-contain">`;
    if (ride.vehicleDetails.vehicleType === "car") {
        carImg = `<img src="/car.webp" alt="Driver Photo" class="h-[4.5rem] object-contain">`;
    }
    let passengerImg = ``;
    for (let passenger of ride.passengers) {
        passengerImg += `<img src="${passenger.img}" alt="Passenger 1" class="w-6 h-6 rounded-full object-cover">`
    }
    return `
         <div class="bg-white w-[calc(100dvw-2rem)] sm:w-[80vw] sm:h-[90vh] rounded-lg shadow-xl relative overflow-hidden">
      <div class="w-full flex items-center justify-between p-3 bg-gray-100 border-b">
        <button id="closeRideDetails" class="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 flex items-center justify-center">
          <svg class="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#202a38"></path> </g></svg>
        </button>
        <div class="absolute left-1/2 transform -translate-x-1/2 text-gray-800 font-semibold text-lg">
          ${new Date(ride.datetime).toLocaleDateString()}
        </div>
        <div class="w-10"></div>
      </div>
      <div class="sm:flex sm:flex-row h-full">
        <div class="relative sm:w-1/2 sm:h-full flex-shrink-0">
          <img src="/map_moblie.webp" alt="Map Screenshot" class="w-full h-44 object-cover rounded-l-lg sm:hidden">
            <img src="/map_desktop.webp" alt="Map Screenshot" class="w-full h-full object-cover rounded-l-lg hidden sm:block">
        </div>
        <div class="px-6 py-4 sm:w-1/2 sm:overflow-y-auto">
          <div class="flex justify-between mb-4">
            <div class="flex flex-col">
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
          <div class="${hd}">
          <!-- Driver Info -->
          <div class="flex items-center space-x-2">
            <img src="https://res.cloudinary.com/dzxcifimr/image/upload/v1736746583/Carpooling/mhtcyxk1iwospozf28rh.jpg" alt="Driver Photo" class="w-14 h-14 rounded-full object-cover">
            <div class="capitalize flex flex-col justify-between">
              <p class="text-gray-800 font-medium text-xl">${ride.driver.firstName} ${ride.driver.lastName}</p>
              <p class="text-gray-500 text-sm">${ride.driver.department}</p>
            </div>
          </div>
          <hr class="my-3">
          </div>
          <div class="mt-4 flex justify-between items-center">
            <p class="text-sm text-gray-600 font-medium">${ride.passengers.length} Passenger</p>
            <div class="flex space-x-2">
            ${passengerImg}  
            </div>
          </div>
          <div class="mt-2 flex justify-between items-center">
            <p class="text-sm text-gray-600 font-medium">Fare per Passenger</p>
            <p class="text-xl text-[#6d74fc] font-semibold">Rs. ${ride.fare}</p>
          </div>
        </div>
      </div>
    </div>`;

}