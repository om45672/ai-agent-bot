'use client';

import { useState } from 'react';
import AgentChat from './AgentChat';
import AgentConfigSidebar from './AgentConfigSidebar';
import type { AgentConfigTab } from './types';

export default function AgentSpace() {
  const [activeTab, setActiveTab] = useState<AgentConfigTab>('settings');

  return (
    <div className="flex h-screen min-h-[680px] min-w-0 flex-col bg-white lg:flex-row">
      <AgentChat />
      <AgentConfigSidebar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
