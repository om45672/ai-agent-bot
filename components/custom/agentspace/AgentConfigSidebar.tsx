import { CircleHelp } from 'lucide-react';
import AgentProfile from './AgentProfile';
import ConfigTabBar from './ConfigTabBar';
import ConfigTabContent from './ConfigTabContent';
import type { AgentConfigTab } from './types';
import { toast } from '@/components/ui/toast';
import axios from 'axios';
import { AgentConfigContext } from '@/context/AgentConfigContext';
import { useContext, useState } from 'react';
import { useParams } from 'next/navigation';

type Props = { activeTab: AgentConfigTab; onTabChange: (tab: AgentConfigTab) => void };

export default function AgentConfigSidebar({ activeTab, onTabChange }: Props) {
  const {agentConfig,setAgentConfig} = useContext(AgentConfigContext);
  const [saving, setSaving] = useState(false);
  const agentId = useParams<{ agentId: string }>().agentId;
  const saveAgentConfig = async () => {
    if (!agentConfig) return;
    setSaving(true);
    toast.add({
      title: "Saving agent config...",
      description: "Please wait while we save your agent configuration.",
      type: "info",
    })
    try {
      const res = await axios.put(`/api/agent?agentId=${agentId}`, agentConfig);
      setAgentConfig(res.data.agentConfig);
      window.dispatchEvent(new Event("agent-config-updated"));
      toast.add({
        title: "Agent config saved",
        description: "Your agent configuration has been saved successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Could not save agent config",
        description: axios.isAxiosError(error) ? error.response?.data?.error ?? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }
  return (
    <aside className="flex h-[52vh] min-h-[420px] w-full shrink-0 flex-col border-t border-slate-200 bg-white lg:h-screen lg:w-[430px] lg:border-l lg:border-t-0 xl:w-[460px]">
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 px-5 sm:px-6"><h2 className="text-base font-semibold tracking-tight text-slate-900">Agent Configuration</h2><button onClick={saveAgentConfig} disabled={saving || !agentConfig} type="button" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button></div>
      <fieldset disabled={saving} className="contents">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
        <AgentProfile />
        <ConfigTabBar activeTab={activeTab} onTabChange={onTabChange} />
        <ConfigTabContent activeTab={activeTab} />
      </div>
      </fieldset>
      <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400 sm:px-6"><span>Last saved just now</span><span className="inline-flex items-center gap-1"><CircleHelp size={13} />Help</span></div>
    </aside>
  );
}
