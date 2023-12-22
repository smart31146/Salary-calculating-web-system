import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CATEGORY_GROUP, delay } from "@/constants/Budgets.constant";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const uploadData = JSON.parse(json);
    const budgetId = uploadData.budgetId;

    const tmp = uploadData.data;
    for (let i = 0; i < tmp.length; i++) {
      const item = tmp[i];
      if (item.Group) {
        const existGr = await prisma.categoryGroup.findFirst({
          where: {
            name: item.Group,
            budgetId,
          },
        });
        if (existGr) {
          await prisma.category.create({
            data: {
              categoryGroup: { connect: { id: existGr.id } },
              name: item.Category,
              monthlyAmount: item.Monthly,
              note: "",
            },
          });
        } else {
          const newGr = await prisma.categoryGroup.create({
            data: {
              budget: { connect: { id: budgetId } },
              name: item.Group,
              description: "",
            },
          });

          await prisma.category.create({
            data: {
              categoryGroup: { connect: { id: newGr.id } },
              name: item.Category,
              monthlyAmount: item.Monthly,
              note: "",
            },
          });
        }
      }
    }

    // uploadData.data.each(async (item: any) => {
    //   if (item.Group) {
    //     const existGr = await prisma.categoryGroup.findFirst({
    //       where: {
    //         name: item.Group,
    //       },
    //     });
    //     if (existGr) {
    //       await prisma.category.create({
    //         data: {
    //           categoryGroup: { connect: { id: existGr.id } },
    //           name: item.Category,
    //           monthlyAmount: item.Monthly,
    //           note: "",
    //         },
    //       });
    //     } else {
    //       const newGr = await prisma.categoryGroup.create({
    //         data: {
    //           budget: { connect: { id: budgetId } },
    //           name: item.Category,
    //           description: "",
    //         },
    //       });

    //       await prisma.category.create({
    //         data: {
    //           categoryGroup: { connect: { id: newGr.id } },
    //           name: item.Category,
    //           monthlyAmount: item.Monthly,
    //           note: "",
    //         },
    //       });
    //     }
    //   }
    // });

    return new NextResponse(JSON.stringify(""), {
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
