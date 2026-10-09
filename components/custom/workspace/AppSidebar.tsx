'use client';
import Image from "next/image";
import Link from "next/link";
import { Compass, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

type SidebarAgent = {
  id: number;
  name: string;
  agentImage?: string | null;
};


function AppSidebar() {
  const [agents, setAgents] = useState<SidebarAgent[]>([]);
  const [agentsError, setAgentsError] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const requestSequence = useRef(0);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      setAgents([]);
      setAgentsLoading(false);
      return;
    }

    let cancelled = false;
    setAgentsLoading(true);
    setAgentsError(false);
    async function getUserAgents() {
      const requestId = ++requestSequence.current;
      try {
        const result = await axios.get<{ agentConfigs: SidebarAgent[] }>("/api/agent");
        if (!cancelled && requestId === requestSequence.current) {
          setAgents(Array.isArray(result.data.agentConfigs) ? result.data.agentConfigs : []);
          setAgentsError(false);
        }
      } catch (error) {
        console.error("Failed to load agents:", error);
        if (!cancelled && requestId === requestSequence.current) {
          setAgents([]);
          setAgentsError(true);
        }
      } finally {
        if (!cancelled && requestId === requestSequence.current) setAgentsLoading(false);
      }
    }

    void getUserAgents();
    window.addEventListener("agent-config-updated", getUserAgents);
    return () => {
      cancelled = true;
      window.removeEventListener("agent-config-updated", getUserAgents);
    };
  }, [status, session?.user?.email, pathname]);

  const userName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    (status === "loading" ? "Loading account…" : "Your account");
  const userEmail = session?.user?.email || (status === "loading" ? "Loading email…" : "");
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <aside className="flex h-screen w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 text-slate-900">
      <Link href="/workspace" className="mb-8 flex items-center gap-3 px-2" aria-label="Orbit home">
        <Image src="/logo.png" alt="" width={45} height={45} className="rounded-xl" priority />
        <span className="text-lg font-semibold tracking-tight">Orbit</span>
      </Link>
      <Link
        href="/workspace/create-agent"
        aria-label="Create new agent"
        className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
        Create New Agent
      </Link>

      <div className="mt-9 flex-1 overflow-y-auto">
        <div className="mb-3 flex items-center justify-between px-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Your Agents
          </h2>
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
            {agents.length}
          </span>
        </div>

        <nav aria-label="Your agents" className="space-y-1">
          {status === "loading" || agentsLoading ? (
            <p className="px-2.5 py-2 text-xs text-slate-400" role="status">Loading agents…</p>
          ) : agentsError ? (
            <p className="px-2.5 py-2 text-xs text-red-600" role="status">Couldn’t load your agents.</p>
          ) : agents.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-slate-400">No agents yet.</p>
          ) : (
            agents.map((agent) => {
              const active = pathname === `/workspace/${agent.id}`;
              return (
                <Link
                  href={`/workspace/${agent.id}`}
                  key={agent.id}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition ${
                    active
                      ? "bg-slate-100 font-medium text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                    <img
                      src={agent.agentImage || "/default-agent.png"}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="truncate">{agent.name}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                </Link>
              );
            })
          )}
        </nav>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Compass size={18} strokeWidth={1.8} aria-hidden="true" />
          Marketplace
        </Link>

        <button
          type="button"
          className="mt-3 flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-2.5 pt-4 text-left"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={`${userName} avatar`}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-label={`${userName} avatar`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
            >
              {userInitials || "U"}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-800">{userName}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-400">
              {userEmail || "No email available"}
            </span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-label="Online" />
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
