
const addButton = document.getElementById('add-task-btn');
const sortByPriorityButton = document.getElementById('sort-priority-btn');
const logoutButton = document.getElementById('logout');

// Code to prevent selecting task date previous to today
let currentDate = new Date().toISOString().split('T')[0];
let currentTime = new Date().toISOString().split("T")[1].split(".")[0]; 
document.getElementById('task-date').min = `${currentDate}T${currentTime}`;

//Event listener to add a task in the list
addButton.addEventListener('click', () => addTask());

// Event listener to sort the task by priority
sortByPriorityButton.addEventListener('click', () => sortByPriority());

// Event listener for logout button
logoutButton.addEventListener('click', () => logoutApp());


//Function to add the task the list
const addTask = () => {
    const taskInput = document.getElementById('task-input').value;
    const priority = document.getElementById('set-priority').value;
    const taskDate = document.getElementById('task-date').value;

    // check for empty task input
    if (taskInput.trim() !== '') {
        // Adding the task in the list when input is not empty
        const taskList = document.getElementById('task-list-container');
        let priorityRank = '';
        if (priority == 'none') {
            alert('please set the priority');
            return;
        }
        else if (priority == 1) {
            priorityRank = 'High';
        }
        else if (priority == 2) {
            priorityRank = 'Medium';
        }
        else if (priority == 3) {
            priorityRank = 'Low';
        }

        if(!taskDate){
            alert('Please select the date');
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = `
                <div class="checkbox">
                    <input type="checkbox" onchange="changeCheckbox(this)" />
                </div>
                <div class="task-text">${taskInput}</div>
                <div class="priority" id=${priority}>${priorityRank}</div>
                <div class="task-date">${taskDate}</div>
                <div class="actions">
                    <div class="edit">
                        <span class="material-symbols-outlined" onclick="editTask(this)">
                            edit
                        </span>
                    </div>
                    <div class="delete">
                        <span class="material-symbols-outlined" onclick="deleteTask(this)">
                            delete
                        </span>
                    </div>
                </div>
        `;

        taskList.appendChild(li);

        document.getElementById('task-input').value = '';
        document.getElementById('set-priority').value = 'none';
        document.getElementById('task-date').value = '';

        // code to set reminder
        if (taskDate !== '') {
            const now = new Date();
            const taskDateObject = new Date(taskDate);
            if (taskDateObject > now) {
                const timeDifference = taskDateObject - now;
                setTimeout(() => {
                    alert(`Reminder: ${taskInput} is due now!`);
                }, timeDifference);
            }
        }

        saveTask();
    }
}

// function to change the className of checkbox when is checked/unchecked
const changeCheckbox = (checkbox) => {
    const taskText = checkbox.parentElement.nextElementSibling; // Get the task text element

    if (checkbox.checked) {
        taskText.classList.add('completed');
    } else {
        taskText.classList.remove('completed');
    }
    saveTask();
}

// Function to sort the task by priority
const sortByPriority = () => {
    const allTasks = [...document.querySelectorAll('#task-list-container li')];
    if (allTasks.length == 0) {
        return;
    }

    allTasks.sort((a, b) => {
        return a.childNodes[5].id - b.childNodes[5].id;
    });

    const taskList = document.getElementById('task-list-container');
    taskList.innerHTML = '';

    // Now append the sorted tasks in the list
    allTasks.forEach((task) => {
        return taskList.appendChild(task);
    })
}

// Function to filter the task
const filterTask = (taskStatus) => {
    const allTasks = [...document.querySelectorAll('#task-list-container li')];

    allTasks.forEach((task) => {
        const checkbox = task.querySelector('.checkbox input');
        const completedTask = checkbox.checked;
        if ((taskStatus == 'all') || (taskStatus == 'completed' && completedTask) || (taskStatus == 'pending' && !completedTask)) {
            task.style.display = 'flex'
        }
        else {
            task.style.display = 'none'
        }
    })
}


// Function to delete the task
const deleteTask = (task) => {
    const li = task.parentElement.parentElement.parentElement;
    li.remove();
    saveTask();
}


// Function to edit the task
const editTask = (task) => {
    const closeModalButton = document.getElementById("close-modal");
    const modal = document.getElementById("modal");
    const saveEditedTaskButton = document.getElementById('save-edited-task');

    modal.style.display = "block";
    const li = task.parentElement.parentElement.parentElement;

    document.getElementById('edit-task-input').value = li.children[1].innerText;


    saveEditedTaskButton.addEventListener('click', () => {
        li.children[1].innerText = document.getElementById('edit-task-input').value;
        // To save changes in local storage
        saveTask();
    })
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal if the user clicks outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

}


// Function to save the task in the 
const saveTask = () => {
    const allTasks = [...document.querySelectorAll('#task-list-container li')];

    const currUser = JSON.parse(localStorage.getItem('currUser'));

    const localTask = allTasks.map((task) => {
        const taskPriority = task.querySelector('.priority').innerText;
        const priority = task.querySelector('.priority').id;
        const taskText = task.querySelector('.task-text').innerText;
        const isCompleted = task.querySelector('.checkbox input').checked;
        const taskDate = task.querySelector('.task-date').innerText;
        return { priority, taskText, isCompleted, taskPriority, taskDate };
    })
    currUser.todoTask = localTask;
    localStorage.setItem('currUser', JSON.stringify(currUser));

    // now save the curruser data to user array
    const allUsers = JSON.parse(localStorage.getItem('users'));
    for (let i = 0; i < allUsers.length; i++) {
        let user = allUsers[i];
        if (user.email === currUser.email) {
            user.todoTask = currUser.todoTask;
        }
    }
    localStorage.setItem('users', JSON.stringify(allUsers));
}

// function to render task on the screen
function renderTask() {
    const currUser = JSON.parse(localStorage.getItem('currUser'));
    const savedTasks = currUser.todoTask;
    const taskList = document.getElementById('task-list-container');

    savedTasks.forEach((task) => {
        const li = document.createElement('li');
        li.innerHTML = `
                <div class="checkbox">
                    <input type="checkbox" onchange="changeCheckbox(this)" ${task.isCompleted ? "checked" : ''} />
                </div>
                <div class="task-text ${task.isCompleted ? "completed" : ''}">${task.taskText}</div>
                <div class="priority" id=${task.priority}>${task.taskPriority}</div>
                <div class="task-date">${task.taskDate}</div>
                <div class="actions">
                    <div class="edit">
                        <span class="material-symbols-outlined" onclick="editTask(this)">
                            edit
                        </span>
                    </div>
                    <div class="delete">
                        <span class="material-symbols-outlined" onclick="deleteTask(this)">
                            delete
                        </span>
                    </div>
                </div>
        `;
        taskList.appendChild(li);
    })
}

renderTask();

//function to logout from todo app
const logoutApp = () => {
    localStorage.removeItem("currUser");
    window.location.href = "../index.html";
    alert("Logged out successfully!");
}