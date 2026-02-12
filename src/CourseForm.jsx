import React, { useState } from 'react';
import { upsertCourse, getCourseByCode } from './api';
import './CourseForm.css';

const CourseForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    course_semester: '',
    course_desc: '',
    course_type: '',
    credit_hour: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.course_department) {
      alert("Please select a department.");
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch existing record to avoid overwriting existing departments
      const existingCourse = await getCourseByCode(formData.course_code);
      
      let finalDepartments = [formData.course_department];
      
      if (existingCourse && Array.isArray(existingCourse.course_department)) {
        // Merge existing departments with the selected one and remove duplicates
        finalDepartments = [...new Set([...existingCourse.course_department, formData.course_department])];
      }

      // 2. Prepare the final payload
      const payload = {
        ...formData,
        credit_hour: Number(formData.credit_hour),
        pre_requisite: formData.pre_requisite.filter(item => item.trim() !== ''),
        course_department: finalDepartments // Now an array of all associated departments
      };

      await upsertCourse(payload);
      alert('Success! Course saved and department associations updated.');
      
      // Reset form
      setFormData({
        course_name: '', course_code: '', course_semester: '',
        course_desc: '', course_type: '', credit_hour: 0,
        pre_requisite: [''], course_department: ''
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Course Registration</h2>
        <p className="subtitle">Enter department course details</p>
        
        <form onSubmit={handleSubmit} className="course-grid-form">
          <div className="input-group full-width">
            <label>Course Name</label>
            <input name="course_name" value={formData.course_name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Course Code</label>
            <input name="course_code" value={formData.course_code} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Semester</label>
            <input name="course_semester" value={formData.course_semester} onChange={handleChange} placeholder='e.g. 1' />
          </div>

          <div className="input-group">
            <label>Credit Hours</label>
            <input type="number" name="credit_hour" value={formData.credit_hour} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <label>Course Type</label>
            <select name="course_type" value={formData.course_type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="NR">National Requirement</option>
              <option value="UR">University Requirement</option>
              <option value="CC">CC</option>
              <option value="CD">Core Discipline</option>
              <option value="CSp">Core Specialisation</option>
            </select>
          </div>

          <div className="input-group full-width">
            <label>Department (Association to Add)</label>
            <select 
              name="course_department" 
              value={formData.course_department} 
              onChange={handleChange}
              required
            >
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
                <input 
                  value={prereq} 
                  onChange={(e) => handlePrereqChange(index, e.target.value)} 
                  placeholder="e.g. CS101"
                />
                {formData.pre_requisite.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removePrereqField(index)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addPrereqField}>+ Add Prerequisite</button>
          </div>

          <div className="input-group full-width">
            <label>Course Description</label>
            <textarea name="course_desc" value={formData.course_desc} onChange={handleChange} rows="4" />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Save Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;