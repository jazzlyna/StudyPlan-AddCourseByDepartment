import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches a single course to check existing departments before saving.
 */
export const getCourseByCode = async (courseCode) => {
  const { data, error } = await supabase
    .from('COURSE')
    .select('course_department')
    .eq('course_code', courseCode)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Saves/Updates course. 
 * Note: course_department must be an array (e.g., ['CE', 'ME']).
 */
export const upsertCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('COURSE')
    .upsert([courseData], { onConflict: 'course_code' }); 

  if (error) throw error;
  return data;
};

export const getCoursesByDepartment = async (department) => {
  const { data, error } = await supabase
    .from('COURSE')
    .select('*')
    .filter('course_department', 'cs', JSON.stringify([department])); 

  if (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
  return data;
};