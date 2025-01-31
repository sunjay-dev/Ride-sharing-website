const showPassword = document.getElementById('show-password');
const eyeImage = document.getElementById('eyeImage');
const CloseEyeImage = document.getElementById('CloseEyeImage');
const password = document.getElementById('password');

showPassword.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        eyeImage.classList.add('hidden');
        CloseEyeImage.classList.remove('hidden');

    } else {
        password.type = 'password';
        eyeImage.classList.remove('hidden');
        CloseEyeImage.classList.add('hidden');
    }
});

let step = 1; 

function previousStep() {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');

    document.getElementById('next-btn').classList.remove('hidden');
    document.getElementById('signup-btn').classList.add('hidden');
    document.getElementById('back-btn').classList.add('hidden');

    document.querySelectorAll('#step-2 input').forEach((element) => {
        element.type = "hidden";
    })
    step = 1;
}
document.getElementById('next-btn').addEventListener('click', (e) => {
    const form = document.getElementById('signup-form');
    if (form.checkValidity()) {
        e.preventDefault();

        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');

        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('signup-btn').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        let arr = ["text", "tel", "file"]
        let i = 0;
        document.querySelectorAll('#step-2 input').forEach((element) => {
            element.type = arr[i++];
        })
        step = 2;
    }
})

function closeErrorPage() {
    document.querySelector("div[role='alert']").className += " hidden";
}


const departments = [
    "Civil Engineering",
    "Computer Systems Engineering",
    "Electrical Engineering",
    "Electronic Engineering",
    "Software Engineering",
    "Mechanical Engineering",
    "Mechatronics Engineering",
    "Telecommunication Engineering",
    "Chemical Engineering",
    "Environmental Engineering",
    "Bioinformatics Engineering",
    "Industrial Engineering",
    "Information Technology",
    "Architecture",
    "Urban and Regional Planning",
    "Management Sciences",
    "Mathematics",
    "Physics",
    "Chemistry",
    "English"
];
    
function autocomplete(inputElement) {
    let currentFocus;

    inputElement.addEventListener("input", function() {
        const value = this.value;
        closeAllLists();
        if (!value) return false;

        currentFocus = -1;
        const autocompleteList = document.getElementById("autocomplete-list");
        autocompleteList.innerHTML = ""; 
        autocompleteList.classList.remove("hidden");

        departments.forEach((country) => {
            if (country.toLowerCase().startsWith(value.toLowerCase())) {
                const itemElement = document.createElement("div");
                itemElement.innerHTML = country;
                itemElement.classList.add("cursor-pointer", "p-2", "hover:bg-blue-100");
                itemElement.addEventListener("click", function() {
                    inputElement.value = country;
                    closeAllLists();
                });
                autocompleteList.appendChild(itemElement);
            }
        });

        if (autocompleteList.children.length === 0) {
            autocompleteList.classList.add("hidden"); 
        }
    });

    inputElement.addEventListener("keydown", function(e) {
        const items = document.querySelectorAll("#autocomplete-list div");
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

    inputElement.addEventListener("blur", function() {
        const value = this.value;
        if (!departments.includes(value)) {
            this.value = "";
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
        const autocompleteList = document.getElementById("autocomplete-list");
        autocompleteList.innerHTML = ""; 
        autocompleteList.classList.add("hidden");
    }

    document.addEventListener("click", function(e) {
        closeAllLists();
    });
}

autocomplete(document.getElementById("country-input"));