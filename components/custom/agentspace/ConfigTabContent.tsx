import AgentSettingsPanel from './panels/AgentSettingsPanel';
import SchedulePanel from './panels/SchedulePanel';
import SettingsPanel from './panels/SettingsPanel';
import ToolsPanel from './panels/ToolsPanel';
import type { AgentConfigTab } from './types';

export default function ConfigTabContent({ activeTab }: { activeTab: AgentConfigTab }) {
  return <div className="py-5">{activeTab === 'settings' && <SettingsPanel />}{activeTab === 'tools' && <ToolsPanel />}{activeTab === 'schedule' && <SchedulePanel />}{activeTab === 'agent-settings' && <AgentSettingsPanel />}</div>;
}
