import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { DEFAULT_CATEGORY_GROUP, delay } from "@/constants/Budgets.constant";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  let data;

  if (userId) {
    data = await prisma.budget.findMany({
      where: {
        userId,
      },
      include: {
        CategoryGroup: {
          include: {
            Category: true,
          },
        },
      },
    });
  } else {
    data = await prisma.budget.findMany({
      include: {
        CategoryGroup: {
          include: {
            Category: true,
          },
        },
      },
    });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    console.log(json)

    const newBudget = await prisma.budget.create({
      data: json,
    });

    for (const x of DEFAULT_CATEGORY_GROUP) {
      await delay(1);
      await prisma.categoryGroup.create({
        data: {
          budget: {
            connect: { id: newBudget.id },
          },
          name: x.name,
          description: x.desciption,
        },
      });
    }

    const data = await prisma.budget.findFirst({
      where: {
        id: newBudget.id,
      },
      include: {
        CategoryGroup: {
          include: {
            Category: true,
          },
        },
      },
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

    console.log({
      where: { id },
      data: json,
    })
    const data = await prisma.budget.update({
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

    const categoryGrToDelete = await prisma.categoryGroup.findMany({
      where: {
        budgetId: id,
      },
    });

    for (const categoryGr of categoryGrToDelete) {
      const categoriesToDelete = await prisma.category.findMany({
        where: {
          categoryGroupId: categoryGr.id,
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
        where: { id: categoryGr.id },
      });
    }

    await prisma.budget.delete({
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
