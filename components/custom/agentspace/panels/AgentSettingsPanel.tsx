import { Copy, MoreHorizontal, Pause, RotateCcw, ShieldAlert, Trash2 } from 'lucide-react';

const agentActions = [
  { label: 'Duplicate agent', icon: Copy },
  { label: 'Pause agent', icon: Pause },
  { label: 'Reset agent', icon: RotateCcw },
];

export default function AgentSettingsPanel() {
  return (
    <div className="space-y-6">
      <div><h3 className="text-sm font-semibold text-slate-900">General</h3><p className="mt-1 text-xs leading-5 text-slate-500">Manage this agent in your workspace.</p></div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">{agentActions.map(({ label, icon: Icon }) => <button key={label} type="button" className="flex w-full items-center gap-3 px-3 py-3.5 text-left text-sm text-slate-700 hover:bg-slate-50"><Icon size={16} className="text-slate-400" />{label}<MoreHorizontal size={16} className="ml-auto text-slate-400" /></button>)}</div>
      <div className="rounded-xl border border-red-200 bg-red-50/40 p-4"><div className="mb-3 flex items-start gap-2"><ShieldAlert size={16} className="mt-0.5 text-red-500" /><div><h4 className="text-sm font-semibold text-slate-800">Danger Zone</h4><p className="mt-1 text-xs leading-5 text-slate-500">Deleting this agent is permanent.</p></div></div><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"><Trash2 size={14} />Delete agent</button></div>
    </div>
  );
}
