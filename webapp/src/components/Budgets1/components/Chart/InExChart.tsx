import { Progress } from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { formatCurrency } from "@/constants/Budgets.constant";
import BudgetsContext from "../../Budgets.context";

export const InExChart = () => {
  const {
    state: { currentBudget },
  } = useContext(BudgetsContext);

  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [pctAmount, setPctAmount] = useState({
    income: 0,
    expense: 0,
  });

  useEffect(() => {
    if (totalIncomeAmount + totalExpenseAmount == 0)
      return setPctAmount({
        income: 0,
        expense: 0,
      });

    const income = Math.round(
      (totalIncomeAmount / (totalIncomeAmount + totalExpenseAmount)) * 100
    );

    const expense = Math.round(
      (totalExpenseAmount / (totalIncomeAmount + totalExpenseAmount)) * 100
    );

    setPctAmount({
      income,
      expense,
    });
  }, [totalIncomeAmount, totalExpenseAmount]);

  useEffect(() => {
    const categoryGroups = currentBudget?.categoryGroups;
    if (categoryGroups == undefined) return;

    const incomeGroup = categoryGroups.find((group) => group.name === "Income");
    if (incomeGroup) {
      setTotalIncomeAmount(
        incomeGroup.categories.reduce(
          (total, category) => total + category.monthlyAmount,
          0
        )
      );
    }

    const otherGroups = categoryGroups.filter(
      (group) => group.name != "Income"
    );

    let totalExpenseTmp = 0;
    for (const group of otherGroups) {
      const total = group.categories.reduce(
        (total, category) => total + category.monthlyAmount,
        0
      );
      totalExpenseTmp += total;
    }
    setTotalExpenseAmount(totalExpenseTmp);
  }, [currentBudget]);

  return (
    <div className="lg:bg-white lg:rounded-lg lg:shadow-sm mb-1">
      <div className="flex w-full flex-col gap-4 lg:gap-7 p-3">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-2 flex items-center text-xs  gap-4">Income</div>
            <div className="mb-2 flex items-center text-xs  gap-4 ">
              {formatCurrency(totalIncomeAmount)}
            </div>
          </div>
          <Progress
            value={pctAmount.income}
            size="lg"
            color="blue"
            className=" bg-gray-900/5"
          />
        </div>

        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-2 flex items-center text-xs  gap-4">Expense</div>
            <div className="mb-2 flex items-center text-xs  gap-4 ">
              {formatCurrency(totalExpenseAmount)}
            </div>
          </div>
          <Progress
            value={pctAmount.expense}
            size="lg"
            color="orange"
            className="bg-gray-900/5"
          />
        </div>
      </div>
    </div>
  );
};
