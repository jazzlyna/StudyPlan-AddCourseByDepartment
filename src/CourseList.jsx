import React, { useState } from 'react';
import { getCoursesByDepartment } from './api';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dept, setDept] = useState('');

  const handleFetch = async () => {
    if (!dept) return alert("Select a department");
    setLoading(true);
    try {
      const data = await getCoursesByDepartment(dept);
      setCourses(data);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-container">
      <h3>View Courses</h3>
      <div className="filter-bar">
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">-- Choose Department --</option>
          <option value="CE">Chemical Engineering</option>
          <option value="CEE">Civil & Environmental Engineering</option>
          <option value="EEE">Electrical & Electronic Engineering</option>
          <option value="IE">Integrated Engineering</option>
          <option value="ME">Mechanical Engineering</option>
          <option value="PE">Petroleum Engineering</option>
          <option value="FASD">Applied Science</option>
          <option value="GSC">Geosciences</option>
          <option value="DM">Management</option>
        </select>
        <button onClick={handleFetch} className="submit-btn">
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Sem</th>
            <th>Type</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((c) => (
              <tr key={c.course_code}>
                <td><strong>{c.course_code}</strong></td>
                <td>{c.course_name}</td>
                <td>{c.course_semester}</td>
                <td><span className="badge">{c.course_type}</span></td>
                <td>{c.credit_hour}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No records.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;