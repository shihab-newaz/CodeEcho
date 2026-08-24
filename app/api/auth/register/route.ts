import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getUserByEmail, createUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    createUser({
      id: userId,
      name: name?.trim() || null,
      email: email.trim(),
      passwordHash,
    });

    return NextResponse.json({
      success: true,
      user: { id: userId, name: name?.trim() || null, email: email.trim() },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register account." },
      { status: 500 }
    );
  }
}
