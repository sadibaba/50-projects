import { useState, useEffect } from "react";

export default function ProjectCard() {
  // Initialize state with localStorage data if exists
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  const [newProject, setNewProject] = useState({ 
    title: "", 
    category: "", 
    emoji1: "", 
    emoji2: "" 
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (newProject.title.trim()) {
      const newProj = {
        ...newProject,
        id: Date.now(),
        milestones: [],
        expanded: false,
        done: false,
        favorite: false,
        createdAt: new Date().toISOString(),
      };
      
      setProjects([...projects, newProj]);
      setNewProject({ title: "", category: "", emoji1: "", emoji2: "" });
    }
  };

  const toggleExpand = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, expanded: !p.expanded } : p))
    );
  };

  const toggleProjectDone = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p))
    );
  };

  const toggleFavorite = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const editProjectTitle = (id, newTitle) => {
    if (newTitle.trim()) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p))
      );
    }
  };

  const editProjectCategory = (id, newCategory) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, category: newCategory } : p))
    );
  };

  const addMilestone = (id, text) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id && p.milestones.length < 10
          ? {
              ...p,
              milestones: [...p.milestones, { 
                text, 
                done: false,
                id: Date.now() + Math.random(),
                createdAt: new Date().toISOString()
              }],
            }
          : p
      )
    );
  };

  const toggleMilestone = (id, milestoneId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneId ? { ...m, done: !m.done } : m
              ),
            }
          : p
      )
    );
  };

  const editMilestone = (id, milestoneId, newText) => {
    if (newText.trim()) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                milestones: p.milestones.map((m) =>
                  m.id === milestoneId ? { ...m, text: newText } : m
                ),
              }
            : p
        )
      );
    }
  };

  const deleteMilestone = (id, milestoneId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              milestones: p.milestones.filter((m) => m.id !== milestoneId),
            }
          : p
      )
    );
  };

  const deleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const clearAllProjects = () => {
    if (window.confirm("Are you sure you want to delete ALL projects? This cannot be undone!")) {
      setProjects([]);
      localStorage.removeItem("projects");
    }
  };

  const exportProjects = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `projects-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importProjects = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          if (window.confirm(`Import ${importedData.length} projects? This will replace your current projects.`)) {
            setProjects(importedData);
          }
        } else {
          alert("Invalid file format");
        }
      } catch (error) {
        alert("Error reading file");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">📋 Project Manager</h1>
        <div className="flex gap-2">
          <button
            onClick={exportProjects}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            📤 Export
          </button>
          <label className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={importProjects}
              className="hidden"
            />
          </label>
          {projects.length > 0 && (
            <button
              onClick={clearAllProjects}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Add New Project Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">➕ New Project</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              placeholder="e.g., E-commerce Website"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g., Web Development"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji 1</label>
            <input
              type="text"
              placeholder="🚀"
              value={newProject.emoji1}
              onChange={(e) => setNewProject({ ...newProject, emoji1: e.target.value })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-xl"
              maxLength={2}
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji 2</label>
            <input
              type="text"
              placeholder="💰"
              value={newProject.emoji2}
              onChange={(e) => setNewProject({ ...newProject, emoji2: e.target.value })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-xl"
              maxLength={2}
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
          </div>
          <button
            onClick={addProject}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
          >
            Create Project
          </button>
        </div>
      </div>

      {/* Statistics */}
      {projects.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.done).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter(p => p.favorite).length}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">
                {projects.reduce((acc, p) => acc + p.milestones.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Milestones</div>
            </div>
          </div>
        </div>
      )}

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.length > 0 ? (
          [...projects]
            .sort((a, b) => {
              // Favorites first
              if (a.favorite && !b.favorite) return -1;
              if (!a.favorite && b.favorite) return 1;
              // Then by creation date (newest first)
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((project) => (
              <ProjectCardComponent
                key={project.id}
                project={project}
                toggleExpand={toggleExpand}
                toggleFavorite={toggleFavorite}
                toggleProjectDone={toggleProjectDone}
                editProjectTitle={editProjectTitle}
                editProjectCategory={editProjectCategory}
                addMilestone={addMilestone}
                toggleMilestone={toggleMilestone}
                editMilestone={editMilestone}
                deleteMilestone={deleteMilestone}
                deleteProject={deleteProject}
              />
            ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
            <p className="text-gray-500">Create your first project above!</p>
            <p className="text-sm text-gray-400 mt-2">
              ⚡ Data auto-saves in your browser
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCardComponent({
  project,
  toggleExpand,
  toggleFavorite,
  toggleProjectDone,
  editProjectTitle,
  editProjectCategory,
  addMilestone,
  toggleMilestone,
  editMilestone,
  deleteMilestone,
  deleteProject,
}) {
  const [milestoneInput, setMilestoneInput] = useState("");

  const handleAddMilestone = () => {
    if (milestoneInput.trim() && project.milestones.length < 10) {
      addMilestone(project.id, milestoneInput.trim());
      setMilestoneInput("");
    }
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-5 transition-all duration-300 ${
        project.done ? "opacity-75 border-2 border-green-500" : "border-2 border-transparent"
      } ${project.favorite ? "ring-2 ring-yellow-400" : ""}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={() => toggleExpand(project.id)}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(project.id);
            }}
            className={`text-2xl hover:scale-110 transition ${project.favorite ? "text-yellow-500" : "text-gray-300"}`}
            title={project.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {project.favorite ? "⭐" : "☆"}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                {project.category}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-1 flex items-center gap-2">
              {project.title}
              {project.done && (
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">DONE</span>
              )}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {project.milestones.length}/10
              </span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex space-x-2 text-2xl">
            <span>{project.emoji1}</span>
            <span>{project.emoji2}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(project.id);
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
            title={project.expanded ? "Collapse" : "Expand"}
          >
            {project.expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {project.expanded && (
        <div className="mt-6 pt-6 border-t">
          {/* Edit Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edit Name</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => editProjectTitle(project.id, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edit Category</label>
              <input
                type="text"
                value={project.category}
                onChange={(e) => editProjectCategory(project.id, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Add Milestone */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                placeholder={`+ Add milestone (${project.milestones.length}/10)`}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                disabled={project.milestones.length >= 10}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
              />
              <button
                onClick={handleAddMilestone}
                disabled={project.milestones.length >= 10}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  project.milestones.length >= 10
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                }`}
              >
                Add
              </button>
            </div>
          </div>

          {/* Milestone List */}
          <div className="space-y-3 mb-6">
            {project.milestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                onToggle={() => toggleMilestone(project.id, milestone.id)}
                onEdit={(newText) => editMilestone(project.id, milestone.id, newText)}
                onDelete={() => deleteMilestone(project.id, milestone.id)}
              />
            ))}
            {project.milestones.length === 0 && (
              <p className="text-gray-400 text-center py-4">No milestones added yet</p>
            )}
          </div>

          {/* Summary + Actions */}
          <div className="flex flex-wrap justify-between items-center gap-4 mt-6 pt-6 border-t">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">📊 Summary:</span> Total: {project.milestones.length} | 
              Active: <span className="text-blue-600">{project.milestones.filter((m) => !m.done).length}</span> | 
              Done: <span className="text-green-600">{project.milestones.filter((m) => m.done).length}</span>
              {project.milestones.length >= 10 && (
                <span className="ml-2 text-red-500">• Max 10 milestones reached</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleProjectDone(project.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  project.done
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {project.done ? "✅ Mark Active" : "✔️ Mark as Done"}
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
              >
                🗑️ Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneItem({ milestone, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(milestone.text);

  const handleSave = () => {
    if (editValue.trim() && editValue !== milestone.text) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition ${
        milestone.done ? "bg-green-50 border border-green-200" : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <input
        type="checkbox"
        checked={milestone.done}
        onChange={onToggle}
        className="h-5 w-5 accent-blue-600 cursor-pointer"
      />
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-1 border rounded"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 cursor-pointer ${milestone.done ? "line-through text-gray-500" : "text-gray-800"}`}
            onClick={() => setIsEditing(true)}
          >
            {milestone.text}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}