const http = require('http');

// Start backend server in test mode
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

const request = async (serverUrl, path, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, serverUrl);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const runTests = async () => {
  await connectDB();
  const server = app.listen(5099);
  const BASE = 'http://localhost:5099';

  console.log('--- RUNNING API AUTOMATED TESTS ---');
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details) => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`, details);
      failed++;
    }
  };

  try {
    // 1. GET /api/tasks
    let res = await request(BASE, '/api/tasks');
    assert('GET /api/tasks returns 200 and array of tasks', res.status === 200 && Array.isArray(res.body.data) && res.body.data.length > 0, res);
    const existingTaskId = res.body.data[0]._id;

    // 2. Search tasks
    res = await request(BASE, '/api/tasks?search=Calculus');
    assert('GET /api/tasks?search=Calculus filters correctly', res.status === 200 && res.body.data.some(t => t.title.includes('Calculus')), res);

    // 3. Category filter
    res = await request(BASE, '/api/tasks?category=Assignment');
    assert('GET /api/tasks?category=Assignment returns only assignments', res.status === 200 && res.body.data.every(t => t.category === 'Assignment'), res);

    // 4. Priority filter
    res = await request(BASE, '/api/tasks?priority=High');
    assert('GET /api/tasks?priority=High returns only high priority', res.status === 200 && res.body.data.every(t => t.priority === 'High'), res);

    // 5. Status filter
    res = await request(BASE, '/api/tasks?status=completed');
    assert('GET /api/tasks?status=completed returns only completed tasks', res.status === 200 && res.body.data.every(t => t.isCompleted === true), res);

    // 6. GET /api/tasks/:id
    res = await request(BASE, `/api/tasks/${existingTaskId}`);
    assert('GET /api/tasks/:id returns 200 and task object', res.status === 200 && res.body.data._id === existingTaskId, res);

    // 7. Invalid ObjectId format
    res = await request(BASE, '/api/tasks/invalid-id-xyz');
    assert('GET /api/tasks/:invalid returns 400 Bad Request', res.status === 400 && res.body.message.includes('Invalid Task ID'), res);

    // 8. Non-existent valid ObjectId
    res = await request(BASE, '/api/tasks/507f1f77bcf86cd799439011');
    assert('GET /api/tasks/:nonExistent returns 404 Not Found', res.status === 404 && res.body.message.includes('Task not found'), res);

    // 9. POST /api/tasks - Validation error (empty title)
    res = await request(BASE, '/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { title: '', category: 'Study' }
    });
    assert('POST /api/tasks with empty title returns 400', res.status === 400, res);

    // 10. POST /api/tasks - Validation error (invalid category)
    res = await request(BASE, '/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { title: 'Valid Title', category: 'InvalidCategory123' }
    });
    assert('POST /api/tasks with invalid category returns 400', res.status === 400, res);

    // 11. POST /api/tasks - Valid task creation
    res = await request(BASE, '/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        title: 'Review Midterm Chemistry Formulas',
        description: 'Focus on Gibbs free energy and equilibrium constants',
        category: 'Study',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        isCompleted: false
      }
    });
    assert('POST /api/tasks creates task and returns 201', res.status === 201 && res.body.data && res.body.data.title === 'Review Midterm Chemistry Formulas', res);
    const newTaskId = res.body.data._id;

    // 12. PUT /api/tasks/:id - Valid update
    res = await request(BASE, `/api/tasks/${newTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        isCompleted: true,
        priority: 'Medium'
      }
    });
    assert('PUT /api/tasks/:id updates task and returns 200', res.status === 200 && res.body.data.isCompleted === true && res.body.data.priority === 'Medium', res);

    // 13. DELETE /api/tasks/:id - Valid delete
    res = await request(BASE, `/api/tasks/${newTaskId}`, {
      method: 'DELETE'
    });
    assert('DELETE /api/tasks/:id removes task and returns 200', res.status === 200 && res.body.success === true, res);

    // 14. Verify deleted task returns 404
    res = await request(BASE, `/api/tasks/${newTaskId}`);
    assert('GET on deleted task returns 404', res.status === 404, res);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    console.log(`\nTESTS COMPLETED: ${passed} Passed, ${failed} Failed`);
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();
