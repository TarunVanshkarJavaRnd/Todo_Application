const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('login');

loginButton.addEventListener('click', () => loginUser());

// Function to login the user
const loginUser = () => {
    const userList = JSON.parse(localStorage.getItem("users"));
    // If user array is empty
    if (!userList) {
        alert("Please register first!");
        return;
    }

    if (!email.value || !password.value) {
        alert("All fields are mandatory!");
        return;
    }

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];
        if (user.email == email.value) {
            if (user.email == email.value && user.password == password.value) {
                let currUser = user;

                localStorage.setItem("currUser", JSON.stringify(currUser));

                // Empty the input fields
                email.value = "";
                password.value = "";


                // Redirect to todo page
                window.location.href = "./todo_page/index.html";
                return;
            }
            else {
                alert("Either email or password is incorrect");
                return;
            }
        }
    }
    alert("Please register first!");  // when user is not found
}