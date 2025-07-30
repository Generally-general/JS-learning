let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));

  if(storedTasks) {
    storedTasks.forEach((task) => tasks.push(task));
    syncRender();
  }
})

const syncRender = () => {
  updateTaskList();
  updateStats();
  saveTasks();
}

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}



const addTask = () => {
  const taskInput = document.getElementById("task-input");
  const text = taskInput.value.trim();
  if(!text) return;

  
  tasks.push({text: text, completed: false});
  taskInput.value = "";
  syncRender();
}

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  syncRender();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  syncRender();
}

const editTask = (index) => {
  const taskInput = document.getElementById('task-input');
  taskInput.value = tasks[index].text;
  tasks.splice(index, 1);
  syncRender();
};

const updateStats = () => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const progressBar = document.getElementById('progress');
  progressBar.style.width = `${progress}%`;

  const numbers = document.getElementById('numbers');

  numbers.innerText = `${completedTasks} / ${totalTasks}`;
}

const updateTaskList = () => {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}/>
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <img src="./img/edit.png" onclick="editTask(${index})"/>
          <img src="./img/bin.png" onclick="deleteTask(${index})"/>
        </div>
      </div>
    `;
    listItem.addEventListener('change', () => toggleTaskComplete(index))
    taskList.append(listItem);
  })
}

document.getElementById('add-task-btn').addEventListener('click', function (e) {
  e.preventDefault();

  addTask();
})