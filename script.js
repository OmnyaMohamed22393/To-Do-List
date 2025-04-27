var taskInput = document.querySelector("#inputTask");
var taskDescription = document.querySelector("#inputDescription");
var btnAdd = document.querySelector("#btnAdd");
var searchInput = document.querySelector("#search");
var Tasks = [];
var btnUpdate = document.querySelector("#btnUpdate");
var currentId;
var newIndex = 0;

if(localStorage.getItem("Tasks")!=null) {
    Tasks = JSON.parse(localStorage.getItem("Tasks"));
    if(Tasks.length>0){
        newIndex = Tasks[Tasks.length - 1].id;
    }
    else {
        newIndex = 0;
    }
    taskListDisplay();
}


function validateInput() {
    const titleRegex = /^[A-Z][a-z]{2,8}$/;
    const descriptionRegex = /^[A-Za-z\s]{20,}$/;

    var isValid = true;
    var errorMessage = "";

    if(!titleRegex.test(taskInput.value)) {
        errorMessage += "Title must start with Capital letter and be 3-9 character long (e.g., Study, Work).\n";
        isValid = false;
    }

    if(!descriptionRegex.test(taskDescription.value)) {
        errorMessage += "Description must be more than 20 character long and contain only letters and spaces (e.g., Prepare for exam).";
        isValid = false;
    }

    if(!isValid) {
        alert(errorMessage);
    }
    return isValid;
}

btnAdd.addEventListener("click", function() {

    if(!validateInput()) {
        return;
    }
    newIndex++;
    var todo = {
        title: taskInput.value,
        description: taskDescription.value,
        isDone: false,
        id: newIndex,
    };

    Tasks.push(todo);
    taskListDisplay();
    clearInputs();
    setLocalStorage();
});

function setLocalStorage() {
    localStorage.setItem("Tasks", JSON.stringify(Tasks));
}

function taskListDisplay(filteredTasks = Tasks) {
    var cartona =``;
    for(var i=0; i<filteredTasks.length; i++) {
        cartona += `<div class="data view"><h4 class="${filteredTasks[i].isDone ? 'done' : ''}">${filteredTasks[i].title}</h4>
        <div class="task-actions">
        <button class="custom" onClick="Delete(${filteredTasks[i].id})"><i class="fa-solid fa-trash fa-xl" style="color: #4CAF50;"></i></button>
        <button class="custom" onClick="completed(${filteredTasks[i].id})"><i class="fa-solid fa-check fa-xl" style="color: #4CAF50;"></i></button>
        <button class="custom" onClick="Update(${filteredTasks[i].id})"><i class="fa-solid fa-pen fa-xl" style="color: #4CAF50;"></i></button>
        </div> </div>`;
    }
    document.querySelector(".taskList").innerHTML = cartona;

}

function Delete(id){
    var index = Tasks.findIndex(function(task) {
        return task.id === id;
    });
    if (index !== -1) {
        Tasks.splice(index, 1);
        setLocalStorage();
        taskListDisplay();
    }
}

function Update(id) {
    var index = Tasks.findIndex(function(task){
        return task.id === id;
    });
    if(index !== -1) {
        taskInput.value = Tasks[index].title;
        taskDescription.value = Tasks[index].description;
        currentId = id;
        btnAdd.style.display = "none";
        btnUpdate.style.display = "block";
    }
}

btnUpdate.addEventListener("click", function() {

    if(!validateInput()) {
        return;
    }

    var index = Tasks.findIndex(function(task){
        return task.id === currentId;
    });
    if(index !== -1) {
        Tasks[index].title = taskInput.value;
        Tasks[index].description = taskDescription.value;
        taskListDisplay();
        btnUpdate.style.display = "none";
        btnAdd.style.display = "block";
        clearInputs();
        setLocalStorage();
    }
});


function clearInputs() {
    taskInput.value = "";
    taskDescription.value = "";
    searchInput.value = "";
}


function completed(id) {
    var index = Tasks.findIndex(function(task) {
        return task.id === id;
    });
    if (index !== -1) {
        Tasks[index].isDone = !Tasks[index].isDone;
        setLocalStorage();
        taskListDisplay();
    }

}

searchInput.addEventListener("input", function() {
    var searchText = searchInput.value.toLowerCase();
    var filteredTasks = Tasks.filter(function(task) {
        return task.title.toLowerCase().includes(searchText);
                // task.description.toLowerCase().includes(searchText);  ///// Search for Description
    });
    taskListDisplay(filteredTasks);
});

