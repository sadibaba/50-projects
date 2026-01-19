document.addEventListener('DOMContentLoaded', function() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const hourHand = document.getElementById('hour');
        const minuteHand = document.getElementById('mintue'); // Note: typo in ID
        const secondHand = document.getElementById('second');
        
        const hourDeg = (hours * 30) + (minutes * 0.5);
        const minuteDeg = (minutes * 6) + (seconds * 0.1);
        const secondDeg = seconds * 6;
        
        hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
        minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
        secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {
        todo: [],
        progress: [],
        finished: []
    };
    
    const todoCounter = document.querySelector('#todoCounter');
    const progressCounter = document.querySelector('#progressCounter');
    const finishedCounter = document.querySelectorAll('#finishedCounter')[1];
    
    const tasksContainer = document.getElementById('tasks');
    const progressContainer = document.getElementById('progressTask');
    const finishedContainer = document.querySelector('.bg-emerald-900\\/10');
    
    const addTodoBtn = document.getElementById('addNewTask');
    const addProgressBtn = document.getElementById('addProgress');
    const addFinishedBtn = document.querySelector('.bg-emerald-600\\/20');
    
    function updateCounters() {
        todoCounter.textContent = `(${tasks.todo.length})`;
        progressCounter.textContent = `(${tasks.progress.length})`;
        finishedCounter.textContent = `(${tasks.finished.length})`;
    }
    
    function renderTasks() {
        tasksContainer.innerHTML = '';
        progressContainer.innerHTML = '';
        finishedContainer.innerHTML = '';
        
        tasks.todo.forEach((task, index) => {
            const taskElement = createTaskElement(task, 'todo', index);
            tasksContainer.appendChild(taskElement);
        });
        
        tasks.progress.forEach((task, index) => {
            const taskElement = createTaskElement(task, 'progress', index);
            progressContainer.appendChild(taskElement);
        });
        
        tasks.finished.forEach((task, index) => {
            const taskElement = createTaskElement(task, 'finished', index);
            finishedContainer.appendChild(taskElement);
        });
        
        updateCounters();
        saveTasks();
    }
    
    function createTaskElement(task, status, index) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item bg-white/10 p-2 rounded mb-1 text-white text-sm cursor-pointer hover:bg-white/20';
        taskDiv.textContent = task.text;
        
        taskDiv.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showTaskContextMenu(e, status, index);
        });
        
        taskDiv.addEventListener('click', function() {
            moveTask(status, index);
        });
        
        return taskDiv;
    }
    
    function showTaskContextMenu(e, status, index) {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu fixed bg-gray-800 text-white p-2 rounded shadow-lg z-50';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        
        if (status !== 'todo') {
            const moveToTodo = document.createElement('div');
            moveToTodo.className = 'p-1 hover:bg-gray-700 cursor-pointer';
            moveToTodo.textContent = 'Move to To-Do';
            moveToTodo.addEventListener('click', function() {
                moveTaskTo(status, index, 'todo');
                contextMenu.remove();
            });
            contextMenu.appendChild(moveToTodo);
        }
        
        if (status !== 'progress') {
            const moveToProgress = document.createElement('div');
            moveToProgress.className = 'p-1 hover:bg-gray-700 cursor-pointer';
            moveToProgress.textContent = 'Move to In Progress';
            moveToProgress.addEventListener('click', function() {
                moveTaskTo(status, index, 'progress');
                contextMenu.remove();
            });
            contextMenu.appendChild(moveToProgress);
        }
        
        if (status !== 'finished') {
            const moveToFinished = document.createElement('div');
            moveToFinished.className = 'p-1 hover:bg-gray-700 cursor-pointer';
            moveToFinished.textContent = 'Move to Finished';
            moveToFinished.addEventListener('click', function() {
                moveTaskTo(status, index, 'finished');
                contextMenu.remove();
            });
            contextMenu.appendChild(moveToFinished);
        }
        
        const deleteTask = document.createElement('div');
        deleteTask.className = 'p-1 hover:bg-red-700 cursor-pointer';
        deleteTask.textContent = 'Delete Task';
        deleteTask.addEventListener('click', function() {
            deleteTaskFrom(status, index);
            contextMenu.remove();
        });
        contextMenu.appendChild(deleteTask);
        
        document.body.appendChild(contextMenu);
        
        document.addEventListener('click', function closeMenu() {
            contextMenu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }
    
    function moveTask(status, index) {
        let nextStatus;
        
        if (status === 'todo') {
            nextStatus = 'progress';
        } else if (status === 'progress') {
            nextStatus = 'finished';
        } else {
            return; 
        }
        
        moveTaskTo(status, index, nextStatus);
    }
    
    function moveTaskTo(fromStatus, index, toStatus) {
        const task = tasks[fromStatus][index];
        tasks[fromStatus].splice(index, 1);
        tasks[toStatus].push(task);
        renderTasks();
    }
    
    function deleteTaskFrom(status, index) {
        tasks[status].splice(index, 1);
        renderTasks();
    }
    
    function addNewTask(status) {
        const taskText = prompt('Enter task:');
        if (taskText && taskText.trim() !== '') {
            tasks[status].push({ text: taskText.trim(), createdAt: new Date() });
            renderTasks();
        }
    }
    
    addTodoBtn.addEventListener('click', function() {
        addNewTask('todo');
    });
    
    addProgressBtn.addEventListener('click', function() {
        addNewTask('progress');
    });
    
    addFinishedBtn.addEventListener('click', function() {
        addNewTask('finished');
    });
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    renderTasks();
    
    const calendarDates = document.querySelectorAll('.bg-white\\/10, .bg-red-500');
    calendarDates.forEach(date => {
        date.addEventListener('click', function() {
            calendarDates.forEach(d => {
                d.classList.remove('bg-red-500', 'text-white', 'font-bold');
                d.classList.add('bg-white/10');
            });
            
            this.classList.remove('bg-white/10');
            this.classList.add('bg-red-500', 'text-white', 'font-bold');
            
            showEventsForDate(this.textContent);
        });
    });
    
    function showEventsForDate(date) {
        alert(`Events for October ${date}, 2025:\n- No events scheduled`);
    }
    
    const audioElements = document.querySelectorAll('audio');
    let currentAudio = null;
    
    audioElements.forEach(audio => {
        audio.addEventListener('play', function() {
            if (currentAudio && currentAudio !== this) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = this;
            
            const nowPlaying = document.querySelector('.text-white.text-xs');
            const source = this.querySelector('source');
            if (source) {
                const fileName = source.src.split('/').pop().split('.')[0];
                nowPlaying.textContent = `🎵 Now Playing: ${fileName.replace(/-/g, ' ')}`;
            }
        });
    });
    
    const projectAddButtons = document.querySelectorAll('.ongoing');
    projectAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.ongoing');
            const sectionTitle = section.querySelector('span').textContent;
            
            let itemText = '';
            if (sectionTitle === 'ongoing_projects') {
                itemText = prompt('Enter project name:');
                if (itemText && itemText.trim() !== '') {
                    const newProject = document.createElement('h1');
                    newProject.innerHTML = `<i class="ri-computer-fill"></i> ${itemText.trim()}`;
                    section.appendChild(newProject);
                }
            } else if (sectionTitle === '_directions') {
                itemText = prompt('Enter direction name:');
                if (itemText && itemText.trim() !== '') {
                    const newDirection = document.createElement('h1');
                    let iconClass = 'ri-folder-archive-fill';
                    if (itemText.toLowerCase().includes('problem')) {
                        iconClass = 'ri-lightbulb-flash-fill';
                    } else if (itemText.toLowerCase().includes('learn')) {
                        iconClass = 'ri-graduation-cap-fill';
                    }
                    newDirection.innerHTML = `<i class="${iconClass}"></i> ${itemText.trim()}`;
                    section.appendChild(newDirection);
                }
            } else if (sectionTitle === '_notes') {
                itemText = prompt('Enter note:');
                if (itemText && itemText.trim() !== '') {
                    const newNote = document.createElement('p');
                    newNote.className = 'px-2 py-1 text-sm';
                    newNote.textContent = `> ${itemText.trim()}`;
                    section.appendChild(newNote);
                }
            }
        });
    });
    
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
    }
    
    const today = new Date();
    if (today.getMonth() === 9 && today.getFullYear() === 2025) {
        const todayElement = document.querySelector(`.bg-white\\/10:contains("${today.getDate()}")`);
        if (todayElement) {
            todayElement.classList.remove('bg-white/10');
            todayElement.classList.add('bg-red-500', 'text-white', 'font-bold');
        }
    }
});

Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};