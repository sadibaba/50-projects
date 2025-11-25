const addTask = document.getElementById('addNewTask')
const tasks = document.getElementById('tasks')
const counter = document.getElementById('counter')  // 👈 counter select karo

addTask.addEventListener('click', () => {
  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = "Add Here Your Task"

  const enterBtn = document.createElement('button')
  enterBtn.textContent = '⏎'

  const wrapper = document.createElement('div')
  wrapper.appendChild(input)
  wrapper.appendChild(enterBtn)
  tasks.appendChild(wrapper)

  const addNew = () => {
    if (input.value.trim() !== '') {
      const taskWrapper = document.createElement('div')
      taskWrapper.style.display = "flex"
      taskWrapper.style.justifyContent = "space-between"
      taskWrapper.style.alignItems = "center"

      const task = document.createElement('h1')
      task.textContent = input.value
      task.className = 'bg-purple-900/50 break-words p-2 w-full'

      const delBtn = document.createElement('button')
      delBtn.textContent = "Delete"
      delBtn.style.display = "none"
      delBtn.style.background = "rgba(255,0,0,0.6)"
      delBtn.style.color = "white"
      delBtn.style.border = "none"
      delBtn.style.padding = "4px 8px"
      delBtn.style.borderRadius = "4px"
      delBtn.style.cursor = "pointer"
      delBtn.style.marginLeft = "8px"

      // hover show/hide
      taskWrapper.addEventListener('mouseenter', () => {
        delBtn.style.display = "inline-block"
      })
      taskWrapper.addEventListener('mouseleave', () => {
        delBtn.style.display = "none"
      })

      // delete functionality + counter decrease
      delBtn.addEventListener('click', () => {
        taskWrapper.remove()
        updateCounter()
      })

      taskWrapper.appendChild(task)
      taskWrapper.appendChild(delBtn)
      tasks.appendChild(taskWrapper)

      wrapper.remove()
      updateCounter()   // 👈 counter update jab naya task add ho
    }
  }

  enterBtn.addEventListener('click', addNew)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addNew()
  })
})

// 👇 helper function
function updateCounter() {
  const totalTasks = tasks.querySelectorAll('h1').length
  counter.textContent = `(${totalTasks})`
}