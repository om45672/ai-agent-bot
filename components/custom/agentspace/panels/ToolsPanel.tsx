const availableTools = [
  { name: 'Gmail', mark: 'M', color: 'bg-red-50 text-red-600' },
  { name: 'Slack', mark: '✣', color: 'bg-violet-50 text-violet-600' },
  { name: 'Google Calendar', mark: '31', color: 'bg-blue-50 text-blue-600' },
  { name: 'Notion', mark: 'N', color: 'bg-slate-100 text-slate-800' },
  { name: 'GitHub', mark: '⌘', color: 'bg-slate-900 text-white' },
];

export default function ToolsPanel() {
  return <div className="space-y-4"><div><h3 className="text-sm font-semibold text-slate-900">Connected tools</h3><p className="mt-1 text-xs leading-5 text-slate-500">Connect apps to give your agent more context.</p></div><div className="space-y-2">{availableTools.map((tool) => <div key={tool.name} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3"><span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${tool.color}`}>{tool.mark}</span><span className="min-w-0 flex-1 text-sm font-medium text-slate-700">{tool.name}</span><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">Connect</button></div>)}</div></div>;
}
