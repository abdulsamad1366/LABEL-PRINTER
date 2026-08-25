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
import { Layers, LayoutGrid } from 'lucide-react';

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
    fontFamily: 'Arial',
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
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a'
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
    fontFamily: 'Arial',
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
    fontFamily: 'monospace',
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#334155'
  }
];

export function App() {
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>(SEED_TEMPLATES[12]); // Default 12A
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
    alert(`Project "${projectName}" saved to LocalStorage.`);
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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Navbar Header */}
      <Header
        currentTemplate={activeTemplate}
        projectName={projectName}
        onOpenTemplates={() => setIsTemplatePickerOpen(true)}
        onOpenMailMerge={() => setIsMailMergeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onSaveProject={handleSaveProject}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: View Switcher & Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub Header View Switcher Tabs */}
          <div className="h-10 bg-slate-200 border-b border-slate-300 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-300 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'editor' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Single-Label Canvas Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'preview' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>A4 Sheet Live Preview ({activeTemplate.across * activeTemplate.rows} Labels)</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
              {csvData && csvData.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                  Mail Merge Active ({csvData.length} records)
                </span>
              )}
              <span>Paper: A4 (210×297 mm)</span>
            </div>
          </div>

          {/* Active Canvas View */}
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
        </div>

        {/* Right Side: Element Inspector Sidebar */}
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
