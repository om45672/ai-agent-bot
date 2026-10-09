'use client';
import AgentSpace from '@/components/custom/agentspace/AgentSpace';
import { toast } from '@/components/ui/toast';
import { AgentConfigContext } from '@/context/AgentConfigContext';
import { AgentConfigType } from '@/type/Agent';
import axios from 'axios';
import { Agent } from 'http';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AgentSpacePage() {
  const { agentId } = useParams<{ agentId: string }>();
  const [agentConfig, setAgentConfig] = useState<AgentConfigType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setAgentConfig(null);
    setLoading(true);
    setLoadError(false);
    if (agentId) {
      GetAgentConfig(agentId, (config) => {
        if (!cancelled) setAgentConfig(config);
      }).catch(() => {
        if (!cancelled) setLoadError(true);
      }).finally(() => {
        if (!cancelled) setLoading(false);
      });
    }
    return () => { cancelled = true; };
  }, [agentId]);

  const GetAgentConfig = async (id: string, onLoad: (config: AgentConfigType) => void) => {
    const res = await axios.get(`/api/agent?agentId=${id}`);
    onLoad(res.data.agentConfig);
  } 
  if (loading || !agentConfig) {
    return <main className="flex h-screen items-center justify-center text-sm text-slate-500" role="status">{loadError ? 'Could not load this agent.' : 'Loading agent…'}</main>;
  }
  return (
    <AgentConfigContext.Provider value={{agentConfig,setAgentConfig}}>
      <AgentSpace />
    </AgentConfigContext.Provider>
  );
}
