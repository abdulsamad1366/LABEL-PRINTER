import React from 'react';
import { Clock, Printer, FileDown, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';

export const PrintHistoryLogs: React.FC = () => {
  const logs = [
    { id: 'log_1', job: 'Hardware Product Labels', sizeCode: '18', count: 180, mode: 'Direct Browser Print', user: 'admin@labelstudio.com', status: 'Success', time: 'Today, 18:45' },
    { id: 'log_2', job: 'Shipping Box Barcodes', sizeCode: '12A', count: 600, mode: 'Vector PDF Export', user: 'designer@labelstudio.com', status: 'Success', time: 'Today, 14:20' },
    { id: 'log_3', job: 'Small QR Asset Stickers', sizeCode: '84', count: 840, mode: 'Vector PDF Export', user: 'admin@labelstudio.com', status: 'Success', time: 'Yesterday, 11:10' },
    { id: 'log_4', job: 'Fluorescent Caution Labels', sizeCode: '10', count: 200, mode: 'Direct Browser Print', user: 'admin@labelstudio.com', status: 'Success', time: '23 Aug 2026, 16:05' },
    { id: 'log_5', job: 'Clear PET Translucent Labels', sizeCode: '24', count: 480, mode: 'Vector PDF Export', user: 'designer@labelstudio.com', status: 'Success', time: '22 Aug 2026, 09:30' }
  ];

  return (
    <div className="p-6 md:p-8 bg-stitch-bg text-stitch-text h-full overflow-y-auto space-y-6 select-none">
      <div className="flex items-center justify-between pb-4 border-b border-stitch-border">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Print Production Audit Logs</h1>
          </div>
          <p className="text-xs text-stitch-muted mt-1">
            Audit history of all generated vector PDFs, direct browser print batches, and user activity.
          </p>
        </div>
      </div>

      <div className="bg-stitch-panel border border-stitch-border rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stitch-text">
            <thead className="bg-stitch-bg text-stitch-muted font-mono uppercase text-[10px] border-b border-stitch-border">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Production Job</th>
                <th className="p-3">Template</th>
                <th className="p-3">Label Count</th>
                <th className="p-3">Output Mode</th>
                <th className="p-3">Operator</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stitch-border">
              {logs.map((item) => (
                <tr key={item.id} className="hover:bg-stitch-card transition-colors">
                  <td className="p-3 font-mono text-blue-400 font-bold">#{item.id}</td>
                  <td className="p-3 font-semibold text-white">{item.job}</td>
                  <td className="p-3 font-mono">{item.sizeCode}</td>
                  <td className="p-3 font-mono">{item.count} Labels</td>
                  <td className="p-3 font-medium text-teal-400">{item.mode}</td>
                  <td className="p-3 font-mono text-stitch-muted">{item.user}</td>
                  <td className="p-3 text-right font-mono text-stitch-muted">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
