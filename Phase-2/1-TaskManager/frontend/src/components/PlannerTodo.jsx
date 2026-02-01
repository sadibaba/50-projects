import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Calendar, Clock, Flag, Target, Link, CalendarClock } from "lucide-react";

export default function PlannerPanel({ 
  todos: externalTodos = [], 
  setTodos: externalSetTodos = null,
  activeFilter,
  projects = []
}) {
  // Local state for todos if not provided via props
  const [internalTodos, setInternalTodos] = useState([]);
  
  // Use external todos if provided, otherwise use internal state
  const todos = externalSetTodos ? externalTodos : internalTodos;
  const setTodos = externalSetTodos || setInternalTodos;
  
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("plan");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [linkedProject, setLinkedProject] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    setSelectedTime("09:00");
  }, []);

  // Add task with Enter key
  const addTodo = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleAddTask();
    }
  };

  // Add task with button click
  const addTodoButton = () => {
    if (input.trim()) {
      console.log("Add button clicked, input:", input); // ✅ Debug log
      handleAddTask();
    } else {
      console.warn("Input is empty, task not added"); // ✅ Debug log
    }
  };

  // Common function to add task
  const handleAddTask = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        label: input.trim(),
        done: false,
        category: selectedCategory,   
        priority: selectedPriority,
        date: selectedDate,
        time: selectedTime,
        linkedProject: linkedProject || null,
        notes: "",
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log("Creating new todo:", newTodo); // ✅ Debug log

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);

      console.log("Updated todos list:", updatedTodos); // ✅ Debug log

      // Also save to localStorage
      localStorage.setItem("plannerTodos", JSON.stringify(updatedTodos));

      resetForm();
    }
  };

  const resetForm = () => {
    setInput("");
    setSelectedCategory("plan");
    setSelectedPriority("medium");
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    setSelectedTime("09:00");
    setLinkedProject("");
    setShowAdvanced(false);
    setEditIndex(null);
  };

  // Load from localStorage only on initial mount
  useEffect(() => {
    const saved = localStorage.getItem("plannerTodos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTodos(parsed);
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
  }, [setTodos]);

  const toggleDone = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { 
        ...todo, 
        done: !todo.done,
        updatedAt: new Date().toISOString()
      } : todo
    );
    setTodos(updated);
    localStorage.setItem("plannerTodos", JSON.stringify(updated));
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);
    localStorage.setItem("plannerTodos", JSON.stringify(updated));
  };

  const editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setInput(todo.label);
      setSelectedCategory(todo.category || "plan");
      setSelectedPriority(todo.priority || "medium");
      setSelectedDate(todo.date || new Date().toISOString().split('T')[0]);
      setSelectedTime(todo.time || "09:00");
      setLinkedProject(todo.linkedProject || "");
      setEditIndex(id);
      setShowAdvanced(true);
    }
  };

  const updateTodo = () => {
    if (input.trim() && editIndex !== null) {
      const updated = todos.map(todo => 
        todo.id === editIndex ? {
          ...todo,
          label: input.trim(),
          category: selectedCategory,
          priority: selectedPriority,
          date: selectedDate,
          time: selectedTime,
          linkedProject: linkedProject || null,
          updatedAt: new Date().toISOString()
        } : todo
      );
      setTodos(updated);
      localStorage.setItem("plannerTodos", JSON.stringify(updated));
      resetForm();
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const updated = [...todos];
    const [moved] = updated.splice(result.source.index, 1);
    
    // Update category based on where it's dropped
    moved.category = result.destination.droppableId;
    moved.updatedAt = new Date().toISOString();
    
    updated.splice(result.destination.index, 0, moved);
    setTodos(updated);
    localStorage.setItem("plannerTodos", JSON.stringify(updated));
  };

  // Get today's date for highlighting
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get todos for each board
  const planTodos = todos.filter(t => t.category === "plan");
  const scheduleTodos = todos.filter(t => t.category === "schedule");
  const inProgressTodos = todos.filter(t => t.category === "inProgress");
  const reviewTodos = todos.filter(t => t.category === "review");
  const doneTodos = todos.filter(t => t.done);
  const blockedTodos = todos.filter(t => t.category === "blocked");

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-4xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow">
            <CalendarClock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Planner Panel</h2>
            <p className="text-sm text-gray-600">Plan, schedule, and track your tasks</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 shadow"
          >
            {showAdvanced ? "Simple Mode" : "Advanced Mode"}
          </button>
          <button
            onClick={editIndex !== null ? updateTodo : addTodoButton}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 shadow"
          >
            {editIndex !== null ? "Update Task" : "+ Add Task"}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={addTodo}
            placeholder="What needs to be planned? Press Enter to add..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none"
            >
              <option value="plan">📝 Plan</option>
              <option value="schedule">📅 Schedule</option>
              <option value="inProgress">🔄 In Progress</option>
              <option value="review">👁️ Review</option>
              <option value="done">✅ Done</option>
              <option value="blocked">🚫 Blocked</option>
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none"
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Link className="w-4 h-4" />
                Link to Project
              </label>
              <select
                value={linkedProject}
                onChange={(e) => setLinkedProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="">None</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {editIndex !== null ? (
              <span className="text-blue-600">✏️ Editing task...</span>
            ) : (
              <span>📝 Add task with priority and scheduling</span>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High: {todos.filter(t => t.priority === 'high' && !t.done).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium: {todos.filter(t => t.priority === 'medium' && !t.done).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Boards */}
      {todos.length > 0 ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <TodoBoard
                title="📝 Plan"
                droppableId="plan"
                icon="📝"
                todos={planTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
              
              <TodoBoard
                title="📅 Schedule"
                droppableId="schedule"
                icon="📅"
                todos={scheduleTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
              
              <TodoBoard
                title="🔄 In Progress"
                droppableId="inProgress"
                icon="🔄"
                todos={inProgressTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <TodoBoard
                title="👁️ Review"
                droppableId="review"
                icon="👁️"
                todos={reviewTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
              
              <TodoBoard
                title="✅ Done"
                droppableId="done"
                icon="✅"
                todos={doneTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
              
              <TodoBoard
                title="🚫 Blocked"
                droppableId="blocked"
                icon="🚫"
                todos={blockedTodos}
                toggleDone={toggleDone}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                getPriorityColor={getPriorityColor}
                today={today}
                tomorrowStr={tomorrowStr}
                projects={projects}
              />
            </div>
          </DragDropContext>

          {/* Dashboard Summary */}
          <PlannerSummary 
            todos={todos} 
            projects={projects}
            today={today}
          />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Yet</h3>
          <p className="text-gray-500 mb-4">Add your first task using the form above</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setInput("Review project requirements");
                setSelectedCategory("plan");
                setSelectedPriority("high");
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Add Sample Task
            </button>
            <button
              onClick={() => setShowAdvanced(true)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              Show Advanced Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Rest of the code remains the same...
// TodoBoard, PlannerTodoItem, and PlannerSummary functions remain unchanged

function TodoBoard({ 
  title, 
  droppableId, 
  icon, 
  todos, 
  toggleDone, 
  deleteTodo, 
  editTodo,
  getPriorityColor,
  today,
  tomorrowStr,
  projects
}) {
  // Sort todos: high priority first, then by date
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.date || new Date()) - new Date(b.date || new Date());
  });

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </h3>
      </div>
      
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-2"
          >
            {sortedTodos.map((todo, idx) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={idx}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <PlannerTodoItem
                      todo={todo}
                      onToggle={() => toggleDone(todo.id)}
                      onDelete={() => deleteTodo(todo.id)}
                      onEdit={() => editTodo(todo.id)}
                      getPriorityColor={getPriorityColor}
                      today={today}
                      tomorrowStr={tomorrowStr}
                      projects={projects}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {todos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm">No tasks here yet</p>
        </div>
      )}
    </div>
  );
}

function PlannerTodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit,
  getPriorityColor,
  today,
  tomorrowStr,
  projects
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getDateLabel = (date) => {
    if (!date) return "";
    if (date === today) return "Today";
    if (date === tomorrowStr) return "Tomorrow";
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getLinkedProject = () => {
    if (!todo.linkedProject) return null;
    return projects.find(p => p.id == todo.linkedProject);
  };

  const linkedProject = getLinkedProject();

  return (
    <div 
      className={`p-3 rounded-xl border ${getPriorityColor(todo.priority)} transition-all hover:shadow-md ${todo.done ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={onToggle}
          className="mt-1 h-4 w-4 accent-blue-600 cursor-pointer"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`font-medium ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.label}
              </p>
              
              {/* Tags and Info */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                  {todo.priority === 'high' ? '🔴 High' : todo.priority === 'medium' ? '🟡 Medium' : '🔵 Low'}
                </span>
                
                {todo.date && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {getDateLabel(todo.date)}
                    {todo.time && ` • ${todo.time}`}
                  </span>
                )}
                
                {linkedProject && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    {linkedProject.title}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-1 ml-2">
              <button
                onClick={onEdit}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-500 hover:text-red-600"
                title="Delete"
              >
                🗑️
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Details"
              >
                {showDetails ? '▲' : '▼'}
              </button>
            </div>
          </div>
          
          {/* Details Section */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                </div>
                {todo.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1">{todo.notes}</p>
                  </div>
                )}
                {todo.tags && todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {todo.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlannerSummary({ todos, projects, today }) {
  const stats = {
    total: todos.length,
    done: todos.filter(t => t.done).length,
    inProgress: todos.filter(t => t.category === 'inProgress').length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.done).length,
    today: todos.filter(t => t.date === today).length,
    withProject: todos.filter(t => t.linkedProject).length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  // Today's tasks
  const todayTasks = todos.filter(t => t.date === today && !t.done);
  
  // Upcoming deadlines (next 3 days)
  const nextThreeDays = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });
  
  const upcomingTasks = todos.filter(t => 
    nextThreeDays.includes(t.date) && !t.done && t.date !== today
  );

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        Planning Dashboard
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-green-700">{stats.done}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-red-700">{stats.highPriority}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-purple-700">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Focus */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today's Focus ({todayTasks.length})
          </h4>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.slice(0, 3).map(todo => (
                <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => {}}
                    className="h-4 w-4 accent-blue-600"
                    readOnly
                  />
                  <span className={`text-sm ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.label}
                  </span>
                  <span className="text-xs ml-auto bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {todo.time || 'All day'}
                  </span>
                </div>
              ))}
              {todayTasks.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  + {todayTasks.length - 3} more tasks
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No tasks scheduled for today</p>
          )}
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Upcoming ({upcomingTasks.length})
          </h4>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {upcomingTasks.slice(0, 3).map(todo => (
                <div key={todo.id} className="p-2 bg-white rounded-lg">
                  <div className="text-sm text-gray-700">{todo.label}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(todo.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    {todo.priority === 'high' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        🔴 High
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {upcomingTasks.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  + {upcomingTasks.length - 3} more upcoming
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No upcoming deadlines</p>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}