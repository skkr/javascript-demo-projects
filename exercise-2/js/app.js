let appHolder = document.getElementById("todo-app");
let taskInput = document.getElementById("new-task");
let addTaskButton = document.getElementById("add-task");
let incompleteTasksHolder = document.getElementById("incomplete-tasks");
let completedTasksHolder = document.getElementById("completed-tasks");

function createNewTaskElement (taskString) {
  let listItem = document.createElement("li");
  listItem.className = 'task';

  let taskID = Math.floor(Math.random() * 1000000000).toString();

  let taskItem = `
    <div class="task-item">
    <input type="checkbox" id="task-${taskID}">
    <label for="task-${taskID}">${taskString}</label>
    <label for="task-${taskID}-input" class="u-hidden">${taskString}</label>
    <input type="text" id="task-${taskID}-input" value="${taskString}">
    </div>
    <div class="task-actions">
      <button class="btn-edit js-edit">Edit</button>
      <button class="btn-delete js-delete">Delete</button>
    </div>
  `;

  listItem.innerHTML = taskItem;

  return listItem;
};


function addTask () {
  // Create a task based on the task dscription
  let listItemName = taskInput.value;

  // Make sure the user entered a description
  if (listItemName.length > 0 ) {
    listItem = createNewTaskElement(listItemName);
    incompleteTasksHolder.appendChild(listItem);


    bindTaskEvents(listItem, taskCompleted);
    taskInput.value = "";

    saveLocalData();
  } else {
    displayMessage('Please enter a task description', 'error');
  }
};

function editTask () {
  let listItem = this.closest(".task");
  let editInput = listItem.querySelector("input[type=text");
  let label = listItem.querySelector("label");
  let button = listItem.getElementsByTagName("button")[0];

  let containsClass = listItem.classList.contains("js-editMode");
  if (containsClass) {
    label.innerText = editInput.value
    button.innerText = "Edit";
    setTimeout(() => {
      saveLocalData();
    }, 200);
  } else {
    editInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        button.focus();
      }
    });

    editInput.value = label.innerText
    button.innerText = "Save";
  }

  listItem.classList.toggle("js-editMode");
};

function deleteTask () {
  let listItem = this.closest(".task");
  let ul = listItem.parentNode;
  ul.removeChild(listItem);

  if (incompleteTasksHolder.childElementCount == 0) {
    displayMessage("All done!", "success");
  }

  saveLocalData();

};

function taskCompleted () {
  let listItem = this.closest(".task");
  let ul = listItem.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);

  if (incompleteTasksHolder.childElementCount == 0) {
    displayMessage("All done!", "success");
  }

  saveLocalData();
};

function taskIncomplete () {
  let listItem = this.closest(".task");
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  saveLocalData();
};

function bindTaskEvents (taskListItem, checkBoxEventHandler) {
  let checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  let editButton = taskListItem.querySelectorAll("button.js-edit")[0];
  let deleteButton = taskListItem.querySelectorAll("button.js-delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

function displayMessage (textString, type) {
  // Currently the only suported types are "success" and "error"
  // If other type is used the notification will have a generic style
  let delay = 3000;
  let notification = appHolder.querySelector(".notification") || document.createElement("div");

  notification.className = "";
  notification.classList.add("notification", "notification--"+type);
  notification.innerText = textString;

  appHolder.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
  }, delay);

  setTimeout(() => {
    notification.remove()
  }, delay + 30);
}

appHolder.onload = retrieveLocalData();

function saveLocalData() {
      let pendingTasks = document.getElementById("incomplete-tasks");
      let pendingTasksContent = pendingTasks.innerHTML;
      let finishedTasks = document.getElementById("completed-tasks");
      let finishedTasksContent = finishedTasks.innerHTML;

      localStorage.incompleteTasksContent = pendingTasksContent;
      localStorage.finishedTasksContent = finishedTasksContent;

      console.info('Data saved')
}

function retrieveLocalData() {
  let pendingTasks = document.getElementById("incomplete-tasks");
  let finishedTasks = document.getElementById("completed-tasks");

  if (localStorage.pendingTasksContent !== undefined || localStorage.pendingTasksContent !== null) {
    pendingTasks.innerHTML = localStorage.incompleteTasksContent;
  } else {
    pendingTasks.innerHTML = '';
  }

  if (localStorage.finishedTasksContent !== undefined || localStorage.finishedTasksContent !== null) {
    finishedTasks.innerHTML = localStorage.finishedTasksContent;
  } else {
    finishedTasks.innerHTML = '';
  }
}

for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (let i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

