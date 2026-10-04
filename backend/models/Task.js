const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Task category is required'],
      enum: {
        values: ['Study', 'Assignment', 'Exam', 'Personal', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Study'
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'Medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for search optimization
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
