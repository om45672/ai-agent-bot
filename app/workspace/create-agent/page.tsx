"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Check, Dices, Sparkles } from "lucide-react";
import Axios from "axios";
import { useRouter } from "next/navigation";


export default function CreateAgentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("orbit-agent");

  function shuffleAvatar() {
    setAvatarSeed((currentSeed) => `${currentSeed}-${crypto.randomUUID()}`);
    setError("");
    setSubmitted(false);
  }

  async function createAgent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isCreating) return;

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    if (!cleanName) {
      setError("Enter a name for your agent.");
      return;
    }
    if (cleanName.length > 80) {
      setError("Agent name must be 80 characters or fewer.");
      return;
    }
    if (cleanDescription.length > 500) {
      setError("Description must be 500 characters or fewer.");
      return;
    }

    setIsCreating(true);
    setSubmitted(false);
    setError("");

    try {
      const randomId = new Uint32Array(1);
      crypto.getRandomValues(randomId);
      const agentId = (randomId[0] % 2147483647) + 1;
      const response = await Axios.post("/api/agent", {
        agentId,
        name: cleanName,
        description: cleanDescription || null,
        agentImage: `https://api.dicebear.com/10.x/gaze/svg?seed=${encodeURIComponent(avatarSeed)}&size=256`,
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      const createdAgentId = response.data?.agentConfig?.id;
      if (response.status !== 201 || createdAgentId !== agentId) {
        throw new Error("The server did not confirm agent creation.");
      }

      setName("");
      setDescription("");
      setSubmitted(true);
      console.info("Agent created:", response.data.agentConfig);
      router.push(`/workspace/${createdAgentId}`);
    } catch (createError) {
      console.error("Failed to create agent:", createError);
      if (Axios.isAxiosError(createError)) {
        if (createError.response?.status === 401) {
          setError("Your session has expired. Sign in again and retry.");
        } else if (createError.response?.status === 400) {
          setError(createError.response.data?.error || "Check the agent details and try again.");
        } else if (createError.code === "ECONNABORTED") {
          setError("The request timed out. Please try again.");
        } else if (!createError.response) {
          setError("Could not reach the server. Check your connection and try again.");
        } else {
          setError(createError.response.data?.error || "Agent creation failed. Please try again.");
        }
      } else {
        setError(createError instanceof Error ? createError.message : "Agent creation failed. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/workspace" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to workspace
        </Link>

        <header className="mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create New Agent</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Set up your AI agent by choosing an avatar, name, and description. You can configure its tools and behavior later.
          </p>
        </header>

        <form onSubmit={createAgent} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:p-10">
            <section aria-labelledby="avatar-heading" className="flex flex-col items-center text-center">
              <h2 id="avatar-heading" className="mb-5 self-start text-sm font-semibold text-slate-800">Agent image</h2>
              <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 to-fuchsia-100 p-1 ring-1 ring-slate-200/70">
                <img
                  key={avatarSeed}
                  src={`https://api.dicebear.com/10.x/gaze/svg?seed=${encodeURIComponent(avatarSeed)}&size=256`}
                  alt="Generated agent avatar"
                  className="h-full w-full rounded-[1.75rem] object-cover"
                />
                <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/90 text-primary shadow-sm backdrop-blur">
                  <Bot size={18} aria-hidden="true" />
                </span>
              </div>
              <button
                type="button"
                onClick={shuffleAvatar}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Dices size={16} aria-hidden="true" />
                Shuffle image
              </button>
              <p className="mt-2 text-xs text-slate-400">Pick a look that fits your agent</p>
            </section>

            <section className="space-y-6" aria-label="Agent details">
              <div>
                <label htmlFor="agent-name" className="mb-2 block text-sm font-semibold text-slate-800">Agent name <span className="text-primary">*</span></label>
                <input
                  id="agent-name"
                  name="name"
                  type="text"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(event) => { setName(event.target.value); setSubmitted(false); setError(""); }}
                  placeholder="e.g. Research Assistant"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <p className="mt-2 text-xs text-slate-400">Choose a clear name your team will recognize.</p>
              </div>

              <div>
                <label htmlFor="agent-description" className="mb-2 block text-sm font-semibold text-slate-800">Agent description <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea
                  id="agent-description"
                  name="description"
                  rows={5}
                  maxLength={500}
                  value={description}
                  onChange={(event) => { setDescription(event.target.value); setSubmitted(false); setError(""); }}
                  placeholder="Describe what this agent will help you with..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>A little context helps set the right direction.</span>
                  <span>{description.length}/500</span>
                </div>
              </div>
            </section>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9 lg:px-10">
            <p role={error ? "alert" : "status"} className={`text-sm ${error ? "text-red-600" : "text-emerald-700"}`}>
              {error || (submitted ? "Agent created successfully." : "")}
            </p>
            <div className="flex items-center justify-end gap-3">
              {!submitted && (
                <Link href="/workspace" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Cancel
                </Link>
              )}
              <button type="submit" disabled={isCreating} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
                {isCreating ? <Sparkles size={16} aria-hidden="true" className="animate-pulse" /> : submitted ? <Check size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
                {isCreating ? "Creating…" : "Create Agent"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
