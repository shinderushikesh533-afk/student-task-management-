import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import TaskDetail from './pages/TaskDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/new" element={<AddTask />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} StudyPulse • Student Task Planner App</p>
            <p className="flex items-center gap-1.5">
              <span>Full-Stack MERN Architecture</span>
              <span>•</span>
              <span>React + Vite + Express + MongoDB</span>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
