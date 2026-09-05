import { createClient } from '@supabase/supabase-js';
import { User, Project, LabelTemplate, CalibrationSettings } from '../types/label';

// Environment variables configured with user's Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eouhldfidzfheibpxavb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H1oeGwAntGb4QJexGQHStg_H49mWz8P';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to generate a valid UUID v4 string for Supabase database tables
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function ensureUuid(id?: string): string {
  const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  return isUuid ? id : generateUuid();
}

// --- Auth Helpers ---

/**
 * Register new user credentials in Supabase Auth & public.profiles DB table
 */
export async function supabaseSignUp(email: string, pass: string, name: string) {
  let userId: string | null = null;
  let authError: string | null = null;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { name }
      }
    });

    if (error) {
      authError = error.message;
    } else if (data?.user) {
      userId = data.user.id;
    }
  } catch (err: any) {
    authError = err.message || 'Auth registration error';
  }

  // GUARANTEE: Always save profile credentials in Supabase public.profiles database table
  const finalUuid = ensureUuid(userId || undefined);
  try {
    const { error: pErr } = await supabase.from('profiles').upsert({
      id: finalUuid,
      name: name,
      email: email,
      updated_at: new Date().toISOString()
    });
    if (pErr) console.warn('Profiles upsert response error:', pErr.message);
  } catch (profileErr) {
    console.warn('Profiles upsert catch error:', profileErr);
  }

  return { userId: finalUuid, isAuthRegistered: Boolean(!authError), authError };
}

/**
 * Authenticate existing user with email & password against Supabase
 */
export async function supabaseSignIn(email: string, pass: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  });

  if (error) {
    throw error;
  }

  return { data, error: null };
}

export async function supabaseSignOut() {
  await supabase.auth.signOut();
}

// --- Database & Audit Log Helpers ---

/**
 * Record user profile and login activity event into Supabase database tables (profiles & user_login_history)
 */
export async function dbLogUserLogin(user: User) {
  try {
    const validUuid = ensureUuid(user.id);
    
    // 1. Ensure user profile credentials exist in public.profiles table
    const { error: pErr } = await supabase.from('profiles').upsert({
      id: validUuid,
      name: user.name,
      email: user.email,
      updated_at: new Date().toISOString()
    });
    if (pErr) console.warn('dbLogUserLogin profiles upsert error:', pErr.message);

    // 2. Record login timestamp history event into public.user_login_history table
    const { error: hErr } = await supabase.from('user_login_history').insert({
      user_id: validUuid,
      user_name: user.name,
      user_email: user.email,
      login_timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client'
    });
    if (hErr) console.warn('dbLogUserLogin history insert error:', hErr.message);
  } catch (err) {
    console.warn('Supabase dbLogUserLogin catch error:', err);
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
    const validUuid = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ? userId : null;
    await supabase.from('projects').upsert({
      id: project.id,
      user_id: validUuid,
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

// --- Custom Templates Cloud Persistence ---

export async function dbSaveCustomTemplate(template: LabelTemplate, userId?: string) {
  try {
    const validUuid = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ? userId : null;
    const { error } = await supabase.from('custom_templates').upsert({
      id: template.id,
      user_id: validUuid,
      size_code: template.sizeCode,
      width_mm: template.widthMm,
      height_mm: template.heightMm,
      across: template.across,
      rows: template.rows,
      margin_top_mm: template.marginTopMm,
      margin_bottom_mm: template.marginBottomMm || template.marginTopMm,
      margin_left_mm: template.marginLeftMm,
      margin_right_mm: template.marginRightMm || template.marginLeftMm,
      col_gap_mm: template.colGapMm,
      row_gap_mm: template.rowGapMm,
      finish: template.finish || 'Uncoated 70',
      created_at: new Date().toISOString()
    });
    if (error) console.warn('Supabase dbSaveCustomTemplate error:', error.message);
  } catch (err) {
    console.warn('Supabase dbSaveCustomTemplate catch error:', err);
  }
}

export async function dbFetchCustomTemplates(): Promise<LabelTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('custom_templates')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      sizeCode: item.size_code,
      widthMm: Number(item.width_mm),
      heightMm: Number(item.height_mm),
      across: Number(item.across),
      rows: Number(item.rows),
      marginTopMm: Number(item.margin_top_mm),
      marginBottomMm: Number(item.margin_bottom_mm || item.margin_top_mm),
      marginLeftMm: Number(item.margin_left_mm),
      marginRightMm: Number(item.margin_right_mm || item.margin_left_mm),
      colGapMm: Number(item.col_gap_mm),
      rowGapMm: Number(item.row_gap_mm),
      sheetWidthMm: 210,
      sheetHeightMm: 297,
      finish: item.finish,
      color: 'Default',
      verified: true
    }));
  } catch (err) {
    console.warn('Supabase dbFetchCustomTemplates catch error:', err);
    return [];
  }
}

export async function dbDeleteCustomTemplate(templateId: string) {
  try {
    const { error } = await supabase.from('custom_templates').delete().eq('id', templateId);
    if (error) console.warn('Supabase dbDeleteCustomTemplate error:', error.message);
  } catch (err) {
    console.warn('Supabase dbDeleteCustomTemplate catch error:', err);
  }
}

// --- Per-User Label Elements Sync ---

export async function dbSaveUserElements(userEmail: string, elements: any[]) {
  try {
    const projId = `user_design_${userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await supabase.from('projects').upsert({
      id: projId,
      name: `${userEmail}'s Current Design`,
      template_json: {},
      elements_json: elements,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Supabase dbSaveUserElements error:', err);
  }
}

export async function dbFetchUserElements(userEmail: string) {
  try {
    const projId = `user_design_${userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const { data, error } = await supabase.from('projects').select('elements_json').eq('id', projId).single();
    if (error || !data) return null;
    return data.elements_json || null;
  } catch (err) {
    console.warn('Supabase dbFetchUserElements error:', err);
    return null;
  }
}
