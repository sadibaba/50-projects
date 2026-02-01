import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Calendar, Clock, Flag, Target, Link, CalendarClock, Edit2, Trash2, ChevronDown, ChevronUp, Check, X, MoreVertical, AlertCircle } from "lucide-react";

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
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Refs for click outside detection
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    setSelectedTime("09:00");
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add task with Enter key
  const addTodo = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleAddTask();
      setShowSuggestions(false);
    }
  };

  // Add task with button click
  const addTodoButton = () => {
    if (input.trim()) {
      handleAddTask();
      setShowSuggestions(false);
    } else {
      // Input field focus karo agar empty hai
      inputRef.current?.focus();
      setShowSuggestions(true);
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
        notes: notes.trim(),
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem("plannerTodos", JSON.stringify(updatedTodos));

      resetForm();
      
      // Success feedback
      showToast("Task added successfully!", "success");
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
    setNotes("");
    setTags("");
    setShowAdvanced(false);
    setEditIndex(null);
    setShowSuggestions(false);
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
    
    const todo = todos.find(t => t.id === id);
    if (todo) {
      showToast(`Task marked as ${!todo.done ? "done" : "pending"}!`, "info");
    }
  };

  const deleteTodo = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updated = todos.filter(todo => todo.id !== id);
      setTodos(updated);
      localStorage.setItem("plannerTodos", JSON.stringify(updated));
      showToast("Task deleted!", "error");
    }
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
      setNotes(todo.notes || "");
      setTags(todo.tags?.join(', ') || "");
      setEditIndex(id);
      setShowAdvanced(true);
      setShowSuggestions(false);
      
      // Scroll to top for editing
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Editing task...", "info");
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
          notes: notes.trim(),
          tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
          updatedAt: new Date().toISOString()
        } : todo
      );
      setTodos(updated);
      localStorage.setItem("plannerTodos", JSON.stringify(updated));
      resetForm();
      showToast("Task updated successfully!", "success");
    }
  };

  const cancelEdit = () => {
    resetForm();
    showToast("Edit cancelled", "info");
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
    
    showToast(`Task moved to ${getCategoryName(result.destination.droppableId)}`, "info");
  };

  const getCategoryName = (category) => {
    const names = {
      'plan': 'Plan',
      'schedule': 'Schedule',
      'inProgress': 'In Progress',
      'review': 'Review',
      'done': 'Done',
      'blocked': 'Blocked'
    };
    return names[category] || category;
  };

  // Toast notification
  const showToast = (message, type = "info") => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white font-medium animate-slideIn ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-gray-500'}`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '💡'}
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Quick suggestions for tasks
  const quickSuggestions = [
    "Complete project documentation",
    "Review team updates",
    "Prepare for meeting",
    "Follow up on emails",
    "Plan next week tasks",
    "Call with client",
    "Submit weekly report",
    "Update project timeline"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // Get today's date for highlighting
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl md:rounded-4xl shadow-lg">
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow">
            <CalendarClock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Planner Panel</h2>
            <p className="text-xs md:text-sm text-gray-600">Plan, schedule, and track your tasks</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 md:px-4 md:py-2 bg-white text-gray-700 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-50 shadow flex items-center gap-1"
          >
            {showAdvanced ? "📱 Simple" : "⚙️ Advanced"}
          </button>
          
          {editIndex !== null && (
            <button
              onClick={cancelEdit}
              className="px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-200 shadow flex items-center gap-1"
            >
              <X className="w-3 h-3 md:w-4 md:h-4" />
              Cancel
            </button>
          )}
          
          <button
            onClick={editIndex !== null ? updateTodo : addTodoButton}
            className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs md:text-sm font-medium hover:opacity-90 shadow flex items-center gap-1"
          >
            {editIndex !== null ? (
              <>
                <Check className="w-3 h-3 md:w-4 md:h-4" />
                Update
              </>
            ) : (
              <>
                <span className="text-lg">+</span>
                Add Task
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={addTodo}
              onFocus={handleInputFocus}
              placeholder={editIndex !== null ? "Edit your task..." : "What needs to be done? Press Enter to add..."}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && input.length === 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white p-3 rounded-xl shadow-lg border z-50 animate-fadeIn"
              >
                <p className="text-xs text-gray-500 mb-2 font-medium">💡 Quick suggestions:</p>
                <div className="space-y-1">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="text-gray-400">→</span>
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Close suggestions
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 md:flex-none">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none appearance-none"
              >
                <option value="plan">📝 Plan</option>
                <option value="schedule">📅 Schedule</option>
                <option value="inProgress">🔄 In Progress</option>
                <option value="review">👁️ Review</option>
                <option value="done">✅ Done</option>
                <option value="blocked">🚫 Blocked</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            <div className="relative flex-1 md:flex-none">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none appearance-none"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Link className="w-4 h-4" />
                Project
              </label>
              <select
                value={linkedProject}
                onChange={(e) => setLinkedProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="">No Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Edit2 className="w-4 h-4" />
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            
            {showAdvanced && (
              <div className="md:col-span-2 lg:col-span-4 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  🏷️ Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="work, urgent, personal (comma separated)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
                />
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
          <div className="text-xs md:text-sm text-gray-600">
            {editIndex !== null ? (
              <span className="text-blue-600 flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Editing task... 
              </span>
            ) : (
              <span className="flex items-center gap-1">
                {input.trim() ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Ready to add: <span className="font-medium">"{input}"</span></span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">💡</span>
                    <span>Type your task above or click for suggestions</span>
                  </>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-3 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
              <span>High: {todos.filter(t => t.priority === 'high' && !t.done).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium: {todos.filter(t => t.priority === 'medium' && !t.done).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
              <span>Low: {todos.filter(t => t.priority === 'low' && !t.done).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Boards */}
      {todos.length > 0 ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Top Row Boards - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
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

            {/* Bottom Row Boards - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
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
        <div className="text-center py-8 md:py-12 bg-white rounded-2xl shadow">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4">📋</div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No Tasks Yet</h3>
          <p className="text-gray-500 mb-4 text-sm md:text-base">Add your first task using the form above</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              onClick={() => {
                setInput("Complete project documentation");
                setSelectedCategory("plan");
                setSelectedPriority("high");
                inputRef.current?.focus();
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
            >
              Add Sample Task
            </button>
            <button
              onClick={() => {
                setShowAdvanced(true);
                inputRef.current?.focus();
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm"
            >
              ⚙️ Advanced Options
            </button>
            <button
              onClick={() => {
                // Add multiple sample tasks
                const sampleTasks = [
                  { label: "Review team updates", category: "plan", priority: "medium" },
                  { label: "Prepare presentation", category: "schedule", priority: "high" },
                  { label: "Follow up with client", category: "inProgress", priority: "medium" }
                ];
                
                const newTodos = sampleTasks.map((task, idx) => ({
                  id: Date.now() + idx,
                  label: task.label,
                  done: false,
                  category: task.category,
                  priority: task.priority,
                  date: selectedDate,
                  time: selectedTime,
                  linkedProject: "",
                  notes: "",
                  tags: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }));
                
                setTodos([...todos, ...newTodos]);
                localStorage.setItem("plannerTodos", JSON.stringify([...todos, ...newTodos]));
                showToast("Added sample tasks!", "success");
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
            >
              Add Multiple Samples
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// TodoBoard Component (same as before, no changes needed)
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
    <div className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 h-full">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <span className="text-lg md:text-xl">{icon}</span>
          <span className="truncate">{title}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full min-w-[24px] text-center">
            {todos.length}
          </span>
        </h3>
      </div>
      
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[150px] md:min-h-[200px] max-h-[300px] md:max-h-[400px] overflow-y-auto space-y-2 pr-1"
          >
            {sortedTodos.map((todo, idx) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={idx}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="touch-none"
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
        <div className="text-center py-6 md:py-8 text-gray-400">
          <div className="text-2xl md:text-3xl mb-2">📭</div>
          <p className="text-xs md:text-sm">No tasks here yet</p>
          <p className="text-xs text-gray-300 mt-1">Drag & drop tasks here</p>
        </div>
      )}
    </div>
  );
}

// PlannerTodoItem Component (same as before, no changes needed)
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
  const [showActions, setShowActions] = useState(false);
  
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
      className={`p-2 md:p-3 rounded-lg md:rounded-xl border ${getPriorityColor(todo.priority)} transition-all hover:shadow-md ${todo.done ? 'opacity-70' : ''} relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${todo.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
          title={todo.done ? "Mark as pending" : "Mark as done"}
        >
          {todo.done && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-1">
              <p className={`font-medium text-sm md:text-base truncate ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.label}
              </p>
              
              {/* Tags and Info */}
              <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1 md:mt-2">
                <span className={`text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                  {todo.priority === 'high' ? '🔴 High' : todo.priority === 'medium' ? '🟡 Medium' : '🔵 Low'}
                </span>
                
                {todo.date && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span className="hidden sm:inline">{getDateLabel(todo.date)}</span>
                    <span className="sm:hidden">{getDateLabel(todo.date).substring(0, 3)}</span>
                    {todo.time && (
                      <span className="hidden md:inline">
                        • {todo.time}
                      </span>
                    )}
                  </span>
                )}
                
                {linkedProject && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex items-center gap-1 truncate max-w-[100px]">
                    <Link className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                    <span className="truncate">{linkedProject.title}</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons - Always visible on mobile, hover on desktop */}
            <div className={`flex gap-1 ml-1 ${showActions ? 'opacity-100' : 'opacity-70 md:opacity-0'} transition-opacity`}>
              <button
                onClick={onEdit}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Edit"
              >
                <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Details"
              >
                {showDetails ? 
                  <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> : 
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                }
              </button>
            </div>
          </div>
          
          {/* Details Section */}
          {showDetails && (
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
              <div className="text-xs md:text-sm text-gray-600 space-y-1 md:space-y-2">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                </div>
                
                {todo.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-0.5 md:mt-1 text-xs md:text-sm">{todo.notes}</p>
                  </div>
                )}
                
                {todo.tags && todo.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5 md:mt-1">
                      {todo.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
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

// PlannerSummary Component (same as before, no changes needed)
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
    <div className="bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-6">
      <h3 className="font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
        <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
        Planning Dashboard
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div className="text-lg md:text-2xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div className="text-lg md:text-2xl font-bold text-green-700">{stats.done}</div>
          <div className="text-xs md:text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div className="text-lg md:text-2xl font-bold text-red-700">{stats.highPriority}</div>
          <div className="text-xs md:text-sm text-gray-600">High Priority</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div className="text-lg md:text-2xl font-bold text-purple-700">{completionRate}%</div>
          <div className="text-xs md:text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Today's Focus */}
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl">
          <h4 className="font-medium text-gray-700 mb-2 md:mb-3 flex items-center gap-2 text-xs md:text-sm">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            Today's Focus ({todayTasks.length})
          </h4>
          {todayTasks.length > 0 ? (
            <div className="space-y-1 md:space-y-2">
              {todayTasks.slice(0, 3).map(todo => (
                <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${todo.priority === 'high' ? 'bg-red-500' : todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <span className={`text-xs md:text-sm flex-1 ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.label.length > 30 ? `${todo.label.substring(0, 30)}...` : todo.label}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded whitespace-nowrap">
                    {todo.time || 'All day'}
                  </span>
                </div>
              ))}
              {todayTasks.length > 3 && (
                <div className="text-center text-xs md:text-sm text-gray-500">
                  + {todayTasks.length - 3} more tasks
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-xs md:text-sm">No tasks scheduled for today</p>
          )}
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl">
          <h4 className="font-medium text-gray-700 mb-2 md:mb-3 flex items-center gap-2 text-xs md:text-sm">
            <Flag className="w-3 h-3 md:w-4 md:h-4" />
            Upcoming ({upcomingTasks.length})
          </h4>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-1 md:space-y-2">
              {upcomingTasks.slice(0, 3).map(todo => (
                <div key={todo.id} className="p-2 bg-white rounded-lg">
                  <div className="text-xs md:text-sm text-gray-700">
                    {todo.label.length > 35 ? `${todo.label.substring(0, 35)}...` : todo.label}
                  </div>
                  <div className="flex justify-between items-center mt-0.5 md:mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(todo.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    {todo.priority === 'high' && (
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        🔴 High
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {upcomingTasks.length > 3 && (
                <div className="text-center text-xs md:text-sm text-gray-500">
                  + {upcomingTasks.length - 3} more upcoming
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-xs md:text-sm">No upcoming deadlines</p>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 md:mt-6">
        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 md:h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}