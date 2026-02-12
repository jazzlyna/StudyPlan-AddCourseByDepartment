import React, { useState } from 'react';
import CourseForm from './CourseForm';
import CourseList from './CourseList'; // Import the List component
import './App.css';

function App() {
  // 1. Create a state to track which view is active
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="app-shell">
      <nav className="navbar">
        
        <button 
          className={activeTab === 'add' ? 'active' : ''} 
          onClick={() => setActiveTab('add')}
        >
          Add Course
        </button>
        
        <button 
          className={activeTab === 'view' ? 'active' : ''} 
          onClick={() => setActiveTab('view')}
        >
          View Courses 
        </button>
      </nav>

      <main>
        
        {activeTab === 'add' ? (
          <CourseForm />
        ) : (
          <CourseList />
        )}
      </main>
    </div>
  );
}

export default App;