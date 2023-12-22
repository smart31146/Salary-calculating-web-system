import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      throw new Error('Token is required');
    }
    const json = await request.json();
    const user: any = await prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });
    console.log(user)
    console.log(new Date())

    if (!user || (user && user?.resetPasswordExpireTime && (new Date(user.resetPasswordExpireTime) <= new Date())))
      throw new Error('Invalid or expired password reset token');


    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...json,
        resetPasswordToken: null,
        resetPasswordExpireTime: null,
      },
    });
    return new NextResponse(JSON.stringify(updatedUser), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
