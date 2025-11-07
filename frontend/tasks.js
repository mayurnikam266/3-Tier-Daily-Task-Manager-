// API base URL - change this if your backend runs on different port
const API_URL = 'http://localhost:5000';

// Get elements from the page
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const editModal = document.getElementById('edit-modal');
const editTaskForm = document.getElementById('edit-task-form');
const filterButtons = document.querySelectorAll('.filter-btn');

// Store all tasks for filtering
let allTasks = [];
let currentFilter = 'all';

// Check if user is logged in when page loads
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    displayUsername();
    loadTasks();
    setupFilterButtons();
    setupModalEvents();
});

// Function to check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // No token found, redirect to login
        window.location.href = 'login.html';
    }
}

// Function to display username in navbar
function displayUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        usernameDisplay.textContent = `Hello, ${user.username}!`;
    }
}

// Function to get auth headers for API requests
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Function to load all tasks from backend
async function loadTasks() {
    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        const response = await fetch(`${API_URL}/tasks`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            allTasks = await response.json();
            updateStatistics();
            displayTasks(filterTasks(allTasks));
        } else if (response.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            showError('Failed to load tasks');
        }
    } catch (error) {
        console.error('Load tasks error:', error);
        showError('Network error. Please check if the server is running.');
    } finally {
        loadingMessage.style.display = 'none';
    }
}

// Function to update task statistics
function updateStatistics() {
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

// Function to filter tasks based on current filter
function filterTasks(tasks) {
    if (currentFilter === 'all') {
        return tasks;
    } else if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }
    return tasks;
}

// Setup filter button event listeners
function setupFilterButtons() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update filter and display
            currentFilter = btn.dataset.filter;
            displayTasks(filterTasks(allTasks));
        });
    });
}

// Function to display tasks in the UI
function displayTasks(tasks) {
    // Clear current tasks
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">No tasks yet. Add your first task above!</p>';
        return;
    }

    // Create a card for each task
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

// Function to create a task card element
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    
    // Format date
    const date = new Date(task.created_at);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    card.innerHTML = `
        <div class="task-header">
            <h3>${escapeHtml(task.title)}</h3>
            <div class="task-actions">
                <button class="btn-icon" onclick="toggleComplete(${task.id}, ${!task.completed})" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    ${task.completed ? '↩️' : '✓'}
                </button>
                <button class="btn-icon" onclick="openEditModal(${task.id})" title="Edit task">
                    ✏️
                </button>
                <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})" title="Delete task">
                    🗑️
                </button>
            </div>
        </div>
        <p class="task-description">${escapeHtml(task.description) || 'No description'}</p>
        <p class="task-date">Created: ${formattedDate}</p>
        ${task.completed ? '<span class="task-badge">Completed</span>' : '<span class="task-badge pending-badge">Pending</span>'}
    `;

    return card;
}

// Function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle task form submission
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            // Clear form
            taskForm.reset();
            // Reload tasks
            loadTasks();
        } else if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            showError('Failed to add task');
        }
    } catch (error) {
        console.error('Add task error:', error);
        showError('Network error. Please check if the server is running.');
    }
});

// Function to toggle task completion status
async function toggleComplete(taskId, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            // Reload tasks to show updated status
            loadTasks();
        } else if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            showError('Failed to update task');
        }
    } catch (error) {
        console.error('Update task error:', error);
        showError('Network error. Please check if the server is running.');
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            // Reload tasks
            loadTasks();
        } else if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            showError('Failed to delete task');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        showError('Network error. Please check if the server is running.');
    }
}

// Handle logout button click
logoutBtn.addEventListener('click', () => {
    // Clear localStorage to remove token and user info
    localStorage.clear();
    // Redirect to home page
    window.location.href = 'index.html';
});

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Setup modal event listeners
function setupModalEvents() {
    // Close modal when clicking X or Cancel button
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeEditModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Handle edit form submission
    editTaskForm.addEventListener('submit', handleEditSubmit);
}

// Function to open edit modal
function openEditModal(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    // Populate form fields
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description || '';
    document.getElementById('edit-task-completed').checked = task.completed;

    // Show modal
    editModal.style.display = 'flex';
}

// Function to close edit modal
function closeEditModal() {
    editModal.style.display = 'none';
    editTaskForm.reset();
}

// Handle edit form submission
async function handleEditSubmit(e) {
    e.preventDefault();

    const taskId = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value;
    const description = document.getElementById('edit-task-description').value;
    const completed = document.getElementById('edit-task-completed').checked;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, description, completed })
        });

        if (response.ok) {
            closeEditModal();
            loadTasks();
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            showError('Failed to update task');
        }
    } catch (error) {
        console.error('Update task error:', error);
        showError('Network error. Please check if the server is running.');
    }
}
