import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X, Check, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { DataRow } from '../types/label';

interface BulkMailMergeProps {
  isOpen: boolean;
  onClose: () => void;
  csvData?: DataRow[];
  onApplyCSVData: (data: DataRow[] | undefined) => void;
}

export const BulkMailMerge: React.FC<BulkMailMergeProps> = ({
  isOpen,
  onClose,
  csvData,
  onApplyCSVData
}) => {
  const [parsedRows, setParsedRows] = useState<DataRow[]>(csvData || []);
  const [headers, setHeaders] = useState<string[]>(csvData && csvData[0] ? Object.keys(csvData[0]) : []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setErrorMsg(null);
    Papa.parse<DataRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          setErrorMsg(`CSV parsing error: ${results.errors[0].message}`);
          return;
        }

        if (results.data && results.data.length > 0) {
          setParsedRows(results.data);
          setHeaders(Object.keys(results.data[0]));
        } else {
          setErrorMsg('CSV file is empty or missing header row.');
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Bulk Mail-Merge (CSV Import)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900 leading-relaxed">
            <p className="font-bold text-emerald-950 mb-1">How Mail-Merge Works:</p>
            Upload a CSV file containing column headers (e.g. <code>product_name</code>, <code>price</code>, <code>sku</code>). Inside your text elements, use <code>{"{{product_name}}"}</code> placeholders. The app will auto-repeat your label design across every grid cell across multiple A4 sheets.
          </div>

          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-emerald-50/40 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="font-bold text-sm text-slate-800">Click or Drag & Drop CSV File</p>
            <p className="text-xs text-slate-400 mt-1">Supports standard .csv format with header row</p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Data Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Loaded {parsedRows.length} Data Rows ({headers.length} Columns)</span>
                <span className="text-emerald-700 font-mono">Placeholders: {headers.map(h => `{{${h}}}`).join(', ')}</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                      {headers.map(h => (
                        <th key={h} className="p-2 border-r border-slate-200 font-mono">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600 font-mono text-[11px]">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                        {headers.map(h => (
                          <td key={h} className="p-2 border-r border-slate-200">{row[h] || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 5 && (
                <p className="text-[11px] text-slate-400 text-right">...plus {parsedRows.length - 5} more rows</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {parsedRows.length > 0 ? (
            <button
              onClick={() => {
                setParsedRows([]);
                setHeaders([]);
                onApplyCSVData(undefined);
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear CSV Data
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyCSVData(parsedRows);
                onClose();
              }}
              disabled={parsedRows.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Mail Merge ({parsedRows.length} Rows)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
