import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function savePrediction(patientData: any, result: any) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .insert([
        { 
          patient_data: patientData, 
          result: result,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase save failed:', err);
    return null;
  }
}
