import { AgentConfigContext } from '@/context/AgentConfigContext';
import { Bot, Shuffle } from 'lucide-react';
import { useContext } from 'react';

export default function AgentProfile() {
  const {agentConfig,setAgentConfig} = useContext(AgentConfigContext);
  const shuffleAvatar = () => {
    const randomSeed = crypto.randomUUID();
    const newAvatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${randomSeed}`;
    setAgentConfig({ ...agentConfig, agentImage: newAvatarUrl });
  }
  return (
    <section className="border-b border-slate-100 py-5">
      <div className="flex items-center gap-3"><div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"><img src={agentConfig?.agentImage} alt="Agent Avatar" className="h-full w-full rounded-2xl" /></div><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50" onClick={shuffleAvatar}><Shuffle size={14} />Shuffle avatar</button></div>
      <label className="mt-4 block space-y-2"><span className="text-sm font-medium text-slate-700">Agent Name</span><input value={agentConfig?.name ?? 'Orbit Assistant'} onChange={(event) => setAgentConfig({ ...agentConfig, name: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-3 focus:ring-violet-50" /></label>
    </section>
  );
}
