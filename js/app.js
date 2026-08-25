/**
 * Main Application Controller for LabelPrint Studio
 * Wires UI controls, event listeners, keyboard shortcuts, modal dialogs, and manages app lifecycle.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Engines
  const canvasContainer = document.getElementById('canvas-container');
  const designer = new LabelDesigner(canvasContainer, onDesignerChange);
  const printer = new LabelPrinter();

  let activeTemplateName = "Hardware Product Label";
  let csvData = null;

  // --- Initial Setup ---
  init();

  function init() {
    setupTabSwitching();
    renderPresetsList();
    renderSizeChartGallery();
    renderTemplateList();
    bindSheetConfigInputs();
    bindElementPropertiesInputs();
    bindActionButtons();
    bindModals();
    bindKeyboardShortcuts();
    loadCalibrationToUI();

    // Check for saved state or load starter template
    const savedState = StorageManager.getCurrentState();
    if (savedState) {
      designer.sheetConfig = savedState.sheetConfig || designer.sheetConfig;
      designer.elements = savedState.elements || [];
      designer.individualLabelOverrides = savedState.individualLabelOverrides || {};
      designer.applyToAll = savedState.applyToAll !== false;
      designer.render();
      syncSheetInputsFromConfig();
    } else {
      loadTemplate(DEFAULT_TEMPLATES[0]);
    }
  }

  // --- Designer Change Callback ---
  function onDesignerChange() {
    updatePropertiesPanel();
    validateSheetLayout();
    StorageManager.saveCurrentState({
      sheetConfig: designer.sheetConfig,
      elements: designer.elements,
      individualLabelOverrides: designer.individualLabelOverrides,
      applyToAll: designer.applyToAll
    });
  }

  // --- UI Tab Switching ---
  function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        const parent = tab.closest('.sidebar-panel');
        parent.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const content = document.getElementById(targetId);
        if (content) content.classList.add('active');
      });
    });
  }

  // --- Render Visual Size Chart Gallery (Modeled after reference photo) ---
  function renderSizeChartGallery() {
    const galleryContainer = document.getElementById('modal-size-chart-gallery');
    if (!galleryContainer) return;

    const presets = PresetManager.getAllPresets();
    let html = '';

    presets.forEach(p => {
      const svgIcon = PresetManager.renderMiniGridSVG(p.columns, p.rows, 70, 85);
      const isUnverified = !p.verified;

      html += `
        <div class="chart-tile" data-preset-id="${p.id}">
          ${isUnverified ? '<div class="chart-tile-unverified" title="Dimensions need verification">!</div>' : ''}
          <div class="chart-tile-count">${p.count || p.columns * p.rows}</div>
          <div class="chart-tile-svg">${svgIcon}</div>
          <div class="chart-tile-code">${p.code || 'PRESET'}</div>
          <div class="chart-tile-dims">${p.width} × ${p.height} mm</div>
        </div>
      `;
    });

    galleryContainer.innerHTML = html;

    galleryContainer.querySelectorAll('.chart-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.dataset.presetId;
        applyPreset(id);
        closeModal('modal-chart');
      });
    });
  }

  // --- Presets List (Sidebar View) ---
  function renderPresetsList() {
    const container = document.getElementById('presets-list-container');
    if (!container) return;

    const presets = PresetManager.getAllPresets();
    let html = '';

    presets.forEach(p => {
      const isUnverified = !p.verified;
      const svgMini = PresetManager.renderMiniGridSVG(p.columns, p.rows, 36, 44);

      html += `
        <div class="preset-card" data-preset-id="${p.id}">
          <div style="flex-shrink:0;">${svgMini}</div>
          <div class="preset-info">
            <div class="preset-header">
              <span class="preset-title">${p.name}</span>
              <span class="preset-badge ${isUnverified ? 'unverified' : ''}">${p.code || 'PRESET'}</span>
            </div>
            <div class="preset-dims">
              ${p.width} × ${p.height} mm | ${p.columns}×${p.rows} grid
              ${isUnverified ? '<br/><strong style="color:#b45309;">Needs Verification</strong>' : ''}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const presetId = card.dataset.presetId;
        applyPreset(presetId);
      });
    });
  }

  function applyPreset(presetId) {
    const p = PresetManager.getPresetById(presetId);
    if (!p) return;

    designer.sheetConfig = {
      paperWidth: 210,
      paperHeight: 297,
      labelWidth: p.width,
      labelHeight: p.height,
      rows: p.rows,
      columns: p.columns,
      topMargin: p.topMargin || 0,
      leftMargin: p.leftMargin || 0,
      horizontalGap: p.horizontalGap || 0,
      verticalGap: p.verticalGap || 0,
      cornerRadius: p.cornerRadius || 0
    };

    syncSheetInputsFromConfig();
    designer.render();
    validateSheetLayout();

    if (!p.verified) {
      showToast('Notice: Preset dimensions need physical verification. You can adjust the millimetre values in the panel.');
    } else {
      showToast(`Loaded ${p.name} (${p.columns * p.rows} labels sheet).`);
    }
  }

  // --- Sheet Inputs Wiring ---
  function bindSheetConfigInputs() {
    const inputs = [
      'input-paper-width', 'input-paper-height',
      'input-label-width', 'input-label-height',
      'input-rows', 'input-columns',
      'input-margin-top', 'input-margin-left',
      'input-gap-h', 'input-gap-v',
      'input-corner-radius'
    ];

    inputs.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.addEventListener('input', updateConfigFromInputs);
      }
    });

    const paperSelect = document.getElementById('select-paper-size');
    if (paperSelect) {
      paperSelect.addEventListener('change', (e) => {
        if (e.target.value === 'A4') {
          document.getElementById('input-paper-width').value = 210;
          document.getElementById('input-paper-height').value = 297;
          updateConfigFromInputs();
        }
      });
    }

    const applyModeSelect = document.getElementById('select-apply-mode');
    if (applyModeSelect) {
      applyModeSelect.addEventListener('change', (e) => {
        designer.applyToAll = (e.target.value === 'all');
        designer.render();
      });
    }
  }

  function updateConfigFromInputs() {
    designer.sheetConfig = {
      paperWidth: parseFloat(document.getElementById('input-paper-width').value) || 210,
      paperHeight: parseFloat(document.getElementById('input-paper-height').value) || 297,
      labelWidth: parseFloat(document.getElementById('input-label-width').value) || 40,
      labelHeight: parseFloat(document.getElementById('input-label-height').value) || 20,
      rows: parseInt(document.getElementById('input-rows').value, 10) || 1,
      columns: parseInt(document.getElementById('input-columns').value, 10) || 1,
      topMargin: parseFloat(document.getElementById('input-margin-top').value) || 0,
      leftMargin: parseFloat(document.getElementById('input-margin-left').value) || 0,
      horizontalGap: parseFloat(document.getElementById('input-gap-h').value) || 0,
      verticalGap: parseFloat(document.getElementById('input-gap-v').value) || 0,
      cornerRadius: parseFloat(document.getElementById('input-corner-radius').value) || 0
    };

    designer.render();
    validateSheetLayout();
  }

  function syncSheetInputsFromConfig() {
    const sc = designer.sheetConfig;
    document.getElementById('input-paper-width').value = sc.paperWidth;
    document.getElementById('input-paper-height').value = sc.paperHeight;
    document.getElementById('input-label-width').value = sc.labelWidth;
    document.getElementById('input-label-height').value = sc.labelHeight;
    document.getElementById('input-rows').value = sc.rows;
    document.getElementById('input-columns').value = sc.columns;
    document.getElementById('input-margin-top').value = sc.topMargin;
    document.getElementById('input-margin-left').value = sc.leftMargin;
    document.getElementById('input-gap-h').value = sc.horizontalGap;
    document.getElementById('input-gap-v').value = sc.verticalGap;
    document.getElementById('input-corner-radius').value = sc.cornerRadius;
    document.getElementById('select-apply-mode').value = designer.applyToAll ? 'all' : 'single';
  }

  function validateSheetLayout() {
    const res = printer.validateLayout(designer.sheetConfig);
    const alertBox = document.getElementById('layout-validation-alert');
    if (!alertBox) return;

    if (!res.isValid) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `⚠️ <strong>Layout Warning:</strong> ${res.errors.join('<br/>')}`;
    } else {
      alertBox.style.display = 'none';
    }
  }

  // --- Element Property Panel Wiring ---
  function bindElementPropertiesInputs() {
    // Add Element Buttons
    document.getElementById('btn-add-text').addEventListener('click', () => designer.addElement('text'));
    document.getElementById('btn-add-image').addEventListener('click', () => {
      document.getElementById('image-file-input').click();
    });
    document.getElementById('image-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          designer.addElement('image', { src: evt.target.result });
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('btn-add-barcode').addEventListener('click', () => designer.addElement('barcode'));
    document.getElementById('btn-add-qrcode').addEventListener('click', () => designer.addElement('qrcode'));

    // Property Inputs
    const propMap = [
      { id: 'prop-text-content', key: 'text' },
      { id: 'prop-font-family', key: 'fontFamily' },
      { id: 'prop-font-size', key: 'fontSize', type: 'float' },
      { id: 'prop-font-weight', key: 'fontWeight' },
      { id: 'prop-font-style', key: 'fontStyle' },
      { id: 'prop-text-align', key: 'textAlign' },
      { id: 'prop-text-color', key: 'color' },
      { id: 'prop-barcode-value', key: 'value' },
      { id: 'prop-barcode-type', key: 'barcodeType' },
      { id: 'prop-qr-value', key: 'value' },
      { id: 'prop-pos-x', key: 'x', type: 'float' },
      { id: 'prop-pos-y', key: 'y', type: 'float' },
      { id: 'prop-size-w', key: 'width', type: 'float' },
      { id: 'prop-size-h', key: 'height', type: 'float' },
      { id: 'prop-rotation', key: 'rotation', type: 'float' }
    ];

    propMap.forEach(item => {
      const elem = document.getElementById(item.id);
      if (elem) {
        elem.addEventListener('input', () => {
          let val = elem.value;
          if (item.type === 'float') val = parseFloat(val) || 0;
          designer.updateSelectedElement({ [item.key]: val });
        });
      }
    });

    // Delete / Duplicate
    document.getElementById('btn-prop-duplicate').addEventListener('click', () => designer.duplicateSelectedElement());
    document.getElementById('btn-prop-delete').addEventListener('click', () => designer.deleteSelectedElement());
  }

  function updatePropertiesPanel() {
    const el = designer.getSelectedElement();
    const noSelectionCard = document.getElementById('prop-no-selection');
    const propsCard = document.getElementById('prop-editor-card');

    if (!el) {
      if (noSelectionCard) noSelectionCard.style.display = 'block';
      if (propsCard) propsCard.style.display = 'none';
      return;
    }

    if (noSelectionCard) noSelectionCard.style.display = 'none';
    if (propsCard) propsCard.style.display = 'block';

    // Show/Hide type specific groups
    document.getElementById('prop-group-text').style.display = (el.type === 'text') ? 'block' : 'none';
    document.getElementById('prop-group-barcode').style.display = (el.type === 'barcode') ? 'block' : 'none';
    document.getElementById('prop-group-qrcode').style.display = (el.type === 'qrcode') ? 'block' : 'none';

    // Set common values
    document.getElementById('prop-pos-x').value = el.x.toFixed(2);
    document.getElementById('prop-pos-y').value = el.y.toFixed(2);
    document.getElementById('prop-size-w').value = el.width.toFixed(2);
    document.getElementById('prop-size-h').value = el.height.toFixed(2);
    document.getElementById('prop-rotation').value = el.rotation || 0;

    if (el.type === 'text') {
      document.getElementById('prop-text-content').value = el.text || '';
      document.getElementById('prop-font-family').value = el.fontFamily || 'Arial';
      document.getElementById('prop-font-size').value = el.fontSize || 10;
      document.getElementById('prop-font-weight').value = el.fontWeight || 'normal';
      document.getElementById('prop-font-style').value = el.fontStyle || 'normal';
      document.getElementById('prop-text-align').value = el.textAlign || 'center';
      document.getElementById('prop-text-color').value = el.color || '#000000';
    } else if (el.type === 'barcode') {
      document.getElementById('prop-barcode-value').value = el.value || '';
      document.getElementById('prop-barcode-type').value = el.barcodeType || 'CODE128';
    } else if (el.type === 'qrcode') {
      document.getElementById('prop-qr-value').value = el.value || '';
    }
  }

  // --- Toolbar & Action Controls ---
  function bindActionButtons() {
    // Size Chart Triggers
    document.getElementById('btn-header-chart').addEventListener('click', () => openModal('modal-chart'));
    document.getElementById('btn-open-size-chart-sidebar').addEventListener('click', () => openModal('modal-chart'));

    // Zoom Controls
    document.getElementById('select-zoom').addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'fit') {
        const viewportW = document.querySelector('.canvas-scroll-area').clientWidth - 80;
        const scale = viewportW / (designer.sheetConfig.paperWidth * designer.pxPerMm);
        designer.zoomLevel = Math.max(0.2, Math.min(1.5, scale));
      } else {
        designer.zoomLevel = parseFloat(val);
      }
      designer.render();
    });

    // Snap Grid Toggle & Size
    const toggleSnapBtn = document.getElementById('btn-toggle-snap');
    toggleSnapBtn.addEventListener('click', () => {
      designer.gridSnap = !designer.gridSnap;
      toggleSnapBtn.classList.toggle('active', designer.gridSnap);
    });

    document.getElementById('select-grid-size').addEventListener('change', (e) => {
      designer.gridSize = parseFloat(e.target.value);
    });

    // Undo / Redo
    document.getElementById('btn-undo').addEventListener('click', () => designer.undo());
    document.getElementById('btn-redo').addEventListener('click', () => designer.redo());

    // Alignment Buttons
    document.getElementById('align-left').addEventListener('click', () => designer.alignSelectedElement('left'));
    document.getElementById('align-center-h').addEventListener('click', () => designer.alignSelectedElement('centerH'));
    document.getElementById('align-right').addEventListener('click', () => designer.alignSelectedElement('right'));
    document.getElementById('align-top').addEventListener('click', () => designer.alignSelectedElement('top'));
    document.getElementById('align-center-v').addEventListener('click', () => designer.alignSelectedElement('centerV'));
    document.getElementById('align-bottom').addEventListener('click', () => designer.alignSelectedElement('bottom'));

    // Z-Index
    document.getElementById('z-forward').addEventListener('click', () => designer.changeZIndex('forward'));
    document.getElementById('z-backward').addEventListener('click', () => designer.changeZIndex('backward'));

    // Primary Actions
    document.getElementById('btn-header-print').addEventListener('click', openPrintModal);
    document.getElementById('btn-header-save').addEventListener('click', saveCurrentTemplate);
    document.getElementById('btn-header-calibration').addEventListener('click', openCalibrationModal);
    document.getElementById('btn-header-templates').addEventListener('click', openTemplatesDrawer);
    document.getElementById('btn-header-csv').addEventListener('click', openCSVModal);
  }

  // --- Templates & Storage ---
  function saveCurrentTemplate() {
    const name = prompt("Enter Template Name:", activeTemplateName) || activeTemplateName;
    activeTemplateName = name;

    const tplData = {
      name,
      paper: {
        width: designer.sheetConfig.paperWidth,
        height: designer.sheetConfig.paperHeight
      },
      label: designer.sheetConfig,
      applyToAll: designer.applyToAll,
      elements: designer.elements,
      individualLabelOverrides: designer.individualLabelOverrides
    };

    StorageManager.saveTemplate(tplData);
    document.getElementById('current-template-name').innerText = name;
    renderTemplateList();
    showToast(`Template "${name}" saved to LocalStorage.`);
  }

  function renderTemplateList() {
    const container = document.getElementById('saved-templates-list');
    if (!container) return;

    const starter = TemplateManager.getStarterTemplates();
    const saved = StorageManager.getTemplates();
    const all = [...starter, ...saved];

    let html = '';
    all.forEach(t => {
      html += `
        <div class="preset-card" style="margin-bottom:8px;">
          <div class="preset-info">
            <div class="preset-header">
              <span class="preset-title">${t.name}</span>
              <button class="btn btn-outline btn-sm btn-load-tpl" data-id="${t.id}">Load</button>
            </div>
            <div class="preset-dims">${t.description || (t.label.columns + 'x' + t.label.rows + ' grid')}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.btn-load-tpl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const target = all.find(item => item.id === id);
        if (target) loadTemplate(target);
      });
    });
  }

  function loadTemplate(tpl) {
    if (!tpl) return;
    activeTemplateName = tpl.name;
    document.getElementById('current-template-name').innerText = tpl.name;

    if (tpl.label) {
      designer.sheetConfig = Object.assign({}, tpl.label);
      syncSheetInputsFromConfig();
    }

    designer.applyToAll = tpl.applyToAll !== false;
    designer.elements = JSON.parse(JSON.stringify(tpl.elements || []));
    designer.individualLabelOverrides = JSON.parse(JSON.stringify(tpl.individualLabelOverrides || {}));
    designer.selectedElementId = null;
    designer.render();
    validateSheetLayout();
    closeModal('modal-templates');
    showToast(`Loaded template "${tpl.name}".`);
  }

  // --- CSV Import ---
  function openCSVModal() {
    openModal('modal-csv');
  }

  document.getElementById('btn-import-csv-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const parsed = CSVProcessor.parseCSV(evt.target.result);
        csvData = parsed;
        renderCSVPreview(parsed);
      };
      reader.readAsText(file);
    }
  });

  function renderCSVPreview(parsed) {
    const container = document.getElementById('csv-preview-table');
    if (!parsed || !parsed.rows.length) {
      container.innerHTML = '<p class="text-muted">No valid rows found in CSV.</p>';
      return;
    }

    let html = `<div style="margin-bottom:10px; font-weight:600;">Found ${parsed.rows.length} records with columns: ${parsed.headers.join(', ')}</div>`;
    html += '<table style="width:100%; border-collapse:collapse; font-size:12px;" border="1" cellpadding="4">';
    html += '<thead><tr style="background:#f1f5f9;">' + parsed.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';

    parsed.rows.slice(0, 5).forEach(row => {
      html += '<tr>' + parsed.headers.map(h => `<td>${row[h] || ''}</td>`).join('') + '</tr>';
    });

    html += '</tbody></table>';
    if (parsed.rows.length > 5) html += `<p style="font-size:11px; color:#64748b; margin-top:4px;">...and ${parsed.rows.length - 5} more rows</p>`;

    container.innerHTML = html;
    document.getElementById('btn-apply-csv').disabled = false;
  }

  document.getElementById('btn-apply-csv').addEventListener('click', () => {
    if (!csvData || !csvData.rows.length) return;

    designer.applyToAll = false; // Enable individual label mapping
    designer.individualLabelOverrides = {};

    const totalGrid = designer.sheetConfig.columns * designer.sheetConfig.rows;

    for (let i = 0; i < Math.min(totalGrid, csvData.rows.length); i++) {
      const rowData = csvData.rows[i];
      designer.individualLabelOverrides[i] = CSVProcessor.applyDataToElements(designer.elements, rowData);
    }

    designer.render();
    closeModal('modal-csv');
    showToast(`Applied ${csvData.rows.length} CSV records to grid labels.`);
  });

  // --- Calibration Modal ---
  function openCalibrationModal() {
    loadCalibrationToUI();
    openModal('modal-calibration');
  }

  function loadCalibrationToUI() {
    const cal = StorageManager.getCalibration();
    document.getElementById('input-calib-h').value = cal.horizontalOffset || 0;
    document.getElementById('input-calib-v').value = cal.verticalOffset || 0;
  }

  document.getElementById('btn-save-calibration').addEventListener('click', () => {
    const h = document.getElementById('input-calib-h').value;
    const v = document.getElementById('input-calib-v').value;
    printer.setCalibration(h, v);
    closeModal('modal-calibration');
    showToast('Saved printer calibration offsets.');
  });

  document.getElementById('btn-print-calib-sheet').addEventListener('click', () => {
    printer.preparePrintContainer(designer.sheetConfig, designer.elements, { isCalibrationTest: true });
    printer.triggerPrint();
  });

  // --- Print Settings Modal & Execution ---
  function openPrintModal() {
    const validation = printer.validateLayout(designer.sheetConfig);
    if (!validation.isValid) {
      alert("Cannot print: " + validation.errors.join("\n"));
      return;
    }
    openModal('modal-print');
  }

  document.getElementById('btn-confirm-print').addEventListener('click', () => {
    const showBorders = document.getElementById('check-print-borders').checked;
    const showNumbers = document.getElementById('check-print-numbers').checked;

    printer.preparePrintContainer(designer.sheetConfig, designer.elements, {
      showBorders,
      showNumbers,
      applyToAll: designer.applyToAll,
      individualOverrides: designer.individualLabelOverrides
    });

    closeModal('modal-print');
    printer.triggerPrint();
  });

  document.getElementById('btn-print-test-dims').addEventListener('click', () => {
    printer.preparePrintContainer(designer.sheetConfig, designer.elements, {
      isTestDimensionMode: true,
      showBorders: true
    });
    closeModal('modal-print');
    printer.triggerPrint();
  });

  // --- Modal Helpers ---
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  function openTemplatesDrawer() {
    renderTemplateList();
    openModal('modal-templates');
  }

  function bindModals() {
    document.querySelectorAll('.modal-close, .btn-close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Template Export / Import
    document.getElementById('btn-export-json').addEventListener('click', () => {
      const tplData = {
        name: activeTemplateName,
        paper: { width: designer.sheetConfig.paperWidth, height: designer.sheetConfig.paperHeight },
        label: designer.sheetConfig,
        applyToAll: designer.applyToAll,
        elements: designer.elements,
        individualLabelOverrides: designer.individualLabelOverrides
      };
      TemplateManager.exportTemplateAsJSON(tplData);
    });

    document.getElementById('input-import-json').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const tpl = TemplateManager.parseImportedJSON(evt.target.result);
          if (tpl) loadTemplate(tpl);
        };
        reader.readAsText(file);
      }
    });
  }

  // --- Keyboard Shortcuts ---
  function bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveCurrentTemplate();
      } else if (cmdKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        designer.redo();
      } else if (cmdKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        designer.undo();
      } else if (cmdKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openPrintModal();
      } else if (cmdKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        designer.duplicateSelectedElement();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        designer.deleteSelectedElement();
      }
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#0f172a; color:#fff; padding:10px 16px; border-radius:6px; font-size:13px; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:opacity 0.3s ease;';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }
});
