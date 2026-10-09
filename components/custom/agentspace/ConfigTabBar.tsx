import { CalendarClock, FileText, Grip, Settings2 } from 'lucide-react';
import type { AgentConfigTab } from './types';

const tabs: { id: AgentConfigTab; label: string; icon: typeof FileText }[] = [
  { id: 'settings', label: 'Settings', icon: FileText },
  { id: 'tools', label: 'Tools', icon: Grip },
  { id: 'schedule', label: 'Schedule', icon: CalendarClock },
  { id: 'agent-settings', label: 'Agent settings', icon: Settings2 },
];

export default function ConfigTabBar({ activeTab, onTabChange }: { activeTab: AgentConfigTab; onTabChange: (tab: AgentConfigTab) => void }) {
  return <nav aria-label="Agent configuration sections" className="flex items-center gap-1 border-b border-slate-100 py-3">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" title={label} aria-label={label} aria-current={activeTab === id ? 'page' : undefined} onClick={() => onTabChange(id)} className={`group relative flex h-10 flex-1 items-center justify-center rounded-lg transition ${activeTab === id ? 'bg-violet-50 text-violet-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}><Icon size={18} strokeWidth={1.8} /><span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow transition group-hover:opacity-100">{label}</span></button>)}</nav>;
}
