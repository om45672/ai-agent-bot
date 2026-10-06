import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { db, users } from "@/db";

export async function POST(req: NextRequest) {
    const session= await getServerSession(authOptions);

    if(!session?.user?.email){
        return new Response("Unauthorized", {status: 401});
    }

    try{
        const result = await db.insert(users).values({
            email: session?.user?.email,
            name: session?.user?.name,    
        }).onConflictDoNothing({
            target: users.email,
        })
        .returning();

        if(result.length === 0){
            return new Response("User already exists", {status: 200});
        }

        return NextResponse.json({message: "User created successfully", user: result});
    } catch (error) {
        return new Response("Internal Server Error", {status: 500});
    }
}