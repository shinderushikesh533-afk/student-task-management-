const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Task = require('./models/Task');

dotenv.config();

const sampleTasks = [
  {
    title: 'Complete Data Structures Assignment 2',
    description: 'Implement binary search trees, AVL balancing algorithms, and write unit test cases for tree rotations.',
    category: 'Assignment',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    isCompleted: false
  },
  {
    title: 'Read Chapters 5-7 for Organic Chemistry Midterm',
    description: 'Focus on reaction mechanisms, stereochemistry, and synthesis pathways for aromatic compounds.',
    category: 'Study',
    priority: 'High',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // In 4 days
    isCompleted: false
  },
  {
    title: 'Calculus III Practice Exam',
    description: 'Solve past papers from 2023 and 2024 covering multiple integrals and Green\'s theorem.',
    category: 'Exam',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // In 1 day
    isCompleted: false
  },
  {
    title: 'Review Operating Systems Lecture Slides 8-10',
    description: 'Process scheduling algorithms, virtual memory paging, and deadlock avoidance bankers algorithm.',
    category: 'Study',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
    isCompleted: false
  },
  {
    title: 'Renew Campus Library Books',
    description: 'Return artificial intelligence handbook and extend borrowing period for Linear Algebra textbook.',
    category: 'Personal',
    priority: 'Low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In 7 days
    isCompleted: true
  },
  {
    title: 'Submit Group Project Proposal for Web Dev',
    description: 'Draft problem statement, system architecture diagram, and tech stack specification in PDF format.',
    category: 'Assignment',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    isCompleted: true
  },
  {
    title: 'Schedule Advisor Meeting for Semester Registration',
    description: 'Consult academic advisor regarding elective courses and credit requirements for next semester.',
    category: 'Other',
    priority: 'Low',
    dueDate: null,
    isCompleted: false
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Task.deleteMany();
    console.log('Cleared existing tasks from database.');

    const created = await Task.insertMany(sampleTasks);
    console.log(`Successfully seeded ${created.length} sample tasks!`);
    process.exit(0);
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Task.deleteMany();
    console.log('All tasks successfully removed from database.');
    process.exit(0);
  } catch (err) {
    console.error(`Destroy error: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
