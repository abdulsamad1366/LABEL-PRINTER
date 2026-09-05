import { LabelTemplate, Project, CalibrationSettings, User, LabelElement } from '../types/label';
import { SEED_TEMPLATES } from '../data/seedPresets';

const KEYS = {
  PROJECTS: 'labelstudio_projects',
  TEMPLATES: 'labelstudio_custom_templates',
  CALIBRATION: 'labelstudio_calibration',
  CURRENT_PROJECT_ID: 'labelstudio_current_project_id',
  USER: 'labelstudio_user'
};

export class StorageManager {
  // --- User Auth Session ---
  static getUser(): User | null {
    try {
      const str = localStorage.getItem(KEYS.USER);
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }

  static saveUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  static logoutUser(): void {
    localStorage.removeItem(KEYS.USER);
  }

  // --- Per-User Label Design State ---
  static getUserElements(userEmail: string): LabelElement[] | null {
    try {
      const key = `labelstudio_elements_${userEmail.toLowerCase().trim()}`;
      const str = localStorage.getItem(key);
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }

  static saveUserElements(userEmail: string, elements: LabelElement[]): void {
    try {
      const key = `labelstudio_elements_${userEmail.toLowerCase().trim()}`;
      localStorage.setItem(key, JSON.stringify(elements));
    } catch (err) {
      console.warn('saveUserElements error:', err);
    }
  }

  // --- Templates ---
  static getTemplates(): LabelTemplate[] {
    try {
      const customStr = localStorage.getItem(KEYS.TEMPLATES);
      const custom: LabelTemplate[] = customStr ? JSON.parse(customStr) : [];
      return [...SEED_TEMPLATES, ...custom];
    } catch {
      return SEED_TEMPLATES;
    }
  }

  static saveCustomTemplate(template: LabelTemplate): LabelTemplate {
    const templates = this.getCustomTemplates();
    const existingIdx = templates.findIndex(t => t.id === template.id);
    if (existingIdx >= 0) {
      templates[existingIdx] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
    return template;
  }

  static deleteCustomTemplate(id: string): void {
    const templates = this.getCustomTemplates().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
  }

  static syncCustomTemplates(cloudTemplates: LabelTemplate[]): void {
    if (!cloudTemplates || cloudTemplates.length === 0) return;
    const localCustom = this.getCustomTemplates();
    const mergedMap = new Map<string, LabelTemplate>();

    // Local custom first
    localCustom.forEach(t => mergedMap.set(t.id, t));
    // Cloud custom overrides / adds
    cloudTemplates.forEach(t => mergedMap.set(t.id, t));

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(merged));
  }

  static getCustomTemplates(): LabelTemplate[] {
    try {
      const str = localStorage.getItem(KEYS.TEMPLATES);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }

  // --- Projects ---
  static getProjects(): Project[] {
    try {
      const str = localStorage.getItem(KEYS.PROJECTS);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }

  static saveProject(project: Project): Project {
    const projects = this.getProjects();
    project.updatedAt = new Date().toISOString();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) projects[idx] = project;
    else projects.push(project);

    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(KEYS.CURRENT_PROJECT_ID, project.id);
    return project;
  }

  static getProject(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  // --- Calibration ---
  static getCalibration(): CalibrationSettings {
    try {
      const str = localStorage.getItem(KEYS.CALIBRATION);
      return str ? JSON.parse(str) : { horizontalOffset: 0, verticalOffset: 0 };
    } catch {
      return { horizontalOffset: 0, verticalOffset: 0 };
    }
  }

  static saveCalibration(settings: CalibrationSettings): void {
    localStorage.setItem(KEYS.CALIBRATION, JSON.stringify(settings));
  }
}
