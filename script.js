const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelectorAll(".clear-btn"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
//getting localstorege toso-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filters) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            //if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : ""; 
            if (filters == todo.status || filters == "all") {
                li += `<li class="task">
                <label for="${id}"> 
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                 </label>
                <div class="setting">
                    <i onclick="showMenu(this)" class="fa fa-ellipsis-v"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="fa fa-pencil"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa fa-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;

            }
        });
    }
    taskBox.innerHTML = li || `<span>You Don't have any task here`;
}

showTodo("all");

function showMenu(selectedTask) {
    //getting taskmenu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        //removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    //removing selected task from array/todos
    todos.splice("deleteId", 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
}

function updateStatus(selectedTask) {
    //getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        //updating the status of selected task to completed
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        //updating the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) { //if isEditedTask isn't true
            if (!todos) {//if todos isn't exit, pass any empty array to todos
                todos = [];
            }
            let taskIfo = {name: userTask, status: "pending"};
            todos.push(taskIfo);//adding new task to todos
        }
        else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo();
    }
});