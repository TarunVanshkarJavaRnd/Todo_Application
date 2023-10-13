const fullName = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const signupButton = document.getElementById('signup-btn');

// Fetching user array from local storage or creating it if it is not present
const userList = JSON.parse(localStorage.getItem("users")) || [];       // Getting it in json format array


// Event listener to signup the todo app
signupButton.addEventListener('click', () => saveData());

// Function to check email is already present in local storage or not
function duplicateEmail(email) {
    return userList.some((user) => {
        return user.email === email;
    });
}


// Function to save user in local storage
const saveData = () => {
    if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
        alert('All fields are mandatory');
        return;
    }

    //password validation
    if (password.value !== confirmPassword.value) {
        alert('Password does not match');
        return;
    }

    // Check for duplicacy of email in local storage
    if (duplicateEmail(email.value)) {
        alert("User is already registered with given email!");
        return;
    }

    // If above conditions satisfied then we can create a new user object and add it to localStorage
    const newUser= {
        name: fullName.value,
        email: email.value,
        password: password.value,
        todoTask: []
    }

    userList.push(newUser);

    // Save updated user array in localStorage in strin
    localStorage.setItem("users", JSON.stringify(userList));

    // After signing up redirecting to login page
    window.location.href = "../index.html";
}