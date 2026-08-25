import React, { useState, useEffect } from 'react';
import { LabelTemplate, LabelElement, CalibrationSettings, Project, DataRow, User } from './types/label';
import { StorageManager } from './utils/storage';
import { Header } from './components/Header';
import { SingleLabelEditor } from './components/SingleLabelEditor';
import { SheetPreview } from './components/SheetPreview';
import { ElementInspector } from './components/ElementInspector';
import { TemplatePicker } from './components/TemplatePicker';
import { BulkMailMerge } from './components/BulkMailMerge';
import { TemplateAdminModal } from './components/TemplateAdminModal';
import { CalibrationModal } from './components/CalibrationModal';
import { PrintExportModal } from './components/PrintExportModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './components/LandingPage';
import { ERPDashboard } from './components/ERPDashboard';
import { InventoryManager } from './components/InventoryManager';
import { PrintHistoryLogs } from './components/PrintHistoryLogs';

export type ERPModule = 'dashboard' | 'studio' | 'inventory' | 'audit';

function App() {
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>({
    id: 'template_18',
    sizeCode: '18',
    widthMm: 63.5,
    heightMm: 46.6,
    across: 3,
    rows: 6,
    marginTopMm: 8.7,
    marginLeftMm: 9.75,
    colGapMm: 0,
    rowGapMm: 0,
    sheetWidthMm: 210,
    sheetHeightMm: 297,
    finish: 'Uncoated 70',
    color: 'Default',
    verified: true
  });

  const [elements, setElements] = useState<LabelElement[]>([
    {
      id: 'el_header',
      type: 'text',
      x: 3,
      y: 2,
      width: 57.5,
      height: 5,
      content: 'NAFI LOCK INDUSTRIES',
      fontSize: 10,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#0f172a'
    },
    {
      id: 'el_sub',
      type: 'text',
      x: 3,
      y: 7.5,
      width: 57.5,
      height: 4,
      content: '90 MM HEAVY DUTY DISC LOCK',
      fontSize: 7,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1d4ed8'
    },
    {
      id: 'el_price',
      type: 'text',
      x: 3,
      y: 12.5,
      width: 57.5,
      height: 4,
      content: 'MRP ₹{{price}} | GST {{gst}}',
      fontSize: 7.5,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#047857'
    },
    {
      id: 'el_barcode',
      type: 'barcode',
      x: 6,
      y: 18,
      width: 28,
      height: 18,
      value: 'ABC-70',
      barcodeType: 'CODE128',
      displayValue: true
    },
    {
      id: 'el_qr',
      type: 'qrcode',
      x: 38,
      y: 18,
      width: 18,
      height: 18,
      value: 'https://example.com/product/pdl-90'
    },
    {
      id: 'el_sku',
      type: 'text',
      x: 3,
      y: 38,
      width: 57.5,
      height: 3.5,
      content: 'CODE: {{sku}}',
      fontSize: 6.5,
      fontFamily: 'JetBrains Mono',
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#475569'
    }
  ]);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [individualOverrides, setIndividualOverrides] = useState<Record<number, LabelElement[]>>({});
  const [csvData, setCsvData] = useState<DataRow[] | undefined>([
    { price: '1299', gst: '18%', sku: 'PDL-90' },
    { price: '1499', gst: '18%', sku: 'PDL-100' },
    { price: '1799', gst: '18%', sku: 'PDL-120' }
  ]);
  const [calibration, setCalibration] = useState<CalibrationSettings>({ horizontalOffset: 0, verticalOffset: 0 });
  const [projectName, setProjectName] = useState<string>('Hardware Product Label');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>(0);

  // ERP State
  const [activeERPModule, setActiveERPModule] = useState<ERPModule>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isMailMergeOpen, setIsMailMergeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const loadedTemplates = StorageManager.getTemplates();
    setTemplates(loadedTemplates);
    const loadedCalibration = StorageManager.getCalibration();
    setCalibration(loadedCalibration);
    const loadedUser = StorageManager.getUser();
    setCurrentUser(loadedUser);
  }, []);

  const handleLaunchDemo = () => {
    const demoUser: User = {
      id: 'usr_demo_admin',
      name: 'Sarah Connor',
      email: 'admin@labelstudio.com',
      role: 'Production Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    };
    StorageManager.saveUser(demoUser);
    setCurrentUser(demoUser);
    setActiveERPModule('studio');
  };

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

  const handleLogout = () => {
    StorageManager.logoutUser();
    setCurrentUser(null);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const handleUpdateSelectedElement = (props: Partial<LabelElement>) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...props } : el));
  };

  // 1. IF USER IS NOT LOGGED IN -> SHOW LANDING PAGE FIRST!
  if (!currentUser) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setIsLoginOpen(true)}
          onLaunchDemo={handleLaunchDemo}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setActiveERPModule('studio');
          }}
        />
      </>
    );
  }

  // 2. IF LOGGED IN -> RENDER FULL ERP WORKSPACE!
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface select-none">
      {/* Stitch Navbar Header */}
      <Header
        currentTemplate={activeTemplate}
        projectName={projectName}
        activeTab={activeTab}
        currentUser={currentUser}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setActiveERPModule('studio');
        }}
        onOpenTemplates={() => setIsTemplatePickerOpen(true)}
        onOpenMailMerge={() => setIsMailMergeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onSaveProject={handleSaveProject}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main ERP Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ERP Module Navigation Sidebar */}
        <aside className="w-56 bg-stitch-panel border-r border-stitch-border flex flex-col z-40 shrink-0 h-full overflow-y-auto text-stitch-text">
          <div className="p-4 border-b border-stitch-border">
            <span className="text-[10px] font-bold text-stitch-muted uppercase tracking-wider block">ERP Navigation</span>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">Production Suite</span>
              <span className="text-[10px] text-teal-400 font-mono">v2.0</span>
            </div>
          </div>

          <nav className="p-2 space-y-1 flex-1">
            <button 
              onClick={() => setActiveERPModule('dashboard')}
              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeERPModule === 'dashboard' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
              <span>ERP Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('studio')}
              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeERPModule === 'studio' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">design_services</span>
              <span>Label Design Studio</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('inventory')}
              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeERPModule === 'inventory' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Paper & Stock ERP</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('audit')}
              className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeERPModule === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Print Audit Logs</span>
            </button>

            <div className="pt-4 pb-2">
              <span className="text-[10px] font-bold text-stitch-muted uppercase tracking-wider block px-3">Production Quick Tools</span>
            </div>

            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="w-full px-3 py-2 text-stitch-muted hover:text-white hover:bg-stitch-card rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">square_foot</span>
              <span>Presets & Specs ({templates.length})</span>
            </button>

            <button 
              onClick={() => setIsMailMergeOpen(true)}
              className="w-full px-3 py-2 text-stitch-muted hover:text-white hover:bg-stitch-card rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">database</span>
              <span>CSV Mail Merge ({csvData ? csvData.length : 0})</span>
            </button>
          </nav>

          <div className="p-3 border-t border-stitch-border">
            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="w-full py-2 bg-stitch-card border border-stitch-border text-blue-400 hover:text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">widgets</span>
              <span>Change Active Specs</span>
            </button>
          </div>
        </aside>

        {/* Module Content Container */}
        <main className="flex-1 bg-stitch-bg flex flex-col relative overflow-hidden">
          {activeERPModule === 'dashboard' && (
            <ERPDashboard
              currentUser={currentUser}
              activeTemplate={activeTemplate}
              onNavigateToStudio={() => setActiveERPModule('studio')}
              onNavigateToInventory={() => setActiveERPModule('inventory')}
              onOpenMailMerge={() => setIsMailMergeOpen(true)}
              onOpenCalibration={() => setIsCalibrationOpen(true)}
            />
          )}

          {activeERPModule === 'inventory' && (
            <InventoryManager />
          )}

          {activeERPModule === 'audit' && (
            <PrintHistoryLogs />
          )}

          {activeERPModule === 'studio' && (
            <div className="flex flex-1 h-full overflow-hidden">
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
          )}
        </main>

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

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveERPModule('studio');
        }}
      />

    </div>
  );
}

export default App;
