/**
 * Storage Manager for LabelPrint Studio
 * Handles LocalStorage CRUD for templates, calibration offsets, custom presets, and settings.
 */

const STORAGE_KEYS = {
  TEMPLATES: 'label_studio_templates',
  CALIBRATION: 'label_studio_calibration',
  CUSTOM_PRESETS: 'label_studio_custom_presets',
  CURRENT_STATE: 'label_studio_current_state',
  SETTINGS: 'label_studio_settings'
};

class StorageManager {
  // --- Calibration ---
  static getCalibration() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALIBRATION);
      return data ? JSON.parse(data) : { horizontalOffset: 0, verticalOffset: 0 };
    } catch (e) {
      console.error('Error reading calibration settings', e);
      return { horizontalOffset: 0, verticalOffset: 0 };
    }
  }

  static saveCalibration(offsets) {
    try {
      localStorage.setItem(STORAGE_KEYS.CALIBRATION, JSON.stringify({
        horizontalOffset: parseFloat(offsets.horizontalOffset) || 0,
        verticalOffset: parseFloat(offsets.verticalOffset) || 0
      }));
    } catch (e) {
      console.error('Error saving calibration settings', e);
    }
  }

  // --- Templates ---
  static getTemplates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading templates', e);
      return [];
    }
  }

  static saveTemplate(template) {
    try {
      const templates = this.getTemplates();
      if (!template.id) {
        template.id = 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      }
      template.updatedAt = new Date().toISOString();
      
      const existingIdx = templates.findIndex(t => t.id === template.id);
      if (existingIdx >= 0) {
        templates[existingIdx] = template;
      } else {
        templates.push(template);
      }
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
      return template;
    } catch (e) {
      console.error('Error saving template', e);
      return null;
    }
  }

  static deleteTemplate(id) {
    try {
      let templates = this.getTemplates();
      templates = templates.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
      return true;
    } catch (e) {
      console.error('Error deleting template', e);
      return false;
    }
  }

  // --- Custom Presets ---
  static getCustomPresets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading custom presets', e);
      return [];
    }
  }

  static saveCustomPreset(preset) {
    try {
      const presets = this.getCustomPresets();
      if (!preset.id) {
        preset.id = 'custom_preset_' + Date.now();
      }
      const idx = presets.findIndex(p => p.id === preset.id);
      if (idx >= 0) presets[idx] = preset;
      else presets.push(preset);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(presets));
      return preset;
    } catch (e) {
      console.error('Error saving custom preset', e);
      return null;
    }
  }

  // --- Auto-Save Current State ---
  static saveCurrentState(state) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STATE, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving current state', e);
    }
  }

  static getCurrentState() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STATE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
}

window.StorageManager = StorageManager;
