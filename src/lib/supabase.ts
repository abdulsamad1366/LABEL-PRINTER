import { createClient } from '@supabase/supabase-js';
import { User, Project, LabelTemplate, CalibrationSettings } from '../types/label';

// Environment variables configured with user's Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eouhldfidzfheibpxavb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H1oeGwAntGb4QJexGQHStg_H49mWz8P';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Auth Helpers ---
export async function supabaseSignUp(email: string, pass: string, name: string, role: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: { name, role }
    }
  });
  return { data, error };
}

export async function supabaseSignIn(email: string, pass: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  });
  return { data, error };
}

export async function supabaseSignOut() {
  await supabase.auth.signOut();
}

// --- Database & Audit Log Helpers ---

/**
 * Record user login activity event into Supabase user_login_history table
 */
export async function dbLogUserLogin(user: User) {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    await supabase.from('user_login_history').insert({
      user_id: isUuid ? user.id : null,
      user_name: user.name,
      user_email: user.email,
      user_role: user.role,
      login_timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client'
    });
  } catch (err) {
    console.warn('Supabase dbLogUserLogin error:', err);
  }
}

/**
 * Fetch past user login history from Supabase
 */
export async function dbFetchLoginHistory() {
  try {
    const { data, error } = await supabase
      .from('user_login_history')
      .select('*')
      .order('login_timestamp', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase dbFetchLoginHistory error:', err);
    return [];
  }
}

export async function dbSaveProject(project: Project, userId?: string) {
  try {
    await supabase.from('projects').upsert({
      id: project.id,
      user_id: userId,
      name: project.name,
      template_json: project.template,
      elements_json: project.design.elements,
      csv_data_json: project.csvData,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Supabase dbSaveProject error:', err);
  }
}

export async function dbFetchProjects(userId?: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase dbFetchProjects error:', err);
    return [];
  }
}

export async function dbLogPrintBatch(jobName: string, sizeCode: string, labelCount: number, mode: string, userEmail: string) {
  try {
    await supabase.from('print_audit_logs').insert({
      job_name: jobName,
      size_code: sizeCode,
      label_count: labelCount,
      output_mode: mode,
      operator_email: userEmail,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Supabase dbLogPrintBatch error:', err);
  }
}
