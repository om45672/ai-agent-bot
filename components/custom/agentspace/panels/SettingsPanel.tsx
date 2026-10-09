import { AgentConfigContext } from "@/context/AgentConfigContext";
import { useContext } from "react";

export default function SettingsPanel() {
  const {agentConfig,setAgentConfig} = useContext(AgentConfigContext);
  return (
    <div className="space-y-5">
      <div><h3 className="text-sm font-semibold text-slate-900">About your agent</h3><p className="mt-1 text-xs leading-5 text-slate-500">Describe your agent and give it guidance.</p></div>
      <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Agent description and instructions</span><textarea value={agentConfig?.description ?? 'No description provided.'} onChange={(event) => setAgentConfig({ ...agentConfig, description: event.target.value })} rows={12} className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-5 text-slate-700 outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-50" /></label>
      <p className="text-[11px] text-slate-400">Describe what your agent does and how it should respond.</p>
    </div>
  );
}
