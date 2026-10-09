import { NextRequest, NextResponse } from "next/server";
import { eq, desc, and } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";
import { AgentConfig, users } from "@/db/schema";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
    }

    const { agentId, name, description, agentImage } = body as Record<string, unknown>;
    if (typeof agentId !== "number" || !Number.isInteger(agentId) || agentId < 1 || agentId > 2147483647) {
        return NextResponse.json({ error: "Agent ID must be a positive 32-bit integer" }, { status: 400 });
    }
    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }
    if (name.trim().length > 80) {
        return NextResponse.json({ error: "Agent name must be 80 characters or fewer" }, { status: 400 });
    }
    if (description !== undefined && description !== null && typeof description !== "string") {
        return NextResponse.json({ error: "Description must be text" }, { status: 400 });
    }
    if (typeof description === "string" && description.trim().length > 500) {
        return NextResponse.json({ error: "Description must be 500 characters or fewer" }, { status: 400 });
    }
    if (agentImage !== undefined && agentImage !== null && typeof agentImage !== "string") {
        return NextResponse.json({ error: "Agent image must be a URL" }, { status: 400 });
    }
    if (typeof agentImage === "string") {
        try {
            const imageUrl = new URL(agentImage);
            if (imageUrl.protocol !== "https:" || imageUrl.hostname !== "api.dicebear.com") {
                return NextResponse.json({ error: "Agent image URL is not supported" }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ error: "Agent image URL is invalid" }, { status: 400 });
        }
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await db.insert(users).values({ email: session.user.email }).onConflictDoNothing({ target: users.email });

        const [agentConfig] = await db.insert(AgentConfig).values({
            id: agentId,
            name: name.trim(),
            description: typeof description === "string" && description.trim() ? description.trim() : null,
            agentImage: typeof agentImage === "string" ? agentImage : null,
            userEmail: session.user.email,
        }).returning();

        if (!agentConfig) {
            throw new Error("Database insert returned no agent record");
        }

        return NextResponse.json({ message: "Agent created successfully", agentConfig }, { status: 201 });
    } catch (error) {
        console.error("Failed to create agent:", error);
        if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
            return NextResponse.json({ error: "This agent ID is already in use. Please retry." }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const {searchParams} = new URL(req.url);
        const agentId = searchParams.get("agentId");

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(agentId){
            const parsedAgentId = Number(agentId);
            if (!Number.isInteger(parsedAgentId) || parsedAgentId < 1 || parsedAgentId > 2147483647) {
                return NextResponse.json({ error: "Agent ID must be a positive 32-bit integer" }, { status: 400 });
            }
            const agentConfig = await db.select().from(AgentConfig).where(and(eq(AgentConfig.userEmail, session.user.email), eq(AgentConfig.id, parsedAgentId)));
            if(agentConfig.length === 0){
                return NextResponse.json({ error: "Agent not found" }, { status: 404 });
            }
            return NextResponse.json({ agentConfig: agentConfig[0] }, { status: 200 });
        }
        const agentConfigs = await db.select().from(AgentConfig).where(eq(AgentConfig.userEmail, session.user.email)).orderBy(desc(AgentConfig.createdAt));

        return NextResponse.json({ agentConfigs }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch agents:", error);
        return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const agentId = Number(new URL(req.url).searchParams.get("agentId"));
        if (!Number.isInteger(agentId) || agentId < 1 || agentId > 2147483647) {
            return NextResponse.json({ error: "Agent ID must be a positive 32-bit integer" }, { status: 400 });
        }

        const body: unknown = await req.json();
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
        }
        const { name, description, agentImage } = body as Record<string, unknown>;
        if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
            return NextResponse.json({ error: "Agent name must be between 1 and 80 characters" }, { status: 400 });
        }
        if (description !== undefined && description !== null && typeof description !== "string") {
            return NextResponse.json({ error: "Description must be text" }, { status: 400 });
        }
        if (typeof description === "string" && description.length > 500) {
            return NextResponse.json({ error: "Description must be 500 characters or fewer" }, { status: 400 });
        }
        if (agentImage !== undefined && agentImage !== null && typeof agentImage !== "string") {
            return NextResponse.json({ error: "Agent image must be a URL" }, { status: 400 });
        }

        const [updatedAgentConfig] = await db.update(AgentConfig).set({
            name: name.trim(),
            description: typeof description === "string" && description.trim() ? description.trim() : null,
            agentImage: typeof agentImage === "string" ? agentImage : null,
            createdAt: new Date(),
        }).where(and(eq(AgentConfig.userEmail, session.user.email), eq(AgentConfig.id, agentId))).returning();

        if (!updatedAgentConfig) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Agent updated successfully", agentConfig: updatedAgentConfig }, { status: 200 });
    } catch (error) {
        console.error("Failed to update agent:", error);
        return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
    }
}
