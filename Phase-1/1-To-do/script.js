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
    
    let storedTasks = {};
    try {
        storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    } catch {
        storedTasks = {};
    }

    let tasks = {
        todo: Array.isArray(storedTasks.todo) ? storedTasks.todo : [],
        progress: Array.isArray(storedTasks.progress) ? storedTasks.progress : [],
        finished: Array.isArray(storedTasks.finished) ? storedTasks.finished : []
    };
    
    const todoCounter = document.querySelector('#todoCounter');
    const progressCounter = document.querySelector('#progressCounter');
    const finishedCounter = document.querySelector('#finishedCounter');
    
    const tasksContainer = document.getElementById('tasks');
    const progressContainer = document.getElementById('progressTask');
    const finishedContainer = document.querySelector('#finishedTask .overflow-y-auto');
    
    const addTodoBtn = document.getElementById('addNewTask');
    const addProgressBtn = document.getElementById('addProgress');
    const addFinishedBtn = document.querySelector('#finishedTask footer');

    const inputModal = document.getElementById('inputModal');
    const inputForm = document.getElementById('inputForm');
    const inputTitle = document.getElementById('inputTitle');
    const inputValue = document.getElementById('inputValue');
    const inputCancel = document.getElementById('inputCancel');

    let resolveInput = null;

    function closeInput(value) {
        inputModal.classList.add('hidden');
        inputModal.classList.remove('flex');
        if (resolveInput) {
            resolveInput(value);
            resolveInput = null;
        }
    }

    function askText(title, placeholder = '') {
        inputTitle.textContent = title;
        inputValue.value = '';
        inputValue.placeholder = placeholder;
        inputModal.classList.remove('hidden');
        inputModal.classList.add('flex');
        inputValue.focus();

        return new Promise((resolve) => {
            resolveInput = resolve;
        });
    }

    inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = inputValue.value.trim();
        closeInput(value || null);
    });

    inputCancel.addEventListener('click', () => closeInput(null));
    inputModal.addEventListener('click', (event) => {
        if (event.target === inputModal) closeInput(null);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !inputModal.classList.contains('hidden')) {
            closeInput(null);
        }
    });
    
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
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        
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
    
    async function addNewTask(status) {
        const taskText = await askText('Add a task', 'What needs to be done?');
        if (taskText) {
            tasks[status].push({ text: taskText, createdAt: new Date() });
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
    
    const calendarGrid = document.querySelector('#calendarGrid');
    const calendarMonth = document.querySelector('#calendarMonth');
    const calendarToday = document.querySelector('#calendarToday');
    const eventDetails = document.querySelector('#eventDetails');

    function renderCalendar(monthDate = new Date()) {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        calendarMonth.textContent = monthDate.toLocaleString(undefined, {
            month: 'long',
            year: 'numeric',
        });
        calendarGrid.innerHTML = '';

        for (let cell = 0; cell < 42; cell += 1) {
            const dayNumber = cell - firstDay + 1;

            if (dayNumber < 1 || dayNumber > daysInMonth) {
                const spacer = document.createElement('div');
                spacer.className = 'py-2 text-white/25';
                calendarGrid.appendChild(spacer);
                continue;
            }

            const dateButton = document.createElement('button');
            dateButton.type = 'button';
            dateButton.textContent = dayNumber;
            dateButton.className = 'rounded-md py-2 text-sm transition hover:bg-white/20';

            const isToday =
                dayNumber === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            if (isToday) {
                dateButton.className += ' bg-red-500 text-white font-bold';
            }

            dateButton.addEventListener('click', () => {
                calendarGrid.querySelectorAll('button').forEach((button) => {
                    button.classList.remove('bg-red-500', 'text-white', 'font-bold');
                });
                dateButton.classList.add('bg-red-500', 'text-white', 'font-bold');
                eventDetails.textContent = `No events scheduled for ${dayNumber} ${monthDate.toLocaleString(undefined, { month: 'long' })} ${year}.`;
            });

            calendarGrid.appendChild(dateButton);
        }
    }

    calendarToday.addEventListener('click', () => renderCalendar(new Date()));
    renderCalendar();
    
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
                nowPlaying.textContent = `Now playing: ${fileName.replace(/-/g, ' ')}`;
            }
        });
    });
    
    const projectAddButtons = document.querySelectorAll('.ongoing button');
    projectAddButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const section = this.closest('.ongoing');
            const sectionTitle = section.querySelector('span').textContent;
            
            if (sectionTitle === 'ongoing_projects') {
                const itemText = await askText('Add a project', 'Project name');
                if (itemText) {
                    const newProject = document.createElement('h1');
                    const icon = document.createElement('i');
                    icon.className = 'ri-computer-fill';
                    newProject.append(icon, document.createTextNode(` ${itemText}`));
                    section.appendChild(newProject);
                }
            } else if (sectionTitle === '_directions') {
                const itemText = await askText('Add a direction', 'For example: Learning hub');
                if (itemText) {
                    const newDirection = document.createElement('h1');
                    const icon = document.createElement('i');
                    let iconClass = 'ri-folder-archive-fill';
                    if (itemText.toLowerCase().includes('problem')) {
                        iconClass = 'ri-lightbulb-flash-fill';
                    } else if (itemText.toLowerCase().includes('learn')) {
                        iconClass = 'ri-graduation-cap-fill';
                    }
                    icon.className = iconClass;
                    newDirection.append(icon, document.createTextNode(` ${itemText}`));
                    section.appendChild(newDirection);
                }
            } else if (sectionTitle === '_notes') {
                const itemText = await askText('Add a note', 'Write a short note');
                if (itemText) {
                    const emptyState = document.querySelector('#notesEmpty');
                    if (emptyState) emptyState.remove();

                    const newNote = document.createElement('p');
                    newNote.className = 'px-2 py-1 text-sm';
                    newNote.textContent = `> ${itemText}`;
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
});
