import React, { useState } from 'react';
import { Search, X, Grid, Check, Sparkles, Trash2, Cloud, Edit } from 'lucide-react';
import { LabelTemplate } from '../types/label';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  templates: LabelTemplate[];
  activeTemplateId: string;
  onSelectTemplate: (template: LabelTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onEditTemplate?: (template: LabelTemplate) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  isOpen,
  onClose,
  templates,
  activeTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
  onEditTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  if (!isOpen) return null;

  const filteredTemplates = templates.filter(t => {
    const total = t.across * t.rows;
    const matchesSearch = t.sizeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          `${t.widthMm}x${t.heightMm}`.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterCategory === 'small') return total <= 8;
    if (filterCategory === 'medium') return total > 8 && total <= 24;
    if (filterCategory === 'large') return total > 24;
    return true;
  });

  const renderMiniGrid = (cols: number, rows: number) => {
    const pad = 3;
    const w = 60;
    const h = 75;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;

    const maxCols = Math.min(cols, 8);
    const maxRows = Math.min(rows, 16);
    const cellW = innerW / maxCols;
    const cellH = innerH / maxRows;

    const rects = [];
    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < maxCols; c++) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={pad + c * cellW}
            y={pad + r * cellH}
            width={cellW - 0.8}
            height={cellH - 0.8}
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="0.5"
            rx="1"
          />
        );
      }
    }

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect width="100%" height="100%" fill="#f1f5f9" rx="4" stroke="#cbd5e1" strokeWidth="1" />
        {rects}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Select Label Sheet Template</h2>
            <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full flex items-center gap-1">
              <Cloud className="w-3 h-3 text-blue-600" />
              <span>{templates.length} Catalog Presets</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search size code (e.g. 12A, 24, 40, 65, 84)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterCategory === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              All ({templates.length})
            </button>
            <button
              onClick={() => setFilterCategory('small')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterCategory === 'small' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              1–8 Labels
            </button>
            <button
              onClick={() => setFilterCategory('medium')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterCategory === 'medium' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              10–24 Labels
            </button>
            <button
              onClick={() => setFilterCategory('large')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filterCategory === 'large' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              30+ Labels
            </button>
          </div>
        </div>

        {/* Grid List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-slate-50">
          {filteredTemplates.map(t => {
            const isActive = t.id === activeTemplateId;
            const totalLabels = t.across * t.rows;
            const isCustom = t.id.startsWith('custom_');

            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTemplate(t);
                  onClose();
                }}
                className={`group relative bg-white border-2 rounded-xl p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  isActive ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                {isActive && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center z-10">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}

                {isCustom && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-white font-extrabold text-[9px] rounded uppercase tracking-wider shadow-2xs">
                    CUSTOM
                  </span>
                )}

                {/* Big Label Count Badge */}
                <div className="text-xl font-extrabold text-blue-600 group-hover:scale-105 transition-transform mt-2">
                  {totalLabels}
                </div>

                {/* Mini Grid Thumbnail */}
                <div className="my-2">
                  {renderMiniGrid(t.across, t.rows)}
                </div>

                {/* Size Code */}
                <div className="font-bold text-xs text-slate-800 tracking-wide bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 px-2 py-0.5 rounded text-center mb-1">
                  Code: {t.sizeCode}
                </div>

                {/* Dimensions */}
                <div className="text-[11px] font-semibold text-slate-600">
                  {t.widthMm} × {t.heightMm} mm
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.across} across × {t.rows} down
                </div>

                {/* Action buttons (Edit & Delete) */}
                <div className="mt-2.5 flex items-center gap-1.5 z-10">
                  {onEditTemplate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTemplate(t);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded border border-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                      title="Edit Template Physical Specifications"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}

                  {isCustom && onDeleteTemplate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Permanently delete custom template "${t.sizeCode}" from Cloud & Local storage?`)) {
                          onDeleteTemplate(t.id);
                        }
                      }}
                      className="px-2 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded border border-red-200 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                      title="Permanently Delete Custom Template"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTemplates.length} of {templates.length} label formats</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
