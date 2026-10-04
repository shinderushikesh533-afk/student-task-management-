const API_BASE = '/api/tasks';

/**
 * Handle API responses and throw detailed errors
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

/**
 * Fetch all tasks with optional search, filter, and sort params
 */
export const fetchTasks = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.search && params.search.trim()) {
    query.append('search', params.search.trim());
  }
  if (params.category && params.category !== 'All') {
    query.append('category', params.category);
  }
  if (params.priority && params.priority !== 'All') {
    query.append('priority', params.priority);
  }
  if (params.status && params.status !== 'all') {
    query.append('status', params.status);
  }
  if (params.sortBy) {
    query.append('sortBy', params.sortBy);
  }
  if (params.order) {
    query.append('order', params.order);
  }

  const url = query.toString() ? `${API_BASE}?${query.toString()}` : API_BASE;
  const response = await fetch(url);
  const result = await handleResponse(response);
  return result.data || [];
};

/**
 * Fetch a single task by ID
 */
export const fetchTaskById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

/**
 * Quick toggle task completion status
 */
export const toggleTaskCompletion = async (id, isCompleted) => {
  return updateTask(id, { isCompleted: !isCompleted });
};
