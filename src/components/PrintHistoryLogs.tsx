import React, { useState, useEffect } from 'react';
import { Clock, Printer, FileDown, CheckCircle2, ShieldCheck, Filter, UserCheck, Database } from 'lucide-react';
import { dbFetchLoginHistory } from '../lib/supabase';

interface LoginLogItem {
  id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  login_timestamp: string;
}

export const PrintHistoryLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'print' | 'logins'>('logins');
  const [loginLogs, setLoginLogs] = useState<LoginLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const printLogs = [
    { id: 'log_1', job: 'Hardware Product Labels', sizeCode: '18', count: 180, mode: 'Direct Browser Print', user: 'admin@labelstudio.com', status: 'Success', time: 'Today, 18:45' },
    { id: 'log_2', job: 'Shipping Box Barcodes', sizeCode: '12A', count: 600, mode: 'Vector PDF Export', user: 'designer@labelstudio.com', status: 'Success', time: 'Today, 14:20' },
    { id: 'log_3', job: 'Small QR Asset Stickers', sizeCode: '84', count: 840, mode: 'Vector PDF Export', user: 'admin@labelstudio.com', status: 'Success', time: 'Yesterday, 11:10' },
    { id: 'log_4', job: 'Fluorescent Caution Labels', sizeCode: '10', count: 200, mode: 'Direct Browser Print', user: 'admin@labelstudio.com', status: 'Success', time: '23 Aug 2026, 16:05' },
    { id: 'log_5', job: 'Clear PET Translucent Labels', sizeCode: '24', count: 480, mode: 'Vector PDF Export', user: 'designer@labelstudio.com', status: 'Success', time: '22 Aug 2026, 09:30' }
  ];

  useEffect(() => {
    let mounted = true;
    dbFetchLoginHistory().then((data) => {
      if (mounted) {
        setLoginLogs(data || []);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6 md:p-8 bg-stitch-bg text-stitch-text h-full overflow-y-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stitch-border">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Supabase ERP Audit & History Logs</h1>
          </div>
          <p className="text-xs text-stitch-muted mt-1">
            Real-time security audit trails of operator logins and print production jobs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stitch-panel p-1 rounded-xl border border-stitch-border text-xs font-bold">
          <button
            onClick={() => setActiveTab('logins')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'logins' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>User Login History ({loginLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'print' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Production Logs</span>
          </button>
        </div>
      </div>

      {/* User Login History Table */}
      {activeTab === 'logins' && (
        <div className="bg-stitch-panel border border-stitch-border rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              <span>Supabase User Login History Log</span>
            </h2>
            <span className="text-xs text-teal-400 font-mono">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stitch-text">
              <thead className="bg-stitch-bg text-stitch-muted font-mono uppercase text-[10px] border-b border-stitch-border">
                <tr>
                  <th className="p-3">Log Event ID</th>
                  <th className="p-3">Operator Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Login Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stitch-border">
                {loginLogs.length > 0 ? (
                  loginLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stitch-card transition-colors">
                      <td className="p-3 font-mono text-blue-400 font-bold">#{log.id.slice(0, 8)}</td>
                      <td className="p-3 font-semibold text-white">{log.user_name || 'Operator'}</td>
                      <td className="p-3 font-mono text-slate-300">{log.user_email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] font-bold">
                          {log.user_role || 'Production Manager'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-stitch-muted">
                        {new Date(log.login_timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-stitch-muted">
                      {loading ? 'Fetching login history from Supabase...' : 'No login history events recorded yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print Production Logs Table */}
      {activeTab === 'print' && (
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
                {printLogs.map((item) => (
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
      )}
    </div>
  );
};
