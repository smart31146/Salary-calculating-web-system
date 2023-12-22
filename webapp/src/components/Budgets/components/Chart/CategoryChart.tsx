import { Progress } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import BudgetsContext from "../../Budgets.context";

export const CategoryChart = () => {

  const [data, setData] = useState<[string, number][]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  const calculateTotalMonthlyAmount = (categoryGroup: CategoryGroup) => {
    return categoryGroup.categories.reduce(
      (total, category) => total + category.monthlyAmount,
      0
    );
  };

  const processData = (categoryGroups: CategoryGroup[]) => {
    const newList: [string, number][] = [];

    // 1. Get total income amount
    const filteredGroups = categoryGroups.filter(
      (group) => group.name == "Income"
    );

    const totalAmount = filteredGroups.reduce(
      (total, group) => total + calculateTotalMonthlyAmount(group),
      0
    );

    setTotalIncome(totalAmount);

    // 2.Calculate others
    const otherGroups = categoryGroups.filter(
      (group) => group.name !== "Income" && group.name !== "Expense"
    );

    for (const group of otherGroups) {
      const total = group.categories.reduce(
        (total, category) => total + category.monthlyAmount,
        0
      );
      const percentage = (total / totalAmount) * 100;
      if (!isNaN(percentage))
        newList.push([group.name, Math.round(percentage)]);
    }

    setData(newList);
  };

  useEffect(() => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups === undefined) return;
    processData(categoryGroups);
  }, [currentBudget]);

  return (
    <>
      {data.length > 0 && (
        <div className="flex w-full flex-col gap-4 lg:gap-7 bg-white shadow-sm p-3 rounded-lg">
          {data.map((item, index) => {
            const pct = item[1];

            return (
              <div className="rounded-lg shadow-sm" key={index}>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="mb-2 flex items-center text-xs  gap-4">
                      {item[0]}: {pct}%
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    size="lg"
                    color={pct > 35 ? "red" : "light-green"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
