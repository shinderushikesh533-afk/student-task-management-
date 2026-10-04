const mongoose = require('mongoose');
const Task = require('../models/Task');

// @desc    Get all tasks with search, filter, and sort
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const { search, category, priority, status, sortBy, order } = req.query;

    // Build query filter
    const query = {};

    // Search by title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by status (completed, pending)
    if (status && status !== 'all') {
      if (status === 'completed') {
        query.isCompleted = true;
      } else if (status === 'pending') {
        query.isCompleted = false;
      }
    }

    // Sorting
    let sortOptions = {};
    const sortDirection = order === 'asc' ? 1 : -1;

    if (sortBy === 'dueDate') {
      // Sort tasks by dueDate, nulls at end
      sortOptions = { dueDate: sortDirection, createdAt: -1 };
    } else if (sortBy === 'priority') {
      // High > Medium > Low or vice versa
      // We can sort by priority field or sort in memory / aggregation if needed,
      // or default sort field. Since priority is string, let's also support priority sorting.
      sortOptions = { priority: sortDirection, createdAt: -1 };
    } else {
      // Default sort: createdAt descending
      sortOptions = { createdAt: sortDirection };
    }

    let tasks = await Task.find(query).sort(sortOptions);

    // If sorting by priority, Mongoose string sorting would be Alphabetical ('High', 'Low', 'Medium').
    // Let's provide true priority weight sorting if sortBy === 'priority'
    if (sortBy === 'priority') {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        return order === 'asc' ? weightA - weightB : weightB - weightA;
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid Task ID format');
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate, isCompleted } = req.body;

    // Validate title presence
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400);
      throw new Error('Please provide a valid task title');
    }

    // Validate category if provided
    const validCategories = ['Study', 'Assignment', 'Exam', 'Personal', 'Other'];
    if (category && !validCategories.includes(category)) {
      res.status(400);
      throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
    }

    // Validate priority if provided
    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400);
      throw new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
    }

    // Validate dueDate if provided
    let parsedDueDate = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        res.status(400);
        throw new Error('Invalid due date provided');
      }
      parsedDueDate = d;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Study',
      priority: priority || 'Medium',
      dueDate: parsedDueDate,
      isCompleted: typeof isCompleted === 'boolean' ? isCompleted : false
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task by ID
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid Task ID format');
    }

    const { title, description, category, priority, dueDate, isCompleted } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Validate title if present in update
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400);
        throw new Error('Title cannot be empty');
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (category !== undefined) {
      const validCategories = ['Study', 'Assignment', 'Exam', 'Personal', 'Other'];
      if (!validCategories.includes(category)) {
        res.status(400);
        throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
      }
      task.category = category;
    }

    if (priority !== undefined) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        res.status(400);
        throw new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
      }
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        task.dueDate = null;
      } else {
        const d = new Date(dueDate);
        if (isNaN(d.getTime())) {
          res.status(400);
          throw new Error('Invalid due date provided');
        }
        task.dueDate = d;
      }
    }

    if (isCompleted !== undefined) {
      task.isCompleted = Boolean(isCompleted);
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task by ID
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid Task ID format');
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
