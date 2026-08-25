import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TemplatePicker } from './components/TemplatePicker';
import { SingleLabelEditor } from './components/SingleLabelEditor';
import { SheetPreview } from './components/SheetPreview';
import { ElementInspector } from './components/ElementInspector';
import { BulkMailMerge } from './components/BulkMailMerge';
import { PrintExportModal } from './components/PrintExportModal';
import { TemplateAdminModal } from './components/TemplateAdminModal';
import { CalibrationModal } from './components/CalibrationModal';

import { LabelTemplate, LabelElement, CalibrationSettings, DataRow, Project } from './types/label';
import { StorageManager } from './utils/storage';
import { SEED_TEMPLATES } from './data/seedPresets';

const STARTER_ELEMENTS: LabelElement[] = [
  {
    id: 'el_title',
    type: 'text',
    content: 'NAFI LOCK INDUSTRIES',
    x: 3,
    y: 2,
    width: 57.5,
    height: 5,
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a'
  },
  {
    id: 'el_sub',
    type: 'text',
    content: 'HEAVY DUTY PADLOCK 70 MM',
    x: 3,
    y: 7.5,
    width: 57.5,
    height: 4.5,
    fontSize: 8.5,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#004ac6'
  },
  {
    id: 'el_price',
    type: 'text',
    content: 'MRP ₹{{price}}  |  GST {{gst}}',
    x: 3,
    y: 13,
    width: 57.5,
    height: 4,
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#047857'
  },
  {
    id: 'el_barcode',
    type: 'barcode',
    value: 'ABC-70',
    barcodeType: 'CODE128',
    x: 3,
    y: 18,
    width: 38,
    height: 12,
    displayValue: true
  },
  {
    id: 'el_qr',
    type: 'qrcode',
    value: 'https://nafilocks.com/item/ABC-70',
    x: 44,
    y: 18,
    width: 14,
    height: 14
  },
  {
    id: 'el_code',
    type: 'text',
    content: 'CODE: {{sku}}',
    x: 3,
    y: 33,
    width: 57.5,
    height: 3.5,
    fontSize: 7.5,
    fontFamily: 'JetBrains Mono',
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#334155'
  }
];

export function App() {
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>(SEED_TEMPLATES[12]); // Default 12A (24 labels)
  const [elements, setElements] = useState<LabelElement[]>(STARTER_ELEMENTS);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [individualOverrides, setIndividualOverrides] = useState<Record<number, LabelElement[]>>({});
  const [csvData, setCsvData] = useState<DataRow[] | undefined>([
    { price: '250', gst: '18%', sku: 'PL-40' },
    { price: '300', gst: '18%', sku: 'PL-50' },
    { price: '350', gst: '18%', sku: 'PL-60' }
  ]);
  const [calibration, setCalibration] = useState<CalibrationSettings>({ horizontalOffset: 0, verticalOffset: 0 });
  const [projectName, setProjectName] = useState<string>('Hardware Product Label');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>(0);

  // Modals
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isMailMergeOpen, setIsMailMergeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    const loadedTemplates = StorageManager.getTemplates();
    setTemplates(loadedTemplates);
    const loadedCalibration = StorageManager.getCalibration();
    setCalibration(loadedCalibration);
  }, []);

  const handleSaveProject = () => {
    const proj: Project = {
      id: `proj_${Date.now()}`,
      name: projectName,
      updatedAt: new Date().toISOString(),
      template: activeTemplate,
      design: { elements },
      applyToAll,
      individualOverrides,
      csvData
    };
    StorageManager.saveProject(proj);
    alert(`Project "${projectName}" saved to local storage.`);
  };

  const handleSaveCustomTemplate = (newTpl: LabelTemplate) => {
    StorageManager.saveCustomTemplate(newTpl);
    const updated = StorageManager.getTemplates();
    setTemplates(updated);
    setActiveTemplate(newTpl);
  };

  const handleSaveCalibration = (settings: CalibrationSettings) => {
    setCalibration(settings);
    StorageManager.saveCalibration(settings);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const handleUpdateSelectedElement = (props: Partial<LabelElement>) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...props } : el));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      {/* Stitch Navbar Header */}
      <Header
        currentTemplate={activeTemplate}
        projectName={projectName}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenTemplates={() => setIsTemplatePickerOpen(true)}
        onOpenMailMerge={() => setIsMailMergeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onSaveProject={handleSaveProject}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Stitch Left SideNav Sidebar */}
        <aside className="w-sidebar_width bg-surface-container-lowest border-r border-outline-variant flex flex-col z-40 shrink-0 h-full overflow-y-auto shadow-xs">
          <div className="p-4 border-b border-outline-variant">
            <h2 className="font-semibold text-sm text-on-surface mb-0.5">Label Designer</h2>
            <p className="font-mono text-xs text-on-surface-variant">{activeTemplate.sizeCode} ({activeTemplate.widthMm}×{activeTemplate.heightMm}mm)</p>
          </div>
          
          <nav className="flex-1 p-3 flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs transition-all w-full text-left cursor-pointer ${
                activeTab === 'editor' ? 'bg-primary-container text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">category</span>
              <span>Design Canvas</span>
            </button>

            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs transition-all w-full text-left cursor-pointer ${
                activeTab === 'preview' ? 'bg-primary-container text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Full Sheet Preview</span>
            </button>

            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-low transition-all font-mono text-xs rounded-lg w-full text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">style</span>
              <span>Presets & Specs</span>
            </button>

            <button 
              onClick={() => setIsMailMergeOpen(true)}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-low transition-all font-mono text-xs rounded-lg w-full text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">table_view</span>
              <span>Data Source ({csvData ? csvData.length : 0})</span>
            </button>
          </nav>

          <div className="p-4 border-t border-outline-variant">
            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="w-full py-2 border border-primary text-primary rounded-lg font-medium text-xs hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">widgets</span>
              <span>Change Template</span>
            </button>
          </div>
        </aside>

        {/* Center Workspace Area */}
        <main className="flex-1 bg-stitch-bg flex flex-col relative overflow-hidden">

          {/* Active View Container */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' ? (
              <SingleLabelEditor
                template={activeTemplate}
                elements={elements}
                onChangeElements={setElements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
              />
            ) : (
              <SheetPreview
                template={activeTemplate}
                elements={elements}
                applyToAll={applyToAll}
                individualOverrides={individualOverrides}
                csvData={csvData}
                selectedLabelIndex={selectedLabelIndex}
                onSelectLabelIndex={(idx) => {
                  setSelectedLabelIndex(idx);
                  setActiveTab('editor');
                }}
              />
            )}
          </div>
        </main>

        {/* Stitch Right Side Inspector */}
        <ElementInspector
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateSelectedElement}
          onDeleteElement={() => {
            if (selectedElementId) {
              setElements(prev => prev.filter(el => el.id !== selectedElementId));
              setSelectedElementId(null);
            }
          }}
          onDuplicateElement={() => {
            if (selectedElement) {
              const clone = JSON.parse(JSON.stringify(selectedElement));
              clone.id = `el_${Date.now()}`;
              clone.x += 2;
              clone.y += 2;
              setElements(prev => [...prev, clone]);
              setSelectedElementId(clone.id);
            }
          }}
        />

      </div>

      {/* Modals */}
      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        templates={templates}
        activeTemplateId={activeTemplate.id}
        onSelectTemplate={(tpl) => {
          setActiveTemplate(tpl);
          setSelectedElementId(null);
        }}
      />

      <BulkMailMerge
        isOpen={isMailMergeOpen}
        onClose={() => setIsMailMergeOpen(false)}
        csvData={csvData}
        onApplyCSVData={(data) => setCsvData(data)}
      />

      <TemplateAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSaveTemplate={handleSaveCustomTemplate}
      />

      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        calibration={calibration}
        onSaveCalibration={handleSaveCalibration}
      />

      <PrintExportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        template={activeTemplate}
        elements={elements}
        calibration={calibration}
        csvData={csvData}
      />

    </div>
  );
}

export default App;
