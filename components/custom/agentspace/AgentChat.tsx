import { Bot, Send, Sparkles } from 'lucide-react';

export default function AgentChat() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#fbfcfe]">
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"><Bot size={22} strokeWidth={1.8} /></div>
          <div><h1 className="text-sm font-semibold text-slate-900">Orbit Assistant</h1><p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Ready to help</p></div>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
          <span>Active</span><span role="switch" aria-checked="true" aria-label="Agent active status" className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 p-0.5 shadow-inner"><span className="ml-auto h-5 w-5 rounded-full bg-white shadow-sm" /></span>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-end gap-6 pb-8">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"><Sparkles size={26} /></div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">How can I help today?</h2><p className="mt-1 text-sm text-slate-500">Your personal assistant is ready when you are.</p>
          </div>
          <div className="flex items-end gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Bot size={17} /></div><div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">Hi! I’m Orbit Assistant. I can help you organize your work, draft a message, or find a little more time in your day.</div></div>
          <div className="flex justify-end"><div className="max-w-[82%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-3 text-sm leading-6 text-white shadow-sm">Help me get ready for the week.</div></div>
          <div className="flex items-end gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Bot size={17} /></div><div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">Absolutely. I can help you review your priorities and sketch out a plan. What are the most important things you’d like to focus on?</div></div>
        </div>
        <div className="mx-auto w-full max-w-2xl pb-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <textarea aria-label="Message your agent (preview only)" placeholder="Chat is available in preview only" rows={2} disabled className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
            <div className="flex items-center justify-between px-1 pb-1"><span className="text-xs text-slate-400">Preview only</span><button type="button" aria-label="Send message (preview only)" disabled className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl bg-violet-300 text-white"><Send size={16} /></button></div>
          </div><p className="mt-3 text-center text-[11px] text-slate-400">AI can make mistakes. Review important information.</p>
        </div>
      </div>
    </section>
  );
}
