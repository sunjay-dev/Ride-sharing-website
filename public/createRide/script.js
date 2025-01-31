const seatsOfferRide = document.getElementById('seatsOfferRide');
const dateInputOfferRide = document.getElementById('dateInputOfferRide');
const timeInputOfferRide = document.getElementById('timeInputOfferRide');
const vehicleOfferRide = document.getElementById('vehicleOfferRide');
const fareOfferRide = document.getElementById('fareOfferRide');

function validateInput(inputElement, limit, min) {
  inputElement.addEventListener("input", function (event) {
    let value = this.value;

    value = value.replace(/\D/g, "");

    if (value !== "") {
      const numValue = parseInt(value, 10);
      if (numValue > limit) {
        value = limit.toString();
      } else if (numValue < min) {
        value = min;
      }
    }
    this.value = value;
  });
}

document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}

function setDateTime() {
  let now = new Date();
  now.setMinutes(now.getMinutes() + 10);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;  

  const formattedTime = now.toLocaleTimeString([], { //format date 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  dateInputOfferRide.value = formattedDate;
  dateInputOfferRide.setAttribute('min', formattedDate);

  timeInputOfferRide.value = formattedTime;
}


function handleVehicleSelection(select) {
  const selectedValue = select.value;

  if (selectedValue === "") {
    select.value = "";

    window.location.href = "vehicle/manageVehicles";
  } else {
    fareOfferRide.readOnly = false;
    seatsOfferRide.readOnly = false;
    fareOfferRide.value = "";
    seatsOfferRide.value = "";

    const selectedOption = select.options[select.selectedIndex];

    const vehicleType = selectedOption.getAttribute("data-vehicletype");

    if (vehicleType === "car") {
      validateInput(seatsOfferRide, 4, 1);
      validateInput(fareOfferRide, 150, 0);

    } else if (vehicleType === "bike") {

      validateInput(seatsOfferRide, 2, 1);
      validateInput(fareOfferRide, 100, 0);

    }
  }
}



document.addEventListener('DOMContentLoaded', function () {
  setDateTime();
  fetch('/vehicle/getVehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      for (let i = 0; i < data.vehicles.length; i++) {
        let option = document.createElement("option");
        option.value = data.vehicles[i]._id;
        option.textContent = data.vehicles[i].model + " - " + data.vehicles[i].numberPlate;

        option.setAttribute("data-vehicletype", data.vehicles[i].vehicleType);

        vehicleOfferRide.appendChild(option);
      }
      let option = document.createElement("option");
      option.value = "";
      option.className = "font-sm";
      option.textContent = "➕ Add New Vehicle";
      vehicleOfferRide.appendChild(option);
    }).catch(error => {
      console.log(error);
    })
});


document.getElementById('OfferRideSubmitBtn').addEventListener('click', (e) => {
  document.getElementById('OfferRideSubmitBtn').disabled = true;
  const form = document.getElementById('offerRidesOption');
  let vehicleOfferRide = form.querySelector('#vehicleOfferRide');

  if (form.checkValidity()) {
    e.preventDefault();

    let fromFindRideValue = form.querySelector('#fromOfferRide');
    let toFindRideValue = form.querySelector('#toOfferRide');
    let dateInputOfferRide = form.querySelector('#dateInputOfferRide');
    let timeInputOfferRide = form.querySelector('#timeInputOfferRide');
    let seatsOfferRide = form.querySelector('#seatsOfferRide');
    let fareOfferRide = form.querySelector('#fareOfferRide');

    const dateValue = dateInputOfferRide.value;
    const timeValue = timeInputOfferRide.value;

    const localDateTime = `${dateValue}T${timeValue}`;

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //convert local date time to UTC

    const utcDateTime = new Date(
      new Date(localDateTime).toLocaleString('en-US', { timeZone: userTimeZone })
    ).toISOString();

    fetch('/ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        from: fromFindRideValue.value,
        to: toFindRideValue.value,
        datetime: utcDateTime,
        fare: fareOfferRide.value,
        seats: seatsOfferRide.value,
        vehicleDetails: vehicleOfferRide.value
      })
    }).then(response => {

      if (!response.ok) {
        return response.json().then(errorData => {
          console.log(errorData.error)
          throw new Error(errorData.error || 'Something went wrong');
        });
      }
      return response.json();
    })
      .then(data => {
        fromFindRideValue.value = "";
        toFindRideValue.value = "";
        dateInputOfferRide.value = "";
        timeInputOfferRide.value = "";
        fareOfferRide.value = "";
        seatsOfferRide.value = "";
        vehicleOfferRide.value = "";

        window.location.href = "/ride/created"
      })
      .catch((error) => {
        let errorspan = document.querySelector('div[role="alert"]');
        errorspan.classList.remove('hidden');
        document.querySelector('div[role="success"]').classList.add('hidden');
        errorspan.querySelector('span').innerHTML = error.message;

        errorspan.scrollIntoView({
          behavior: 'smooth', 
          block: 'center',
        });
      }).finally(() => {
        document.getElementById('OfferRideSubmitBtn').disabled = false;
      });
  } else {
    form.reportValidity();
  }
})

const places = [
  "Abdullah Mall, Hyderabad",
  "London Town, Hyderabad",
  "Ali Palace, Hyderabad",
  "Naseem Nagar Chowk, Hyderabad",
  "Citizen Colony, Hyderabad",
  "Waduwaw, Hyderabad",
  "Ponam Pump, Hyderabad",
  "Qasim Chowk, Hyderabad",
  "Gul Center, Hyderabad",
  "Hyder Chowk, Hyderabad",
  "Hussianabad, Hyderabad",
  "Halanaka, Hyderabad",
  "Latifabad 6, Hyderabad",
  "Latifabad 7, Hyderabad",
  "Latifabad 8, Hyderabad",
  "Latifabad 9, Hyderabad",
  "Latifabad 10, Hyderabad",
  "Latifabad 11, Hyderabad",
  "Kosar, Hyderabad",
  "Saddar, Hyderabad",
  "MUET, Jamshoro"
];

function autocomplete(inputElement, listId, filterFn) {
  let currentFocus;

  inputElement.addEventListener("input", function () {
    const value = this.value;
    closeAllLists();
    if (!value) return false;

    currentFocus = -1;
    const autocompleteList = document.getElementById(listId);
    autocompleteList.innerHTML = "";
    autocompleteList.classList.remove("hidden");

    const filteredPlaces = filterFn ? filterFn(places) : places;

    filteredPlaces.forEach((place) => {
      if (place.toLowerCase().startsWith(value.toLowerCase())) {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = place;
        itemElement.classList.add("cursor-pointer", "p-2", "hover:bg-blue-100");
        itemElement.addEventListener("click", function () {
          inputElement.value = place;
          closeAllLists();
          inputElement.dispatchEvent(new Event("change"));
        });
        autocompleteList.appendChild(itemElement);
      }
    });

    if (autocompleteList.children.length === 0) {
      autocompleteList.classList.add("hidden");
    }
  });

  inputElement.addEventListener("keydown", function (e) {
    const items = document.querySelectorAll(`#${listId} div`);
    if (e.keyCode === 40) { 
      currentFocus++;
      addActive(items);
    } else if (e.keyCode === 38) { 
      currentFocus--;
      addActive(items);
    } else if (e.keyCode === 13) { 
      e.preventDefault();
      if (currentFocus > -1) {
        if (items) items[currentFocus].click();
      }
    }
  });

  inputElement.addEventListener("blur", function () {
    const value = this.value;
    if (!places.some(place => place.toLowerCase() === value.toLowerCase())) {
      inputElement.value = ""; 
    }
  });

  function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add("bg-blue-100");
  }

  function removeActive(items) {
    items.forEach(item => item.classList.remove("bg-blue-100"));
  }

  function closeAllLists() {
    const autocompleteList = document.getElementById(listId);
    autocompleteList.innerHTML = ""; 
    autocompleteList.classList.add("hidden"); 
  }

  document.addEventListener("click", function () {
    closeAllLists();
  });
}

autocomplete(document.getElementById('fromOfferRide'), "fromOfferRide-list", () => places);
autocomplete(document.getElementById('toOfferRide'), "toOfferRide-list", () => places);


document.getElementById('fromOfferRide').addEventListener('change', function () {
  const value = this.value;

  if (value === "MUET, Jamshoro") {
    const filteredPlaces = places.filter(place => place !== "MUET, Jamshoro");
    autocomplete(
      document.getElementById('toOfferRide'),
      "toOfferRide-list",
      () => filteredPlaces
    );
    document.getElementById('toOfferRide').value = "";
    document.getElementById('toOfferRide').readOnly = false;
  } else if (places.includes(value)) {
    document.getElementById('toOfferRide').value = "MUET, Jamshoro";
    document.getElementById('toOfferRide').readOnly = true; 
  }
});

document.getElementById('toOfferRide').addEventListener('change', function () {
  const value = this.value;

  if (value === "MUET, Jamshoro") {
    const filteredPlaces = places.filter(place => place !== "MUET, Jamshoro");

    autocomplete(
      document.getElementById('fromOfferRide'),
      "fromOfferRide-list",
      () => filteredPlaces
    );
    document.getElementById('fromOfferRide').value = "";
    document.getElementById('fromOfferRide').readOnly = false; 
  } else if (places.includes(value)) {
    document.getElementById('fromOfferRide').value = "MUET, Jamshoro";
    document.getElementById('fromOfferRide').readOnly = true; 
  }
});



function showError(message) {
  const errorDiv = document.getElementById("readOnlyerror");
  errorDiv.textContent = message; 
  errorDiv.classList.remove("opacity-0", "pointer-events-none"); 
  errorDiv.classList.add("-translate-y-10", "opacity-100"); 

  setTimeout(() => {
    errorDiv.classList.remove("-translate-y-10", "opacity-100");
    errorDiv.classList.add("-translate-y-20", "opacity-0", "pointer-events-none");

    setTimeout(() => {
      errorDiv.classList.remove("-translate-y-20"); 
    }, 500);
  }, 2500);

}

document.getElementById("seatsOfferRide").addEventListener("click", () => {
  if (document.getElementById("seatsOfferRide").readOnly) {
    showError("Please select the vehicle first");
  }
});

document.getElementById("fareOfferRide").addEventListener("click", () => {
  if (document.getElementById("fareOfferRide").readOnly) {
    showError("Please select the vehicle first");
  }
});