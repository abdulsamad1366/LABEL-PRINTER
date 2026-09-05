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
import { 
  dbSaveCustomTemplate, 
  dbFetchCustomTemplates, 
  dbDeleteCustomTemplate, 
  dbSaveUserElements, 
  dbFetchUserElements 
} from './lib/supabase';
import { SEED_TEMPLATES } from './data/seedPresets';

export type ERPModule = 'dashboard' | 'studio' | 'inventory' | 'audit';

// Helper to generate a clean, modern label template tailored for a new user account
const getNewUserDefaultElements = (user: User): LabelElement[] => {
  const brandName = (user.name || user.email.split('@')[0] || 'YOUR BRAND').toUpperCase();
  const userTag = user.email.split('@')[0].toUpperCase();

  return [
    {
      id: 'el_header',
      type: 'text',
      x: 3,
      y: 2.5,
      width: 57.5,
      height: 5,
      content: `${brandName} PRODUCTS`,
      fontSize: 9.5,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#0f172a'
    },
    {
      id: 'el_sub',
      type: 'text',
      x: 3,
      y: 8,
      width: 57.5,
      height: 4,
      content: 'PREMIUM PACKAGING LABEL',
      fontSize: 7,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#2563eb'
    },
    {
      id: 'el_price',
      type: 'text',
      x: 3,
      y: 13,
      width: 57.5,
      height: 4,
      content: 'PRICE ₹{{price}} | GST {{gst}}',
      fontSize: 7.5,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#059669'
    },
    {
      id: 'el_barcode',
      type: 'barcode',
      x: 6,
      y: 18.5,
      width: 28,
      height: 17.5,
      value: `SKU-${userTag.slice(0, 6)}`,
      barcodeType: 'CODE128',
      displayValue: true
    },
    {
      id: 'el_qr',
      type: 'qrcode',
      x: 38,
      y: 18.5,
      width: 17.5,
      height: 17.5,
      value: `https://${userTag.toLowerCase()}.labelstudio.app`
    },
    {
      id: 'el_sku',
      type: 'text',
      x: 3,
      y: 38.5,
      width: 57.5,
      height: 3.5,
      content: 'CODE: {{sku}}',
      fontSize: 6.5,
      fontFamily: 'JetBrains Mono',
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#475569'
    }
  ];
};

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

  const [elements, setElements] = useState<LabelElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [individualOverrides, setIndividualOverrides] = useState<Record<number, LabelElement[]>>({});
  const [csvData, setCsvData] = useState<DataRow[] | undefined>([
    { price: '1299', gst: '18%', sku: 'PDL-90' },
    { price: '1499', gst: '18%', sku: 'PDL-100' },
    { price: '1799', gst: '18%', sku: 'PDL-120' }
  ]);
  const [calibration, setCalibration] = useState<CalibrationSettings>({ horizontalOffset: 0, verticalOffset: 0 });
  const [projectName, setProjectName] = useState<string>('Custom Product Label');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>(0);

  // ERP State
  const [activeERPModule, setActiveERPModule] = useState<ERPModule>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Template Editing State
  const [editingTemplate, setEditingTemplate] = useState<LabelTemplate | null>(null);

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

    // Initial fetch of custom templates from Supabase Cloud DB
    dbFetchCustomTemplates().then(cloudTemplates => {
      if (cloudTemplates && cloudTemplates.length > 0) {
        StorageManager.syncCustomTemplates(cloudTemplates);
        setTemplates(StorageManager.getTemplates());
      }
    });
  }, []);

  // Load / Save Per-User Label Elements dynamically whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      const savedUserElements = StorageManager.getUserElements(currentUser.email);
      if (savedUserElements && savedUserElements.length > 0) {
        setElements(savedUserElements);
      } else {
        const newUserLabel = getNewUserDefaultElements(currentUser);
        setElements(newUserLabel);
        StorageManager.saveUserElements(currentUser.email, newUserLabel);
        dbSaveUserElements(currentUser.email, newUserLabel);
      }

      // Fetch user elements from Supabase Cloud DB (cross-browser sync)
      dbFetchUserElements(currentUser.email).then(cloudElements => {
        if (cloudElements && Array.isArray(cloudElements) && cloudElements.length > 0) {
          setElements(cloudElements);
          StorageManager.saveUserElements(currentUser.email, cloudElements);
        }
      });

      // Fetch custom templates from Supabase Cloud DB on login
      dbFetchCustomTemplates().then(cloudTemplates => {
        if (cloudTemplates && cloudTemplates.length > 0) {
          StorageManager.syncCustomTemplates(cloudTemplates);
          setTemplates(StorageManager.getTemplates());
        }
      });
    }
  }, [currentUser]);

  // Save elements automatically whenever they are modified by the current user
  const handleUpdateElements = (newElements: LabelElement[] | ((prev: LabelElement[]) => LabelElement[])) => {
    setElements(prev => {
      const updated = typeof newElements === 'function' ? newElements(prev) : newElements;
      if (currentUser) {
        StorageManager.saveUserElements(currentUser.email, updated);
        dbSaveUserElements(currentUser.email, updated);
      }
      return updated;
    });
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
    alert(`Project "${projectName}" saved permanently.`);
  };

  const handleSaveCustomTemplate = (newTpl: LabelTemplate) => {
    // Save to Local Storage & Supabase Cloud DB
    StorageManager.saveCustomTemplate(newTpl);
    dbSaveCustomTemplate(newTpl, currentUser?.id);
    const updated = StorageManager.getTemplates();
    setTemplates(updated);
    if (activeTemplate.id === newTpl.id || editingTemplate) {
      setActiveTemplate(newTpl);
    }
    setEditingTemplate(null);
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    // Delete from Local Storage & Supabase Cloud DB
    StorageManager.deleteCustomTemplate(templateId);
    dbDeleteCustomTemplate(templateId);
    const updated = StorageManager.getTemplates();
    setTemplates(updated);
    if (activeTemplate.id === templateId) {
      setActiveTemplate(updated[0] || SEED_TEMPLATES[0]);
    }
  };

  const handleSaveCalibration = (settings: CalibrationSettings) => {
    setCalibration(settings);
    StorageManager.saveCalibration(settings);
  };

  const handleLogout = () => {
    if (currentUser) {
      StorageManager.saveUserElements(currentUser.email, elements);
    }
    StorageManager.logoutUser();
    setCurrentUser(null);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const handleUpdateSelectedElement = (props: Partial<LabelElement>) => {
    if (!selectedElementId) return;
    handleUpdateElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...props } : el));
  };

  // 1. IF USER IS NOT LOGGED IN -> SHOW LANDING PAGE FIRST!
  if (!currentUser) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setIsLoginOpen(true)}
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc] text-slate-900 select-none font-sans antialiased">
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
        
        {/* Light ERP Navigation Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col z-40 shrink-0 h-full overflow-y-auto text-slate-800 antialiased shadow-2xs">
          
          <div className="p-4 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ERP NAVIGATION</span>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-700">Production Suite</span>
              <span className="text-[10px] text-blue-600 font-mono font-bold">v2.0</span>
            </div>
          </div>

          <nav className="p-3 space-y-1.5 flex-1">
            <button 
              onClick={() => setActiveERPModule('dashboard')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeERPModule === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
              <span>ERP Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('studio')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeERPModule === 'studio' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">design_services</span>
              <span>Label Design Studio</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('inventory')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeERPModule === 'inventory' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Paper & Stock ERP</span>
            </button>

            <button 
              onClick={() => setActiveERPModule('audit')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeERPModule === 'audit' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Print Audit Logs</span>
            </button>

            <div className="pt-5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-3">PRODUCTION QUICK TOOLS</span>
            </div>

            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="w-full px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">square_foot</span>
              <span>Presets & Specs ({templates.length})</span>
            </button>

            <button 
              onClick={() => setIsMailMergeOpen(true)}
              className="w-full px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-500">database</span>
              <span>CSV Mail Merge ({csvData ? csvData.length : 0})</span>
            </button>
          </nav>

          <div className="p-3 border-t border-slate-100 space-y-1.5">
            <button 
              onClick={() => setIsTemplatePickerOpen(true)}
              className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">widgets</span>
              <span>Change Active Specs</span>
            </button>
            <button 
              onClick={() => {
                setEditingTemplate(activeTemplate);
                setIsAdminOpen(true);
              }}
              className="w-full py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">edit_note</span>
              <span>Edit Active Specs ({activeTemplate.sizeCode})</span>
            </button>
          </div>
        </aside>

        {/* Module Content Container */}
        <main className="flex-1 bg-[#f8fafc] flex flex-col relative overflow-hidden">
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
                    onChangeElements={handleUpdateElements}
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
                    handleUpdateElements(prev => prev.filter(el => el.id !== selectedElementId));
                    setSelectedElementId(null);
                  }
                }}
                onDuplicateElement={() => {
                  if (selectedElement) {
                    const clone = JSON.parse(JSON.stringify(selectedElement));
                    clone.id = `el_${Date.now()}`;
                    clone.x += 2;
                    clone.y += 2;
                    handleUpdateElements(prev => [...prev, clone]);
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
        onDeleteTemplate={handleDeleteCustomTemplate}
        onEditTemplate={(tpl) => {
          setEditingTemplate(tpl);
          setIsAdminOpen(true);
          setIsTemplatePickerOpen(false);
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
        onClose={() => {
          setIsAdminOpen(false);
          setEditingTemplate(null);
        }}
        onSaveTemplate={handleSaveCustomTemplate}
        editingTemplate={editingTemplate}
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
