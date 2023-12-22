import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest) {
  const budgetId = request.nextUrl.searchParams.get("budgetId");
  let data;

  if (budgetId) {
    data = await prisma.categoryGroup.findMany({
      where: {
        budgetId,
      },
      include: {
        Category: true,
      },
    });
  } else {
    data = await prisma.categoryGroup.findMany({
      include: {
        Category: true,
      },
    });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const data = await prisma.categoryGroup.create({
      data: json,
    });

    return new NextResponse(JSON.stringify(data), {
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

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return new NextResponse(JSON.stringify("Id is not null"), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    let json = await request.json();

    const data = await prisma.categoryGroup.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(data);
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return new NextResponse(JSON.stringify("Id is not null"), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const categoriesToDelete = await prisma.category.findMany({
      where: {
        categoryGroupId: id,
      },
    });

    for (const category of categoriesToDelete) {
      await prisma.category.delete({
        where: {
          id: category.id,
        },
      });
    }

    await prisma.categoryGroup.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
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
