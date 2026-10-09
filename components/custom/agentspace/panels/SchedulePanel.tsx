import { ChevronDown, Clock3 } from 'lucide-react';

export default function SchedulePanel() {
  return (
    <div className="space-y-5">
      <div><h3 className="text-sm font-semibold text-slate-900">Execution schedule</h3><p className="mt-1 text-xs leading-5 text-slate-500">Choose when this agent should run.</p></div>
      <div className="space-y-2">{['Manual', 'Recurring', 'Specific time'].map((option, index) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 ${index === 0 ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200'}`}><input type="radio" name="schedule" defaultChecked={index === 0} className="accent-violet-600" /><span className="text-sm font-medium text-slate-700">{option}</span></label>)}</div>
      <div className="space-y-4 rounded-xl border border-slate-200 p-4">
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Frequency</span><span className="flex h-10 items-center justify-between rounded-lg border border-slate-200 px-3 text-sm text-slate-600">Every day <ChevronDown size={15} className="text-slate-400" /></span></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Time</span><span className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600"><Clock3 size={15} className="text-slate-400" />8:00 AM</span></label>
        <div><span className="text-sm font-medium text-slate-700">Days</span><div className="mt-2 flex justify-between gap-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${index < 5 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>{day}</span>)}</div></div>
      </div>
      <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600"><span className="font-medium">Example:</span> Every day at 8:00 AM</div>
    </div>
  );
}
