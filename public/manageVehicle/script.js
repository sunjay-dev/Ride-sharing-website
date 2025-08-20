const addNewVehicleButton = document.getElementById('addNewVehicleButton');
const backToListButton = document.getElementById('backToListButton');
const vehicleListSection = document.getElementById('vehicleListSection');
const addVehicleSection = document.getElementById('addVehicleSection');
const vehicleList = document.getElementById('vehicleList');

addNewVehicleButton.addEventListener('click', () => {
    vehicleListSection.classList.add('hidden');
    addVehicleSection.classList.remove('hidden');
});

async function addNewVehicle(e) {
    e.preventDefault();
    const vehicleType = document.getElementById('vehicleType').value;
    const color = document.getElementById('color').value;
    const numberPlate = document.getElementById('numberPlate').value;
    const model = document.getElementById('model').value;
    const alertDiv = document.querySelector("div[role='alert']");
    const alertSpan = document.querySelector("div[role='alert'] span");

    if(!vehicleType.trim() || !color.trim() || !numberPlate.trim() || !model.trim()){
        alertDiv.classList.remove('hidden');
        alertSpan.innerHTML = "All fields are required";
        return;
    }

    const allowedTypes = ["car", "bike"];
    if (!allowedTypes.includes(vehicleType.toLowerCase())) {
        alertDiv.classList.remove('hidden');
        alertSpan.innerHTML = "Vehicle type must be 'car' or 'motor bike'";
        return;
    }

    const numberPlateRegex = /^[A-Z0-9-\s]+$/i;
    if (!numberPlateRegex.test(numberPlate)) {
        alertDiv.classList.remove('hidden');
        alertSpan.innerHTML = "Invalid number plate";
        return;
    }

    const colorRegex = /^[a-zA-Z\s-]+$/;
    if (!colorRegex.test(color)) {
        alertDiv.classList.remove('hidden');
        alertSpan.innerHTML = "Invalid color";
        return;
    }

    const modelRegex = /^[a-zA-Z0-9\s.-]+$/;
    if (!modelRegex.test(model)) {
        alertDiv.classList.remove('hidden');
        alertSpan.innerHTML = "Invalid model";
        return;
    }

    await fetch('/vehicle/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicleType, color, numberPlate, model })
    }).then(response => {
        
            if (response.ok) {
                return response.json();
            }
            else {
                vehicleListSection.classList.remove('hidden');
                addVehicleSection.classList.add('hidden');
                return response.json().then(error => {
                    console.log(error);
                    throw new Error(error.message || 'Vehicle registration failed.');
                });
            }
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            document.querySelector("div[role='alert']").classList.remove('hidden');
            document.querySelector("div[role='alert'] span").innerHTML = error.error || error.message;
        });
    document.getElementById('vehicleType').value = '';
    document.getElementById('color').value = '';
    document.getElementById('numberPlate').value = '';
    document.getElementById('model').value = '';
}

// Go Back to Vehicle List
backToListButton.addEventListener('click', () => {
    vehicleListSection.classList.remove('hidden');
    addVehicleSection.classList.add('hidden');
});

function closeErrorPage() {
    document.querySelector("div[role='alert']").className += " hidden";
}

document.getElementById('backPage').href = 'javascript:void(0);';
document.getElementById('backPage').onclick = () => {
    if (window.history.length <= 1) {
        window.location.href = '/home';
    } else {
        window.history.back();
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    fetch('/vehicle/getVehicles')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        vehicleList.innerHTML = "";
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let li = document.createElement('li');
                li.className = "flex items-center justify-between border p-4 rounded-lg shadow-sm"

                let div = document.createElement('div');

                let p1 = document.createElement('p');
                p1.className = "font-medium text-gray-800 capitalize";
                p1.innerHTML = data[i].model;

                let p2 = document.createElement('p');
                p2.className = "text-gray-500";
                p2.innerHTML = `Color: <span class="capitalize">${data[i].color}</span><br> Number Plate: <span>${data[i].numberPlate}</span>`


                let button = document.createElement('button');
                button.className = "text-red-500 font-medium hover:underline";
                button.innerHTML = "Remove";
                button.onclick = function () {
                    confirmDelete(data[i].numberPlate)
                };

                div.appendChild(p1);
                div.appendChild(p2);
                li.appendChild(div);
                li.appendChild(button);
                vehicleList.appendChild(li);
            }
        }
        else {
            vehicleList.innerHTML = '<li>No vehicles found.</li>';
        }
    })
        .catch(error => {
            document.querySelector("div[role='alert']").classList.remove('hidden');
            document.querySelector("div[role='alert'] span").innerHTML = error.message;
        });
});

async function deleteVehicle(numberPlate) {
    fetch('/vehicle/deleteVehicles', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numberPlate: numberPlate })
    }).then(response => {
        if (response.ok) {
            location.reload();
        }
        else {
            return response.json().then(error => {
                closeModal();
                throw new Error(error.message || 'Failed to delete vehicle.');
            });
        }
    }).catch(error => {
        document.querySelector("div[role='alert']").classList.remove('hidden');
        document.querySelector("div[role='alert'] span").innerHTML = error.message;
    });
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
    document.getElementById('myModal').classList.remove('flex');
}
function confirmDelete(numberPlate) {

    document.getElementById('myModal').classList.add('flex');
    document.getElementById('myModal').classList.remove('hidden');

    document.getElementById('confirmDeleteButton').onclick = function () {
        deleteVehicle(numberPlate);
    }
}

const colors = [
    "Red",
    "Light Red",
    "Dark Red",
    "Crimson",
    "Fire Red",
    "Blue",
    "Light Blue",
    "Dark Blue",
    "Navy Blue",
    "Cobalt Blue",
    "Turquoise",
    "Green",
    "Light Green",
    "Dark Green",
    "Mint Green",
    "Forest Green",
    "Yellow",
    "Light Yellow",
    "Dark Yellow",
    "Gold",
    "Black",
    "Matte Black",
    "Gloss Black",
    "White",
    "Pearl White",
    "Champagne",
    "Silver",
    "Metallic Silver",
    "Gray",
    "Light Gray",
    "Dark Gray",
    "Charcoal Gray",
    "Orange",
    "Light Orange",
    "Dark Orange",
    "Peach",
    "Purple",
    "Light Purple",
    "Dark Purple",
    "Lilac",
    "Brown",
    "Light Brown",
    "Dark Brown",
    "Chocolate",
    "Coffee",
    "Pink",
    "Light Pink",
    "Hot Pink",
    "Fuchsia",
    "Beige",
    "Champagne Beige",
    "Teal",
    "Seafoam",
    "Navy Blue",
    "Metallic Gray",
    "Gunmetal Gray",
    "Burgundy",
    "Light Burgundy",
    "Dark Burgundy",
    "Copper",
    "Rose Gold",
    "Ivory",
    "Ceramic White",
    "Light Green",
    "Bright Green",
    "Neon Green",
    "Emerald Green",
    "Bright Yellow",
    "Lime Yellow",
    "Daffodil Yellow",
    "Cream",
    "Pearl Gray",
    "Slate Gray",
    "Tans",
    "Khaki",
    "Cinnamon",
    "Rust",
    "Chocolate Brown",
    "Cotton Candy Pink",
    "Pumpkin",
    "Sunset Orange",
    "Coral",
    "Salmon",
    "Metallic Black",
    "Bamboo Beige",
    "Forest Fern",
    "Metallic Blue",
    "Steel Blue",
    "Sapphire Blue",
    "Dark Olive Green",
    "Harbor Blue",
    "Raspberry",
    "Mulberry",
    "Light Violet",
    "Pine Green",
    "Ocean Blue",
    "Slate Blue",
    "Bright Orange",
    "Neon Yellow",
    "Verdant Green",
    "Flamingo Pink",
    "Magenta",
    "Light Magenta",
    "Candy Apple Red",
    "Bright Purple",
    "Wild Strawberry",
    "Dusk Blue",
    "Winter White",
    "Spring Green",
    "Lavender",
    "Bright Aqua",
    "Metallic Purple",
    "Neon Pink",
    "Copper Red",
    "Black Pearl",
    "Champagne Pink",
    "Graffiti Green",
    "Electric Blue",
    "Golden Yellow",
    "Dark Amber",
    "Martini Olive",
    "Periwinkle",
    "Sunshine Yellow",
    "Bright Teal",
    "Grape",
    "Orchid",
    "Cottonwood Brown",
    "Twilight Gray",
    "Deep Sea Blue",
    "Pineapple Yellow",
    "Violet",
    "Maroon",
    "Deep Blue",
    "Cinnamon Brown",
    "Black Cherry",
    "Bright Red",
    "Amber",
    "Butterscotch",
    "Dandelion",
    "Mint Cream",
    "Auburn",
    "Almond",
    "Champagne Gold",
    "Lemon Lime",
    "Cotton White",
    "Pewter",
    "Copper Penny",
    "Granite",
    "Shadow Gray",
    "Blush Pink",
    "Bright Salmon",
    "Moss Green",
    "Slate Green",
    "Petrol Blue",
    "Bright Coral",
    "Cranberry",
    "Sunrise Pink",
    "Nutmeg",
    "Spruce",
    "Earthy Brown",
    "Basil Green",
    "Lapis Blue",
    "Iceberg",
    "Pastry Beige",
    "Azure",
    "Cobalt Green",
    "Bright Grapefruit",
    "Slate Violet",
    "Pastel Yellow",
    "Frosted Lavender",
    "Midnight Purple",
    "Dark Turquoise",
    "Caviar Black",
    "Coastal Blue",
    "Evergreen",
    "Papaya Orange",
    "Primrose Yellow",
    "Cherry Blossom Pink"
];

function showSuggestions(value) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    if (value) {
        const filteredColors = colors.filter(color => color.toLowerCase().startsWith(value.toLowerCase()));

        const suggestionsToShow = filteredColors.slice(0, 3);

        suggestionsToShow.forEach(color => {
            const li = document.createElement('li');
            li.textContent = color;
            li.className = "p-2 cursor-pointer hover:bg-[#6d74fc] hover:text-white";
            li.onclick = () => selectColor(color);
            suggestionsContainer.appendChild(li);
        });

        suggestionsContainer.classList.toggle('hidden', suggestionsToShow.length === 0);
    } else {
        suggestionsContainer.classList.add('hidden'); 
    }
}

function selectColor(color) {
    document.getElementById('color').value = color;
    document.getElementById('suggestions').classList.add('hidden');
}