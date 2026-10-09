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
  useEffect(() => {
    agentId && GetAgentConfig();
  }, [agentId]);

  const GetAgentConfig = async () => {
    const res = await axios.get(`/api/agent?agentId=${agentId}`);
    setAgentConfig(res.data.agentConfig);
  } 
  return (
    <AgentConfigContext.Provider value={{agentConfig,setAgentConfig}}>
      <AgentSpace />
    </AgentConfigContext.Provider>
  );
}
