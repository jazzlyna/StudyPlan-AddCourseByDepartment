const API_BASE = import.meta.env.VITE_API_BASE;

// Store credentials in memory after login
let authCredentials = null;

//set credential
export const setAuthCredentials = (username, password) => {
  authCredentials = btoa(`${username}:${password}`);
};

//clear credential
export const clearAuthCredentials = () => {
  authCredentials = null;
};


//get course
export const getCoursesByDepartment = async (department) => {
  const response = await fetch(`${API_BASE}/course/get/all/CourseDepartment/${department}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch courses');
  }
  return await response.json();
};


// upsert
export const upsertCourse = async (courseData, department) => { 
  if (!authCredentials) {
    throw new Error('AUTH_REQUIRED');
  }

  console.log('Sending course data:', JSON.stringify(courseData, null, 2));

  
  const url = `${API_BASE}/course/upsert?department=${encodeURIComponent(department)}`;  

  const response = await fetch(url, {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authCredentials}`
    },
    body: JSON.stringify(courseData)
  });

  if (response.status === 401) {
    // Credentials are wrong or expired
    authCredentials = null;
    throw new Error('AUTH_REQUIRED');
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.log('Response status:', response.status);
    console.log('Full error response:', errorData); 
    console.log('Detail array:', errorData.detail);
    
      console.log('First error detail:', errorData.detail[0]); 
       console.log('Location (field):', errorData.detail[0]?.loc); // Add this
  console.log('Error message:', errorData.detail[0]?.msg);   // Add this
  
  
  // Try to extract the actual error message
  const errorMessage = errorData.detail?.[0]?.msg || 
                       errorData.detail?.[0] || 
                       JSON.stringify(errorData);
  throw new Error(errorMessage);
  }
  
  return await response.json();
};