import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    return new NextResponse(null, { status: 200 });
}