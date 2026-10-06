import { NextRequest, NextResponse } from "next/server";
import { createAndStoreOtp } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, email } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required authentication parameters (uid and email)." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUid = String(uid).trim();

    if (!cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Generate, hash, and store OTP + send luxury email
    const result = await createAndStoreOtp(cleanUid, cleanEmail);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      plainOtp: result.plainOtp
    });
  } catch (error: any) {
    console.error("[send-otp API error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to dispatch security OTP. Please check server logs." },
      { status: 500 }
    );
  }
}
