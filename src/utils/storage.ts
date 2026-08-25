import { LabelTemplate, Project, CalibrationSettings } from '../types/label';
import { SEED_TEMPLATES } from '../data/seedPresets';

const KEYS = {
  PROJECTS: 'labelstudio_projects',
  TEMPLATES: 'labelstudio_custom_templates',
  CALIBRATION: 'labelstudio_calibration',
  CURRENT_PROJECT_ID: 'labelstudio_current_project_id'
};

export class StorageManager {
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

  static deleteProject(id: string): void {
    let projects = this.getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
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
