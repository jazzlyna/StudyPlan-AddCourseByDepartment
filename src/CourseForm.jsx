
import React, { useState } from 'react';
import { upsertCourse, setAuthCredentials } from './api';
import LoginModal from './LoginModal';
import './CourseForm.css';

const CourseForm = () => {
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    course_semester: '',
    course_desc: '',
    course_type: '',
    credit_hour: '',
    pre_requisite: [''],
    course_department: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrereqChange = (index, value) => {
    const newPrereqs = [...formData.pre_requisite];
    newPrereqs[index] = value;
    setFormData({ ...formData, pre_requisite: newPrereqs });
  };

  const addPrereqField = () => {
    setFormData({ ...formData, pre_requisite: [...formData.pre_requisite, ''] });
  };

  const removePrereqField = (index) => {
    const newPrereqs = formData.pre_requisite.filter((_, i) => i !== index);
    setFormData({ ...formData, pre_requisite: newPrereqs });
  };

  const saveCourse = async () => {
    setLoading(true);
    try {
const payload = {
  ...formData,
  credit_hour: Number(formData.credit_hour),
  pre_requisite: formData.pre_requisite.filter(item => item.trim() !== ''),
  
};


delete payload.course_department;  


await upsertCourse(payload, formData.course_department);  

      
      
      alert('Success! Course saved.');
      
      setFormData({
        course_name: '', course_code: '', course_semester: '',
        course_desc: '', course_type: '', credit_hour: 0,
        pre_requisite: [''], course_department: ''
      });
    } catch (err) {
      if (err.message === 'AUTH_REQUIRED') {
        setShowLoginModal(true);
        setPendingSave(true);
      } else {
        alert('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
const { course_name, course_code, course_semester, course_type, credit_hour, course_department } = formData;
  
  if (!course_name || !course_code || !course_semester || !course_type || !course_department || credit_hour === '') {
    alert("Please fill in all required fields.");
    return;
  }

    await saveCourse();
  };

  const handleLogin = async (username, password) => {
    setAuthCredentials(username, password);
    setShowLoginModal(false);
    
    if (pendingSave) {
      setPendingSave(false);
      await saveCourse();
    }
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal 
          onLogin={handleLogin}
          onClose={() => {
            setShowLoginModal(false);
            setPendingSave(false);
          }}
        />
      )}
      
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Course Registration</h2>
          <form onSubmit={handleSubmit} className="course-grid-form">
            <div className="input-group full-width">
              <label>Course Name</label>
              <input name="course_name" placeholder='e.g. Engineering Economics'value={formData.course_name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Course Code</label>
              <input name="course_code" placeholder='e.g. PFB4102' value={formData.course_code} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Semester</label>
              <input name="course_semester" placeholder='e.g. 1' value={formData.course_semester} onChange={handleChange} required/>
            </div>

            <div className="input-group">
              <label>Credit Hours</label>
              <input type="number"placeholder='e.g. 0' name="credit_hour" value={formData.credit_hour} onChange={handleChange} required/>
            </div>

            <div className="input-group">
              <label>Course Type</label>
              <select name="course_type" value={formData.course_type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="NR">National Requirement</option>
                <option value="UR">University Requirement</option>
                <option value="CC">Common Course</option>
                <option value="CD">Core Discipline</option>
                <option value="CSp">Core Specialisation</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Department</label>
              <select name="course_department" value={formData.course_department} onChange={handleChange} required>
                <option value="">Select Department</option>
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
            </div>

            <div className="input-group full-width">
              <label>Prerequisites</label>
              {formData.pre_requisite.map((prereq, index) => (
                <div key={index} className="dynamic-input-row">
                  <input placeholder='e.g. PFB4102' value={prereq} onChange={(e) => handlePrereqChange(index, e.target.value)} />
                  {formData.pre_requisite.length > 1 && (
                    <button type="button" onClick={() => removePrereqField(index)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button"className='add-btn' onClick={addPrereqField}>+ Add Prerequisites</button>
            </div>

            <div className="input-group full-width">
              <label>Course Description</label>
              <textarea 
                name="course_desc" 
                placeholder='...'
                value={formData.course_desc} 
                onChange={handleChange} 
                rows="5" 
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Save Course'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CourseForm;